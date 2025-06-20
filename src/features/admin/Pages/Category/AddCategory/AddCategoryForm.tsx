import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  MenuItem,
  Select,
  SnackbarCloseReason,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  categoryDivision,
  categoryType,
  categoryUniversityType,
} from "../../../../../interface/category.interface";
import {
  useCreateCategoryMutation
} from "../../../../../redux/features/category/categoryApi";
import Loader from "../../../../../shared/components/Loader";
import { createCategorySchema } from "../../../../../validation/category.validation";
import Alert from "../../../../../shared/components/Alert";
import { useNavigate } from "react-router-dom";

type CreateCategoryInput = {
  type: string;
  division?: string;
  subject: string;
  chapter?: string;
  lesson?: string;
  universityType?: string;
  universityName?: string;
  unit?: string;
  jobType?: string;
  jobName?: string;
};

const AddCategoryForm = () => {
  const [createCategory, { isLoading, isSuccess, error }] =
      useCreateCategoryMutation();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // No need to fetch dropdown data from API
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      type: "",
      division: "",
      subject: "",
      chapter: "",
      lesson: "",
      universityType: "",
      universityName: "",
      unit: "",
      jobType: "",
      jobName: "",
    },
  });
  const typeValue = watch("type");
  const universityTypeValue = watch("universityType");

  const onSubmit = async (data: CreateCategoryInput) => {
    const trimmedData = {
      ...data,
      subject: data.subject?.trim(),
      chapter: data.chapter?.trim(),
      universityName: data.universityName?.trim(),
      universityType: data.universityType?.trim(),
      unit: data.unit?.trim(),
      lesson: data.lesson?.trim(),
      jobType: data.jobType?.trim(),
      jobName: data.jobName?.trim(),

    };

    const cleanedData = Object.fromEntries(
        Object.entries(trimmedData).filter(([key, value]) => value !== "")
    );
    await createCategory(cleanedData);
    reset();
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (
      event: React.SyntheticEvent | Event,
      reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    console.log(error);
  }

  return (
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Category Type */}
            <Grid size={4}>
              <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                      <Select
                          {...field}
                          fullWidth
                          error={!!errors.type}
                          displayEmpty
                          inputProps={{ "aria-label": "Type" }}
                      >
                        <MenuItem value="" disabled>
                          Select Type
                        </MenuItem>
                        {categoryType.map((type) => (
                            <MenuItem key={type} value={type}>
                              {type}
                            </MenuItem>
                        ))}
                      </Select>
                  )}
              />
              {errors.type && (
                  <Typography color="error" variant="body2">
                    {errors.type?.message}
                  </Typography>
              )}
            </Grid>

            {/* Academic Type Fields */}
            {typeValue === "Academic" && (
                <>
                  <Grid size={4}>
                    <Controller
                        name="division"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                fullWidth
                                error={!!errors.division}
                                displayEmpty
                                inputProps={{ "aria-label": "Division" }}
                            >
                              <MenuItem value="" disabled>
                                Select Division
                              </MenuItem>
                              {categoryDivision.map((div) => (
                                  <MenuItem key={div} value={div}>
                                    {div}
                                  </MenuItem>
                              ))}
                            </Select>
                        )}
                    />
                    {errors.division && (
                        <Typography color="error" variant="body2">
                          {errors.division?.message}
                        </Typography>
                    )}
                  </Grid>

                  <Grid size={4}>
                    <Controller
                        name="subject"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Subject"
                                fullWidth
                                error={!!errors.subject}
                            />
                        )}
                    />
                    {errors.subject && (
                        <Typography color="error" variant="body2">
                          {errors.subject?.message}
                        </Typography>
                    )}
                  </Grid>

                  <Grid size={4}>
                    <Controller
                        name="chapter"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Chapter"
                                fullWidth
                                error={!!errors.chapter}
                            />
                        )}
                    />
                    {errors.chapter && (
                        <Typography color="error" variant="body2">
                          {errors.chapter?.message}
                        </Typography>
                    )}
                  </Grid>

                  <Grid size={4}>
                    <Controller
                        name="lesson"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Lesson"
                                fullWidth
                                error={!!errors.lesson}
                            />
                        )}
                    />
                    {errors.lesson && (
                        <Typography color="error" variant="body2">
                          {errors.lesson?.message}
                        </Typography>
                    )}
                  </Grid>
                </>
            )}

            {/* Admission Type Fields */}
            {typeValue === "Admission" && (
                <>
                  <Grid size={4}>
                    <Controller
                        name="universityType"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="University Type"
                                fullWidth
                                error={!!errors.universityType}
                            />
                        )}
                    />
                    {errors.universityType && (
                        <Typography color="error" variant="body2">
                          {errors.universityType.message}
                        </Typography>
                    )}
                  </Grid>

                  <Grid size={4}>
                    <Controller
                        name="universityName"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="University Name"
                                fullWidth
                                error={!!errors.universityName}
                            />
                        )}
                    />
                    {errors.universityName && (
                        <Typography color="error" variant="body2">
                          {errors.universityName?.message}
                        </Typography>
                    )}
                  </Grid>

                  <Grid size={4}>
                    <Controller
                        name="subject"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Subject"
                                fullWidth
                                error={!!errors.subject}
                            />
                        )}
                    />
                    {errors.subject && (
                        <Typography color="error" variant="body2">
                          {errors.subject?.message}
                        </Typography>
                    )}
                  </Grid>

                  {universityTypeValue === "University" && (
                      <Grid size={4}>
                        <Controller
                            name="unit"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Unit"
                                    fullWidth
                                    error={!!errors.unit}
                                />
                            )}
                        />
                        {errors.unit && (
                            <Typography color="error" variant="body2">
                              {errors.unit?.message}
                            </Typography>
                        )}
                      </Grid>
                  )}
                </>
            )}

            {/* Job Type Fields */}
            {typeValue === "Job" && (
                <>
                  <Grid size={4}>
                    <Controller
                        name="jobType"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Job Type"
                                fullWidth
                                error={!!errors.jobType}
                            />
                        )}
                    />
                    {errors.jobType && (
                        <Typography color="error" variant="body2">
                          {errors.jobType?.message}
                        </Typography>
                    )}
                  </Grid>

                  <Grid size={4}>
                    <Controller
                        name="jobName"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Job Name"
                                fullWidth
                                error={!!errors.jobName}
                            />
                        )}
                    />
                    {errors.jobName && (
                        <Typography color="error" variant="body2">
                          {errors.jobName?.message}
                        </Typography>
                    )}
                  </Grid>

                  <Grid size={4}>
                    <Controller
                        name="subject"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Subject"
                                fullWidth
                                error={!!errors.subject}
                            />
                        )}
                    />
                    {errors.subject && (
                        <Typography color="error" variant="body2">
                          {errors.subject?.message}
                        </Typography>
                    )}
                  </Grid>
                </>
            )}

            {/* Submit Button */}
            <Grid size={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Create Category
              </Button>
            </Grid>
          </Grid>
        </form>

        <Alert
            openSnackbar={openSnackbar}
            autoHideDuration={5000}
            handleCloseSnackbar={handleCloseSnackbar}
            isSuccess={isSuccess}
        />
      </>
  );
};

export default AddCategoryForm;