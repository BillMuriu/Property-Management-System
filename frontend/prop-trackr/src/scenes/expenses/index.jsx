import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header";

import React from 'react'

const Expenses = () => {
  return (
    <div>
        <Box style={{marginLeft: "20px"}}>
            <Header title="Expenses" subtitle="Welcome to the dashboard page" />
        </Box>
    </div>
  )
}

export default Expenses