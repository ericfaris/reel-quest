# Reel Quest — Project Guide

## Architecture
- `client/` — React 18 + Phaser 3 PWA (CRA-based)
- `server/` — Express API with Firebase Admin SDK
- Game logic lives in `client/src/game/` (Phaser scenes, entities, systems)
- React handles shell UI (menus, HUD, leaderboard) while Phaser handles the game canvas
- Communication: React → Phaser via registry; Phaser → React via `onGameEvent` callback

## Art Style
- Pixel art aesthetic inspired by the Reel Quest branding logo
- Color palette: golden title text (#D4A017), sky blue (#87CEEB), pine green (#3a6a1a), brown earth (#8B6B4A), pond blue (#4A9AC4)
- All sprites are colored rectangle placeholders generated programmatically in BootScene
- Font: Courier New monospace throughout

## Key Patterns
- Game state flows one-way: React state → Phaser registry, Phaser events → React callbacks
- JSON-driven game data in `client/src/game/data/` (fish, ponds, quests, lures)
- Fishing flow: idle → casting (swipe) → waiting → hooking (QTE) → reeling (tension) → caught
- Audio uses Web Audio API oscillators (no audio files needed)
- Firebase is optional; app works fully offline with placeholder data

## Commands
- `cd client && npm start` — dev server
- `cd client && npm run build` — production build
- `cd server && npm start` — API server
- `cd server && npm run dev` — API with --watch

## File Naming
- Scenes: PascalCase (PondScene.js, BossFightScene.js)
- Entities: PascalCase (Player.js, Fish.js)
- Systems: PascalCase (CastingSystem.js, ReelSystem.js)
- Data: lowercase (fish.json, ponds.json)
