import { Button, TextField, Typography, Grid, Box, Paper } from "@mui/material";

import robot from "../assets/robot.png";
import media from "../assets/media.mp4";
import media3 from "../assets/media3.mp4";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { useRef, useEffect, useState } from "react";

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

  const navigate = useNavigate();
  const { login } = useAuth();

  /* 🔧 FIX 1: PASSWORD TOGGLE FUNCTIONS (MISSING BEFORE) */
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const video = media3Ref.current;
    if (!video) return;

    const handleLoaded = async () => {
      try {
        await video.play();
      } catch {
        const click = async () => {
          await video.play().catch(() => {});
          window.removeEventListener("click", click);
        };
        window.addEventListener("click", click);
      }
    };

    video.addEventListener("loadeddata", handleLoaded);
    video.loop = true;
    video.muted = true;
    video.playsInline = true;

    return () => video.removeEventListener("loadeddata", handleLoaded);
  }, []);

  useEffect(() => {
    const video = mediaRef.current;
    if (!video) return;

    const handleLoaded = async () => {
      try {
        await video.play();
      } catch {
        const click = async () => {
          await video.play().catch(() => {});
          window.removeEventListener("click", click);
        };
        window.addEventListener("click", click);
      }
    };

    video.addEventListener("loadeddata", handleLoaded);
    video.muted = true;
    video.playsInline = true;

    return () => video.removeEventListener("loadeddata", handleLoaded);
  }, []);

  const onSubmit = (data) => {
    const saved = localStorage.getItem("savedUser");
    if (!saved) {
      alert("No account found");
      return;
    }

    const savedUser = JSON.parse(saved);

    if (
      savedUser.email === data.email &&
      savedUser.password === data.password
    ) {
      login(data.email, data.password);
      navigate("/home");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <Grid sx={{ bgcolor: "#E7500F" }} container>
      <Grid container>
        <Grid container justifyContent="center" alignItems="center">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: "2px",
              textTransform: "uppercase",
              textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
              marginTop: 5,
            }}
          >
            <Box component="span" sx={{ color: "#E50914" }}>
              Cosmic
            </Box>{" "}
            -
            <Box component="span" sx={{ color: "#FFD700", ml: 1 }}>
              Sheet
            </Box>
          </Typography>
        </Grid>
      </Grid>

      <Grid container justifyContent="center" mt={5}>
        <Paper
          sx={{
            width: 500,
            p: 4,
            bgcolor: "#FFBD00",
            borderRadius: 3,
          }}
        >
          {showCreateAccount ? (
            <CreateAccount onBack={() => setShowCreateAccount(false)} />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container direction="column" spacing={3}>
                <Typography variant="h5" textAlign="center">
                  Sign In
                </Typography>

                <TextField
                  label="Email"
                  fullWidth
                  {...register("email", { required: "Email required" })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />

                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  {...register("password", { required: "Password required" })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Grid container justifyContent="space-between">
                  <Button
                    onClick={() => setShowCreateAccount(true)}
                    variant="contained"
                  >
                    Create Account
                  </Button>

                  <Button type="submit" variant="contained" color="success">
                    Login
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}
