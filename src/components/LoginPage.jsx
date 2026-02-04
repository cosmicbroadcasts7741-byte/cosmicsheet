import { Button, TextField, Typography } from "@mui/material";
import { Grid } from "@mui/material";
import { Box } from "@mui/material";
import { Paper } from "@mui/material";
import robot from "../assets/robot.png";
import media from "../assets/media.mp4";
import media3 from "../assets/media3.mp4";
import { useForm, Controller } from "react-hook-form";
import { red } from "@mui/material/colors";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { useRef, useEffect } from "react";
import { useState } from "react";
import CreateAccount from "./CreateAccount.jsx";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

export default function LoginPage() {
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const media3Ref = useRef(null);
  const mediaRef = useRef(null);

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

  useEffect(() => {
    const video = mediaRef.current;
    if (!video) return;

    const handleLoaded = async () => {
      try {
        await video.play();
      } catch (err) {
        console.warn("Autoplay prevented, waiting for user gesture...");
        const handleUserGesture = async () => {
          await video.play().catch(() => {});
          window.removeEventListener("click", handleUserGesture);
        };
        window.addEventListener("click", handleUserGesture);
      }
    };

    video.addEventListener("loadeddata", handleLoaded);

    video.muted = true;
    video.playsInline = true;

    return () => {
      video.removeEventListener("loadeddata", handleLoaded);
    };
  }, []);

  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    // Read saved user from localStorage
    const saved = localStorage.getItem("savedUser");
    if (!saved) {
      alert("No account found. Please create an account first.");
      return;
    }

    let savedUser = null;
    try {
      savedUser = JSON.parse(saved);
    } catch (err) {
      console.error("Failed to parse savedUser", err);
      alert("Stored user data is corrupted.");
      return;
    }

    // Simple check: email and password must match saved values
    if (
      savedUser.email === data.email &&
      savedUser.password === data.password
    ) {
      login(data.email, data.password);
      // But simple navigation:
      navigate("/home");
    } else {
      alert("Invalid username or password");
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Grid sx={{ bgcolor: "#E7500F" }} container>
      <Grid container>
        <Grid size={12} container justifyContent="center" alignItems="center">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: "2px",
              textTransform: "uppercase",
              textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
              transform: "scaleY(1.1) rotateX(7deg)",
              marginLeft: 15,
              marginTop: 5,
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
              height: 120,
              borderRadius: "10px",
              overflow: "hidden",
              mt: 5,
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
                height: "100%",
                objectFit: "cover",
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
        </Grid>
      </Grid>

      <Grid
        size={12}
        sx={{ mt: 5 }}
        spacing={5}
        container
        justifyContent="center"
      >
        <Grid sx={{ ml: 20, mt: 1 }}>
          <Box
            component="img"
            src={robot}
            alt="Robot"
            sx={{
              width: 400,
              height: "300",
            }}
          />
        </Grid>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            "& > :not(style)": {
              m: 1,
              width: 500,
              height: 600,
            },
          }}
        >
          <Paper
            elevation={3}
            sx={{
              background: "#FFBD00",
              backdropFilter: "blur(15px)",
              border: "2px solid black",
              boxShadow: "0 0 25px rgba(255, 0, 0, 0.6)",
              borderRadius: "20px",
              transition: "0.4s",
              overflowY: "auto",
              maxHeight: 600,
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#B9313B",
                borderRadius: "10px",
                marginTop: "8px", // ✅ adds space at top
                marginBottom: "8px", // ✅ adds space at bottom
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "transparent",
                marginTop: "8px", // ✅ ensures thumb doesn’t start at the top edge
                marginBottom: "8px", // ✅ same for bottom
              },
            }}
          >
            {showCreateAccount ? (
              <CreateAccount onBack={() => setShowCreateAccount(false)} />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container direction={"column"} m={5} spacing={3}>
                  <Grid container justifyContent="center">
                    <Typography
                      variant="h5"
                      sx={{
                        color: "#FFD700",
                        WebkitTextStroke: "1px black",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        bgcolor: "#B9313B",
                      }}
                    >
                      Sign In
                    </Typography>
                  </Grid>

                  <Grid
                    sx={{
                      height: 150,
                      overflow: "hidden",
                      borderRadius: "10px",
                    }}
                  >
                    <Box
                      component="video"
                      src={media}
                      ref={mediaRef}
                      playsInline
                      controls={false}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        transform: "scale(1.9)",
                        borderRadius: "10px",
                      }}
                    />
                  </Grid>

                  <Grid>
                    <TextField
                      label="Email"
                      variant="outlined"
                      fullWidth
                      {...register("email", {
                        required: "Email is required",
                        maxLength: {
                          value: 30,
                          message: "email length cannot exceed 30 characters",
                        },
                      })}
                      error={!!errors.email}
                      helperText={errors.email?.message ?? " "}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "20px",
                          height: 50,
                        },
                      }}
                    />
                  </Grid>
                  <Grid>
                    <TextField
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      variant="outlined"
                      fullWidth
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      error={!!errors.password}
                      helperText={errors.password?.message ?? " "}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                              onClick={handleTogglePassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "20px",
                          height: 50,
                        },
                      }}
                    />
                  </Grid>

                  <Grid container justifyContent="space-between">
                    <Grid>
                      <Button
                        variant="outlined"
                        sx={{
                          width: 150,
                          height: 50,
                          borderColor: "#FFBD00",
                          color: "black",
                          bgcolor: "#FFBD00",
                        }}
                        onClick={() => setShowCreateAccount(true)}
                      >
                        Create Account
                      </Button>
                    </Grid>
                    <Grid>
                      <Button
                        variant="outlined"
                        sx={{
                          width: 100,
                          borderColor: "black",
                          color: "#FFD700",
                          bgcolor: "#B9313B",
                        }}
                        type="submit"
                      >
                        Login In
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            )}{" "}
          </Paper>
        </Box>
      </Grid>

      <Grid
        size={12}
        container
        sx={{
          mt: 10,
          bgcolor: "#D40300",
          py: 5,
          ml: 7,
        }}
        justifyContent="center"
        alignItems="flex-start"
      >
        <Grid size={3}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            gap={1}
          >
            <Typography variant="h6" sx={{ color: "black" }}>
              FAQ
            </Typography>
            <Typography variant="h6" sx={{ color: "black" }}>
              Privacy
            </Typography>
            <Typography variant="h6" sx={{ color: "black" }}>
              Terms of Service
            </Typography>
          </Box>
        </Grid>

        <Grid size={3}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            gap={1}
          >
            <Typography variant="h6" sx={{ color: "black" }}>
              Help Center
            </Typography>
            <Typography variant="h6" sx={{ color: "black" }}>
              Jobs
            </Typography>
            <Typography variant="h6" sx={{ color: "black" }}>
              Cookie Preferences
            </Typography>
          </Box>
        </Grid>

        <Grid size={3}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            gap={1}
          >
            <Typography variant="h6" sx={{ color: "black" }}>
              Account
            </Typography>
            <Typography variant="h6" sx={{ color: "black" }}>
              Media Center
            </Typography>
            <Typography variant="h6" sx={{ color: "black" }}>
              Investor Relations
            </Typography>
          </Box>
        </Grid>

        <Grid size={3}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            gap={1}
          >
            <Typography variant="h6" sx={{ color: "black" }}>
              Ways to Watch
            </Typography>
            <Typography variant="h6" sx={{ color: "black" }}>
              Corporate Information
            </Typography>
            <Typography variant="h6" sx={{ color: "black" }}>
              Legal Notices
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
