import { useState, useCallback } from 'react';
import { callClaude, extractClaudeResponse } from '../utils/claudeApi';
import { ANTHROPIC_API_KEY } from '../config';

/**
 * Custom hook for interacting with Claude API
 * @returns {Object} - The hook's interface
 */
export function useClaude() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Sends a message to Claude and returns the response
   * @param {string} message - The message to send to Claude
   * @returns {Promise<string>} - Claude's response
   */
  const sendMessage = useCallback(async (message) => {
    console.log('useClaude: Checking API key...');
    if (!ANTHROPIC_API_KEY) {
      const error = new Error('ANTHROPIC_API_KEY is not set. Please check your .env file.');
      console.error('API Key Error:', error);
      setError(error.message);
      throw error;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('useClaude: Making API call with message:', message);
      const response = await callClaude(message, ANTHROPIC_API_KEY);
      console.log('useClaude: Raw API response:', response);
      
      const content = extractClaudeResponse(response);
      console.log('useClaude: Extracted content:', content);
      
      return content;
    } catch (err) {
      console.error('useClaude: API call failed:', err);
      console.error('Error details:', {
        message: err.message,
        status: err.status,
        statusText: err.statusText,
        response: err.response
      });
      
      const errorMessage = err.message || 'Failed to get response from Claude';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    sendMessage,
    isLoading,
    error
  };
} 