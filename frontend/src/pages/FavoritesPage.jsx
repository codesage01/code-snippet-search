import { Box, Container, Typography, Grid, Chip, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState, useEffect } from 'react';
import { getSnippet } from '../services/api';
import SnippetCard from '../components/SnippetCard';

export default function FavoritesPage({ sessionId, favorites, onFavoriteToggle }) {
    const [snippets, setSnippets] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const ids = [...favorites];
        if (!ids.length) { setSnippets([]); return; }
        setLoading(true);
        Promise.all(ids.map((id) => getSnippet(id).then((r) => r.data.data).catch(() => null)))
            .then((results) => setSnippets(results.filter(Boolean)))
            .finally(() => setLoading(false));
    }, [favorites]);

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <FavoriteIcon sx={{ color: 'error.main', fontSize: 30 }} />
                <Box>
                    <Typography variant="h4" fontWeight={700}>My Favorites</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Your saved code snippets
                    </Typography>
                </Box>
                {favorites.size > 0 && (
                    <Chip
                        label={`${favorites.size} saved`}
                        sx={{ ml: 'auto', bgcolor: 'rgba(248,113,113,0.15)', color: 'error.main', fontWeight: 600 }}
                    />
                )}
            </Box>

            {loading ? (
                <Typography sx={{ color: 'text.secondary' }}>Loading…</Typography>
            ) : snippets.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 10 }}>
                    <FavoriteIcon sx={{ fontSize: 60, color: 'rgba(168,156,200,0.2)', mb: 2 }} />
                    <Typography variant="h5" sx={{ color: 'text.secondary', mb: 1 }}>No favorites yet</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Click the ♡ heart on any snippet to save it here
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={2.5}>
                    {snippets.map((snippet) => snippet && (
                        <Grid item xs={12} sm={6} lg={4} key={snippet._id}>
                            <SnippetCard
                                snippet={snippet}
                                sessionId={sessionId}
                                isFavorited={favorites.has(snippet._id)}
                                onFavoriteToggle={onFavoriteToggle}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}
