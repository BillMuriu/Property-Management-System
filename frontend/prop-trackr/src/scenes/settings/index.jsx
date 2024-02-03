import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header";

import React from 'react'

const Settings = () => {
  return (
    <div>
        <Box style={{marginLeft: "20px"}}>
            <Header title="Settings" subtitle="Welcome to the Settings page" />
        </Box>
    </div>
  )
}

export default Settings