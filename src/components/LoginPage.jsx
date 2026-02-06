import { Button, TextField, Typography, Grid, Paper } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import CreateAccount from "./CreateAccount";

export default function LoginPage() {
  const [showCreateAccount, setShowCreateAccount] = useState(false);

  const navigate = useNavigate();

  const { handleSubmit, register } = useForm();

  const onSubmit = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);

      navigate("/home");
    } catch (error) {
      console.error(error);

      if (error.code === "auth/user-not-found") {
        alert("User not found");
      } else if (error.code === "auth/wrong-password") {
        alert("Wrong password");
      } else {
        alert(error.message);
      }
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Paper sx={{ width: 400, p: 4 }}>
        {showCreateAccount ? (
          <CreateAccount onBack={() => setShowCreateAccount(false)} />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container direction="column" spacing={3}>
              <Typography variant="h5" align="center">
                Login
              </Typography>

              <TextField label="Email" {...register("email")} />
              <TextField
                label="Password"
                type="password"
                {...register("password")}
              />

              <Grid container justifyContent="space-between">
                <Button onClick={() => setShowCreateAccount(true)}>
                  Create Account
                </Button>

                <Button type="submit" variant="contained">
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
