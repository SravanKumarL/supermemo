# AI Topics Generator

This module provides an AI-assisted workflow for generating learning topics and flashcards based on user prompts.

## Features

- Clean modal interface for user interactions
- Prompt-based AI topic generation
- Selectable topic bubbles
- Automatic flashcard generation for selected topics
- Integration with the main content tree

## Usage

The AI Topics feature is accessed via the "Create with AI" button in the main interface. When clicked, it opens a modal dialog where users can:

1. Enter a prompt describing what they want to learn
2. View AI-suggested topics displayed as selectable bubbles
3. Choose which topics to add to their learning tree
4. Confirm their selection to add topics and flashcards to the content tree

## Implementation Details

- `index.jsx`: Main component with the UI for the AI topic creation workflow
- `index.css`: Styling for the AI Topics UI
- `ai-service.js`: Service functions for interacting with AI to generate topics and flashcards

## Future Enhancements

- Connect to a real AI API for topic and flashcard generation
- Add more customization options for generated content
- Implement topic similarity detection to avoid duplicates
- Add preview functionality for generated flashcards before adding to the tree 