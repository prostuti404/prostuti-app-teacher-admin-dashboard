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
import { useGetAllCategoriesQuery } from "../../../../redux/features/category/categoryApi";
import { ICategory } from "../../../../types/types";

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
  
  // New cascading state
  const [groupFilter, setGroupFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState("");
  
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch categories for cascading dropdowns
  const { data: allCategoriesData } = useGetAllCategoriesQuery({ limit: 0 });
  const categories: ICategory[] = allCategoriesData?.data || [];

  // Derived options based on current selections
  const availableGroups = Array.from(new Set(categories.map((c) => c.group))).filter(Boolean);
  const availableTypes = Array.from(new Set(categories.filter((c) => !groupFilter || c.group === groupFilter).map((c) => c.type))).filter(Boolean);
  const availableNames = Array.from(new Set(categories.filter((c) => (!groupFilter || c.group === groupFilter) && (!typeFilter || c.type === typeFilter)).map((c) => c.name))).filter(Boolean);

  // When sending to backend, we currently map Group->subCategory and Type->mainCategory for backward compatibility
  // In Phase 2, backend should be updated to accept group, type, name natively.
  const { data, isLoading, isFetching } = useGetAllStudentsQuery({
    // We map the new terminology back to the old one so the backend doesn't crash until it's updated
    mainCategory: typeFilter || undefined,
    subCategory: groupFilter || undefined, 
    isSubscribed: subscriptionFilter !== "" ? subscriptionFilter : undefined,
    searchTerm: debouncedSearch || undefined,
  });

  const students = (data as any)?.data ?? [];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(value), 400);
  };

  const handleGroupChange = (value: string) => {
    setGroupFilter(value);
    setTypeFilter("");
    setNameFilter("");
  };

  const handleTypeChange = (value: string) => {
    setTypeFilter(value);
    setNameFilter("");
  };

  const handleReset = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setGroupFilter("");
    setTypeFilter("");
    setNameFilter("");
    setSubscriptionFilter("");
  };

  const hasActiveFilters =
    searchTerm || groupFilter || typeFilter || nameFilter || subscriptionFilter !== "";

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

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="group-filter-label">Group</InputLabel>
            <Select
              labelId="group-filter-label"
              value={groupFilter}
              label="Group"
              onChange={(e: any) => handleGroupChange(e.target.value)}
            >
              <MenuItem value="">All Groups</MenuItem>
              {availableGroups.map((g) => (
                <MenuItem key={g} value={g}>{g}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {groupFilter && (
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="type-filter-label">Type</InputLabel>
              <Select
                labelId="type-filter-label"
                value={typeFilter}
                label="Type"
                onChange={(e: any) => handleTypeChange(e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                {availableTypes.map((t) => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {typeFilter && availableNames.length > 0 && (
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="name-filter-label">Name</InputLabel>
              <Select
                labelId="name-filter-label"
                value={nameFilter}
                label="Name"
                onChange={(e: any) => setNameFilter(e.target.value)}
              >
                <MenuItem value="">All Names</MenuItem>
                {availableNames.map((n) => (
                  <MenuItem key={n} value={n}>{n}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="subscription-filter-label">Subscription</InputLabel>
            <Select
              labelId="subscription-filter-label"
              value={subscriptionFilter}
              label="Subscription"
              onChange={(e: any) => setSubscriptionFilter(e.target.value)}
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
            {groupFilter && (
              <Chip size="small" label={`Group: ${groupFilter}`} onDelete={() => handleGroupChange("")} />
            )}
            {typeFilter && (
              <Chip size="small" label={`Type: ${typeFilter}`} onDelete={() => handleTypeChange("")} />
            )}
            {nameFilter && (
              <Chip size="small" label={`Name: ${nameFilter}`} onDelete={() => setNameFilter("")} />
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
                  <TableCell>Type (Legacy)</TableCell>
                  <TableCell>Sub (Legacy)</TableCell>
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
                      <TableCell>{student.name || "-"}</TableCell>
                      <TableCell>
                        <Typography variant="body2">{student.phone || student.email || "-"}</Typography>
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