import { useState } from 'react';
import {
    Card, CardContent, CardActions, Box, Typography, Chip,
    IconButton, Rating, Tooltip, Collapse, Button,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CodeIcon from '@mui/icons-material/Code';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from '@mui/icons-material/Check';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { rateSnippet, favoriteSnippet } from '../services/api';

const LANG_COLORS = {
    javascript: '#f7df1e', python: '#3572A5', typescript: '#3178c6',
    go: '#00ADD8', sql: '#e38c00', css: '#264de4', rust: '#b7410e',
    java: '#b07219', 'c++': '#f34b7d',
};

export default function SnippetCard({ snippet, sessionId, isFavorited, onFavoriteToggle }) {
    const [expanded, setExpanded] = useState(false);
    const [rating, setRating] = useState(snippet.rating || 0);
    const [ratingCount, setRatingCount] = useState(snippet.ratingCount || 0);
    const [copied, setCopied] = useState(false);
    const [favorited, setFavorited] = useState(isFavorited || false);

    const handleCopy = () => {
        navigator.clipboard.writeText(snippet.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleRate = async (_, newValue) => {
        if (!newValue) return;
        try {
            const res = await rateSnippet(snippet._id, newValue);
            setRating(res.data.data.rating);
            setRatingCount(res.data.data.ratingCount);
        } catch { }
    };

    const handleFavorite = async () => {
        try {
            const res = await favoriteSnippet(snippet._id, sessionId);
            setFavorited(res.data.favorited);
            if (onFavoriteToggle) onFavoriteToggle(snippet._id, res.data.favorited);
        } catch { }
    };

    const langColor = LANG_COLORS[snippet.language] || '#a855f7';
    const codeLines = snippet.code.split('\n').length;

    return (
        <Card
            sx={{
                height: '100%', display: 'flex', flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(168,84,247,0.2)',
                    borderColor: 'rgba(168,84,247,0.4)',
                },
            }}
        >
            <CardContent sx={{ flexGrow: 1, pb: 0 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.5 }}>
                    <Box
                        sx={{
                            width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                            mt: 0.7, bgcolor: langColor,
                            boxShadow: `0 0 8px ${langColor}80`,
                        }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontSize: '0.95rem', lineHeight: 1.3, mb: 0.5 }}>
                            {snippet.title}
                        </Typography>
                        <Chip
                            label={snippet.language}
                            size="small"
                            sx={{ bgcolor: `${langColor}20`, color: langColor, borderColor: `${langColor}40`, border: '1px solid' }}
                        />
                    </Box>
                    <Tooltip title={favorited ? 'Remove favorite' : 'Add to favorites'}>
                        <IconButton onClick={handleFavorite} size="small" sx={{ color: favorited ? 'error.main' : 'text.secondary' }}>
                            {favorited ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Description */}
                {snippet.description && (
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5, lineHeight: 1.5 }}>
                        {snippet.description}
                    </Typography>
                )}

                {/* Code Preview */}
                <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
                    <Box sx={{
                        position: 'absolute', top: 8, right: 8, zIndex: 2, display: 'flex', gap: 0.5
                    }}>
                        <Tooltip title={copied ? 'Copied!' : 'Copy code'}>
                            <IconButton
                                size="small"
                                onClick={handleCopy}
                                sx={{
                                    bgcolor: 'rgba(0,0,0,0.4)', color: copied ? 'success.main' : 'text.secondary',
                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
                                }}
                            >
                                {copied ? <CheckIcon sx={{ fontSize: 14 }} /> : <ContentCopyIcon sx={{ fontSize: 14 }} />}
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <SyntaxHighlighter
                        language={snippet.language === 'javascript' ? 'jsx' : snippet.language}
                        style={vscDarkPlus}
                        customStyle={{
                            margin: 0, borderRadius: 8, fontSize: '0.78rem',
                            maxHeight: expanded ? '600px' : '180px',
                            overflow: 'auto',
                            transition: 'max-height 0.3s ease',
                        }}
                        showLineNumbers
                    >
                        {snippet.code}
                    </SyntaxHighlighter>
                </Box>

                {codeLines > 10 && (
                    <Button
                        size="small"
                        onClick={() => setExpanded((v) => !v)}
                        endIcon={<ExpandMoreIcon sx={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />}
                        sx={{ mt: 0.5, color: 'primary.light', fontSize: '0.75rem' }}
                    >
                        {expanded ? 'Collapse' : `Show all ${codeLines} lines`}
                    </Button>
                )}

                {/* Tags */}
                {snippet.tags?.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1.5 }}>
                        {snippet.tags.map((tag) => (
                            <Chip
                                key={tag}
                                label={`#${tag}`}
                                size="small"
                                sx={{ bgcolor: 'rgba(168,156,200,0.1)', color: 'text.secondary', fontSize: '0.68rem' }}
                            />
                        ))}
                    </Box>
                )}
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2, pt: 1, borderTop: '1px solid rgba(168,156,200,0.08)', mt: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <CodeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Rating
                        name={`rating-${snippet._id}`}
                        value={rating}
                        precision={0.5}
                        size="small"
                        onChange={handleRate}
                        sx={{ '& .MuiRating-iconFilled': { color: '#f59e0b' } }}
                    />
                    <Typography variant="caption" sx={{ color: 'text.secondary', ml: 'auto' }}>
                        {ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'}
                    </Typography>
                </Box>
            </CardActions>
        </Card>
    );
}
