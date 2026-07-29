import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  Stack,
  Alert,
  Snackbar,
  FormHelperText,
  Chip,
  Fade,
} from "@mui/material";
import {
  Add,
  DirectionsRun,
  DirectionsWalk,
  DirectionsBike,
} from "@mui/icons-material";
import { addActivity } from "../service/api";

export const ActivityForm = ({ onActivityAdded }) => {
  const [activity, setActivity] = useState({
    type: "RUNNING",
    duration: "",
    caloriesBurned: "",
    additionalMetrics: {},
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!activity.duration || !activity.caloriesBurned) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      await addActivity(activity);
      setSuccess(true);
      onActivityAdded();
      setActivity({
        type: "RUNNING",
        duration: "",
        caloriesBurned: "",
        additionalMetrics: {},
      });
    } catch (error) {
      setError("Failed to add activity. Please try again.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseError = () => setError(null);
  const handleCloseSuccess = () => setSuccess(false);

  return (
    <Fade in timeout={300}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          border: "2px dashed",
          borderColor: "primary.light",
          borderRadius: 3,
          bgcolor: "background.default",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            borderColor: "primary.main",
            bgcolor: "background.paper",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: "primary.light",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Add sx={{ color: "primary.main" }} />
          </Box>
          <Typography variant="h6" fontWeight="bold" color="primary">
            Log New Activity
          </Typography>
          <Chip
            label="Track your progress"
            size="small"
            sx={{ ml: "auto", bgcolor: "primary.light", color: "primary.main" }}
          />
        </Stack>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel>Activity Type</InputLabel>
              <Select
                label="Activity Type"
                value={activity.type}
                onChange={(e) =>
                  setActivity({ ...activity, type: e.target.value })
                }
                sx={{
                  borderRadius: 2,
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  },
                }}
                renderValue={(value) => (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {value === "RUNNING" ? (
                      <DirectionsRun sx={{ color: "#FF6B6B" }} />
                    ) : value === "WALKING" ? (
                      <DirectionsWalk sx={{ color: "#4ECDC4" }} />
                    ) : (
                      <DirectionsBike sx={{ color: "#45B7D1" }} />
                    )}
                    <span>{value.charAt(0) + value.slice(1).toLowerCase()}</span>
                  </Stack>
                )}
              >
                <MenuItem value="RUNNING">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <DirectionsRun sx={{ color: "#FF6B6B" }} />
                    <span>Running</span>
                  </Stack>
                </MenuItem>
                <MenuItem value="WALKING">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <DirectionsWalk sx={{ color: "#4ECDC4" }} />
                    <span>Walking</span>
                  </Stack>
                </MenuItem>
                <MenuItem value="CYCLING">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <DirectionsBike sx={{ color: "#45B7D1" }} />
                    <span>Cycling</span>
                  </Stack>
                </MenuItem>
              </Select>
              <FormHelperText>Select the type of activity you performed</FormHelperText>
            </FormControl>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Duration"
                type="number"
                placeholder="Enter duration in minutes"
                value={activity.duration}
                onChange={(e) =>
                  setActivity({ ...activity, duration: e.target.value })
                }
                InputProps={{
                  endAdornment: <Chip label="min" size="small" variant="outlined" />,
                }}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Calories Burned"
                type="number"
                placeholder="Enter calories burned"
                value={activity.caloriesBurned}
                onChange={(e) =>
                  setActivity({ ...activity, caloriesBurned: e.target.value })
                }
                InputProps={{
                  endAdornment: <Chip label="kcal" size="small" variant="outlined" />,
                }}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Stack>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={submitting}
              sx={{
                py: 1.5,
                borderRadius: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #5a67d8 0%, #6c3b9e 100%)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
                },
                transition: "all 0.3s ease",
              }}
            >
              {submitting ? "Adding Activity..." : "Log Activity"}
            </Button>
          </Stack>
        </Box>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
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

        <Snackbar
          open={success}
          autoHideDuration={3000}
          onClose={handleCloseSuccess}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSuccess}
            severity="success"
            variant="filled"
            sx={{ width: "100%", borderRadius: 2 }}
          >
            🎉 Activity added successfully!
          </Alert>
        </Snackbar>
      </Paper>
    </Fade>
  );
};