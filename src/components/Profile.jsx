import React from "react";
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useAuth } from "../AuthProvider";

function Profile() {
  const { email, firstName, lastName, mobileNumber } = useAuth();
  return (
    <Grid container direction="column" alignItems="center" spacing={2} mt={5}>
      <Typography variant="h5">User Profile : {email}</Typography>
      <Typography variant="h6">First Name: {firstName}</Typography>
      <Typography variant="h6">Last Name: {lastName}</Typography>
      <Typography variant="h6">Mobile Number: {mobileNumber}</Typography>
    </Grid>
  );
}
export default Profile;
