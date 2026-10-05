import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Pagination,
  Chip
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../../../redux/features/category/categoryApi";
import { ICategory } from "../../../../interface/category.interface";
import toast from "react-hot-toast";

const Category = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 10;
  
  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
  
  // Edit form state
  const [editFormValues, setEditFormValues] = useState({
    group: "",
    type: "",
    name: "",
  });

  const { data: categoriesData, isLoading } = useGetAllCategoriesQuery({
    page,
    limit,
  });

  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleEditClick = (category: ICategory) => {
    setSelectedCategory(category);
    setEditFormValues({
      group: category.group || "",
      type: category.type || "",
      name: category.name || "",
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (category: ICategory) => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory?._id) return;

    try {
      await updateCategory({
        id: selectedCategory._id,
        data: editFormValues,
      }).unwrap();
      toast.success("Category updated successfully");
      handleEditDialogClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update category");
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory?._id) return;

    try {
      await deleteCategory(selectedCategory._id).unwrap();
      toast.success("Category deleted successfully");
      handleDeleteDialogClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete category");
    }
  };

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Paper
        variant="outlined"
        sx={{
          width: "100%",
          minHeight: "80vh",
          borderRadius: "10px",
          p: { xs: 2, md: 3 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h5" component="h1" fontWeight="600">
            Category Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin/add-category")}
          >
            Add Category
          </Button>
        </Box>

        <Box sx={{ width: "100%" }}>
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "40vh",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="categories table">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "rgba(0,0,0,0.02)" }}>
                      <TableCell>Group</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Created Date</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categoriesData?.data &&
                      categoriesData.data.map((category: ICategory) => (
                        <TableRow
                          key={category._id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                            "&:hover": { backgroundColor: "rgba(0,0,0,0.01)" },
                          }}
                        >
                          <TableCell>
                            <Chip size="small" label={category.group} color="primary" variant="outlined" />
                          </TableCell>
                          <TableCell>
                            <Chip size="small" label={category.type} color="secondary" variant="outlined" />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {category.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {category.createdAt ? new Date(category.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) : "-"}
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
                    {(!categoriesData?.data || categoriesData.data.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
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
            <TextField
              fullWidth
              margin="normal"
              label="Group (e.g., Science)"
              name="group"
              value={editFormValues.group}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Type (e.g., Academic)"
              name="type"
              value={editFormValues.type}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Name (e.g., HSC 2027)"
              name="name"
              value={editFormValues.name}
              onChange={handleInputChange}
            />
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
            Are you sure you want to delete the category "{selectedCategory?.name}"? This action cannot be undone.
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