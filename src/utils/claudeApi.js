/**
 * Utility functions for making API calls to Claude
 */

const CLAUDE_API_URL = '/api/v1/messages';
const CLAUDE_MODEL = 'claude-3-opus-20240229';

/**
 * Makes a request to Claude API
 * @param {string} message - The message to send to Claude
 * @param {string} apiKey - The Anthropic API key
 * @returns {Promise<Object>} - The response from Claude
 */
export async function callClaude(message, apiKey) {
  console.log('claudeApi: Preparing API request...');
  
  // Validate API key
  if (!apiKey || !apiKey.startsWith('sk-ant-')) {
    console.error('claudeApi: Invalid API key format');
    throw new Error('Invalid API key format. API key should start with "sk-ant-"');
  }
  
  try {
    console.log('claudeApi: Sending request to:', CLAUDE_API_URL);
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        system: "You are a helpful AI assistant."
      })
    };
    
    console.log('claudeApi: Request options:', {
      ...requestOptions,
      headers: {
        ...requestOptions.headers,
        'x-api-key': '***' + apiKey.slice(-4) // Log only last 4 chars of API key
      }
    });
    
    const response = await fetch(CLAUDE_API_URL, requestOptions);
    console.log('claudeApi: Received response status:', response.status);
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
        console.error('claudeApi: Error response data:', JSON.stringify(errorData, null, 2));
      } catch (e) {
        console.error('claudeApi: Failed to parse error response:', e);
        errorData = { error: 'Could not parse error response' };
      }
      
      console.error('claudeApi: API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (response.status === 401) {
        const errorMessage = errorData.error?.message || errorData.error || 'Unknown error';
        throw new Error(`Authentication failed. Please check your API key. Error: ${errorMessage}`);
      }
      
      const error = new Error(`Claude API error: ${response.status} ${response.statusText}`);
      error.status = response.status;
      error.statusText = response.statusText;
      error.response = errorData;
      throw error;
    }

    const data = await response.json();
    console.log('claudeApi: Successfully parsed response');
    return data;
  } catch (error) {
    console.error('claudeApi: Request failed:', error);
    throw error;
  }
}

/**
 * Extracts the response content from Claude's API response
 * @param {Object} response - The response from Claude API
 * @returns {string} - The extracted content
 */
export function extractClaudeResponse(response) {
  console.log('claudeApi: Extracting response content...');
  
  if (!response) {
    console.error('claudeApi: No response provided');
    throw new Error('No response received from Claude API');
  }
  
  if (!response.content || !Array.isArray(response.content)) {
    console.error('claudeApi: Invalid response format:', response);
    throw new Error('Invalid response format from Claude API');
  }
  
  const content = response.content[0]?.text || '';
  console.log('claudeApi: Extracted content length:', content.length);
  return content;
} 