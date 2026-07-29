import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  Box,
  Button,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Avatar,
  IconButton,
  Chip,
  Badge,
  Tooltip,
  Paper,
  Fade,
  Stack,
  useTheme,
  useMediaQuery,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import {
  FitnessCenter,
  Logout,
  Person,
  Notifications,
  Dashboard,
  Login,
  EmojiEvents,
  TrendingUp,
  Error as ErrorIcon,
  OpenInNew,
} from "@mui/icons-material";
import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { setCredentials } from "./store/authSlice";
import { ActivityForm } from "./component/ActivityForm";
import { ActivityList } from "./component/ActivityList";
import { ActivityDetail } from "./component/ActivityDetail";

const ActivitiesPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleActivityAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in timeout={500}>
        <Box>
          <ActivityForm onActivityAdded={handleActivityAdded} />
          <ActivityList key={refreshKey} />
        </Box>
      </Fade>
    </Container>
  );
};

function App() {
  const { token, tokenData, logIn, logOut, tokenExpiresIn } = useContext(AuthContext);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authInProgress, setAuthInProgress] = useState(false);

  useEffect(() => {
    if (token) {
      console.log('Token received:', token);
      dispatch(setCredentials({ token, user: tokenData }));
      setLoading(false);
      setAuthInProgress(false);
    }
  }, [token, tokenData, dispatch]);

  // Check if we're returning from Keycloak
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (code || state) {
      console.log('OAuth2 callback detected');
      setAuthInProgress(true);
    }
  }, []);

  // FIX: Properly handle OAuth2 login
  const handleLogin = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setAuthInProgress(true);
      
      console.log('Initiating OAuth2 login...');
      
      // Call logIn - this should redirect to Keycloak
      await logIn();
      
      // The page will be redirected to Keycloak, so code after this won't execute
      console.log('Redirecting to Keycloak...');
      
      // If we get here, something went wrong
      setAuthInProgress(false);
      setLoading(false);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Failed to login. Please try again.");
      setLoading(false);
      setAuthInProgress(false);
    }
  }, [logIn]);

  const handleLogout = useCallback(() => {
    try {
      logOut();
      // Clear any local state
      dispatch(setCredentials({ token: null, user: null }));
    } catch (err) {
      console.error("Logout error:", err);
    }
  }, [logOut, dispatch]);

  const handleCloseError = () => {
    setError(null);
  };

  // If we're in the middle of authentication, show a loading state
  if (authInProgress && !token) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Paper
          elevation={24}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 4,
            maxWidth: 400,
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 3 }}>
            Authenticating...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please wait while we complete the login process
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Router>
      {!token ? (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            p: 2,
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: -50,
              right: -50,
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -100,
              left: -100,
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.03)",
            },
          }}
        >
          <Fade in timeout={800}>
            <Paper
              elevation={24}
              sx={{
                p: { xs: 4, sm: 6 },
                borderRadius: 4,
                maxWidth: 440,
                width: "100%",
                textAlign: "center",
                position: "relative",
                zIndex: 1,
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 3,
                }}
              >
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
                    "&:hover": {
                      transform: "scale(1.05)",
                      transition: "transform 0.3s ease",
                    },
                  }}
                >
                  <FitnessCenter sx={{ fontSize: 50, color: "white" }} />
                </Avatar>
              </Box>

              <Typography
                variant="h4"
                gutterBottom
                fontWeight="bold"
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Fitness Tracker
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 1, px: 2 }}
              >
                Track your activities and get AI-powered insights
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                sx={{ mb: 4 }}
              >
                <Chip
                  icon={<EmojiEvents sx={{ fontSize: 16 }} />}
                  label="Track Progress"
                  size="small"
                  variant="outlined"
                />
                <Chip
                  icon={<TrendingUp sx={{ fontSize: 16 }} />}
                  label="AI Analysis"
                  size="small"
                  variant="outlined"
                />
              </Stack>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ mb: 2, textAlign: "left" }}
                  icon={<ErrorIcon />}
                >
                  {error}
                </Alert>
              )}

              <Button
                variant="contained"
                size="large"
                onClick={handleLogin}
                fullWidth
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <OpenInNew />}
                sx={{
                  py: 1.8,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: 2,
                  "&:hover": {
                    background: "linear-gradient(135deg, #5a67d8 0%, #6c3b9e 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {loading ? "Redirecting to login..." : "Sign In with Keycloak"}
              </Button>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 3, display: "block", opacity: 0.7 }}
              >
                Secure authentication with Keycloak OAuth2
              </Typography>
            </Paper>
          </Fade>
        </Box>
      ) : (
        <>
          <AppBar
            position="sticky"
            elevation={0}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            <Toolbar sx={{ flexWrap: "wrap", gap: { xs: 0.5, sm: 1 } }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "rgba(255,255,255,0.2)",
                  mr: 1,
                }}
              >
                <FitnessCenter sx={{ fontSize: 24 }} />
              </Avatar>

              <Typography
                variant="h6"
                sx={{
                  flexGrow: 1,
                  fontWeight: "bold",
                  fontSize: { xs: "0.9rem", sm: "1.25rem" },
                }}
              >
                Fitness Tracker
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1.5 } }}>
                <Tooltip title="Dashboard">
                  <IconButton
                    color="inherit"
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    <Dashboard />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Notifications">
                  <IconButton
                    color="inherit"
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    <Badge badgeContent={3} color="error">
                      <Notifications />
                    </Badge>
                  </IconButton>
                </Tooltip>

                {!isMobile && (
                  <Chip
                    icon={<Person />}
                    label={tokenData?.email || tokenData?.preferred_username || "User"}
                    size="small"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.15)",
                      color: "white",
                      "& .MuiChip-icon": { color: "white" },
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.25)",
                      },
                    }}
                  />
                )}

                <Tooltip title="Sign Out">
                  <IconButton
                    color="inherit"
                    onClick={handleLogout}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      border: "1px solid rgba(255,255,255,0.3)",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.5)",
                      },
                    }}
                  >
                    <Logout />
                  </IconButton>
                </Tooltip>
              </Box>
            </Toolbar>
          </AppBar>

          <Routes>
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/activities/:id" element={<ActivityDetail />} />
            <Route
              path="/"
              element={<Navigate to="/activities" replace />}
            />
          </Routes>

          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={handleCloseError}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseError}
              severity="error"
              variant="filled"
              sx={{ width: "100%", borderRadius: 2 }}
            >
              {error}
            </Alert>
          </Snackbar>
        </>
      )}
    </Router>
  );
}

export default App;