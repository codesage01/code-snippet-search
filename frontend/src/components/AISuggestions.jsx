import { Box, Typography, Paper, CircularProgress, Divider } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export default function AISuggestions({ suggestion, loading, query }) {
    if (!query && !suggestion && !loading) return null;

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                background: 'linear-gradient(135deg, rgba(168,84,247,0.08) 0%, rgba(6,182,212,0.06) 100%)',
                border: '1px solid rgba(168,84,247,0.2)',
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""', position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, rgba(168,84,247,0.04) 0%, transparent 60%)',
                    pointerEvents: 'none',
                },
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <AutoAwesomeIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ color: 'primary.light', fontWeight: 700, fontSize: '0.85rem' }}>
                    AI Suggestion
                </Typography>
                {query && (
                    <Typography variant="caption" sx={{ color: 'text.secondary', ml: 'auto' }}>
                        for "{query}"
                    </Typography>
                )}
            </Box>
            <Divider sx={{ mb: 1.5, borderColor: 'rgba(168,84,247,0.15)' }} />

            {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
                    <CircularProgress size={18} sx={{ color: 'primary.main' }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                        Generating AI suggestion…
                    </Typography>
                </Box>
            ) : (
                <Typography
                    variant="body2"
                    sx={{
                        color: 'text.primary', lineHeight: 1.75, whiteSpace: 'pre-wrap',
                        fontSize: '0.85rem',
                    }}
                >
                    {suggestion || 'Enter a search query to get AI-powered insights.'}
                </Typography>
            )}
        </Paper>
    );
}
