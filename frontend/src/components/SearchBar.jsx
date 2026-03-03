import { useState, useCallback } from 'react';
import {
    Box, TextField, Button, Select, MenuItem, FormControl,
    InputLabel, Chip, InputAdornment, Collapse, Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';

const LANGUAGES = ['javascript', 'python', 'typescript', 'go', 'sql', 'css', 'rust', 'java', 'c++'];

export default function SearchBar({ onSearch, loading }) {
    const [query, setQuery] = useState('');
    const [lang, setLang] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = useCallback(() => {
        onSearch({ q: query, lang, tags: tags.join(',') });
    }, [query, lang, tags, onSearch]);

    const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch(); };

    const addTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            setTags((prev) => [...new Set([...prev, tagInput.trim().toLowerCase()])]);
            setTagInput('');
        }
    };

    const removeTag = (tag) => setTags((prev) => prev.filter((t) => t !== tag));

    const handleReset = () => {
        setQuery(''); setLang(''); setTags([]); setTagInput('');
        onSearch({ q: '', lang: '', tags: '' });
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 860, mx: 'auto' }}>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <TextField
                    fullWidth
                    placeholder="Search code snippets… e.g. 'sort array', 'async await', 'JWT'"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: 'primary.main' }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            background: 'rgba(168,156,200,0.07)',
                            '&:hover fieldset': { borderColor: 'primary.main' },
                            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                        },
                    }}
                />
                <Button
                    variant="contained"
                    onClick={handleSearch}
                    disabled={loading}
                    sx={{
                        px: 3, py: 1.8, minWidth: 120,
                        background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                        '&:hover': { background: 'linear-gradient(135deg, #c084fc 0%, #a855f7 100%)' },
                    }}
                >
                    {loading ? 'Searching…' : 'Search'}
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => setShowFilters((v) => !v)}
                    sx={{ px: 2, py: 1.8, borderColor: 'rgba(168,156,200,0.3)', minWidth: 48 }}
                >
                    <TuneIcon />
                </Button>
            </Box>

            <Collapse in={showFilters}>
                <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                    <FormControl sx={{ minWidth: 180 }} size="small">
                        <InputLabel>Language</InputLabel>
                        <Select
                            value={lang}
                            label="Language"
                            onChange={(e) => setLang(e.target.value)}
                            sx={{ background: 'rgba(168,156,200,0.07)' }}
                        >
                            <MenuItem value="">All Languages</MenuItem>
                            {LANGUAGES.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <TextField
                        size="small"
                        placeholder="Add tag & press Enter"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={addTag}
                        sx={{ minWidth: 220, '& .MuiOutlinedInput-root': { background: 'rgba(168,156,200,0.07)' } }}
                    />

                    <Button size="small" variant="text" onClick={handleReset} sx={{ color: 'text.secondary', alignSelf: 'center' }}>
                        Reset
                    </Button>
                </Box>

                {tags.length > 0 && (
                    <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', alignSelf: 'center' }}>Tags:</Typography>
                        {tags.map((tag) => (
                            <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                onDelete={() => removeTag(tag)}
                                sx={{ bgcolor: 'rgba(168,84,247,0.18)', color: 'primary.light' }}
                            />
                        ))}
                    </Box>
                )}
            </Collapse>
        </Box>
    );
}
