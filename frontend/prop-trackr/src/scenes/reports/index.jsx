import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header";

import React from 'react'

const Reports = () => {
  const handleDownloadPDF = () => {
    window.open('http://127.0.0.1:8000/property/property-statements/pdf/?start_date=2024-02-17&end_date=2024-2-19', '_blank');
  };

  return (
    <div>
        <Box style={{marginLeft: "20px"}}>
        <Header title="Reports" subtitle="Welcome to the Reports page" />
        <Button variant="contained" onClick={handleDownloadPDF}>
          Download PDF
        </Button>
      </Box>
    </div>
  )
}

export default Reports