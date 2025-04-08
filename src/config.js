/**
 * Application configuration
 */

// Get the API key from environment variables
// You should set this in your .env file or environment
export const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

// Log API key status (without exposing the actual key)
console.log('API Key Status:', ANTHROPIC_API_KEY ? 'Present' : 'Missing');
if (ANTHROPIC_API_KEY) {
  console.log('API Key Format:', ANTHROPIC_API_KEY.startsWith('sk-ant-api03-') ? 'Valid' : 'Invalid');
}

// Validate that the API key is set
if (!ANTHROPIC_API_KEY) {
  console.warn('Warning: ANTHROPIC_API_KEY is not set. Claude API calls will fail.');
} else if (!ANTHROPIC_API_KEY.startsWith('sk-ant-api03-')) {
  console.warn('Warning: ANTHROPIC_API_KEY has invalid format. It should start with "sk-ant-api03-"');
} 