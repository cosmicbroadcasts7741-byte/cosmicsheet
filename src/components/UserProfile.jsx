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
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Avatar, Typography, Grid, TextField, Button } from "@mui/material";
import { useAuth } from "../AuthProvider";
import { useEffect, useState } from "react";

export default function UserProfile() {
  const { uid } = useParams(); // clicked user's uid
  const { user } = useAuth(); // logged-in user

  const [profile, setProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // ✅ CHAT ID
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

  // 🔹 Send TEXT message
  const sendMessage = async () => {
    if (!newMessage.trim() || !chatId) return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: newMessage,
      senderId: user.uid,
      createdAt: serverTimestamp(),
      type: "text",
    });

    setNewMessage("");
  };

  // 🔹 Send IMAGE message
  const sendImage = async () => {
    if (!imageFile || !chatId) return;

    const imageRef = ref(
      storage,
      `chatImages/${chatId}/${Date.now()}_${imageFile.name}`,
    );

    await uploadBytes(imageRef, imageFile);
    const imageURL = await getDownloadURL(imageRef);

    await addDoc(collection(db, "chats", chatId, "messages"), {
      imageUrl: imageURL,
      senderId: user.uid,
      createdAt: serverTimestamp(),
      type: "image",
    });

    setImageFile(null);
  };

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
            <Grid
              key={i}
              sx={{
                textAlign: msg.senderId === user.uid ? "right" : "left",
                mb: 1,
              }}
            >
              {msg.type === "text" && (
                <Typography
                  sx={{
                    color: msg.senderId === user.uid ? "blue" : "black",
                  }}
                >
                  {msg.text}
                </Typography>
              )}

              {msg.type === "image" && (
                <img
                  src={msg.imageUrl}
                  alt="sent"
                  style={{
                    maxWidth: "70%",
                    borderRadius: 8,
                  }}
                />
              )}
            </Grid>
          ))}
        </Grid>

        {/* TEXT INPUT */}
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

        {/* IMAGE INPUT */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          style={{ marginTop: 12 }}
        />

        <Button
          fullWidth
          sx={{ mt: 1 }}
          variant="outlined"
          onClick={sendImage}
          disabled={!imageFile}
        >
          Send Image
        </Button>
      </Grid>
    </Grid>
  );
}
