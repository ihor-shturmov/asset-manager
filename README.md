# Asset Manager – Hierarchical Namespace (React + TypeScript)

A modern, scalable asset management UI built with React and TypeScript. Supports hierarchical folders/files, CRUD, move, unique naming, and persists data asynchronously to local storage. UI is built with Tailwind CSS utility classes (no UI framework).

## Features
- Hierarchical tree of folders and files (unified namespace)
- Create, rename, delete, and move assets (drag-and-drop not required)
- Unique naming enforced within each folder
- Fully in-memory and persisted to browser local storage (async)
- Responsive, accessible, and modern UI (Tailwind CSS)
- Modular, testable code structure

## Technical
- **Framework:** React 18 + TypeScript
- **Persistence:** Async localStorage (see `useAssetTree` hook)
- **UI:** Tailwind CSS utility classes only (no UI framework)
- **State Management:** Custom React hook (`useAssetTree`)
- **Scalability:** Components and logic are modular and easily testable

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for production
```bash
npm run build
```

## Project Structure
- `src/App.tsx` – Main app, layout, and state wiring
- `src/hooks/useAssetTree.ts` – All asset tree logic, async localStorage, and state
- `src/components/AssetTree.tsx` – Recursive tree rendering
- `src/components/MoveDropdown.tsx` – Move asset UI
- `src/types.ts` – Shared types

## Async Local Storage
- The asset tree is loaded from localStorage asynchronously on app start (with a loading screen)
- All changes are saved asynchronously to localStorage
- See `useAssetTree.ts` for details

## Customization
- All UI is styled with Tailwind utility classes (see `index.css` for Tailwind import)
- No UI framework is used
- You can further customize the look by editing Tailwind classes in the components

## License
MIT (or as specified by your organization)

---

**Challenge:** Senior Frontend Developer Coding Challenge 1 – Hierarchical Asset Management in a Unified Namespace
