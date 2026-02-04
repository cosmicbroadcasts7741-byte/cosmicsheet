import { Grid, Paper } from "@mui/material";
import { useAuth } from "../AuthProvider";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";

import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import media3 from "../assets/media3.mp4";
import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import broadcast from "../assets/broadcast.png";
import messenger from "../assets/messenger.png";
import moodyfry from "../assets/moodyfry.png";

import starsbg from "../assets/starsbg.mp4";
import tv from "../assets/tv.png";

function HomePage() {
  const media3Ref = useRef(null);

  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showHologramMenu, setShowHologramMenu] = React.useState(false);

  useEffect(() => {
    const video = media3Ref.current;
    if (!video) return;

    const handleLoaded = async () => {
      try {
        await video.play();
      } catch (err) {
        console.warn("Autoplay prevented, retrying...");

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

    return () => {
      video.removeEventListener("loadeddata", handleLoaded);
    };
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const { logout, firstName, lastName } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <Grid>
      <Box
        position="relative"
        minHeight="100vh"
        overflow="hidden"
        sx={{ flexGrow: 1 }}
      >
        <Box
          component="video"
          src={starsbg}
          autoPlay
          loop
          muted
          playsInline
          ref={media3Ref}
          sx={{
            mt: 7,
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover", // ensures video fills the screen nicely
            zIndex: -1, // keeps it behind everything
          }}
        />

        <AppBar position="static" sx={{ bgcolor: "#E7500F" }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => setShowHologramMenu((prev) => !prev)}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: "2px",
                textTransform: "uppercase",
                textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
                transform: "scaleY(1.1) rotateX(7deg)",
              }}
            >
              <Box
                component="span"
                sx={{
                  color: "#E50914",
                  WebkitTextStroke: "1px black",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                Cosmic
              </Box>
              <Box component="span" sx={{ color: "#000", mx: 0.5 }}>
                -
              </Box>
              <Box
                component="span"
                sx={{
                  color: "#FFD700",
                  WebkitTextStroke: "1px black",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                Sheet
              </Box>
            </Typography>
            <Grid
              sx={{
                position: "relative",
                height: 70,
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <Box
                component="video"
                src={media3}
                ref={media3Ref}
                autoPlay
                loop
                muted
                playsInline
                controls={false}
                sx={{
                  width: "100%",
                  height: "70%",
                  objectFit: "cover",
                  mt: 1,
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "rgba(255, 215, 0, 0.2)",
                  mixBlendMode: "overlay",
                }}
              />
            </Grid>

            <Box sx={{ flexGrow: 1 }} />

            {auth && (
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <Typography>
                    {firstName} {lastName}
                  </Typography>

                  <AccountCircle sx={{ fontSize: 40 }} />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem
                    onClick={handleClose}
                    component={Link}
                    to="/profile"
                  >
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleClose}>My account</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>

        {/* 🔹 Centered Content on Background */}
        <Grid
          container
          size="12"
          direction="column"
          alignItems="center"
          sx={{
            mt: 5,
            // full height minus AppBar
            color: "white",
            textShadow: "1px 1px 5px rgba(0,0,0,0.8)",
          }}
        >
          <Grid
            container
            size={12}
            justifyContent="center"
            spacing={2}
            alignContent={"center"}
            alignItems={"center"}
            sx={{ ml: 6 }}
          >
            <Grid size={10}>
              <Box
                sx={{
                  position: "relative",
                  px: 6,
                  py: 3,
                  borderRadius: "20px",
                  background:
                    "linear-gradient(135deg, rgba(255,140,0,0.25), rgba(255,80,0,0.15))",
                  backdropFilter: "blur(12px)", // glassy transparency
                  border: "1px solid rgba(255,150,50,0.5)",
                  boxShadow: "0 0 25px rgba(255,100,0,0.6)",
                  overflow: "hidden",
                  "::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(45deg, rgba(255,180,80,0.35), rgba(255,220,150,0.1), rgba(255,120,0,0.05))",
                    mixBlendMode: "overlay",
                    animation: "holoMove 4s linear infinite",
                    backgroundSize: "200% 200%",
                    borderRadius: "20px",
                  },
                  "@keyframes holoMove": {
                    "0%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" },
                    "100%": { backgroundPosition: "0% 50%" },
                  },
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight={700}
                  sx={{
                    fontFamily: "'Orbitron', sans-serif",
                    letterSpacing: "2px",
                    color: "#CFFAFE",
                    textShadow: "0 0 10px rgba(0,255,255,0.8)",
                    borderColor: "black",
                    borderWidth: 2,
                  }}
                >
                  Welcome to the Cosmic Sheet
                </Typography>
              </Box>
            </Grid>
            <Grid size={2}>
              <Paper
                onClick={() => navigate("/cosmicmessenger")}
                sx={{
                  ml: 7,
                  width: 50, // increase this for bigger circle (try 300–350)
                  height: 50,
                  borderRadius: "50%",
                  position: "relative",
                  overflow: "hidden",
                  background:
                    "linear-gradient(135deg, rgba(255,140,0,0.25), rgba(255,80,0,0.15))",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,150,50,0.5)",
                  boxShadow: "0 0 25px rgba(255,100,0,0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 0 35px rgba(255,140,0,0.8)",
                  },

                  // 🛰️ holographic orange image background
                  "::after": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${messenger})`,
                    backgroundSize: "100%", // adjust how large icon appears inside
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    opacity: 1.5,
                    mixBlendMode: "screen",
                    zIndex: 0,
                  },

                  // ✨ holographic gradient movement layer
                  "::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(45deg, rgba(255,180,80,0.35), rgba(255,220,150,0.1), rgba(255,120,0,0.05))",
                    mixBlendMode: "overlay",
                    animation: "holoMove 4s linear infinite",
                    backgroundSize: "200% 200%",
                    borderRadius: "50%",
                    zIndex: 1,
                  },

                  "@keyframes holoMove": {
                    "0%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" },
                    "100%": { backgroundPosition: "0% 50%" },
                  },
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight={700}
                  sx={{
                    fontFamily: "'Orbitron', sans-serif",
                    letterSpacing: "2px",
                    color: "#CFFAFE",
                    textShadow: "0 0 10px rgba(0,255,255,0.8)",
                    borderColor: "black",
                    borderWidth: 2,
                  }}
                ></Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          size={12}
          container
          justifyContent="center"
          spacing={2}
          sx={{ mt: 5 }}
        >
          <Grid size={3}>
            <Paper
              onClick={() => navigate("/cosmicbroadcast")}
              sx={{
                width: 300,
                height: 300,
                borderRadius: "50%",
                position: "relative",
                overflow: "hidden",
                background:
                  "linear-gradient(135deg, rgba(255,140,0,0.25), rgba(255,80,0,0.15))",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,150,50,0.5)",
                boxShadow: "0 0 25px rgba(255,100,0,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                cursor: "pointer",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 0 35px rgba(255,140,0,0.8)",
                },

                "::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${broadcast})`,
                  backgroundSize: "70%",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  opacity: 0.5,
                  mixBlendMode: "screen",
                  zIndex: 0,
                },

                "::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(45deg, rgba(255,180,80,0.35), rgba(255,220,150,0.1), rgba(255,120,0,0.05))",
                  mixBlendMode: "overlay",
                  animation: "holoMove 4s linear infinite",
                  backgroundSize: "200% 200%",
                  borderRadius: "50%",
                  zIndex: 1,
                },

                "@keyframes holoMove": {
                  "0%": { backgroundPosition: "0% 50%" },
                  "50%": { backgroundPosition: "100% 50%" },
                  "100%": { backgroundPosition: "0% 50%" },
                },
              }}
            >
              {/* SVG for curved text */}
              <svg
                viewBox="0 0 300 300"
                width="100%"
                height="100%"
                style={{
                  position: "absolute",
                  zIndex: 2,
                  pointerEvents: "none",
                }}
              >
                {/* Top curve path */}
                <path
                  id="topCurve"
                  d="M 60,150 A 90,90 0 0,1 240,150"
                  fill="transparent"
                />
                {/* Bottom curve path (flipped) */}
                <path
                  id="bottomCurve"
                  d="M 60,150 A 90,90 0 0,0 240,150"
                  fill="transparent"
                />

                {/* Top text */}
                <text
                  fill="#CFFAFE"
                  fontSize="50"
                  fontWeight="700"
                  fontFamily="'Orbitron', sans-serif"
                  letterSpacing="2px"
                  textShadow="0 0 10px rgba(0,255,255,0.8)"
                >
                  <textPath
                    href="#topCurve"
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    COSMIC
                  </textPath>
                </text>

                {/* Bottom text */}
                <text
                  fill="#CFFAFE"
                  fontSize="30"
                  fontWeight="700"
                  fontFamily="'Orbitron', sans-serif"
                  letterSpacing="2px"
                >
                  <textPath
                    href="#bottomCurve"
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    BROADCAST
                  </textPath>
                </text>
              </svg>
            </Paper>
          </Grid>
          <Grid size={3}>
            <Paper
              onClick={() => navigate("/cosmicmedia")}
              sx={{
                width: 300, // increase this for bigger circle (try 300–350)
                height: 300,
                borderRadius: "50%",
                position: "relative",
                overflow: "hidden",
                background:
                  "linear-gradient(135deg, rgba(255,140,0,0.25), rgba(255,80,0,0.15))",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,150,50,0.5)",
                boxShadow: "0 0 25px rgba(255,100,0,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                cursor: "pointer",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 0 35px rgba(255,140,0,0.8)",
                },

                // 🛰️ holographic orange image background
                "::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${tv})`,
                  backgroundSize: "70%", // adjust how large icon appears inside
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  opacity: 0.5,
                  mixBlendMode: "screen",
                  zIndex: 0,
                },

                // ✨ holographic gradient movement layer
                "::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(45deg, rgba(255,180,80,0.35), rgba(255,220,150,0.1), rgba(255,120,0,0.05))",
                  mixBlendMode: "overlay",
                  animation: "holoMove 4s linear infinite",
                  backgroundSize: "200% 200%",
                  borderRadius: "50%",
                  zIndex: 1,
                },

                "@keyframes holoMove": {
                  "0%": { backgroundPosition: "0% 50%" },
                  "50%": { backgroundPosition: "100% 50%" },
                  "100%": { backgroundPosition: "0% 50%" },
                },
              }}
            >
              {/* SVG for curved text */}
              <svg
                viewBox="0 0 300 300"
                width="100%"
                height="100%"
                style={{
                  position: "absolute",
                  zIndex: 2,
                  pointerEvents: "none",
                }}
              >
                {/* Top curve path */}
                <path
                  id="topCurve"
                  d="M 60,150 A 90,90 0 0,1 240,150"
                  fill="transparent"
                />
                {/* Bottom curve path (flipped) */}
                <path
                  id="bottomCurve"
                  d="M 60,150 A 90,90 0 0,0 240,150"
                  fill="transparent"
                />

                {/* Top text */}
                <text
                  fill="#CFFAFE"
                  fontSize="50"
                  fontWeight="700"
                  fontFamily="'Orbitron', sans-serif"
                  letterSpacing="2px"
                  textShadow="0 0 10px rgba(0,255,255,0.8)"
                >
                  <textPath
                    href="#topCurve"
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    COSMIC
                  </textPath>
                </text>

                {/* Bottom text */}
                <text
                  fill="#CFFAFE"
                  fontSize="30"
                  fontWeight="700"
                  fontFamily="'Orbitron', sans-serif"
                  letterSpacing="2px"
                >
                  <textPath
                    href="#bottomCurve"
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    Media
                  </textPath>
                </text>
              </svg>
            </Paper>
          </Grid>
          <Grid size={3}>
            <Paper
              onClick={() => navigate("/cosmicmoodyfry")}
              sx={{
                width: 300, // increase this for bigger circle (try 300–350)
                height: 300,
                borderRadius: "50%",
                position: "relative",
                overflow: "hidden",
                background:
                  "linear-gradient(135deg, rgba(255,140,0,0.25), rgba(255,80,0,0.15))",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,150,50,0.5)",
                boxShadow: "0 0 25px rgba(255,100,0,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                cursor: "pointer",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 0 35px rgba(255,140,0,0.8)",
                },

                // 🛰️ holographic orange image background
                "::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${moodyfry})`,
                  backgroundSize: "70%", // adjust how large icon appears inside
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  opacity: 0.5,
                  mixBlendMode: "screen",
                  zIndex: 0,
                },

                // ✨ holographic gradient movement layer
                "::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(45deg, rgba(255,180,80,0.35), rgba(255,220,150,0.1), rgba(255,120,0,0.05))",
                  mixBlendMode: "overlay",
                  animation: "holoMove 4s linear infinite",
                  backgroundSize: "200% 200%",
                  borderRadius: "50%",
                  zIndex: 1,
                },

                "@keyframes holoMove": {
                  "0%": { backgroundPosition: "0% 50%" },
                  "50%": { backgroundPosition: "100% 50%" },
                  "100%": { backgroundPosition: "0% 50%" },
                },
              }}
            >
              {/* SVG for curved text */}
              <svg
                viewBox="0 0 300 300"
                width="100%"
                height="100%"
                style={{
                  position: "absolute",
                  zIndex: 2,
                  pointerEvents: "none",
                }}
              >
                {/* Top curve path */}
                <path
                  id="topCurve"
                  d="M 60,150 A 90,90 0 0,1 240,150"
                  fill="transparent"
                />
                {/* Bottom curve path (flipped) */}
                <path
                  id="bottomCurve"
                  d="M 60,150 A 90,90 0 0,0 240,150"
                  fill="transparent"
                />

                {/* Top text */}
                <text
                  fill="#CFFAFE"
                  fontSize="50"
                  fontWeight="700"
                  fontFamily="'Orbitron', sans-serif"
                  letterSpacing="2px"
                  textShadow="0 0 10px rgba(0,255,255,0.8)"
                >
                  <textPath
                    href="#topCurve"
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    COSMIC
                  </textPath>
                </text>

                {/* Bottom text */}
                <text
                  fill="#CFFAFE"
                  fontSize="30"
                  fontWeight="700"
                  fontFamily="'Orbitron', sans-serif"
                  letterSpacing="2px"
                >
                  <textPath
                    href="#bottomCurve"
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    MoodyFry
                  </textPath>
                </text>
              </svg>
            </Paper>
          </Grid>
        </Grid>
        {showHologramMenu && (
          <Box
            onClick={() => setShowHologramMenu(false)}
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "70vw",
              height: "60vh",
              borderRadius: "20px",
              background:
                "linear-gradient(135deg, rgba(255,120,0,0.15), rgba(255,80,0,0.05))",
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(255,150,50,0.7)",
              boxShadow: "0 0 40px rgba(255,100,0,0.5)",
              zIndex: 2000,
              overflow: "hidden",
              animation: "holoFloat 4s ease-in-out infinite",
              "@keyframes holoFloat": {
                "0%, 100%": { transform: "translate(-50%, -50%) scale(1)" },
                "50%": { transform: "translate(-50%, -50%) scale(1.02)" },
              },
              "::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(45deg, rgba(255,180,80,0.25), rgba(255,220,150,0.1), rgba(255,120,0,0.05))",
                mixBlendMode: "overlay",
                backgroundSize: "200% 200%",
                animation: "holoShine 5s linear infinite",
                borderRadius: "20px",
              },
              "@keyframes holoShine": {
                "0%": { backgroundPosition: "0% 50%" },
                "50%": { backgroundPosition: "100% 50%" },
                "100%": { backgroundPosition: "0% 50%" },
              },
            }}
          >
            {/* 🔸 Content inside the hologram panel */}
            <Box
              sx={{
                position: "relative",
                zIndex: 2,
                color: "#FFD580",
                fontFamily: "'Orbitron', sans-serif",
                textAlign: "center",
                p: 4,
              }}
            >
              <Typography
                variant="h4"
                sx={{ mb: 3, textShadow: "0 0 10px orange" }}
              >
                COSMIC MENU
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "orange",
                  color: "#FFD580",
                  "&:hover": { backgroundColor: "rgba(255,165,0,0.1)" },
                  mx: 2,
                }}
                onClick={() => navigate("/cosmicbroadcast")}
              >
                Broadcast
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "orange",
                  color: "#FFD580",
                  "&:hover": { backgroundColor: "rgba(255,165,0,0.1)" },
                  mx: 2,
                }}
                onClick={() => navigate("/cosmicmedia")}
              >
                Media
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "orange",
                  color: "#FFD580",
                  "&:hover": { backgroundColor: "rgba(255,165,0,0.1)" },
                  mx: 2,
                }}
                onClick={() => navigate("/cosmicmoodyfry")}
              >
                MoodyFry
              </Button>

              <Typography
                sx={{
                  mt: 5,
                  fontSize: 14,
                  opacity: 0.7,
                  textShadow: "0 0 6px orange",
                }}
              >
                Click anywhere outside to close
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Grid>
  );
}

export default HomePage;
