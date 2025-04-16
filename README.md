# InsightSync: AI-Powered Meeting Companion

InsightSync is a smart meeting assistant that lets you record or upload audio, transcribe it, summarize key points using AI, extract action items, and sync notes with tools like Notion and Google Calendar.

## Goal for This First Version

Build a minimal prototype where:

- You record or upload audio via React
- The audio is preprocessed via WebAssembly (basic pass-through for now)
- The audio file is sent to a Python FastAPI server
- The server transcribes it (initially mocked, then Whisper/OpenAI)
- The transcription is returned and displayed in the frontend

## Phase 1: Planning & Stack Setup

### Core Features (MVP)

- Upload or record audio from mic
- Transcribe audio (Whisper or similar)
- Summarize text using LLMs
- Extract action items, decisions, and attendees
- Export to Markdown or sync with Notion/Calendar

### Tech Stack

| Layer          | Tech                        | Reason                                           |
|----------------|-----------------------------|--------------------------------------------------|
| Frontend       | React + TypeScript          | Strong ecosystem & developer experience (DX)     |
| Client Audio   | Typescript + Web Audio API  | Fast audio processing with offline capabilities  |
| AI / Backend   | Python (FastAPI) or Node.js | Seamless integration with Whisper & LLMs         |
| Auth + Sync    | Google API / Notion API     | For syncing meetings and managing user data      |
| App Wrapper    | Tauri                       | Rust-based, lightweight desktop app wrapper      |

## Phase 2: Initial Setup

### Step-by-Step Plan

#### Step 1: Project Structure (Monorepo-style)

```
insight-sync/
├── frontend/      # React + TypeScript (Vite)
├── rust-audio/    # Rust + WASM (compiled to .wasm)
└── ai-backend/    # Python + FastAPI (AI logic)
```

Would you like to:

- Create this manually,
- Or use tooling like Turborepo or nx to scaffold the monorepo?