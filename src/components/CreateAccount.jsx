import { Grid } from "@mui/material";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";

function CreateAccount({ onBack }) {
  const navigate = useNavigate();
  const { firstName, email } = useAuth();

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      mobileNumber: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data) => {
    // Basic client-side validation for confirm password
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Save user to localStorage (simple example: single user)
    const userToSave = {
      firstName: data.firstName,
      lastName: data.lastName,
      mobileNumber: data.mobileNumber,
      email: data.email,
      password: data.password, // note: plain text (see security note)
    };

    try {
      localStorage.setItem("savedUser", JSON.stringify(userToSave));
      alert("Account created successfully!");
      // go back to login view inside the Paper
      if (typeof onBack === "function") onBack();
    } catch (err) {
      console.error("LocalStorage error:", err);
      alert(
        "Failed to save account. Make sure your browser allows localStorage."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3} direction="column" sx={{ m: 4 }}>
        <Grid>
          <Typography variant="h5">Create Account</Typography>
        </Grid>

        <Grid>
          <TextField
            variant="outlined"
            label="First Name"
            fullWidth
            {...register("firstName", { required: "First Name is required" })}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                height: 50,
              },
            }}
          ></TextField>
        </Grid>
        <Grid>
          <TextField
            variant="outlined"
            label="Last Name"
            fullWidth
            {...register("lastName", { required: "Last Name is required" })}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                height: 50,
              },
            }}
          ></TextField>
        </Grid>

        <Grid>
          <TextField
            variant="outlined"
            label="Mobile Number"
            fullWidth
            type="number"
            {...register("mobileNumber", {
              required: "Mobile Number is required",
            })}
            error={!!errors.mobileNumber}
            helperText={errors.mobileNumber?.message}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                height: 50,
              },
            }}
          ></TextField>
        </Grid>
        <Grid>
          <TextField
            variant="outlined"
            label="Email"
            fullWidth
            type="email"
            {...register("email", { required: "Email is required" })}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                height: 50,
              },
            }}
          ></TextField>
        </Grid>
        <Grid>
          <TextField
            variant="outlined"
            label="Password"
            fullWidth
            type="password"
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                height: 50,
              },
            }}
          ></TextField>
        </Grid>
        <Grid>
          <TextField
            variant="outlined"
            label="Confirm Password"
            fullWidth
            type="password"
            {...register("confirmPassword", {
              required: "Confirm Password is required",
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                height: 50,
              },
            }}
          ></TextField>
        </Grid>
        <Grid container spacing={2} justifyContent="space-between">
          <Grid>
            <Button
              variant="outlined"
              sx={{ borderColor: "#FFD700", color: "#FFD700" }}
              onClick={onBack}
            >
              <ArrowBackIosIcon />
            </Button>
          </Grid>

          <Grid>
            <Button
              variant="outlined"
              sx={{
                width: 160,
                height: 50,
                borderColor: "black",
                color: "#FFD700",
                bgcolor: "#B9313B",
              }}
              type="submit"
            >
              Create Account
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
}

export default CreateAccount;
