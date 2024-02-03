import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header";

import React from 'react'

const Invoices = () => {
  return (
    <div>
        <Box style={{marginLeft: "20px"}}>
            <Header title="Invoices" subtitle="Welcome to the Invoices page" />
        </Box>
    </div>
  )
}

export default Invoices