# Code Snippet Search 🔍

A full-stack application to search, discover, and save code snippets — powered by React, Node.js/Express, MongoDB, and Groq.

![Tech Stack](https://img.shields.io/badge/React-18-blue?logo=react) ![Node](https://img.shields.io/badge/Node.js-Express-green?logo=node.js) ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen?logo=mongodb) ![Groq](https://img.shields.io/badge/Groq-LLM-orange)

---

## Features

- 🔎 **Full-text search** across title, description, tags, and code (MongoDB text indexes)
- 🤖 **AI-augmented suggestions** via Groq
- ⭐ **Rate snippets** (1–5 stars, incremental weighted average)
- ❤️ **Favorite snippets** and view them on a dedicated page
- 📋 **Copy code** to clipboard with one click
- 🎨 **Syntax highlighting** for 15+ languages
- 🔍 **Filter by language and tags**
- 📄 **Pagination** for large result sets
- 🌑 **Dark mode** with a premium purple design

---

## Project Structure

```
code-snippet-search/
├── backend/
│   ├── server.js           # Express app entry point
│   ├── .env                # Environment variables
│   ├── config/db.js        # MongoDB connection
│   ├── models/Snippet.js   # Mongoose schema + text index
│   ├── routes/snippets.js  # CRUD + search + rate/favorite routes
│   ├── routes/ai.js        # Groq suggestion route
│   ├── seed/seed.js        # 20-snippet sample dataset
│   └── tests/snippets.test.js  # Jest + Supertest API tests
└── frontend/
    └── src/
        ├── App.jsx
        ├── theme.js
        ├── services/api.js
        ├── components/
        │   ├── SearchBar.jsx
        │   ├── SnippetCard.jsx
        │   └── AISuggestions.jsx
        └── pages/
            ├── SearchPage.jsx
            ├── FavoritesPage.jsx
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) running locally (or use a MongoDB Atlas URI)
- (Optional) Groq API key for AI suggestions

---

## Setup & Run

### 1. Unified Setup (Recommended)

From the root `code-snippet-search` directory:

```bash
# Install all dependencies (root, backend, and frontend)
npm run install:all

# Seed the database
npm run seed

# Run both backend and frontend together
npm run dev
```

The app will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

---

### Manual Setup (Optional)

If you prefer to run them separately:

#### Backend
```bash
cd backend
npm install
npm run seed
npm start
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/snippets` | List all snippets |
| GET | `/api/snippets/:id` | Get single snippet |
| POST | `/api/snippets` | Create snippet |
| GET | `/api/search?q=&lang=&tags=&page=&limit=` | Full-text search with filters |
| PUT | `/api/snippets/:id/rate` | Rate a snippet `{ rating: 1-5 }` |
| PUT | `/api/snippets/:id/favorite` | Toggle favorite `{ sessionId: "..." }` |
| POST | `/api/ai/suggest` | Get AI suggestion `{ query, snippets }` |

---

## MongoDB Indexing

The `Snippet` collection has a compound **text index** on:

| Field | Weight |
|-------|--------|
| `title` | 10 (highest) |
| `tags` | 8 |
| `description` | 5 |
| `code` | 1 (lowest) |

Additional indexes: `language` (single field), `tags` (array index).

---

## Running Tests

```bash
cd backend
npm test
```

Tests cover: health check, list snippets, get by ID, create snippet, text search, language filter, pagination, rating, favorite toggle, and AI suggest endpoint.

---

## Sample Dataset

The seed script inserts 20 snippets across:
- **JavaScript**: Bubble Sort, Merge Sort, Debounce, Async/Await, React hooks, JWT middleware, MongoDB aggregation
- **Python**: Binary Search, Quick Sort, Fibonacci (memoized), Context Manager, List Comprehensions, Decorators
- **TypeScript**: Generic Stack, Utility Types, useReducer
- **Go**: Goroutines with channels
- **SQL**: Window functions, Find duplicates
- **CSS**: CSS Grid dashboard layout

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/code-snippets
GROQ_API_KEY=your_groq_api_key_here   # Groq API key
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```
