const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

// POST /api/ai/suggest  { query, snippets: [{title, language, description}] }
router.post('/suggest', async (req, res) => {
    const { query, snippets = [] } = req.body;

    const apiKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY;

    if (!apiKey || apiKey === 'your_groq_api_key_here' || apiKey === 'your_grok_api_key_here') {
        return res.json({
            success: true,
            suggestion:
                '🤖 AI suggestions are disabled. Add your GROQ_API_KEY (or legacy GROK_API_KEY) to the backend .env file to enable Groq-powered suggestions.',
        });
    }

    try {
        const groq = new Groq({ apiKey });
        const snippetSummary = snippets
            .slice(0, 5)
            .map((s, i) => `${i + 1}. [${s.language}] ${s.title} — ${s.description || 'No description'}`)
            .join('\n');

        const prompt = `You are a helpful programming assistant. A developer searched for: "${query}"

The following code snippets were found:
${snippetSummary || 'No snippets found yet.'}

Please provide:
1. A brief explanation of what this concept does (2-3 sentences).
2. Key use cases or best practices.
3. A concise code tip or alternative approach if the search returned no good results.

Keep your response concise and developer-friendly (under 200 words).`;

        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 350,
            temperature: 0.7,
        });

        const suggestion = completion.choices[0]?.message?.content || 'No suggestion available.';
        res.json({ success: true, suggestion });
    } catch (error) {
        console.error('Groq API error:', error.message);
        res.json({
            success: false,
            suggestion: `AI suggestion unavailable: ${error.message}`,
        });
    }
});

module.exports = router;
