# Smart-Scribe-AI
Smart Scribe AI ✍️⚡

A lightweight writing assistant that rewrites text with different tones (Grammar Fix, Professional, Casual, Polite, Social, Witty, Emojify) while preserving Hinglish (Hindi + English mixed) without translating it into full English.

What it does

Smart Scribe AI helps you instantly improve your text in one click:

✅ Fix grammar & spelling

✅ Make text professional/formal

✅ Convert to casual/friendly tone

✅ Rewrite politely and respectfully

✅ Create social-media-friendly versions (with emojis)

✅ Add a witty twist

✅ Emojify text without removing words

✅ Keeps Hinglish as Hinglish (no forced translation)

Key features

Hinglish-first rewriting: understands mixed Hindi/English and keeps the original style intact

Tone-based rewriting: multiple tone presets for different contexts

Fast UI: simple, clean, and easy to use

Configurable AI provider (recommended):

Bring Your Own API Key (Gemini) — users enter their own key locally in the app

Optional support for local models (Ollama) for fully offline usage

Why “Bring Your Own Key”?

For public deployments, storing an API key in frontend code is unsafe. This project supports a BYOK flow where:

Users paste their own Gemini API key (saved locally in browser storage)

No private key is shipped in the repository

Tech stack

React + TypeScript

Vite

Tailwind CSS

AI via Gemini API (BYOK) and/or Ollama (local)

Getting started

Clone the repo

Install dependencies

npm install

Run dev server

npm run dev

Using Gemini (BYOK)

Paste your Gemini API key in the UI (stored in localStorage)

Start rewriting instantly

Using Ollama (optional, fully local)

Install Ollama

Start it: ollama serve

Run a model: ollama run llama3.1

Switch provider in the UI to “Local (Ollama)”

Notes

This project is intended as a demo/utility app for rewriting and tone transformation.

If you want production-grade security while using your own API key (not user keys), use a backend proxy (serverless function) to protect secrets.


a shorter one-line GitHub description + topics/tags

a proper README.md with screenshots section + folder structure + contribution guidelines
