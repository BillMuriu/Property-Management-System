import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header";

import React from 'react'

const Payments = () => {
  return (
    <div>
        <Box style={{marginLeft: "20px"}}>
            <Header title="Payments" subtitle="Welcome to the Payments page" />
        </Box>
    </div>
  )
}

export default Payments