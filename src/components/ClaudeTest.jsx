import { useState } from 'react';
import { useClaude } from '../hooks/useClaude';

export default function ClaudeTest() {
  const [response, setResponse] = useState('');
  const [prompt, setPrompt] = useState('Hello, Claude! How are you?');
  const { sendMessage, isLoading, error } = useClaude();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Sending message to Claude:', prompt);
    
    try {
      console.log('Starting API call...');
      const result = await sendMessage(prompt);
      console.log('Received response from Claude:', result);
      setResponse(result);
    } catch (err) {
      console.error('API Error details:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Claude API Test</h2>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label htmlFor="prompt" className="block text-sm font-medium mb-2">
            Enter your prompt:
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Sending...' : 'Send to Claude'}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
          <p className="text-sm mt-2">Check the browser console for more details.</p>
        </div>
      )}

      {response && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Response:</h3>
          <div className="bg-gray-50 p-4 rounded">
            <pre className="whitespace-pre-wrap">{response}</pre>
          </div>
        </div>
      )}
    </div>
  );
} 