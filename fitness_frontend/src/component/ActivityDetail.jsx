import {
  Box,
  Card,
  Typography,
  Chip,
  Stack,
  Paper,
  Avatar,
  Button,
  Fade,
  Alert,
  AlertTitle,
  LinearProgress,
  Container,
  Divider,
  Tooltip,
  alpha,
  Grid,
} from "@mui/material";
import {
  DirectionsRun,
  DirectionsWalk,
  DirectionsBike,
  AccessTime,
  LocalFireDepartment,
  Speed,
  Favorite,
  TrendingUp,
  CheckCircle,
  Lightbulb,
  Security,
  ArrowBack,
  CalendarToday,
  Analytics,
  Architecture,
  CloudSync,
  Shield,
  Psychology,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getActivityDetail } from "../service/api";

const ActivityIcon = ({ type, size = 28 }) => {
  switch (type) {
    case "RUNNING":
      return <DirectionsRun sx={{ color: "#FF6B6B", fontSize: size }} />;
    case "WALKING":
      return <DirectionsWalk sx={{ color: "#4ECDC4", fontSize: size }} />;
    case "CYCLING":
      return <DirectionsBike sx={{ color: "#45B7D1", fontSize: size }} />;
    default:
      return <DirectionsRun sx={{ fontSize: size }} />;
  }
};

const ActivityColor = ({ type }) => {
  switch (type) {
    case "RUNNING":
      return "#FF6B6B";
    case "WALKING":
      return "#4ECDC4";
    case "CYCLING":
      return "#45B7D1";
    default:
      return "#667eea";
  }
};

const ActivityGradient = ({ type }) => {
  switch (type) {
    case "RUNNING":
      return "linear-gradient(135deg, #FF6B6B 0%, #ee5a24 100%)";
    case "WALKING":
      return "linear-gradient(135deg, #4ECDC4 0%, #2ecc71 100%)";
    case "CYCLING":
      return "linear-gradient(135deg, #45B7D1 0%, #3498db 100%)";
    default:
      return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  }
};

export const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState(null);
  
  const activityType = location.state?.activityType || "RUNNING";
  const activityColor = ActivityColor({ type: activityType });
  const activityGradient = ActivityGradient({ type: activityType });

  useEffect(() => {
    const fetchActivityDetail = async () => {
      try {
        setLoading(true);
        const response = await getActivityDetail(id);
        setActivity(response.data);
        
        // Get data from location state
        if (location.state?.activityData) {
          setActivityData(location.state.activityData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivityDetail();
  }, [id, location.state]);

  const getActivityTypeDisplay = (type) => {
    if (!type) return "Activity";
    return type.charAt(0) + type.slice(1).toLowerCase();
  };

  const formatDuration = (minutes) => {
    if (!minutes) return "N/A";
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  if (loading) {
    return (
      <Box sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 4 }}>
        <Box sx={{ width: "100%", maxWidth: 400 }}>
          <LinearProgress sx={{ height: 4, borderRadius: 2 }} />
          <Typography sx={{ mt: 2, textAlign: "center", color: "text.secondary", fontSize: "0.875rem" }}>
            Loading activity details...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!activity) {
    return (
      <Box sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 3, maxWidth: 500 }}>
          <AlertTitle>Error</AlertTitle>
          Activity not found. Please go back and try again.
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/activities")}
            sx={{ mt: 1 }}
            size="small"
          >
            Back to Activities
          </Button>
        </Alert>
      </Box>
    );
  }

  // Use data from state if available, otherwise fallback to activity data
  const duration = activityData?.duration || activity.duration;
  const calories = activityData?.caloriesBurned || activity.caloriesBurned;
  const avgSpeed = activityData?.additionalMetrices?.averageSpeed || activity.additionalMetrices?.averageSpeed || "N/A";
  const heartRate = activityData?.additionalMetrices?.heartRate || activity.additionalMetrices?.heartRate || "N/A";

  return (
    <Box sx={{ 
      height: "100vh",
      display: "flex",
      alignItems: "center",
      bgcolor: "background.default",
      p: 2,
      overflow: "hidden",
    }}>
      <Container maxWidth="xl" sx={{ height: "100%", p: 0 }}>
        <Fade in timeout={400}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
              overflow: "hidden",
              background: "white",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header with Stats */}
            <Box
              sx={{
                background: activityGradient,
                px: { xs: 2, sm: 3 },
                py: { xs: 1.5, sm: 2 },
                color: "white",
                position: "relative",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: -30,
                  right: -30,
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  bgcolor: "rgba(255,255,255,0.05)",
                }}
              />

              <Stack spacing={1.5} sx={{ position: "relative", zIndex: 1 }}>
                {/* Top Row */}
                <Stack 
                  direction="row" 
                  spacing={2} 
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button
                      startIcon={<ArrowBack />}
                      onClick={() => navigate("/activities")}
                      size="small"
                      sx={{
                        color: "white",
                        border: "1px solid rgba(255,255,255,0.3)",
                        "&:hover": {
                          bgcolor: "rgba(255,255,255,0.1)",
                          borderColor: "rgba(255,255,255,0.5)",
                        },
                        px: { xs: 1, sm: 2 },
                        py: 0.5,
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                        flexShrink: 0,
                      }}
                    >
                      Back
                    </Button>
                    
                    <Avatar
                      sx={{
                        width: { xs: 40, sm: 48 },
                        height: { xs: 40, sm: 48 },
                        bgcolor: "rgba(255,255,255,0.2)",
                        border: "2px solid rgba(255,255,255,0.3)",
                        backdropFilter: "blur(10px)",
                        flexShrink: 0,
                      }}
                    >
                      <ActivityIcon type={activityType} size={24} />
                    </Avatar>
                    
                    <Box>
                      <Typography 
                        variant="h6" 
                        fontWeight="bold"
                        sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                      >
                        {getActivityTypeDisplay(activityType)} Activity
                      </Typography>
                      
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                        <Chip
                          label={`#${activity.activityId}`}
                          size="small"
                          sx={{
                            bgcolor: "rgba(255,255,255,0.2)",
                            color: "white",
                            height: 18,
                            fontSize: "0.6rem",
                            backdropFilter: "blur(10px)",
                          }}
                        />
                        <Chip
                          icon={<CalendarToday sx={{ color: "white !important", fontSize: 12 }} />}
                          label={new Date(activity.createdDate).toLocaleDateString('en-US', { 
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                          size="small"
                          sx={{
                            bgcolor: "rgba(255,255,255,0.2)",
                            color: "white",
                            height: 18,
                            fontSize: "0.6rem",
                            backdropFilter: "blur(10px)",
                          }}
                        />
                      </Stack>
                    </Box>
                  </Stack>
                </Stack>

                {/* Stats Row */}
                <Grid container spacing={1}>
                  {[
                    { icon: <AccessTime sx={{ fontSize: 14 }} />, label: "Duration", value: formatDuration(duration), color: "rgba(255,255,255,0.9)" },
                    { icon: <LocalFireDepartment sx={{ fontSize: 14 }} />, label: "Calories", value: `${calories || 0} kcal`, color: "rgba(255,255,255,0.9)" },
                    { icon: <Speed sx={{ fontSize: 14 }} />, label: "Avg Speed", value: `${avgSpeed} km/h`, color: "rgba(255,255,255,0.9)" },
                    { icon: <Favorite sx={{ fontSize: 14 }} />, label: "Heart Rate", value: `${heartRate} bpm`, color: "rgba(255,255,255,0.9)" },
                  ].map((stat, index) => (
                    <Grid item xs={3} key={index}>
                      <Box
                        sx={{
                          p: 0.5,
                          borderRadius: 1.5,
                          bgcolor: "rgba(255,255,255,0.1)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255,255,255,0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 0.75,
                        }}
                      >
                        <Box sx={{ color: "white", display: "flex", alignItems: "center", opacity: 0.8 }}>
                          {stat.icon}
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ fontSize: { xs: "0.5rem", sm: "0.55rem" }, display: "block", lineHeight: 1, color: "rgba(255,255,255,0.7)" }}>
                            {stat.label}
                          </Typography>
                          <Typography variant="caption" fontWeight="bold" sx={{ fontSize: { xs: "0.55rem", sm: "0.65rem" }, lineHeight: 1, color: "white" }}>
                            {stat.value}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </Box>

            {/* Main Content */}
            <Box sx={{ flex: 1, overflow: "hidden", p: { xs: 1.5, sm: 2 }, minHeight: 0 }}>
              <Box sx={{ display: "flex", gap: 1.5, height: "100%", width: "100%" }}>
                {/* Left Column */}
                <Box sx={{ flex: 1, minWidth: 0, height: "100%" }}>
                  <Stack spacing={1.5} sx={{ height: "100%" }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: { xs: 1.5, sm: 2 },
                        bgcolor: alpha(activityColor, 0.04),
                        borderRadius: 2,
                        border: `1px solid ${alpha(activityColor, 0.15)}`,
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        minHeight: 0,
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, flexShrink: 0 }}>
                        <Psychology sx={{ color: activityColor, fontSize: 20 }} />
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: "0.9rem" }}>
                          AI Analysis
                        </Typography>
                        <Chip 
                          label="AI" 
                          size="small" 
                          sx={{ 
                            bgcolor: alpha(activityColor, 0.1), 
                            color: activityColor,
                            height: 20,
                            fontSize: "0.6rem",
                            fontWeight: 600,
                          }} 
                        />
                      </Stack>
                      <Typography 
                        variant="body2" 
                        color="text.primary" 
                        lineHeight={1.8} 
                        sx={{ 
                          fontSize: "0.875rem",
                          flex: 1,
                          overflow: "auto",
                          "&::-webkit-scrollbar": {
                            width: 4,
                          },
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: alpha(activityColor, 0.3),
                            borderRadius: 4,
                          },
                        }}
                      >
                        {activity.recommendation}
                      </Typography>
                    </Paper>

                    <Paper
                      elevation={0}
                      sx={{
                        p: { xs: 1.5, sm: 2 },
                        bgcolor: alpha("#FFA726", 0.04),
                        borderRadius: 2,
                        border: `1px solid ${alpha("#FFA726", 0.15)}`,
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        minHeight: 0,
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, flexShrink: 0 }}>
                        <TrendingUp sx={{ color: "#FFA726", fontSize: 20 }} />
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: "0.9rem" }}>
                          Improvements
                        </Typography>
                        <Chip 
                          label={activity.improvements?.length || 0} 
                          size="small" 
                          sx={{ 
                            bgcolor: alpha("#FFA726", 0.1), 
                            color: "#FFA726",
                            height: 20,
                            fontSize: "0.6rem",
                            fontWeight: 600,
                          }} 
                        />
                      </Stack>
                      <Stack 
                        spacing={1} 
                        sx={{ 
                          flex: 1,
                          overflow: "auto",
                          "&::-webkit-scrollbar": {
                            width: 4,
                          },
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: alpha("#FFA726", 0.3),
                            borderRadius: 4,
                          },
                        }}
                      >
                        {activity.improvements?.map((item, index) => (
                          <Box key={index} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                            <Box
                              sx={{
                                minWidth: 20,
                                height: 20,
                                borderRadius: "50%",
                                bgcolor: alpha("#FFA726", 0.15),
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#FFA726",
                                fontWeight: "bold",
                                fontSize: "0.7rem",
                                flexShrink: 0,
                                mt: 0.2,
                              }}
                            >
                              {index + 1}
                            </Box>
                            <Typography variant="body2" sx={{ fontSize: "0.825rem" }}>
                              {item}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Paper>
                  </Stack>
                </Box>

                {/* Right Column */}
                <Box sx={{ flex: 1, minWidth: 0, height: "100%" }}>
                  <Stack spacing={1.5} sx={{ height: "100%" }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: { xs: 1.5, sm: 2 },
                        bgcolor: alpha("#FFD93D", 0.06),
                        borderRadius: 2,
                        border: `1px solid ${alpha("#FFD93D", 0.2)}`,
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        minHeight: 0,
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, flexShrink: 0 }}>
                        <Lightbulb sx={{ color: "#FFD93D", fontSize: 20 }} />
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: "0.9rem" }}>
                          Suggestions
                        </Typography>
                        <Chip 
                          label={activity.suggestions?.length || 0} 
                          size="small" 
                          sx={{ 
                            bgcolor: alpha("#FFD93D", 0.1), 
                            color: "#FFD93D",
                            height: 20,
                            fontSize: "0.6rem",
                            fontWeight: 600,
                          }} 
                        />
                      </Stack>
                      <Stack 
                        spacing={1} 
                        sx={{ 
                          flex: 1,
                          overflow: "auto",
                          "&::-webkit-scrollbar": {
                            width: 4,
                          },
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: alpha("#FFD93D", 0.3),
                            borderRadius: 4,
                          },
                        }}
                      >
                        {activity.suggestions?.map((item, index) => (
                          <Box key={index} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                            <Typography variant="body2" sx={{ fontSize: "0.9rem", flexShrink: 0 }}>💡</Typography>
                            <Typography variant="body2" sx={{ fontSize: "0.825rem" }}>
                              <strong>{index + 1}.</strong> {item}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Paper>

                    <Paper
                      elevation={0}
                      sx={{
                        p: { xs: 1.5, sm: 2 },
                        bgcolor: alpha("#4CAF50", 0.04),
                        borderRadius: 2,
                        border: `1px solid ${alpha("#4CAF50", 0.12)}`,
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        minHeight: 0,
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, flexShrink: 0 }}>
                        <Security sx={{ color: "#4CAF50", fontSize: 20 }} />
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: "0.9rem" }}>
                          Safety Tips
                        </Typography>
                        <Chip 
                          label={activity.safety?.length || 0} 
                          size="small" 
                          sx={{ 
                            bgcolor: alpha("#4CAF50", 0.1), 
                            color: "#4CAF50",
                            height: 20,
                            fontSize: "0.6rem",
                            fontWeight: 600,
                          }} 
                        />
                      </Stack>
                      <Stack 
                        spacing={1} 
                        sx={{ 
                          flex: 1,
                          overflow: "auto",
                          "&::-webkit-scrollbar": {
                            width: 4,
                          },
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: alpha("#4CAF50", 0.3),
                            borderRadius: 4,
                          },
                        }}
                      >
                        {activity.safety?.map((item, index) => (
                          <Box key={index} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                            <CheckCircle sx={{ color: "#4CAF50", fontSize: 16, mt: 0.2, flexShrink: 0 }} />
                            <Typography variant="body2" sx={{ fontSize: "0.825rem" }}>
                              <strong>Tip {index + 1}:</strong> {item}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Paper>
                  </Stack>
                </Box>
              </Box>
            </Box>

            {/* Footer */}
            <Divider sx={{ flexShrink: 0 }} />
            <Box sx={{ 
              px: 2, 
              py: 0.75, 
              bgcolor: "#f8f9fa", 
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexShrink: 0,
            }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                Microservices • Kafka • Keycloak • AI
              </Typography>
              <Box sx={{ display: "flex", gap: 0.75 }}>
                {[
                  { icon: <Architecture sx={{ fontSize: 14 }} />, color: "#6C63FF" },
                  { icon: <CloudSync sx={{ fontSize: 14 }} />, color: "#FF6B6B" },
                  { icon: <Shield sx={{ fontSize: 14 }} />, color: "#4ECDC4" },
                  { icon: <Analytics sx={{ fontSize: 14 }} />, color: "#FFD93D" },
                ].map((tech, index) => (
                  <Tooltip key={index} title={["Microservices", "Kafka", "Keycloak", "AI"][index]}>
                    <Box sx={{ color: tech.color, display: "flex", alignItems: "center" }}>
                      {tech.icon}
                    </Box>
                  </Tooltip>
                ))}
              </Box>
            </Box>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};