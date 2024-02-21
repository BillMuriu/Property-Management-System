import { Box, Card, CardContent, TextField, Button, useTheme, Typography } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleSubmit = (e) => {
    console.log('Great!')
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh" // Adjust the height as needed
    >
      <Card variant="outlined" 
        sx={{
          width: "350px",
          backgroundColor: colors.blueAccent[900],
          maxWidth: "95%",
          padding: 2,
      }}
      >
        <CardContent
        >
          <Box 
            mb="30px"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h2"
              color={colors.grey[100]}
              fontWeight="bold"
              sx={{ m: "0 0 5px 0" }}
            >
              Signup
            </Typography>
            <Typography variant="h5" color={colors.greenAccent[400]}>
              Create your account
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              type="text"
              name="username"
              label="Username"
              placeholder="Enter a username..."
              variant="filled"
            />
            <TextField
              fullWidth
              margin="normal"
              type="email"
              name="email"
              label="Email"
              placeholder="Enter your email..."
              variant="filled"
            />
            <TextField
              fullWidth
              margin="normal"
              type="password"
              name="password"
              label="Password"
              placeholder="Enter a password..."
              variant="filled"
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              sx={{ 
                width: "100%",
                marginTop: "20px",
                backgroundColor: colors.blueAccent[600]
              }} 
            >
              Signup
            </Button>
          </form>
          <Box 
            mt={2}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Link  to="/login">Already have an account? Login</Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Signup;
