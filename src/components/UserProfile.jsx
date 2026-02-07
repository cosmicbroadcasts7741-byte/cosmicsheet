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
import { uploadToCloudinary } from "../utils/cloudinaryUpload";
import { setDoc } from "firebase/firestore";
import { createPeerConnection } from "../utils/webrtc";

export default function UserProfile() {
  const { uid } = useParams(); // clicked user's uid
  const { user } = useAuth(); // logged-in user

  const [profile, setProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // ✅ CHAT ID (stable & correct)
  const chatId =
    user && uid
      ? user.uid < uid
        ? `${user.uid}_${uid}`
        : `${uid}_${user.uid}`
      : null;

  useEffect(() => {
    if (!chatId || !user) return;

    const callRef = doc(db, "chats", chatId, "calls", "activeCall");

    const unsubscribe = onSnapshot(callRef, async (snap) => {
      if (!snap.exists()) return;

      const data = snap.data();

      // If THIS user is the receiver
      if (data.receiverId === user.uid && data.status === "ringing") {
        const accept = window.confirm("📞 Incoming call. Accept?");

        if (!accept) return;

        // 1️⃣ Create peer connection
        const pc = createPeerConnection();

        // 2️⃣ Get microphone
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        // 3️⃣ Set remote description (offer)
        await pc.setRemoteDescription(data.offer);

        // 4️⃣ Create answer
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        // 5️⃣ Save answer back to Firestore
        await setDoc(
          callRef,
          {
            answer,
            status: "connected",
          },
          { merge: true },
        );

        console.log("✅ Call accepted");
      }
    });

    return () => unsubscribe();
  }, [chatId, user]);

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
    if (!chatId || !user) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscribe();
  }, [chatId, user]);

  // 🔹 Send TEXT message
  const sendMessage = async () => {
    if (!newMessage.trim() || !chatId || !user) return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: newMessage,
      senderId: user.uid,
      createdAt: serverTimestamp(),
      type: "text",
    });

    setNewMessage("");
  };

  // 🔹 Send IMAGE message (🔥 CLOUDINARY ONLY 🔥)
  const sendImage = async () => {
    if (!imageFile || !chatId || !user) return;

    try {
      // 1️⃣ Upload image to Cloudinary
      const data = await uploadToCloudinary(imageFile, user.uid);

      // 2️⃣ Save image URL in Firestore
      await addDoc(collection(db, "chats", chatId, "messages"), {
        imageUrl: data.secure_url,
        senderId: user.uid,
        createdAt: serverTimestamp(),
        type: "image",
      });

      setImageFile(null);
    } catch (err) {
      console.error("Image send failed:", err);
      alert("Failed to send image");
    }
  };

  if (!profile || !user) return <p>Loading profile...</p>;

  const startCall = async () => {
    if (!chatId || !user) return;

    try {
      // 1️⃣ Create WebRTC connection
      const pc = createPeerConnection();

      // 2️⃣ Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // 3️⃣ Create offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // 4️⃣ Save offer to Firestore (signaling)
      await setDoc(doc(db, "chats", chatId, "calls", "activeCall"), {
        callerId: user.uid,
        receiverId: uid, // the profile you're chatting with
        type: "audio",
        status: "ringing",
        offer,
        createdAt: serverTimestamp(),
      });

      console.log("📞 Call started");
    } catch (err) {
      console.error("❌ Call failed FULL ERROR:", err);
      alert(err.message || "Call failed");
    }
  };

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

        <Button onClick={startCall}>📞 Call</Button>

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
