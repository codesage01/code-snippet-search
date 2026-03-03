import { useState, useCallback, useEffect, useRef } from 'react';
import {
    Container, Box, Grid, Typography, Pagination, Alert,
    Skeleton, Chip, Fade,
} from '@mui/material';
import SearchBar from '../components/SearchBar';
import SnippetCard from '../components/SnippetCard';
import AISuggestions from '../components/AISuggestions';
import { searchSnippets, getSnippets, getAISuggestion } from '../services/api';

export default function SearchPage({ sessionId, favorites, onFavoriteToggle }) {
    const [snippets, setSnippets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState('');
    const [currentQuery, setCurrentQuery] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(0);
    const [error, setError] = useState('');
    const [lastParams, setLastParams] = useState({});
    const aiDebounce = useRef(null);

    const loadInitial = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getSnippets();
            setSnippets(res.data.data);
            setTotal(res.data.data.length);
        } catch (e) {
            setError('Failed to connect to the server. Make sure the backend is running on port 5000.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadInitial(); }, [loadInitial]);

    const handleSearch = useCallback(async (params, p = 1) => {
        setLoading(true);
        setError('');
        setLastParams(params);
        setCurrentQuery(params.q || '');
        try {
            const res = await searchSnippets({ ...params, page: p, limit: 12 });
            setSnippets(res.data.data);
            setTotal(res.data.total);
            setPages(res.data.pages);
            setPage(p);

            // Trigger AI suggestion with debounce
            if (params.q && params.q.trim()) {
                setAiLoading(true);
                clearTimeout(aiDebounce.current);
                aiDebounce.current = setTimeout(async () => {
                    try {
                        const aiRes = await getAISuggestion(
                            params.q,
                            res.data.data.slice(0, 5).map((s) => ({
                                title: s.title, language: s.language, description: s.description,
                            }))
                        );
                        setAiSuggestion(aiRes.data.suggestion);
                    } catch {
                        setAiSuggestion('AI suggestion unavailable at this time.');
                    } finally {
                        setAiLoading(false);
                    }
                }, 600);
            } else {
                setAiSuggestion('');
                setAiLoading(false);
            }
        } catch (e) {
            setError('Search failed. Please ensure the backend server is running.');
        } finally {
            setLoading(false);
        }
    }, []);

    const handlePageChange = (_, newPage) => handleSearch(lastParams, newPage);

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Hero */}
            <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Typography
                    variant="h2"
                    sx={{
                        fontSize: { xs: '2rem', md: '2.8rem' }, fontWeight: 800, mb: 1.5,
                        background: 'linear-gradient(135deg, #c084fc 0%, #a855f7 40%, #06b6d4 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}
                >
                    Code Snippet Search
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 540, mx: 'auto' }}>
                    Search, discover, and save code snippets with AI-powered suggestions
                </Typography>
            </Box>

            {/* Search Bar */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <SearchBar onSearch={handleSearch} loading={loading} />
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
            )}

            {/* AI Suggestion */}
            {(aiSuggestion || aiLoading || currentQuery) && (
                <Box sx={{ mb: 3, maxWidth: 860, mx: 'auto' }}>
                    <AISuggestions suggestion={aiSuggestion} loading={aiLoading} query={currentQuery} />
                </Box>
            )}

            {/* Result count */}
            {!loading && snippets.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                    <Chip
                        label={`${total} snippet${total !== 1 ? 's' : ''}${currentQuery ? ` for "${currentQuery}"` : ''}`}
                        sx={{ bgcolor: 'rgba(168,84,247,0.15)', color: 'primary.light', fontWeight: 600 }}
                    />
                </Box>
            )}

            {/* Grid */}
            {loading ? (
                <Grid container spacing={2.5}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Grid item xs={12} sm={6} lg={4} key={i}>
                            <Skeleton variant="rounded" height={320} sx={{ bgcolor: 'rgba(168,156,200,0.08)', borderRadius: 2 }} />
                        </Grid>
                    ))}
                </Grid>
            ) : snippets.length > 0 ? (
                <Fade in>
                    <Grid container spacing={2.5}>
                        {snippets.map((snippet) => (
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
                </Fade>
            ) : (
                !error && (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h5" sx={{ color: 'text.secondary', mb: 1 }}>No snippets found</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Try different keywords or filters
                        </Typography>
                    </Box>
                )
            )}

            {/* Pagination */}
            {pages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={pages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        shape="rounded"
                    />
                </Box>
            )}
        </Container>
    );
}
