import {
  Box,
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Pagination,
  Stack,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  useGetAllCategoriesQuery,
  useGetAllCategoryTypesQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} from "../../../../redux/features/category/categoryApi";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Category = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editFormValues, setEditFormValues] = useState({
    subject: "",
    type: "",
    division: "",
    chapter: "",
    lesson: "",
    universityName: "",
    universityType: "",
    unit: "",
    jobType: "",
    jobName: ""
  });
  const [originalValues, setOriginalValues] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Track university type for conditionally showing unit field
  const [showUnitField, setShowUnitField] = useState(false);

  // Get all categories with pagination
  const { data: categoriesData, isLoading, isFetching } = useGetAllCategoriesQuery({ page, limit });

  // Get category types
  const { data: categoryTypes } = useGetAllCategoryTypesQuery({});

  // Update and delete mutations
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  // For dropdowns
  const divisions = ['Science', 'Arts', 'Commerce'];
  const universityTypes = ['Engineering', 'Medical', 'University'];

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    // Store original values for comparison
    const values = {
      subject: category.subject || "",
      type: category.type || "",
      division: category.division || "",
      chapter: category.chapter || "",
      lesson: category.lesson || "",
      universityName: category.universityName || "",
      universityType: category.universityType || "",
      unit: category.unit || "",
      jobType: category.jobType || "",
      jobName: category.jobName || ""
    };
    setEditFormValues(values);
    setOriginalValues(values);
    // Set unit field visibility based on universityType
    setShowUnitField(category.universityType === "University");
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormValues((prev) => ({
      ...prev,
      [name]: value
    }));

    // Update showUnitField when universityType changes
    if (name === "universityType") {
      setShowUnitField(value === "University");
    }
  };

  const handleUpdateCategory = async () => {
    // Create dynamic update body with only changed fields
    const updateBody = {};

    // Compare each field with original values and include only changed ones
    Object.keys(editFormValues).forEach(key => {
      if (editFormValues[key] !== originalValues[key] && editFormValues[key] !== "") {
        updateBody[key] = editFormValues[key];
      }
    });

    // Only proceed if there are changes
    if (Object.keys(updateBody).length === 0) {
      setEditDialogOpen(false);
      return;
    }

    try {
      await updateCategory({
        id: selectedCategory._id,
        body: updateBody
      }).unwrap();
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await deleteCategory(selectedCategory._id).unwrap();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const renderCategoryCell = (category) => {
    switch (category.type) {
      case "Academic":
        return (
            <>
              <Box sx={{ mb: 1 }}>
                <Chip size="small" color="primary" label={category.type} sx={{ mr: 1 }} />
                {category.division && <Chip size="small" color="secondary" label={category.division} />}
              </Box>
              <Typography variant="body1">{category.subject}</Typography>
              {category.chapter && <Typography variant="body2" color="textSecondary">Chapter: {category.chapter}</Typography>}
              {category.lesson && <Typography variant="body2" color="textSecondary">Lesson: {category.lesson}</Typography>}
            </>
        );
      case "Admission":
        return (
            <>
              <Box sx={{ mb: 1 }}>
                <Chip size="small" color="primary" label={category.type} sx={{ mr: 1 }} />
                {category.universityType && <Chip size="small" color="secondary" label={category.universityType} />}
              </Box>
              <Typography variant="body1">{category.subject}</Typography>
              {category.universityName && <Typography variant="body2" color="textSecondary">University: {category.universityName}</Typography>}
              {category.unit && <Typography variant="body2" color="textSecondary">Unit: {category.unit}</Typography>}
            </>
        );
      case "Job":
        return (
            <>
              <Box sx={{ mb: 1 }}>
                <Chip size="small" color="primary" label={category.type} sx={{ mr: 1 }} />
                {category.jobType && <Chip size="small" color="secondary" label={category.jobType} />}
              </Box>
              <Typography variant="body1">{category.subject}</Typography>
              {category.jobName && <Typography variant="body2" color="textSecondary">Job Name: {category.jobName}</Typography>}
            </>
        );
      default:
        return (
            <>
              <Box sx={{ mb: 1 }}>
                <Chip size="small" color="primary" label={category.type || "Unknown"} />
              </Box>
              <Typography variant="body1">{category.subject}</Typography>
            </>
        );
    }
  };

  return (
      <Box sx={{ width: "100%", height: "100vh" }}>
        <Paper
            variant="outlined"
            sx={{ width: "100%", height: "100vh", borderRadius: "10px", p: 3 }}
        >
          {/* top title and button section */}
          <Box
              component="section"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
          >
            <Typography variant="h3">Category List</Typography>
            <Link to="/admin/add-category">
              <Button
                  variant="contained"
                  sx={{
                    width: "179px",
                    height: "48px",
                    borderRadius: "8px",
                    fontSize: "16px",
                  }}
              >
                + Add Category
              </Button>
            </Link>
          </Box>

          <TextField
              label="Search by Subject"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: "100%", mb: 2 }}
          />

          <Box component="section" sx={{ mt: 3, flexGrow: 1 }}>
            {isLoading || isFetching ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
                  <CircularProgress />
                </Box>
            ) : (
                <>
                  <TableContainer component={Paper} elevation={0} variant="outlined">
                    <Table sx={{ minWidth: 650 }} aria-label="categories table">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "rgba(0, 0, 0, 0.04)" }}>
                          <TableCell>Category</TableCell>
                          <TableCell>Created At</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {categoriesData?.data ?.filter((category) =>
                            category.subject.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                            .map((category) => (
                            <TableRow
                                key={category._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                              <TableCell component="th" scope="row" sx={{ minWidth: 300 }}>
                                {renderCategoryCell(category)}
                              </TableCell>
                              <TableCell>
                                {new Date(category.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </TableCell>
                              <TableCell align="right">
                                <IconButton
                                    color="primary"
                                    onClick={() => handleEditClick(category)}
                                    aria-label="edit category"
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                    color="error"
                                    onClick={() => handleDeleteClick(category)}
                                    aria-label="delete category"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                        ))}
                        {categoriesData?.data?.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                                <Typography variant="body1" color="textSecondary">
                                  No categories found
                                </Typography>
                              </TableCell>
                            </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {categoriesData?.meta?.count > 0 && (
                      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                        <Pagination
                            count={Math.ceil((categoriesData?.meta?.count || 0) / limit)}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                        />
                      </Stack>
                  )}
                </>
            )}
          </Box>
        </Paper>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onClose={handleEditDialogClose} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ mt: 2 }}>
              {/* Subject is common to all category types */}
              <TextField
                  fullWidth
                  margin="normal"
                  label="Subject"
                  name="subject"
                  value={editFormValues.subject}
                  onChange={handleInputChange}
              />

              {selectedCategory?.type === "Academic" && (
                  <>
                    {/* Division as dropdown */}
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="division-select-label">Division</InputLabel>
                      <Select
                          labelId="division-select-label"
                          id="division-select"
                          name="division"
                          value={editFormValues.division}
                          label="Division"
                          onChange={handleInputChange}
                      >
                        {divisions.map((division) => (
                            <MenuItem key={division} value={division}>
                              {division}
                            </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Chapter as text field */}
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Chapter"
                        name="chapter"
                        value={editFormValues.chapter}
                        onChange={handleInputChange}
                    />

                    {/* Lesson as text field */}
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Lesson"
                        name="lesson"
                        value={editFormValues.lesson}
                        onChange={handleInputChange}
                    />
                  </>
              )}

              {selectedCategory?.type === "Admission" && (
                  <>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="University Name"
                        name="universityName"
                        value={editFormValues.universityName}
                        onChange={handleInputChange}
                    />

                    {/* University Type as dropdown */}
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="university-type-select-label">University Type</InputLabel>
                      <Select
                          labelId="university-type-select-label"
                          id="university-type-select"
                          name="universityType"
                          value={editFormValues.universityType}
                          label="University Type"
                          onChange={handleInputChange}
                      >
                        {universityTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                              {type}
                            </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Only show Unit field if University Type is "University" */}
                    {showUnitField && (
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Unit"
                            name="unit"
                            value={editFormValues.unit}
                            onChange={handleInputChange}
                        />
                    )}
                  </>
              )}

              {selectedCategory?.type === "Job" && (
                  <>
                    {/* Job Type as text field */}
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Job Type"
                        name="jobType"
                        value={editFormValues.jobType}
                        onChange={handleInputChange}
                    />

                    {/* Job Name as text field */}
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Job Name"
                        name="jobName"
                        value={editFormValues.jobName}
                        onChange={handleInputChange}
                    />
                  </>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditDialogClose}>Cancel</Button>
            <Button
                onClick={handleUpdateCategory}
                variant="contained"
                disabled={isUpdating}
            >
              {isUpdating ? <CircularProgress size={24} /> : "Update"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the category "{selectedCategory?.subject}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteDialogClose}>Cancel</Button>
            <Button
                onClick={handleDeleteCategory}
                color="error"
                variant="contained"
                disabled={isDeleting}
            >
              {isDeleting ? <CircularProgress size={24} /> : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
  );
};

export default Category;