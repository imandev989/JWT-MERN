import { AppBar, Toolbar, Typography, Tabs, Tab, Box } from "@mui/material";
import { useState } from "react";
import { Link, LinkComponent } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { authActions } from "../store/index";

axios.defaults.withCredential = true;

const Header = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const sendLogoutReq = async () => {
    const res = await axios.post("http://localhost:5000/api/logout", null, {
      withCredentials: true,
    });
    if (res.status == 200) {
      return res;
    }
    return new Error("Unable To Logout, Please Try Again");
  };
  const handleLogout = () => {
    sendLogoutReq().then(() => dispatch(authActions.logout()));
  };
  const [value, setValue] = useState();

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h3">MernAuth</Typography>
        <Box sx={{ marginLeft: "auto" }}>
          <Tabs
            onChange={(e, val) => setValue(val)}
            value={value}
            textColor="inherit"
            indicatorColor="secondary"
          >
            {!isLoggedIn && (
              <>
                <Tab to="/login" LinkComponent={Link} label="Login" />
                <Tab to="/signup" LinkComponent={Link} label="SignUp" />
              </>
            )}
            {isLoggedIn && (
              <Tab
                onClick={handleLogout}
                to="/"
                LinkComponent={Link}
                label="Logout"
              />
            )}{" "}
          </Tabs>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
