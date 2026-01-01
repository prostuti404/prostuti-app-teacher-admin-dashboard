import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ArrowRightIcon } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useGetAllPaymentsQuery } from "../../../../redux/features/payment/paymentApi";
import Loader from "../../../../shared/components/Loader";
import { useNavigate } from "react-router-dom";

const PaymentTable = () => {
  const navigate = useNavigate();
  const { data: paymentsData, isLoading, isError } = useGetAllPaymentsQuery({});

  if (isLoading) {
    return <Loader />;
  }
  const payments = paymentsData?.data.data;

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      {payments?.length === 0 ? (
        <Box
          component="section"
          sx={{
            width: "100%",
            height: "40vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          NO Payments found
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SL</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Student ID</TableCell>
              <TableCell>Subscription End</TableCell>
              <TableCell>Coupon</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments?.map((payment, index) => (
              <TableRow key={payment._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{payment.student_id.name}</TableCell>
                <TableCell>{payment.student_id.studentId}</TableCell>

                <TableCell>
                  {payment.paymentType === "Subscription" &&
                    payment.expireDate &&
                    dayjs(payment.expireDate).format("MMMM D, YYYY")}
                </TableCell>
                <TableCell>
                  {payment.isCouponAdded ? (
                    <Typography color="success.main">Applied</Typography>
                  ) : (
                    <Typography color="text.secondary">Not Applied</Typography>
                  )}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => navigate(`/admin/payment-management/${payment._id}`)}>
                    <ArrowRightIcon />
                  </IconButton>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );


};

export default PaymentTable;
