import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header";

import React from 'react'

const Maintenance = () => {
  return (
    <div>
        <Box style={{marginLeft: "20px"}}>
            <Header title="Maintenance" subtitle="Welcome to the Maintenance page" />
        </Box>
    </div>
  )
}

export default Maintenance