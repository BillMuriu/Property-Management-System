import { Box} from "@mui/material";
import Header from "../../components/Header";

import React, {useContext} from 'react'
import AuthContext from "../../context/AuthContext";

const Login = () => {

  let {loginUser} = useContext(AuthContext)

  return (
    <div>
        <Box style={{marginLeft: "20px"}}>
            <Header title="Login" subtitle="Welcome to the Login page" />
            <form onSubmit={loginUser}>
              <input type="text" name="username" placeholder="Enter a username..."/>
              <input type="password" name="password" placeholder="Enter a password..."/>
              <input type="submit" />
            </form>
        </Box>
    </div>
  )
}

export default Login