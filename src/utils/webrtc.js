import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export const createPeerConnection = (chatId, isCaller) => {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  const localCandidates = collection(
    db,
    "chats",
    chatId,
    "calls",
    "activeCall",
    isCaller ? "callerCandidates" : "receiverCandidates",
  );

  pc.onicecandidate = async (e) => {
    if (e.candidate) {
      await addDoc(localCandidates, e.candidate.toJSON());
    }
  };

  const remoteCandidates = collection(
    db,
    "chats",
    chatId,
    "calls",
    "activeCall",
    isCaller ? "receiverCandidates" : "callerCandidates",
  );

  onSnapshot(remoteCandidates, (snap) => {
    snap.docChanges().forEach((change) => {
      if (change.type === "added") {
        pc.addIceCandidate(new RTCIceCandidate(change.doc.data()));
      }
    });
  });

  return pc;
};
