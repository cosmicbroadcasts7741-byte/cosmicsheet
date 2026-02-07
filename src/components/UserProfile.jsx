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
import { useEffect, useState, useRef } from "react";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";
import { setDoc } from "firebase/firestore";
import { createPeerConnection } from "../utils/webrtc";

/* 🔊 GLOBAL AUDIO ELEMENT */
const remoteAudio = new Audio();
remoteAudio.autoplay = true;
remoteAudio.muted = false;

export default function UserProfile() {
  const { uid } = useParams();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  /* 🧠 STORE PEER CONNECTION */
  const pcRef = useRef(null);

  const chatId =
    user && uid
      ? user.uid < uid
        ? `${user.uid}_${uid}`
        : `${uid}_${user.uid}`
      : null;

  /* 📞 LISTEN FOR INCOMING CALL */
  useEffect(() => {
    if (!chatId || !user) return;

    const callRef = doc(db, "chats", chatId, "calls", "activeCall");

    const unsubscribe = onSnapshot(callRef, async (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      if (!data) return;

      if (data.receiverId === user.uid && data.status === "ringing") {
        const accept = window.confirm("📞 Incoming call. Accept?");
        if (!accept) return;

        if (pcRef.current) return;

        const pc = createPeerConnection();
        pcRef.current = pc;

        pc.ontrack = (e) => {
          remoteAudio.srcObject = e.streams[0];
          remoteAudio.play().catch(() => {});
        };

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        stream.getTracks().forEach((t) => pc.addTrack(t, stream));

        await pc.setRemoteDescription(data.offer);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        await setDoc(callRef, { answer, status: "connected" }, { merge: true });

        console.log("✅ Call accepted");
      }
    });

    return () => unsubscribe();
  }, [chatId, user]);

  /* 👂 CALLER LISTENS FOR ANSWER */
  useEffect(() => {
    if (!chatId || !user) return;

    const callRef = doc(db, "chats", chatId, "calls", "activeCall");

    const unsub = onSnapshot(callRef, async (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      if (!data) return;

      if (
        data.answer &&
        pcRef.current &&
        pcRef.current.signalingState !== "stable"
      ) {
        await pcRef.current.setRemoteDescription(data.answer);
        console.log("🔗 Call connected (caller)");
      }
    });

    return () => unsub();
  }, [chatId, user]);

  /* FETCH PROFILE */
  useEffect(() => {
    if (!uid) return;
    getDoc(doc(db, "users", uid)).then((snap) => {
      if (snap.exists()) setProfile(snap.data());
    });
  }, [uid]);

  /* CHAT LISTENER */
  useEffect(() => {
    if (!chatId || !user) return;
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt"),
    );
    return onSnapshot(q, (s) => setMessages(s.docs.map((d) => d.data())));
  }, [chatId, user]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: newMessage,
      senderId: user.uid,
      createdAt: serverTimestamp(),
      type: "text",
    });
    setNewMessage("");
  };

  const sendImage = async () => {
    const data = await uploadToCloudinary(imageFile, user.uid);
    await addDoc(collection(db, "chats", chatId, "messages"), {
      imageUrl: data.secure_url,
      senderId: user.uid,
      createdAt: serverTimestamp(),
      type: "image",
    });
    setImageFile(null);
  };

  /* 📞 START CALL */
  const startCall = async () => {
    if (pcRef.current) return;

    const pc = createPeerConnection();
    pcRef.current = pc;

    pc.ontrack = (e) => {
      remoteAudio.srcObject = e.streams[0];
      remoteAudio.play().catch(() => {});
    };

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => pc.addTrack(t, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    await setDoc(doc(db, "chats", chatId, "calls", "activeCall"), {
      callerId: user.uid,
      receiverId: uid,
      type: "audio",
      status: "ringing",
      offer,
      createdAt: serverTimestamp(),
    });

    console.log("📞 Call started");
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <Grid container justifyContent="center" sx={{ mt: 4 }}>
      <Grid item xs={10} md={6}>
        <Avatar
          src={profile.photoURL}
          sx={{ width: 90, height: 90, mx: "auto" }}
        />
        <Typography align="center" variant="h6">
          {profile.firstName}
        </Typography>

        <Grid
          sx={{
            border: "1px solid #ddd",
            height: 300,
            overflowY: "auto",
            p: 2,
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{ textAlign: m.senderId === user.uid ? "right" : "left" }}
            >
              {m.text && <Typography>{m.text}</Typography>}
              {m.imageUrl && <img src={m.imageUrl} width="60%" />}
            </div>
          ))}
        </Grid>

        <TextField
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button fullWidth onClick={sendMessage}>
          Send
        </Button>

        <Button onClick={startCall}>📞 Call</Button>
      </Grid>
    </Grid>
  );
}
