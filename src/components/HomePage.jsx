import * as React from "react";
import { Grid } from "@mui/material";
import { useAuth } from "../AuthProvider";
import { useNavigate, Link } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";

import starsbg from "../assets/starsbg.mp4";

import { useRef, useEffect } from "react";

function HomePage() {
  const mediaRef = useRef(null);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const { logout, firstName, lastName } = useAuth();
  const navigate = useNavigate();

  const auth = Boolean(firstName);

  useEffect(() => {
    const video = mediaRef.current;
    if (!video) return;

    const handleLoaded = async () => {
      try {
        await video.play();
      } catch {
        const handleUserGesture = async () => {
          await video.play().catch(() => {});
          window.removeEventListener("click", handleUserGesture);
        };
        window.addEventListener("click", handleUserGesture);
      }
    };

    video.addEventListener("loadeddata", handleLoaded);
    video.loop = true;
    video.muted = true;
    video.playsInline = true;

    return () => video.removeEventListener("loadeddata", handleLoaded);
  }, []);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Grid>
      <Box position="relative" minHeight="100vh" overflow="hidden">
        <Box
          component="video"
          src={starsbg}
          ref={mediaRef}
          autoPlay
          loop
          muted
          playsInline
          sx={{
            mt: 7,
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -1,
          }}
        />

        <AppBar position="static" sx={{ bgcolor: "#E7500F" }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              Cosmic-Sheet
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            {auth && (
              <>
                <IconButton onClick={handleMenu} color="inherit">
                  <Typography sx={{ mr: 1 }}>
                    {firstName} {lastName}
                  </Typography>
                  <AccountCircle sx={{ fontSize: 40 }} />
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem component={Link} to="/profile">
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </Grid>
  );
}

export default HomePage;
