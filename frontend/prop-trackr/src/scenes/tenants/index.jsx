import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header";

import React from 'react'

const Tenants = () => {
  return (
    <div>
        <Box style={{marginLeft: "20px"}}>
            <Header title="Tenants" subtitle="Welcome to the Tenants page" />
        </Box>
    </div>
  )
}

export default Tenants