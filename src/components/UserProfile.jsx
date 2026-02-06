import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { Avatar, Typography } from "@mui/material";
import { Grid } from "@mui/material";

export default function UserProfile() {
  const { uid } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        setProfile(snap.data());
      }
    };

    fetchProfile();
  }, [uid]);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <Grid container justifyContent="center" sx={{ mt: 5 }}>
      <Grid item xs={10} md={6} textAlign="center">
        <Avatar
          src={profile.photoURL}
          sx={{ width: 100, height: 100, mx: "auto" }}
        />

        <Typography variant="h6" sx={{ mt: 2 }}>
          {profile.firstName}
        </Typography>

        <Typography sx={{ mt: 1, color: "gray" }}>
          {profile.bio || "No bio added yet"}
        </Typography>
      </Grid>
    </Grid>
  );
}
