import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useRef } from "react";
import { useGetAllStudentsQuery } from "../../../../redux/features/student/studentApi";

const SUB_CATEGORY_MAP: Record<string, string[]> = {
  Academic: ["Science", "Arts", "Commerce"],
  Admission: ["Engineering", "Medical", "University"],
  Job: [],
};

const categoryColorMap: Record<string, "primary" | "secondary" | "success"> = {
  Academic: "primary",
  Admission: "secondary",
  Job: "success",
};

const subCategoryColorMap: Record<string, "default" | "info" | "warning"> = {
  Science: "info",
  Arts: "warning",
  Commerce: "default",
  Engineering: "info",
  Medical: "warning",
  University: "default",
};

const StudentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [mainCategoryFilter, setMainCategoryFilter] = useState("");
  const [subCategoryFilter, setSubCategoryFilter] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, isLoading, isFetching } = useGetAllStudentsQuery({
    mainCategory: mainCategoryFilter || undefined,
    subCategory: subCategoryFilter || undefined,
    isSubscribed: subscriptionFilter !== "" ? subscriptionFilter : undefined,
    searchTerm: debouncedSearch || undefined,
  });

  const students = (data as any)?.data ?? [];
  const availableSubCategories = SUB_CATEGORY_MAP[mainCategoryFilter] ?? [];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(value), 400);
  };

  const handleMainCategoryChange = (value: string) => {
    setMainCategoryFilter(value);
    setSubCategoryFilter("");
  };

  const handleReset = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setMainCategoryFilter("");
    setSubCategoryFilter("");
    setSubscriptionFilter("");
  };

  const hasActiveFilters =
    searchTerm || mainCategoryFilter || subCategoryFilter || subscriptionFilter !== "";

  return (
    <Box sx={{ width: "100%", height: "100vh" }}>
      <Paper variant="outlined" sx={{ width: "100%", minHeight: "100vh", borderRadius: "10px", p: 3 }}>

        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h3">Student Management</Typography>
          {!isLoading && (
            <Chip
              label={`${students.length} Student${students.length !== 1 ? "s" : ""}`}
              color="primary"
              variant="outlined"
            />
          )}
        </Box>

        {/* Filters Row */}
        <Box sx={{ display: "flex", gap: 2, mb: 1, flexWrap: "wrap", alignItems: "center" }}>
          <TextField
            id="student-search-input"
            label="Search by name or student ID"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
            sx={{ flexGrow: 1, minWidth: 220 }}
            size="small"
          />

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="category-filter-label">Category</InputLabel>
            <Select
              labelId="category-filter-label"
              id="category-filter-select"
              value={mainCategoryFilter}
              label="Category"
              onChange={(e) => handleMainCategoryChange(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              <MenuItem value="Academic">Academic</MenuItem>
              <MenuItem value="Admission">Admission</MenuItem>
              <MenuItem value="Job">Job</MenuItem>
            </Select>
          </FormControl>

          {availableSubCategories.length > 0 && (
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="subcategory-filter-label">Sub-category</InputLabel>
              <Select
                labelId="subcategory-filter-label"
                id="subcategory-filter-select"
                value={subCategoryFilter}
                label="Sub-category"
                onChange={(e) => setSubCategoryFilter(e.target.value)}
              >
                <MenuItem value="">All Sub-categories</MenuItem>
                {availableSubCategories.map((sub) => (
                  <MenuItem key={sub} value={sub}>
                    {sub}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="subscription-filter-label">Subscription</InputLabel>
            <Select
              labelId="subscription-filter-label"
              id="subscription-filter-select"
              value={subscriptionFilter}
              label="Subscription"
              onChange={(e) => setSubscriptionFilter(e.target.value)}
            >
              <MenuItem value="">All Students</MenuItem>
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
          </FormControl>

          {hasActiveFilters && (
            <Button
              id="reset-filters-btn"
              variant="outlined"
              size="small"
              color="inherit"
              onClick={handleReset}
              sx={{ whiteSpace: "nowrap", height: 40 }}
            >
              Reset Filters
            </Button>
          )}
        </Box>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
            {mainCategoryFilter && (
              <Chip size="small" label={`Category: ${mainCategoryFilter}`} onDelete={() => handleMainCategoryChange("")} />
            )}
            {subCategoryFilter && (
              <Chip size="small" label={`Sub-category: ${subCategoryFilter}`} onDelete={() => setSubCategoryFilter("")} />
            )}
            {subscriptionFilter !== "" && (
              <Chip
                size="small"
                label={`Subscription: ${subscriptionFilter === "true" ? "Active" : "Inactive"}`}
                onDelete={() => setSubscriptionFilter("")}
              />
            )}
            {debouncedSearch && (
              <Chip
                size="small"
                label={`Search: "${debouncedSearch}"`}
                onDelete={() => { setSearchTerm(""); setDebouncedSearch(""); }}
              />
            )}
          </Box>
        )}

        {/* Table */}
        {isLoading || isFetching ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : students.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "40vh" }}>
            <Typography color="text.secondary">No students found</Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0} variant="outlined">
            <Table sx={{ minWidth: 750 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "rgba(0,0,0,0.04)" }}>
                  <TableCell>SL</TableCell>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Sub-category</TableCell>
                  <TableCell>Subscription</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student: any, index: number) => {
                  const mainCat = student.category?.mainCategory ?? student.categoryType ?? "";
                  const subCat = student.category?.subCategory;
                  const isSubscribed = student.isSubscribed;

                  return (
                    <TableRow key={student._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {student.studentId}
                        </Typography>
                      </TableCell>
                      <TableCell>{student.name || "—"}</TableCell>
                      <TableCell>
                        <Typography variant="body2">{student.phone || student.email || "—"}</Typography>
                      </TableCell>
                      <TableCell>
                        {mainCat ? (
                          <Chip size="small" label={mainCat} color={categoryColorMap[mainCat] ?? "default"} />
                        ) : (
                          <Typography variant="body2" color="text.secondary">Not set</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {subCat ? (
                          <Chip
                            size="small"
                            label={subCat}
                            color={subCategoryColorMap[subCat] ?? "default"}
                            variant="outlined"
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            {mainCat === "Job" ? "N/A" : "Not set"}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {isSubscribed ? (
                          <Chip size="small" label="Active" color="success" />
                        ) : (
                          <Chip size="small" label="Inactive" color="default" variant="outlined" />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default StudentManagement;
