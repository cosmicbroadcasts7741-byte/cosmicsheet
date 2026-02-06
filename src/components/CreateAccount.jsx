import * as React from "react";
import { Grid, Typography, Button, TextField } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

function CreateAccount({ onBack }) {
  const navigate = useNavigate();

  const { handleSubmit, register } = useForm();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        firstName: data.firstName,
        lastName: data.lastName,
        mobileNumber: data.mobileNumber,
        email: data.email,
        createdAt: new Date(),
      });

      alert("Account Created Successfully");

      navigate("/home");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3} direction="column">
        <Typography variant="h5">Create Account</Typography>

        <TextField
          label="First Name"
          {...register("firstName", { required: true })}
        />
        <TextField
          label="Last Name"
          {...register("lastName", { required: true })}
        />
        <TextField
          label="Mobile Number"
          {...register("mobileNumber", { required: true })}
        />
        <TextField label="Email" {...register("email", { required: true })} />

        <TextField
          label="Password"
          type="password"
          {...register("password", { required: true })}
        />

        <TextField
          label="Confirm Password"
          type="password"
          {...register("confirmPassword", { required: true })}
        />

        <Grid container justifyContent="space-between">
          <Button onClick={onBack}>
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
