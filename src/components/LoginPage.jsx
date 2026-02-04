import { Button, TextField, Typography, Grid, Box, Paper } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { useRef, useEffect, useState } from "react";

import CreateAccount from "./CreateAccount";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

export default function LoginPage() {
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

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

  // ✅ password toggle handlers (FIXES no-undef error)
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

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
      login(data.email);
      navigate("/home");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#E7500F"
    >
      <Paper
        elevation={4}
        sx={{
          width: 450,
          p: 4,
          borderRadius: 3,
          bgcolor: "#FFBD00",
        }}
      >
        {showCreateAccount ? (
          <CreateAccount onBack={() => setShowCreateAccount(false)} />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container direction="column" spacing={3}>
              <Typography
                variant="h5"
                align="center"
                sx={{ fontWeight: "bold" }}
              >
                Sign In
              </Typography>

              <TextField
                label="Email"
                fullWidth
                {...register("email", {
                  required: "Email is required",
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                })}
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
                  variant="outlined"
                  onClick={() => setShowCreateAccount(true)}
                >
                  Create Account
                </Button>

                <Button variant="contained" type="submit">
                  Login
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Paper>
    </Grid>
  );
}
