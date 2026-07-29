import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Fade,
  Stack,
  Paper,
  Skeleton,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  DirectionsRun,
  DirectionsWalk,
  DirectionsBike,
  AccessTime,
  LocalFireDepartment,
  TrendingUp,
  CalendarToday,
  ArrowForward,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getActivities } from "../service/api";

const ActivityIcon = ({ type }) => {
  switch (type) {
    case "RUNNING":
      return <DirectionsRun sx={{ color: "#FF6B6B", fontSize: 30 }} />;
    case "WALKING":
      return <DirectionsWalk sx={{ color: "#4ECDC4", fontSize: 30 }} />;
    case "CYCLING":
      return <DirectionsBike sx={{ color: "#45B7D1", fontSize: 30 }} />;
    default:
      return <DirectionsRun sx={{ fontSize: 30 }} />;
  }
};

const ActivityColor = ({ type }) => {
  switch (type) {
    case "RUNNING":
      return "#FFE5E5";
    case "WALKING":
      return "#E5F4F2";
    case "CYCLING":
      return "#E5F0F4";
    default:
      return "#F5F5F5";
  }
};

export const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await getActivities();
      setActivities(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const activityDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const diffTime = today - activityDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleActivityClick = (activity) => {
    navigate(`/activities/${activity.id}`, {
      state: {
        activityType: activity.type,
        activityData: {
          duration: activity.duration,
          caloriesBurned: activity.caloriesBurned,
          additionalMetrices: activity.additionalMetrices || {},
        }
      }
    });
  };

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3].map((i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Skeleton
              variant="rectangular"
              height={200}
              sx={{ borderRadius: 3 }}
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (activities.length === 0) {
    return (
      <Paper
        sx={{
          p: 6,
          textAlign: "center",
          borderRadius: 3,
          bgcolor: "background.default",
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No activities yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Start tracking your fitness journey by adding your first activity!
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h5" fontWeight="bold">
          Recent Activities
        </Typography>
        <Chip
          label={`${activities.length} total`}
          color="primary"
          size="small"
          sx={{ fontWeight: "bold" }}
        />
      </Stack>

      <Grid container spacing={3}>
        {activities.map((activity, index) => (
          <Grid item xs={12} sm={6} md={4} key={activity.id}>
            <Fade in timeout={300 + index * 100}>
              <Card
                sx={{
                  cursor: "pointer",
                  height: "100%",
                  borderRadius: 3,
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                  },
                  position: "relative",
                  overflow: "visible",
                }}
                onClick={() => handleActivityClick(activity)}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Activity Type Badge */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: -12,
                      right: 16,
                      bgcolor: "primary.main",
                      color: "white",
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      fontSize: "0.7rem",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {activity.type}
                  </Box>

                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: ActivityColor({ type: activity.type }),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ActivityIcon type={activity.type} />
                    </Box>
                    <Box flex={1}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {activity.type.charAt(0) + activity.type.slice(1).toLowerCase()}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <CalendarToday sx={{ fontSize: 12, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(activity.createdAt)}
                        </Typography>
                      </Stack>
                    </Box>
                  </Box>

                  <Stack spacing={1.5}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <AccessTime sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                          Duration
                        </Typography>
                      </Stack>
                      <Typography variant="body2" fontWeight="bold">
                        {formatDuration(activity.duration)}
                      </Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <LocalFireDepartment sx={{ fontSize: 16, color: "#FF6B6B" }} />
                        <Typography variant="body2" color="text.secondary">
                          Calories
                        </Typography>
                      </Stack>
                      <Typography variant="body2" fontWeight="bold" color="primary">
                        {activity.caloriesBurned} kcal
                      </Typography>
                    </Box>

                    {activity.additionalMetrices?.averageSpeed && (
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <TrendingUp sx={{ fontSize: 16, color: "text.secondary" }} />
                          <Typography variant="body2" color="text.secondary">
                            Avg Speed
                          </Typography>
                        </Stack>
                        <Typography variant="body2" fontWeight="bold">
                          {activity.additionalMetrices.averageSpeed} km/h
                        </Typography>
                      </Box>
                    )}
                  </Stack>

                  <Box
                    sx={{
                      mt: 2,
                      pt: 2,
                      borderTop: "1px solid",
                      borderColor: "divider",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        sx={{
                          color: "primary.main",
                          "&:hover": {
                            bgcolor: "primary.light",
                          },
                        }}
                      >
                        <ArrowForward />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};