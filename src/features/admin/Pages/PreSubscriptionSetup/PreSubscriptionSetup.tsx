import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import toast from "react-hot-toast";
import {
  useGetAppConfigQuery,
  useUpdateAppConfigMutation,
} from "../../../../redux/features/appConfig/appConfigApi";

const AVAILABLE_FEATURES = [
  "Mock Tests",
  "Live Classes",
  "Recorded Videos",
  "PDF Notes",
  "Discussion Forum",
];

const PreSubscriptionSetup = () => {
  const { data, isLoading } = useGetAppConfigQuery();
  const [updateAppConfig, { isLoading: isUpdating }] = useUpdateAppConfigMutation();

  const [isTrialEnabled, setIsTrialEnabled] = useState(false);
  const [freeTrialDays, setFreeTrialDays] = useState(7);
  const [freeAccessFeatures, setFreeAccessFeatures] = useState<string[]>([]);
  const [featureLimits, setFeatureLimits] = useState<Record<string, number>>({});

  useEffect(() => {
    if (data?.data) {
      setIsTrialEnabled(data.data.isTrialEnabled);
      setFreeTrialDays(data.data.freeTrialDays);
      setFreeAccessFeatures(data.data.freeAccessFeatures || []);
      setFeatureLimits(data.data.featureLimits || {});
    }
  }, [data]);

  const handleFeatureToggle = (feature: string) => {
    setFreeAccessFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  const handleLimitChange = (key: string, value: string) => {
    const numValue = parseInt(value, 10);
    setFeatureLimits((prev) => ({
      ...prev,
      [key]: isNaN(numValue) ? 0 : numValue,
    }));
  };

  const handleSave = async () => {
    try {
      await updateAppConfig({
        isTrialEnabled,
        freeTrialDays,
        freeAccessFeatures,
        featureLimits,
      }).unwrap();
      toast.success("App configuration updated successfully");
    } catch (error) {
      toast.error("Failed to update configuration");
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", height: "100vh" }}>
      <Paper variant="outlined" sx={{ width: "100%", minHeight: "100vh", borderRadius: "10px", p: 4 }}>
        <Typography variant="h3" sx={{ mb: 4 }}>
          Pre-Subscription Setup
        </Typography>

        <Box sx={{ maxWidth: 600 }}>
          {/* Trial Toggle */}
          <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h6">Enable Free Trial:</Typography>
            <Switch
              checked={isTrialEnabled}
              onChange={(e) => setIsTrialEnabled(e.target.checked)}
              color="primary"
            />
          </Box>

          {/* Trial Days */}
          <Box sx={{ mb: 4 }}>
            <TextField
              label="Free Trial Duration (Days)"
              type="number"
              variant="outlined"
              fullWidth
              value={freeTrialDays}
              onChange={(e) => setFreeTrialDays(parseInt(e.target.value) || 0)}
              disabled={!isTrialEnabled}
            />
          </Box>

          {/* Free Access Features */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Free Access Features:
            </Typography>
            <FormGroup>
              {AVAILABLE_FEATURES.map((feature) => (
                <FormControlLabel
                  key={feature}
                  control={
                    <Checkbox
                      checked={freeAccessFeatures.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                      disabled={!isTrialEnabled}
                    />
                  }
                  label={feature}
                />
              ))}
            </FormGroup>
          </Box>

          {/* Feature Limits */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Feature Access Limits (During Trial):
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <TextField
                label="Max Mock Tests"
                type="number"
                size="small"
                disabled={!isTrialEnabled || !freeAccessFeatures.includes("Mock Tests")}
                value={featureLimits["maxMockTests"] || 0}
                onChange={(e) => handleLimitChange("maxMockTests", e.target.value)}
                sx={{ minWidth: 200 }}
              />
              <TextField
                label="Max Live Classes"
                type="number"
                size="small"
                disabled={!isTrialEnabled || !freeAccessFeatures.includes("Live Classes")}
                value={featureLimits["maxLiveClasses"] || 0}
                onChange={(e) => handleLimitChange("maxLiveClasses", e.target.value)}
                sx={{ minWidth: 200 }}
              />
            </Box>
          </Box>

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSave}
            disabled={isUpdating}
          >
            {isUpdating ? <CircularProgress size={24} /> : "Save Configuration"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PreSubscriptionSetup;
