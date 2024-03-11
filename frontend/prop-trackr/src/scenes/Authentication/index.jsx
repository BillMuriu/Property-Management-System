import { Box, Card, CardContent, TextField, Button, useTheme, Typography } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from "../../context/AuthContext";

const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { loginUser, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginUser(e);
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    } else {
      setLoginError('Login failed. Please check your credentials.');
    }
  }, [user, navigate]);

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
              Welcome
            </Typography>
            <Typography variant="h5" color={colors.greenAccent[400]}>
              Enter your credentials to login
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
              Submit
            </Button>

            {loginError && (
              <Typography color="error" mt={2}>
                {loginError}
              </Typography>
            )}
          </form>
          <Box 
            mt={2}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Link  to="/forgot-password">Forgot Password?</Link>
          </Box>
          <Box 
            mt={1}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px'
            }}
          >
            <Typography variant="body2" color="textSecondary">Do you have an account?</Typography>
            <Link  
              to="/signup"
            >
              Signup
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;

