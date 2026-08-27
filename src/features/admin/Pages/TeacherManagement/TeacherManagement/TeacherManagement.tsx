import { Box, Button, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { AddTeacherModal } from "./AddTeacherModal";
import SearchBarWithFilter from "./SearchBarWithFilter";
import TeachersTable from "./TeachersTable";

const TeacherManagement = () => {
  const [open, setOpen] = useState(false);

  // SearchTerm
  const [searchTerm, setSearchTerm] = useState("");

  // Filter states
  const [subjects, setSubjects] = useState("");
  const [category, setCategory] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        variant="outlined"
        sx={{ width: "100%", borderRadius: "10px", p: 3 }}>
        {/* top title and button section */}
        <Box
          component="section"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}>
          <Typography variant="h3">Teacher Management</Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}>
            Add Teacher
          </Button>

          {/* Modal */}
          <AddTeacherModal open={open} onClose={handleClose} />
        </Box>

        {/* Search + Filter */}
        <SearchBarWithFilter
          setSearchTerm={setSearchTerm}
          setSubjects={setSubjects}
          setCategory={setCategory}
        />
        {/* Table */}
        <TeachersTable
          searchTerm={searchTerm}
          subjects={subjects}
          category={category}
        />
      </Paper>
    </Box>
  );
};

export default TeacherManagement;
