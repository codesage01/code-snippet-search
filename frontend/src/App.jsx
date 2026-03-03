import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Box, Typography, Badge, IconButton, Tooltip } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { v4 as uuidv4 } from 'uuid';
import theme from './theme';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';

function getSessionId() {
  let id = localStorage.getItem('snippet_session_id');
  if (!id) { id = uuidv4(); localStorage.setItem('snippet_session_id', id); }
  return id;
}

function getFavorites() {
  try {
    return new Set(JSON.parse(localStorage.getItem('snippet_favorites') || '[]'));
  } catch { return new Set(); }
}

export default function App() {
  const sessionId = useMemo(() => getSessionId(), []);
  const [favorites, setFavorites] = useState(getFavorites);

  const handleFavoriteToggle = (snippetId, isFav) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      isFav ? next.add(snippetId) : next.delete(snippetId);
      localStorage.setItem('snippet_favorites', JSON.stringify([...next]));
      return next;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: 'rgba(15,10,30,0.85)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(168,156,200,0.1)',
          }}
        >
          <Toolbar sx={{ gap: 2 }}>
            <Box
              component={NavLink}
              to="/"
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none' }}
            >
              <Box
                sx={{
                  width: 34, height: 34, borderRadius: 2,
                  background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <CodeIcon sx={{ fontSize: 18, color: '#fff' }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800, fontSize: '1.05rem',
                  background: 'linear-gradient(90deg, #c084fc, #06b6d4)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}
              >
                SnippetSearch
              </Typography>
            </Box>

            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="My Favorites">
                <IconButton component={NavLink} to="/favorites" sx={{ color: 'text.secondary', '&.active': { color: 'error.main' } }}>
                  <Badge badgeContent={favorites.size} color="error" max={99}>
                    <FavoriteIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: 'background.default' }}>
          <Routes>
            <Route
              path="/"
              element={<SearchPage sessionId={sessionId} favorites={favorites} onFavoriteToggle={handleFavoriteToggle} />}
            />
            <Route
              path="/favorites"
              element={<FavoritesPage sessionId={sessionId} favorites={favorites} onFavoriteToggle={handleFavoriteToggle} />}
            />
          </Routes>
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            textAlign: 'center', py: 3,
            borderTop: '1px solid rgba(168,156,200,0.1)',
            bgcolor: 'background.default',
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            SnippetSearch — Powered by React · Node.js · MongoDB · OpenAI
          </Typography>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}
