import { Box, Button, IconButton, Typography, useTheme, Card, CardContent } from "@mui/material";

import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';


import Header from "../../components/Header";
import { useSnackbar } from 'notistack';
import { tokens } from "../../theme";

import React from 'react'

const Dashboard = () => {


  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <div>
        <Box style={{marginLeft: "20px"}}>
            <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
            <Box style={{ display: "flex", flexWrap: "wrap", gap: "20px", maxWidth: '95%'}}>

              <Card style={{ minWidth: "200px", maxWidth: "100%", flex: "1 1" }}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    Unpaid Tenant Balance
                  </Typography>
                </CardContent>
              </Card>

              <Card style={{ minWidth: "200px", maxWidth: "100%", flex: "1 1" }}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    Payments
                  </Typography>
                </CardContent>
              </Card>

              <Card style={{ minWidth: "200px", maxWidth: "100%", flex: "1 1" }}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    Total Vacancies
                  </Typography>
                </CardContent>
              </Card>

            </Box>

            <Box
              sx={{
                backgroundColor: colors.grey[900], 
                width: '200px',
                padding: '30px',
                marginTop: '30px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}
            >
                <Button variant="text">Text</Button>
                <Button variant="contained">Contained</Button>
                <Button variant="outlined">Outlined</Button>
                <Button variant="outlined" startIcon={<DeleteIcon />}>
                  Delete
                </Button>

                <Button 
                  variant="contained" 
                  endIcon={<SendIcon />}
                  sx={{
                    width: '100px',
                  }}
                >
                  <Typography>
                    Send
                  </Typography>
                </Button>

                <IconButton 
                  aria-label="delete"
                  sx={{
                    width: '40px',
                  }}
                >
                  <DeleteIcon />
                </IconButton>

            </Box>
        </Box>
    </div>
  )
}

export default Dashboard