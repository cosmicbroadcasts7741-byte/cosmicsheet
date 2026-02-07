import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { Avatar, Typography, Grid, TextField, Button } from "@mui/material";
import { useAuth } from "../AuthProvider";
import { useEffect, useState } from "react";

export default function UserProfile() {
  const { uid } = useParams(); // clicked user's uid
  const { user } = useAuth(); // logged-in user

  const [profile, setProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // ✅ CHAT ID (safe even if user is null)
  const chatId =
    user && uid
      ? user.uid < uid
        ? `${user.uid}_${uid}`
        : `${uid}_${user.uid}`
      : null;

  // 🔹 Fetch profile
  useEffect(() => {
    if (!uid) return;

    const fetchProfile = async () => {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        setProfile(snap.data());
      }
    };

    fetchProfile();
  }, [uid]);

  // 🔹 Listen to messages
  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscribe();
  }, [chatId]);

  // 🔹 Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !chatId) return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: newMessage,
      senderId: user.uid,
      createdAt: serverTimestamp(),
    });

    setNewMessage("");
  };

  // ✅ NOW it is safe to return conditionally
  if (!profile || !user) return <p>Loading profile...</p>;

  return (
    <Grid container justifyContent="center" sx={{ mt: 4 }}>
      <Grid item xs={10} md={6}>
        <Avatar
          src={profile.photoURL}
          sx={{ width: 90, height: 90, mx: "auto" }}
        />

        <Typography align="center" variant="h6" sx={{ mt: 2 }}>
          {profile.firstName}
        </Typography>

        <Typography align="center" sx={{ color: "gray", mb: 2 }}>
          {profile.bio || "No bio added yet"}
        </Typography>

        {/* CHAT BOX */}
        <Grid
          sx={{
            border: "1px solid #ddd",
            borderRadius: 2,
            p: 2,
            height: 300,
            overflowY: "auto",
            mb: 2,
          }}
        >
          {messages.map((msg, i) => (
            <Typography
              key={i}
              align={msg.senderId === user.uid ? "right" : "left"}
              sx={{
                mb: 1,
                color: msg.senderId === user.uid ? "blue" : "black",
              }}
            >
              {msg.text}
            </Typography>
          ))}
        </Grid>

        <TextField
          fullWidth
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />

        <Button
          fullWidth
          sx={{ mt: 1 }}
          variant="contained"
          onClick={sendMessage}
        >
          Send
        </Button>
      </Grid>
    </Grid>
  );
}
