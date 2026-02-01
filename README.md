# Reel Quest — Pixel Fishing RPG

A mobile-first pixel art RPG fishing PWA built with React + Phaser.js.

## Quick Start

```bash
# Client
cd client
npm install
npm start        # Opens at http://localhost:3000

# Server (optional, for saves/leaderboards)
cd server
npm install
npm start        # Runs at http://localhost:3001
```

## iPhone Install (Add to Home Screen)

1. Open `http://<your-host>:3000` in Safari
2. Tap the Share button (box with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" — the app launches in fullscreen

## How to Play

- **Cast**: Tap and drag upward to set power/angle, release to cast
- **Hook**: When you see "TAP NOW", tap quickly to hook the fish
- **Reel**: Drag left/right to keep the tension gauge in the green zone (0.3–0.7)
- **Boss Fights**: Multi-phase encounters — manage tension through charge, jump, thrash, and tire phases

## Firebase Setup (Optional)

Create a `.env` file in `client/`:

```
REACT_APP_FIREBASE_API_KEY=your-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456
REACT_APP_FIREBASE_APP_ID=1:123456:web:abc
REACT_APP_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
```

For the server, set `GOOGLE_APPLICATION_CREDENTIALS` to your Firebase Admin SDK service account JSON path.

## Tech Stack

- **Frontend**: React 18, Phaser 3, Web Audio API
- **Backend**: Node.js, Express
- **Services**: Firebase Auth, Firestore, Realtime Database
- **PWA**: Service worker + manifest for offline/home screen install

## Game Content

- **3 Ponds**: Middleton-Mills, Doe Run Lake, Lake Pollywog
- **10 Fish Species**: Bluegill to legendary Muskellunge
- **6 Lures**: Basic Worm → Golden Lure progression
- **8 Quests**: Catch counts, weight records, boss defeats
- **Boss Fights**: Channel Catfish, Largemouth Bass, Muskellunge
- **Weather/Day-Night**: Dynamic cycle affecting visuals
