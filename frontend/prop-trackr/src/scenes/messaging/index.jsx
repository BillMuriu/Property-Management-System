import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header";

import React from 'react'

const Messaging = () => {
  return (
    <div>
        <Box style={{marginLeft: "20px"}}>
            <Header title="Messaging" subtitle="Welcome to the Messaging page" />
        </Box>
    </div>
  )
}

export default Messaging