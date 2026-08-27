import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  ListItemText,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CustomTextField from "../../../../../shared/components/CustomTextField";
import { SelectChangeEvent } from "@mui/material/Select";
import { teacherAssignedWorks } from "../../../../../constants";
import {
  useCreateTeacherMutation,
  useGetAllCategorySubjectsQuery,
} from "../../../../../redux/features/teacherManagement/teacherManagementApi";
import toast from "react-hot-toast";
import { z } from "zod";
import { getErrorMessage } from "../../../../../utils/getErrorMessage";

const selectStyles = {
  mb: 2,
  borderRadius: "8px",
  "& .MuiOutlinedInput-input": {
    padding: "8.5px 12px",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderRadius: "8px",
  },
  "& .MuiSelect-select": {
    color: "#747083",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#747083",
    opacity: 1,
  },
};

// Validation schema
const validationSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must not exceed 20 characters"),
});

interface AddTeacherModalProps {
  open: boolean;
  onClose: () => void;
}

export const AddTeacherModal: React.FC<AddTeacherModalProps> = ({
  open,
  onClose,
}) => {
  const [createTeacher] = useCreateTeacherMutation();
  const { data: subjects } = useGetAllCategorySubjectsQuery({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    subjects: [] as string[],
    assignedWorks: [] as string[],
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "", // Clear error when user types
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<any>, field: string) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  const handleMultiSelectChange = (e: SelectChangeEvent<string[]>) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      assignedWorks: typeof value === "string" ? value.split(",") : value,
    });
  };

  const handleSubmit = async () => {
    const result = validationSchema.safeParse({
      email: formData.email,
      password: formData.password,
    });

    if (!result.success) {
      const fieldErrors = result.error.format();
      setErrors({
        email: fieldErrors.email?._errors[0] || "",
        password: fieldErrors.password?._errors[0] || "",
      });
      return;
    }

    try {
      await createTeacher(formData).unwrap();
      toast.success("Teacher created successfully");

      onClose();
      setFormData({
        name: "",
        email: "",
        password: "",
        subjects: [],
        assignedWorks: [],
      });
      setErrors({ email: "", password: "" });
    } catch (error) {
      console.error("Failed to create teacher:", error);
      toast.error(getErrorMessage(error, "Failed to create teacher"));
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: "10px",
          p: 3,
        }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}>
          <Typography variant="h6" fontWeight={600}>
            Add Teacher
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="textSecondary" mb={4} mt={-2}>
          Please enter teacher information
        </Typography>

        {/* Name */}
        <Typography variant="body2" fontWeight={500} mb={1}>
          Name
        </Typography>
        <CustomTextField
          name="name"
          value={formData.name}
          placeholder="Enter teacher name"
          handleInput={handleInputChange}
        />

        {/* Email */}
        <Typography variant="body2" fontWeight={500} mb={1} mt={2}>
          Email
        </Typography>
        <CustomTextField
          name="email"
          required
          value={formData.email}
          placeholder="Enter teacher email"
          handleInput={handleInputChange}
          type="email"
        />
        {errors.email && (
          <Typography color="error" fontSize={12} mt={0.5}>
            {errors.email}
          </Typography>
        )}

        {/* Password */}
        <Typography variant="body2" fontWeight={500} mb={1} mt={2}>
          Password
        </Typography>
        <CustomTextField
          name="password"
          required
          value={formData.password}
          placeholder="Enter teacher password"
          handleInput={handleInputChange}
          type="password"
        />
        {errors.password && (
          <Typography color="error" fontSize={12} mt={0.5}>
            {errors.password}
          </Typography>
        )}

        {/* Subject */}
        <Typography variant="body2" fontWeight={500} mb={1} mt={2}>
          Subject
        </Typography>
        <Select
          fullWidth
          multiple
          name="subjects"
          value={formData.subjects}
          onChange={(e) => handleSelectChange(e as SelectChangeEvent<string[]>, "subjects")}
          sx={selectStyles}
          displayEmpty
          renderValue={(selected) => (
            (selected as string[]).length === 0 ? "Select Subject" : (selected as string[]).join(", ")
          )}
        >
          {subjects?.data.map((subject: string, index: number) => (
            <MenuItem key={index} value={subject}>
              <Checkbox checked={formData.subjects.includes(subject)} />
              <ListItemText primary={subject} />
            </MenuItem>
          ))}
        </Select>

        {/* Assigned Works */}
        <Typography variant="body2" fontWeight={500} mb={1}>
          Assigned Works
        </Typography>
        <Select
          fullWidth
          multiple
          value={formData.assignedWorks}
          onChange={handleMultiSelectChange}
          input={<OutlinedInput />}
          renderValue={(selected) => (selected as string[]).join(", ")}
          displayEmpty
          sx={selectStyles}>
          <MenuItem value="" disabled>
            Select Work Types
          </MenuItem>
          {teacherAssignedWorks.map((work, index) => (
            <MenuItem key={index} value={work}>
              <Checkbox checked={formData.assignedWorks.indexOf(work) > -1} />
              <ListItemText primary={work} />
            </MenuItem>
          ))}
        </Select>

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={{ mt: 2, borderRadius: "10px", backgroundColor: "#2563EB" }}>
          Add Teacher
        </Button>
      </Box>
    </Modal>
  );
};
