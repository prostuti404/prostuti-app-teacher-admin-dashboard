import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { useGetAllPaymentsQuery } from "../../../../redux/features/payment/paymentApi";
import Loader from "../../../../shared/components/Loader";

const SingleUserPaymentTable = ({ student_id }: { student_id: string }) => {
  const {
    data: paymentsData,
    isLoading,
    isError,
  } = useGetAllPaymentsQuery({ student_id });

  if (isLoading) {
    return <Loader />;
  }
  const payments = paymentsData.data.data;

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Payment History ({payments?.length})
        </Typography>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>SI</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Transaction ID</TableCell>

              <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Paid Amount</TableCell>
              {/*<TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>*/}
            </TableRow>
          </TableHead>
          <TableBody>
  {payments?.map((payment, index) => (
    <TableRow key={payment._id}>
      <TableCell sx={{ py: 2 }}>{index + 1}</TableCell>
      <TableCell sx={{ py: 2 }}>{payment.transactionId}</TableCell>
      <TableCell sx={{ py: 2 }}>{payment?.amount}</TableCell>
      <TableCell sx={{ py: 2 }}>{payment?.amount}</TableCell>

      {/*<TableCell*/}
      {/*  sx={{*/}
      {/*    display: "flex",*/}
      {/*    alignItems: "center",*/}
      {/*    color: "blue",*/}
      {/*    textDecoration: "underline",*/}
      {/*    cursor: "pointer",*/}
      {/*    "&:hover": { color: "darkblue" },*/}
      {/*    py: 2, // Add vertical padding to create spacing*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <DownloadIcon sx={{ color: "inherit", marginRight: 0.5 }} />*/}
      {/*  Download*/}
      {/*</TableCell>*/}
    </TableRow>
  ))}
</TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default SingleUserPaymentTable;
