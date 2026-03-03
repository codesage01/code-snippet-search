const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        language: {
            type: String,
            required: [true, 'Language is required'],
            lowercase: true,
            trim: true,
            index: true,
        },
        code: {
            type: String,
            required: [true, 'Code is required'],
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        tags: {
            type: [String],
            default: [],
            index: true,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        ratingCount: {
            type: Number,
            default: 0,
        },
        favoritedBy: {
            type: [String], // array of session IDs
            default: [],
        },
    },
    { timestamps: true }
);

// Compound text index for full-text search
// Use default_language + language_override settings so our `language`
// field for programming languages (javascript, python, etc.) does NOT
// conflict with MongoDB's text search language override mechanism.
snippetSchema.index(
    { title: 'text', description: 'text', tags: 'text', code: 'text' },
    {
        weights: { title: 10, description: 5, tags: 8, code: 1 },
        name: 'snippet_text_index',
        default_language: 'none',
        language_override: 'textLanguage',
    }
);

module.exports = mongoose.model('Snippet', snippetSchema);
