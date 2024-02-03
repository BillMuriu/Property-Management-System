import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header";

import React from 'react'

const Dashboard = () => {
  return (
    <div>
        <Box style={{marginLeft: "20px"}}>
            <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        </Box>
    </div>
  )
}

export default Dashboard