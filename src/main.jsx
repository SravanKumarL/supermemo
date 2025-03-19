/**
 * Main entry point for the SuperMemo Web application.
 * This file initializes the React application and renders it into the DOM.
 */

// Import necessary React dependencies
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Import global styles
import './index.css'
// Import the main App component
import App from './App.jsx'

// Create and render the React application
// StrictMode is used to help identify potential problems in the app during development
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
