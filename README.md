## Mental Wellness App

### Track Selected
- **Student Lifestyle**

### Problem Statement Selected
- **Mental Health Support For Students**

### APK Download
- Download the latest Android APK from Google Drive: [APK folder](https://drive.google.com/drive/folders/17Pm9PMKhDyNR-TWz8bSpqctqxJyA23Hf?usp=sharing)

## Overview
An AI-powered wellness app for students that connects daily life with mental health. It syncs Google Calendar to surface upcoming triggers (deadlines, schedules, finances), supports lightweight mood and journal logging, and offers a friendly AI companion via text and voice for contextual, actionable advice. Multiple companion personalities let students choose the tone that fits the moment, from calm reflection to upbeat motivation.

## Key Features

### App
- **Google Calendar syncing**: Events, tasks, and schedules stay in sync.
- **Mood & Journal Logs**: Lightweight entries to track patterns over time.
- **Calendar View**: Visualize entries and streaks to encourage consistency.
- **Beautiful UI**: Student-centric design with accessible colors and icons.

### AI features
- **Identifies upcoming triggers**: Deadlines, schedule, and financial commitments.
- **Tailored recommendations/advice** based on patterns and context.

### AI Voice
- **Contextual Q&A**: Ask questions based on your calendar and personal data.

### AI Companion
- **Supportive friend feel**: Empathetic tone for reflection and encouragement.
- **Multiple companions**: Create companions with different personalities.
  - **Calm Listener**: Empathetic, mostly listens, gives gentle reflections.
  - **Cheerful Buddy**: Optimistic, sends motivational reminders.

## Tech Stack
- **React Native**: User interface
- **Node.js (Backend)**: API services and business logic
- **OpenAI**: AI companion and LLM Inference
- **Google Calendar API**: Calendar sync and scheduling features
- **Supabase (Database)**: Auth, database, and storage

## Getting Started (Development)
1. Install prerequisites: Node.js (LTS), Git, and a package manager (npm/yarn/pnpm).
2. Install dependencies:
   - `npm install`
3. Start the app:
   - `npx expo start`
4. Run on device/emulator:
   - Press `a` for Android emulator, `i` for iOS simulator (macOS), or scan the QR code in Expo Go.

## Build
- Android (local): `npx expo run:android`
- Managed build service: `npx expo prebuild` (if needed) then `eas build -p android`

For quick testing on Android, use the provided APK link above.

## Project Structure (high-level)
- `app/(tabs)/` — Tab-based screens (e.g., `index.tsx`, `calendar.tsx`, `ai-chat.tsx`, `ai-companion.tsx`)
- `constants/` — Shared constants (e.g., colors, mock data)
- `config/` — App configuration (e.g., Font Awesome setup)

## Privacy & Safety
- Journaling and AI features are designed for wellness support and are not a substitute for professional care. For emergencies, contact local emergency services or trusted hotlines.

## Team Members
- Lim Chun Rong
- Wong Yee Xiong