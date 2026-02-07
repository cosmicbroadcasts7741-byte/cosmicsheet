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
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { Avatar, Typography, Grid, TextField, Button } from "@mui/material";
import { useAuth } from "../AuthProvider";
import { useEffect, useState, useRef } from "react";

import { createPeerConnection } from "../utils/webrtc";

/* 🔊 GLOBAL AUDIO */
const remoteAudio = new Audio();
remoteAudio.autoplay = true;

export default function UserProfile() {
  const { uid } = useParams();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const pcRef = useRef(null);

  const chatId =
    user && uid
      ? user.uid < uid
        ? `${user.uid}_${uid}`
        : `${uid}_${user.uid}`
      : null;

  /* 🔹 FETCH PROFILE */
  useEffect(() => {
    if (!uid) return;
    getDoc(doc(db, "users", uid)).then((snap) => {
      if (snap.exists()) setProfile(snap.data());
    });
  }, [uid]);

  /* 🔹 CHAT LISTENER */
  useEffect(() => {
    if (!chatId || !user) return;
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt"),
    );
    return onSnapshot(q, (s) => setMessages(s.docs.map((d) => d.data())));
  }, [chatId, user]);

  /* 📞 INCOMING CALL */
  useEffect(() => {
    if (!chatId || !user) return;

    const callRef = doc(db, "chats", chatId, "calls", "activeCall");

    const unsub = onSnapshot(callRef, async (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();

      if (
        data.receiverId === user.uid &&
        data.status === "ringing" &&
        !pcRef.current
      ) {
        const accept = window.confirm("📞 Incoming call. Accept?");
        if (!accept) return;

        const pc = createPeerConnection(chatId, false);
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
      }
    });

    return () => unsub();
  }, [chatId, user]);

  /* 👂 CALLER LISTENS FOR ANSWER */
  useEffect(() => {
    if (!chatId || !user) return;

    const callRef = doc(db, "chats", chatId, "calls", "activeCall");

    const unsub = onSnapshot(callRef, async (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();

      if (
        data.answer &&
        pcRef.current &&
        pcRef.current.signalingState !== "stable"
      ) {
        await pcRef.current.setRemoteDescription(data.answer);
      }
    });

    return () => unsub();
  }, [chatId, user]);

  /* ✉️ SEND MESSAGE */
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

  /* 📞 START CALL */
  const startCall = async () => {
    if (pcRef.current) return alert("Call already active");

    const pc = createPeerConnection(chatId, true);
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
              style={{
                textAlign: m.senderId === user.uid ? "right" : "left",
              }}
            >
              {m.text && <Typography>{m.text}</Typography>}
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
