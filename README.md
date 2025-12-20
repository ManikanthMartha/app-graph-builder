# App Graph Builder

A visual graph-based application builder for designing and managing infrastructure/service architectures. Built with React, TypeScript, and React Flow.

![App Graph Builder](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue) ![Vite](https://img.shields.io/badge/Vite-7-purple)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ManikanthMartha/app-graph-builder.git
cd app-graph-builder

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type check and build for production |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run preview` | Preview production build |

## ✨ Features

- **Visual Graph Editor** - Drag-and-drop nodes to build application architectures
- **Multiple Node Types** - GitHub, Docker, PostgreSQL, Redis, MongoDB nodes
- **App Management** - Create, switch between, and manage multiple graphs
- **Real-time Connections** - Connect nodes with animated edges
- **Keyboard Shortcuts** - Delete nodes/edges with Backspace/Delete keys

## 🔧 Key Technical Decisions

1. **React Flow** - Industry-standard library for node-based UIs
2. **Zustand** - Lightweight state management without boilerplate
3. **TanStack Query** - Server state management with caching
4. **Tailwind CSS v4** - Utility-first styling with new CSS-first config
5. **Mock API** - In-memory data with simulated latency for realistic behavior

## ⚠️ Known Limitations

- **No persistence** - Data is stored in memory; refreshing clears all changes
- **No real backend** - Uses mock API with simulated delays
- **Limited node types** - Currently supports 5 infrastructure node types
- **No collaboration** - Single-user experience only
- **No undo/redo** - Changes cannot be reverted

## 📁 Project Structure

```
src/
├── api/           # Mock API endpoints
├── components/    # Reusable UI components
│   ├── draggable/ # Drag-and-drop components
│   ├── layout/    # Layout components (Toolbar, AppSelector)
│   └── ui/        # Base UI primitives
├── features/      # Feature modules
│   └── pipeline/  # Main graph editor
├── icons/         # SVG icon components
├── nodes/         # Node type definitions
├── store/         # Zustand state management
└── styles/        # Global CSS
```