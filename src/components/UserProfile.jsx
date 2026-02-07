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
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { Avatar, Typography, Grid, TextField, Button } from "@mui/material";
import { useAuth } from "../AuthProvider";
import { useEffect, useState, useRef } from "react";
import { createPeerConnection } from "../utils/webrtc";

/* 🔊 GLOBAL AUDIO (IMPORTANT) */
const remoteAudio = new Audio();
remoteAudio.autoplay = true;
remoteAudio.playsInline = true;
remoteAudio.muted = false;

export default function UserProfile() {
  const { uid } = useParams();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [incomingCall, setIncomingCall] = useState(null);

  const pcRef = useRef(null);

  const chatId =
    user && uid
      ? user.uid < uid
        ? `${user.uid}_${uid}`
        : `${uid}_${user.uid}`
      : null;

  /* ================= CLEANUP ON UNMOUNT ================= */
  useEffect(() => {
    return () => {
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
    };
  }, []);

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    if (!uid) return;
    getDoc(doc(db, "users", uid)).then((snap) => {
      if (snap.exists()) setProfile(snap.data());
    });
  }, [uid]);

  /* ================= CHAT LISTENER ================= */
  useEffect(() => {
    if (!chatId || !user) return;
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt"),
    );
    return onSnapshot(q, (s) => setMessages(s.docs.map((d) => d.data())));
  }, [chatId, user]);

  /* ================= INCOMING CALL LISTENER ================= */
  useEffect(() => {
    if (!chatId || !user) return;

    const callRef = doc(db, "chats", chatId, "calls", "activeCall");

    return onSnapshot(callRef, (snap) => {
      if (!snap.exists()) return;

      const data = snap.data();

      if (
        data.receiverId === user.uid &&
        data.status === "ringing" &&
        !pcRef.current
      ) {
        setIncomingCall(data);
      }
    });
  }, [chatId, user]);

  /* ================= ACCEPT CALL ================= */
  const acceptCall = async () => {
    const pc = createPeerConnection();
    pcRef.current = pc;

    pc.ontrack = (e) => {
      remoteAudio.srcObject = e.streams[0];
      remoteAudio.play().catch(() => {});
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        addDoc(
          collection(
            db,
            "chats",
            chatId,
            "calls",
            "activeCall",
            "receiverCandidates",
          ),
          e.candidate.toJSON(),
        );
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => pc.addTrack(t, stream));

    await pc.setRemoteDescription(incomingCall.offer);

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    await setDoc(
      doc(db, "chats", chatId, "calls", "activeCall"),
      { answer, status: "connected" },
      { merge: true },
    );

    setIncomingCall(null);

    // listen caller ICE
    onSnapshot(
      collection(
        db,
        "chats",
        chatId,
        "calls",
        "activeCall",
        "callerCandidates",
      ),
      (snap) => {
        snap.docChanges().forEach((c) => {
          if (c.type === "added") {
            pc.addIceCandidate(c.doc.data());
          }
        });
      },
    );
  };

  /* ================= START CALL ================= */
  const startCall = async () => {
    if (pcRef.current) return alert("Call already active");

    const pc = createPeerConnection();
    pcRef.current = pc;

    pc.ontrack = (e) => {
      remoteAudio.srcObject = e.streams[0];
      remoteAudio.play().catch(() => {});
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        addDoc(
          collection(
            db,
            "chats",
            chatId,
            "calls",
            "activeCall",
            "callerCandidates",
          ),
          e.candidate.toJSON(),
        );
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => pc.addTrack(t, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    await setDoc(doc(db, "chats", chatId, "calls", "activeCall"), {
      callerId: user.uid,
      receiverId: uid,
      offer,
      status: "ringing",
      createdAt: serverTimestamp(),
    });

    // listen answer
    onSnapshot(
      doc(db, "chats", chatId, "calls", "activeCall"),
      async (snap) => {
        const data = snap.data();
        if (data?.answer && pc.signalingState !== "stable") {
          await pc.setRemoteDescription(data.answer);
        }
      },
    );

    // listen receiver ICE
    onSnapshot(
      collection(
        db,
        "chats",
        chatId,
        "calls",
        "activeCall",
        "receiverCandidates",
      ),
      (snap) => {
        snap.docChanges().forEach((c) => {
          if (c.type === "added") {
            pc.addIceCandidate(c.doc.data());
          }
        });
      },
    );
  };

  /* ================= END CALL ================= */
  const endCall = async () => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    await deleteDoc(doc(db, "chats", chatId, "calls", "activeCall"));
  };

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: newMessage,
      senderId: user.uid,
      createdAt: serverTimestamp(),
    });
    setNewMessage("");
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

        {incomingCall && (
          <Grid sx={{ mt: 2, p: 2, border: "2px solid red" }}>
            <Typography>📞 Incoming Call</Typography>
            <Button onClick={acceptCall} color="success" variant="contained">
              Accept
            </Button>
            <Button onClick={endCall} color="error" sx={{ ml: 1 }}>
              Reject
            </Button>
          </Grid>
        )}

        <Grid sx={{ border: "1px solid #ddd", height: 300, p: 2, mt: 2 }}>
          {messages.map((m, i) => (
            <Typography
              key={i}
              align={m.senderId === user.uid ? "right" : "left"}
            >
              {m.text}
            </Typography>
          ))}
        </Grid>

        <TextField
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          sx={{ mt: 1 }}
        />

        <Button fullWidth sx={{ mt: 1 }} onClick={sendMessage}>
          Send
        </Button>

        <Button sx={{ mt: 1 }} onClick={startCall}>
          📞 Call
        </Button>

        <Button sx={{ mt: 1, ml: 1 }} color="error" onClick={endCall}>
          End Call
        </Button>
      </Grid>
    </Grid>
  );
}
