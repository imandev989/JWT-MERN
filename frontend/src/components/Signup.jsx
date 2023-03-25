import { Box, TextField, Button, Typography } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
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
    const res = await axios
      .post("http://localhost:5000/api/signup", {
        name: inputs.name,
        email: inputs.email,
        password: inputs.password,
      })
      .catch((err) => console.log(err));
    const data = await res.data;
    return data;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(inputs);
    //send http request
    sendRequest().then(() => history("/login"));
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
            SignUp
          </Typography>

          <TextField
            name="name"
            type="name"
            onChange={handleChange}
            value={inputs.name}
            variant="outlined"
            placeholder="Name"
            margin="normal"
          />
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
          <Button variant="contained" type="submit">SignUp</Button>
        </Box>
      </form>
    </div>
  );
};

export default Signup;
