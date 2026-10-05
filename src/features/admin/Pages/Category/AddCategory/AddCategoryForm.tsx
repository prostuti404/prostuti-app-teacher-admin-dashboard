import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateCategoryMutation } from "../../../../../redux/features/category/categoryApi";
import toast from "react-hot-toast";

const AddCategoryForm = () => {
  const navigate = useNavigate();
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const [formValues, setFormValues] = useState({
    group: "",
    type: "",
    name: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.group || !formValues.type || !formValues.name) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await createCategory(formValues).unwrap();
      toast.success("Category created successfully");
      navigate("/admin/category");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to create category");
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
      <Paper variant="outlined" sx={{ borderRadius: "10px", p: { xs: 2, md: 4 } }}>
        <Typography variant="h5" component="h2" fontWeight="600" mb={3}>
          Add New Category
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            required
            margin="normal"
            label="Group (e.g., Science, Arts, Commerce)"
            name="group"
            value={formValues.group}
            onChange={handleInputChange}
          />
          
          <TextField
            fullWidth
            required
            margin="normal"
            label="Type (e.g., Academic, Admission, Job)"
            name="type"
            value={formValues.type}
            onChange={handleInputChange}
          />
          
          <TextField
            fullWidth
            required
            margin="normal"
            label="Name (e.g., HSC 2027, Medical, Engineering)"
            name="name"
            value={formValues.name}
            onChange={handleInputChange}
          />

          <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/admin/category")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {isLoading ? "Saving..." : "Save Category"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddCategoryForm;