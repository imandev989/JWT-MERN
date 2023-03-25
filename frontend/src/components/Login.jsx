import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Box, Typography, Button, TextField } from "@mui/material";
import { useDispatch } from 'react-redux';
import { authActions } from '../store/index';
const Login = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const sendRequest = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email: inputs.email,
        password: inputs.password,
      });
      const data = await res.data;
      console.log("DATAF");
      console.log(data);
      return data;
    } catch (error) {
      console.err(error);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("INPUTS");
    console.log(inputs);
    //send http request
    sendRequest().then(() => dispatch(authActions.login())).then(() => history("/user"));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box
          display="flex"
          flexDirection={"column"}
          width={300}
          marginLeft="auto"
          marginRight="auto"
          justifyContent="center"
          alignItems="center"
        >
          <Typography value={inputs.name} variant="h2">
            Login
          </Typography>

          <TextField
            name="email"
            onChange={handleChange}
            type="email"
            value={inputs.email}
            variant="outlined"
            placeholder="Email"
            margin="normal"
          />
          <TextField
            name="password"
            onChange={handleChange}
            variant="outlined"
            value={inputs.password}
            type="password"
            placeholder="Password"
            margin="normal"
          />
          <Button variant="contained" type="submit">
            Login
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default Login;
