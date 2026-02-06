import * as React from "react";
import { Grid, Avatar, Box } from "@mui/material";
import { useAuth } from "../AuthProvider";
import { useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { TextField, Button } from "@mui/material";
import { doc, updateDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";

function HomePage() {
  const { user, profile, logout, setProfile } = useAuth();
  const [bio, setBio] = React.useState("");
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const fileInputRef = React.useRef(null);

  // 🔹 NEW: users list
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      const list = snap.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));
      setUsers(list);
    };

    fetchUsers();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };
  const handleSaveBio = async () => {
    if (!user) return;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        bio: bio,
      });

      alert("Bio saved successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to save bio ❌");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    try {
      const data = await uploadToCloudinary(file, user.uid);

      await updateDoc(doc(db, "users", user.uid), {
        photoURL: data.secure_url,
      });

      setProfile((prev) => ({
        ...prev,
        photoURL: data.secure_url,
      }));

      e.target.value = "";
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    }
  };

  return (
    <Grid>
      {/* 🔹 TOP BAR */}
      <AppBar position="static">
        <Toolbar>
          <MenuIcon />
          <Typography sx={{ ml: 2, flexGrow: 1 }}>Cosmic Sheet</Typography>

          {user && (
            <>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                hidden
                onChange={handleImageUpload}
              />

              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{ ml: 1 }}
              >
                <Typography sx={{ mr: 1 }}>{profile?.firstName}</Typography>

                <Avatar
                  src={profile?.photoURL || ""}
                  sx={{ width: 36, height: 36 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current.click();
                  }}
                />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Grid container justifyContent="center" sx={{ mt: 4 }}>
        <Grid item xs={10} md={6}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Your Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <Button variant="contained" sx={{ mt: 2 }} onClick={handleSaveBio}>
            Add Bio
          </Button>
        </Grid>
      </Grid>

      {/* 🔹 NEW: USERS LIST (friends / explore) */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Users</Typography>

        {users
          .filter((u) => u.uid !== user?.uid)
          .map((u) => (
            <Box
              key={u.uid}
              onClick={() => navigate(`/user/${u.uid}`)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mt: 2,
                cursor: "pointer",
              }}
            >
              <Avatar src={u.photoURL || ""} />
              <Typography>{u.firstName}</Typography>
            </Box>
          ))}
      </Box>
    </Grid>
  );
}

export default HomePage;
