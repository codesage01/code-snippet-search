const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../server');
const Snippet = require('../models/Snippet');

const TEST_DB = 'mongodb://localhost:27017/code-snippets-test';

let snippetId;

beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(TEST_DB);
    }
    await Snippet.deleteMany({});
    // Insert test fixture
    const snippet = await Snippet.create({
        title: 'Test Bubble Sort',
        language: 'javascript',
        description: 'A sorting example for testing',
        code: 'function sort(arr) { return arr.sort(); }',
        tags: ['sorting', 'algorithm'],
    });
    snippetId = snippet._id.toString();
});

afterAll(async () => {
    await Snippet.deleteMany({});
    await mongoose.disconnect();
});

// ─── Health ──────────────────────────────────────────────────────────────────
describe('GET /api/health', () => {
    it('should return status ok', async () => {
        const res = await request(app).get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
    });
});

// ─── Snippets CRUD ───────────────────────────────────────────────────────────
describe('GET /api/snippets', () => {
    it('should return array of snippets', async () => {
        const res = await request(app).get('/api/snippets');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
    });
});

describe('GET /api/snippets/:id', () => {
    it('should return a single snippet', async () => {
        const res = await request(app).get(`/api/snippets/${snippetId}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data._id).toBe(snippetId);
        expect(res.body.data.title).toBe('Test Bubble Sort');
    });

    it('should return 500 for invalid ID format', async () => {
        const res = await request(app).get('/api/snippets/invalid-id');
        expect(res.status).toBe(500);
    });
});

describe('POST /api/snippets', () => {
    it('should create a new snippet', async () => {
        const res = await request(app).post('/api/snippets').send({
            title: 'New Test Snippet',
            language: 'python',
            description: 'A test snippet',
            code: 'print("hello world")',
            tags: ['python', 'test'],
        });
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.title).toBe('New Test Snippet');
    });

    it('should fail without required fields', async () => {
        const res = await request(app).post('/api/snippets').send({ description: 'No title or language' });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });
});

// ─── Search ──────────────────────────────────────────────────────────────────
describe('GET /api/search', () => {
    it('should return snippets for a text query', async () => {
        const res = await request(app).get('/api/search?q=sorting');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should filter by language', async () => {
        const res = await request(app).get('/api/search').query({ lang: 'javascript' });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        res.body.data.forEach((s) => expect(s.language).toBe('javascript'));
    });

    it('should return paginated results', async () => {
        const res = await request(app).get('/api/search').query({ page: 1, limit: 2 });
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeLessThanOrEqual(2);
        expect(res.body).toHaveProperty('pages');
    });

    it('should return empty array for no results', async () => {
        const res = await request(app).get('/api/search').query({ q: 'xyznonexistentkeyword12345' });
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(0);
    });
});

// ─── Rating ──────────────────────────────────────────────────────────────────
describe('PUT /api/snippets/:id/rate', () => {
    it('should rate a snippet and update rating', async () => {
        const res = await request(app)
            .put(`/api/snippets/${snippetId}/rate`)
            .send({ rating: 4 });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.rating).toBeGreaterThan(0);
        expect(res.body.data.ratingCount).toBe(1);
    });

    it('should reject invalid rating', async () => {
        const res = await request(app)
            .put(`/api/snippets/${snippetId}/rate`)
            .send({ rating: 10 });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });
});

// ─── Favorite ────────────────────────────────────────────────────────────────
describe('PUT /api/snippets/:id/favorite', () => {
    const sessionId = 'test-session-123';

    it('should add to favorites', async () => {
        const res = await request(app)
            .put(`/api/snippets/${snippetId}/favorite`)
            .send({ sessionId });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.favorited).toBe(true);
        expect(res.body.favoritesCount).toBe(1);
    });

    it('should toggle off favorites on second call', async () => {
        const res = await request(app)
            .put(`/api/snippets/${snippetId}/favorite`)
            .send({ sessionId });
        expect(res.status).toBe(200);
        expect(res.body.favorited).toBe(false);
        expect(res.body.favoritesCount).toBe(0);
    });

    it('should require sessionId', async () => {
        const res = await request(app)
            .put(`/api/snippets/${snippetId}/favorite`)
            .send({});
        expect(res.status).toBe(400);
    });
});

// ─── AI Suggest (no real API key in test) ────────────────────────────────────
describe('POST /api/ai/suggest', () => {
    it('should return a response (mocked/fallback when no key)', async () => {
        const res = await request(app).post('/api/ai/suggest').send({
            query: 'binary search',
            snippets: [{ title: 'Binary Search', language: 'python', description: 'Search algorithm' }],
        });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('suggestion');
        expect(typeof res.body.suggestion).toBe('string');
    });
});
