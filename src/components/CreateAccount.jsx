import * as React from "react";
import { Grid, Typography, Button, TextField } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useForm } from "react-hook-form";

function CreateAccount({ onBack }) {
  const {
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
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const userToSave = {
      firstName: data.firstName,
      lastName: data.lastName,
      mobileNumber: data.mobileNumber,
      email: data.email,
      password: data.password,
    };

    try {
      localStorage.setItem("savedUser", JSON.stringify(userToSave));
      alert("Account created successfully!");
      if (typeof onBack === "function") onBack();
    } catch (err) {
      console.error("LocalStorage error:", err);
      alert("Failed to save account.");
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
            label="First Name"
            fullWidth
            {...register("firstName", { required: "First Name is required" })}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
        </Grid>

        <Grid>
          <TextField
            label="Last Name"
            fullWidth
            {...register("lastName", { required: "Last Name is required" })}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
        </Grid>

        <Grid>
          <TextField
            label="Mobile Number"
            fullWidth
            type="number"
            {...register("mobileNumber", {
              required: "Mobile Number is required",
            })}
            error={!!errors.mobileNumber}
            helperText={errors.mobileNumber?.message}
          />
        </Grid>

        <Grid>
          <TextField
            label="Email"
            fullWidth
            type="email"
            {...register("email", { required: "Email is required" })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Grid>

        <Grid>
          <TextField
            label="Password"
            fullWidth
            type="password"
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        </Grid>

        <Grid>
          <TextField
            label="Confirm Password"
            fullWidth
            type="password"
            {...register("confirmPassword", {
              required: "Confirm Password is required",
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
        </Grid>

        <Grid container justifyContent="space-between">
          <Button variant="outlined" onClick={onBack}>
            <ArrowBackIosIcon />
          </Button>

          <Button type="submit" variant="contained">
            Create Account
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default CreateAccount;
