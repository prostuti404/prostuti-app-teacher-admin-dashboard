import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SnackbarCloseReason,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useCreateCouponMutation } from "../../../../redux/features/coupon/couponApi";
import { ICreateCouponPayload } from "../../../../types/coupon.types";
import Alert from "../../../../shared/components/Alert";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../../../utils/getErrorMessage";

// Create an intermediary type for the form
interface CouponFormData {
  title: string;
  discountType: "Percentage" | "Amount";
  discountValue: number;
  voucherType: "All_Course" | "Specific_Course" | "Specific_Student";
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
  course_id?: string;
  student_id?: string;
}

// Zod schema for form validation
const couponSchema = z
  .object({
    title: z.string().min(3, "Coupon title must be at least 3 characters"),
    discountType: z.enum(["Percentage", "Amount"]),
    discountValue: z.number().positive("Discount value must be positive"),
    voucherType: z.enum(["All_Course", "Specific_Course", "Specific_Student"]),
    startDate: z.any().refine((val) => dayjs(val).isValid(), {
      message: "Invalid start date",
    }),
    endDate: z.any().refine((val) => dayjs(val).isValid(), {
      message: "Invalid end date",
    }),

    student_id: z.string(),
  }).strict()
  .refine((data) => dayjs(data.endDate).isAfter(dayjs(data.startDate)), {
    message: "End date must be after start date",
    path: ["endDate"],
  })
  .refine(
    (data) => !(data.voucherType === "Specific_Student" && !data.student_id),
    {
      message: "Student ID is required for Specific Student voucher",
      path: ["student_id"],
    }
  );

interface AddCouponModalProps {
  open: boolean;
  onClose: () => void;
  student_id: string;
}

const AddCouponUserModal: React.FC<AddCouponModalProps> = ({ open, onClose, student_id }) => {
  const [createCoupon, { isLoading, isSuccess }] = useCreateCouponMutation();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      title: "",
      discountType: "Percentage",
      discountValue: 0,
      voucherType: "Specific_Student",
      student_id: student_id,
      startDate: dayjs(),
      endDate: dayjs().add(1, "month"),
    },
  });

  const handleCloseSnackbar = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const onSubmit = async (data: CouponFormData) => {
    const { voucherType, ...payload } = data;
    try {
      const apiPayload: ICreateCouponPayload = {
        ...payload,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString()
      };
      await createCoupon(apiPayload).unwrap();
      setOpenSnackbar(true);
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create coupon:', error);
      toast.error(getErrorMessage(error, "Failed to create coupon"));
    }
  }

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        Add New Coupon
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box display="grid" gridTemplateColumns="1fr 1fr 1fr" gap={3}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Coupon Title"
                  placeholder="Enter coupon title..."
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  margin="normal"
                />
              )}
            />

            <FormControl
              fullWidth
              margin="normal"
              error={!!errors.discountType}
            >
              <InputLabel>Discount Type</InputLabel>
              <Controller
                name="discountType"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Discount Type">
                    <MenuItem value="Percentage">Percentage</MenuItem>
                    <MenuItem value="Amount">Amount</MenuItem>
                  </Select>
                )}
              />
              {errors.discountType && (
                <FormHelperText>{errors.discountType.message}</FormHelperText>
              )}
            </FormControl>

            <Controller
              name="discountValue"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Discount Value"
                  type="number"
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  error={!!errors.discountValue}
                  helperText={errors.discountValue?.message}
                  margin="normal"
                />
              )}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Start Date"
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: "normal",
                        error: !!errors.startDate,
                        helperText: errors.startDate?.message,
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="End Date"
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: "normal",
                        error: !!errors.endDate,
                        helperText: errors.endDate?.message,
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create"}
          </Button>

        </DialogActions>
      </form>
      <Alert
        openSnackbar={openSnackbar}
        autoHideDuration={5000}
        handleCloseSnackbar={handleCloseSnackbar}
        isSuccess={isSuccess}
      />
    </Dialog>
  );
};

export default AddCouponUserModal;
