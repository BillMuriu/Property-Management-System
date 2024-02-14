import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { useSnackbar } from 'notistack';

import React from 'react'

const Dashboard = () => {

  const { enqueueSnackbar } = useSnackbar();

  const handleClick = () => {
    enqueueSnackbar('The snackbar works as expected', { 
      variant: 'success', 
      autoHideDuration: 1000, 
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
      },
    });
  };
  return (
    <div>
        <Box style={{marginLeft: "20px"}}>
            <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
            <button onClick={handleClick}>Show Notification</button>
        </Box>
    </div>
  )
}

export default Dashboard