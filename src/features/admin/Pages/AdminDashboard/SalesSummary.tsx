import React, { useState } from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useGetMonthlySalesStatsQuery } from "../../../../redux/features/adminDashboard/adminDashboardApi";
import Loader from "../../../../shared/components/Loader";

const SalesSummary = () => {
  const [activeFilter, setActiveFilter] = useState("thisMonth");
  const { data, isLoading } = useGetMonthlySalesStatsQuery({});

  if (isLoading) {
    return <Loader />;
  }

  // Sample data for different time periods

  const salesData = data?.data || {
    thisMonth: {
      totalSales: 0,
      subscriptions: 0,
      premiumCourse: 0,
      percentages: [0, 0],
    },
    lastMonth: {
      totalSales: 0,
      subscriptions: 0,
      premiumCourse: 0,
      percentages: [0, 0],
    },
  };

  // Get current data based on active filter
  const currentData = salesData[activeFilter];

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  // Radial bar chart options
  const chartOptions: ApexOptions = {
    chart: {
      height: 250,
      type: "radialBar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: 0,
        endAngle: 360,

        hollow: {
          margin: 0,
          size: "60%",
        },
        track: {
          background: "#e0e0e0",
          strokeWidth: "100%",
          margin: 2,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: false,
          },
        },
      },
    },
    colors: ["#90caf9", "#1e88e5"],
    labels: ["Subscriptions", "Premium Course"],
    stroke: {
      lineCap: "round",
    },
  };

  return (
    <Box sx={{ p: 3, bgcolor: "white", borderRadius: 2, boxShadow: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Sales
        </Typography>
        <Box>
          <Button
            variant={activeFilter === "thisMonth" ? "contained" : "text"}
            size="small"
            onClick={() => handleFilterChange("thisMonth")}
            sx={{
              bgcolor: activeFilter === "thisMonth" ? "#1a73e8" : "transparent",
              color: activeFilter === "thisMonth" ? "white" : "#333",
              mr: 1,
              textTransform: "none",
              "&:hover": {
                bgcolor: activeFilter === "thisMonth" ? "#1565c0" : "#f5f5f5",
              },
            }}
          >
            This Month
          </Button>
          <Button
            variant={activeFilter === "lastMonth" ? "contained" : "text"}
            size="small"
            onClick={() => handleFilterChange("lastMonth")}
            sx={{
              bgcolor: activeFilter === "lastMonth" ? "#1a73e8" : "transparent",
              color: activeFilter === "lastMonth" ? "white" : "#333",
              textTransform: "none",
              "&:hover": {
                bgcolor: activeFilter === "lastMonth" ? "#1565c0" : "#f5f5f5",
              },
            }}
          >
            Last Month
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
          mt: 2,
        }}
      >
        <Box sx={{ width: 150, height: 150, mr: 2 }}>
          <Chart
            options={chartOptions}
            series={currentData.percentages}
            type="radialBar"
            height="100%"
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Grid container sx={{ maxWidth: "500px" }}>
            <Grid item xs={4}>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ whiteSpace: "nowrap" }}
              >
                Total Sales
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                ${currentData.totalSales.toLocaleString()}
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: "#4285f4",
                    mr: 1,
                  }}
                />
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ whiteSpace: "nowrap" }}
                >
                  Subscriptions
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                ${currentData.subscriptions.toLocaleString()}
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: "#aaa",
                    mr: 1,
                  }}
                />
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ whiteSpace: "nowrap" }}
                >
                  Premium Course
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                ${currentData.premiumCourse.toLocaleString()}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default SalesSummary;
