const express = require('express');
const router = express.Router();
const Snippet = require('../models/Snippet');

// GET /api/search?q=&lang=&tags=&page=&limit=
router.get('/', async (req, res) => {
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
            try {
                // Try text search first (requires text index)
                const textFilter = { ...filter, $text: { $search: q } };
                snippets = await Snippet.find(textFilter, { score: { $meta: 'textScore' } })
                    .sort({ score: { $meta: 'textScore' } })
                    .skip(skip)
                    .limit(parseInt(limit));
                total = await Snippet.countDocuments(textFilter);
            } catch (textErr) {
                // Fallback: regex search across title, description, tags
                const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
                const regexFilter = {
                    ...filter,
                    $or: [{ title: regex }, { description: regex }, { code: regex }, { tags: regex }],
                };
                snippets = await Snippet.find(regexFilter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
                total = await Snippet.countDocuments(regexFilter);
            }
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

module.exports = router;
