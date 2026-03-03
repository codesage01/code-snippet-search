const express = require('express');
const router = express.Router();
const Snippet = require('../models/Snippet');

// GET /api/search?q=&lang=&tags=&page=&limit=
router.get('/search', async (req, res) => {
    try {
        const { q, lang, tags, page = 1, limit = 12 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const filter = {};

        if (lang) filter.language = lang.toLowerCase();
        if (tags) {
            const tagList = tags.split(',').map((t) => t.trim());
            filter.tags = { $in: tagList };
        }

        let snippets;
        let total;

        if (q && q.trim()) {
            filter.$text = { $search: q };
            snippets = await Snippet.find(filter, { score: { $meta: 'textScore' } })
                .sort({ score: { $meta: 'textScore' } })
                .skip(skip)
                .limit(parseInt(limit));
            total = await Snippet.countDocuments(filter);
        } else {
            snippets = await Snippet.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit));
            total = await Snippet.countDocuments(filter);
        }

        res.json({
            success: true,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: snippets,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/snippets
router.get('/', async (req, res) => {
    try {
        const snippets = await Snippet.find().sort({ createdAt: -1 }).limit(50);
        res.json({ success: true, data: snippets });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/snippets/:id
router.get('/:id', async (req, res) => {
    try {
        const snippet = await Snippet.findById(req.params.id);
        if (!snippet) return res.status(404).json({ success: false, message: 'Snippet not found' });
        res.json({ success: true, data: snippet });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/snippets
router.post('/', async (req, res) => {
    try {
        const snippet = new Snippet(req.body);
        await snippet.save();
        res.status(201).json({ success: true, data: snippet });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// PUT /api/snippets/:id/rate  { rating: 1-5 }
router.put('/:id/rate', async (req, res) => {
    try {
        const { rating } = req.body;
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
        }
        const snippet = await Snippet.findById(req.params.id);
        if (!snippet) return res.status(404).json({ success: false, message: 'Snippet not found' });

        // Incremental weighted average
        const newCount = snippet.ratingCount + 1;
        const newRating = (snippet.rating * snippet.ratingCount + rating) / newCount;
        snippet.rating = Math.round(newRating * 10) / 10;
        snippet.ratingCount = newCount;
        await snippet.save();

        res.json({ success: true, data: { rating: snippet.rating, ratingCount: snippet.ratingCount } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT /api/snippets/:id/favorite  { sessionId: "..." }
router.put('/:id/favorite', async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) return res.status(400).json({ success: false, message: 'sessionId required' });

        const snippet = await Snippet.findById(req.params.id);
        if (!snippet) return res.status(404).json({ success: false, message: 'Snippet not found' });

        const idx = snippet.favoritedBy.indexOf(sessionId);
        let favorited;
        if (idx === -1) {
            snippet.favoritedBy.push(sessionId);
            favorited = true;
        } else {
            snippet.favoritedBy.splice(idx, 1);
            favorited = false;
        }
        await snippet.save();

        res.json({ success: true, favorited, favoritesCount: snippet.favoritedBy.length });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
