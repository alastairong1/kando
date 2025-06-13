# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kando is a collaborative Kanban board application built on Holochain with real-time synchronization via the Syn framework. It supports desktop (Tauri), mobile (Android), and web platforms.

## Development Commands

### Environment Setup
```bash
nix develop .#androidDev         # Enter development environment (REQUIRED for all builds/tests)
npm install                      # Install all dependencies
```

**IMPORTANT**: All builds and tests must be run within the Nix shell environment. Always run `nix develop .#androidDev` before executing any development commands.

### Development & Testing
```bash
npm start                      # Launch 2-agent network with Electron
npm run start:tauri           # Launch 2-agent network with Tauri  
npm run start:android         # Android development mode
npm run dev                   # Solo development environment
npm test                      # Run Holochain integration tests
npm run test:unit             # Run unit tests
```

### Building & Packaging
```bash
npm run build                 # Build all components
npm run package              # Build distributable packages
npm run package:linux        # Linux-specific packaging
npm run build:zomes          # Build Holochain zomes only
npm run build:happ           # Build hApp bundle
npm run build:ui             # Build UI only
```

### Holochain Development
```bash
npm run network              # Start bootstrap server
hc app pack workdir --recursive    # Package hApp
hc web-app pack workdir --recursive # Package web hApp
```

## Architecture Overview

### Core Components

**Holochain DNA** (`/dnas/kando/`): Real-time collaborative data layer
- `syn` zome: Real-time synchronization using Holochain Syn framework
- `profiles` zome: User profile management

**Tauri Desktop App** (`/src-tauri/`): Native desktop application
- Rust backend with Holochain conductor integration
- Serves Svelte UI at `http://localhost:1420`
- Cross-platform: Windows, macOS, Linux

**UI Layer** (`/ui/`): Svelte + TypeScript frontend
- Real-time collaboration via `@holochain-syn/core`
- Profile management via `@holochain-open-dev/profiles`
- Weave integration for multi-applet environments

**Testing** (`/tests/`): Vitest + Tryorama integration tests

### Build Pipeline

1. **Zomes**: Rust → WASM compilation (`wasm32-unknown-unknown` target)
2. **hApp**: Bundle zomes with DNA configuration
3. **UI**: Svelte → optimized JS/CSS via Vite
4. **WebhApp**: Combine hApp + UI for web deployment
5. **Desktop**: Tauri bundles WebhApp + Rust backend
6. **Mobile**: Tauri mobile generates Android APK

### Network Configuration

The application uses Holochain's networking with:
- Bootstrap servers for peer discovery
- Signal servers for WebRTC coordination
- Default development servers configured in `src-tauri/tauri.conf.json`

### Key Libraries & Frameworks

- **Holochain Syn**: Conflict-free collaborative editing
- **Holochain Profiles**: Standardized user profiles
- **Tauri**: Cross-platform desktop applications
- **Svelte**: Reactive UI framework
- **Vite**: Build tooling and development server

### Multi-Platform Support

- **Desktop**: Native performance via Tauri
- **Web**: Standard web application deployment
- **Mobile**: Android APK with native performance
- **Weave**: Integration as applet in Weave ecosystem (`/we_dev/`)

## Development Notes

### Environment Requirements
- **Nix**: Required for consistent development environment
- **Node.js 20**: Specified in flake configuration
- **Rust**: For Holochain zome and Tauri development
- **Android SDK**: For mobile development (included in androidDev shell)

### Workspace Structure
This is an NPM workspace with multiple packages. Always run commands from the root directory unless specifically working within a sub-package.

### Testing Strategy
- **Integration Tests**: Tryorama-based tests in `/tests/` for Holochain DNA functionality
- **Unit Tests**: Framework-specific tests within each component
- **Multi-Agent**: Use `npm start` for testing collaborative features

### Static Board Viewer
The `/static-board/` directory contains a standalone read-only board viewer with its own Svelte application and Express mock server for development.