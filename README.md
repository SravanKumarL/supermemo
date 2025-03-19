# SuperMemo Web

A modern web application for spaced repetition learning, built with React and Vite.

## Prerequisites

Before you begin, you'll need to install the following tools:

1. **Node.js**:
   - Visit [nodejs.org](https://nodejs.org)
   - Download and install the LTS (Long Term Support) version
   - Verify installation by running:
     ```bash
     node --version  # Should show v18 or higher
     ```

2. **pnpm**:
   - After installing Node.js, install pnpm globally by running:
     ```bash
     sudo npm install -g pnpm
     ```
   - Verify installation by running:
     ```bash
     pnpm --version  # Should show v9.6.0 or higher
     ```

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd supermemo
   ```

2. Install all project dependencies:
   ```bash
   pnpm install
   ```
   This will install all required packages including:
   - React and React DOM
   - React Sortable Tree
   - React Datepicker
   - Fuse.js
   - And all development dependencies

3. Start the development server:
   ```bash
   pnpm dev
   ```

The application will be available at `http://localhost:5173`

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 6
- **Package Manager**: pnpm 9.6.0
- **Styling**: TailwindCSS 3
- **Key Dependencies**:
  - `@nosferatu500/react-sortable-tree`: For tree-based UI components
  - `react-datepicker`: For date selection functionality
  - `fuse.js`: For fuzzy search capabilities

## Available Scripts

- `pnpm dev`: Start the development server
- `pnpm build`: Build the project for production
- `pnpm preview`: Preview the production build locally
- `pnpm lint`: Run ESLint to check code quality

## Development

The project uses:
- ESLint for code linting
- TailwindCSS for styling
- PostCSS for CSS processing
- TypeScript for type safety

## License

[Add your license information here]
