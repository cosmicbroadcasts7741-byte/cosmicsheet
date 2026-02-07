import { collection, addDoc, onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";

export const createPeerConnection = (chatId, isCaller) => {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  const candidatesRef = collection(
    db,
    "chats",
    chatId,
    "calls",
    "activeCall",
    isCaller ? "callerCandidates" : "receiverCandidates",
  );

  pc.onicecandidate = async (event) => {
    if (event.candidate) {
      await addDoc(candidatesRef, event.candidate.toJSON());
    }
  };

  const remoteCandidatesRef = collection(
    db,
    "chats",
    chatId,
    "calls",
    "activeCall",
    isCaller ? "receiverCandidates" : "callerCandidates",
  );

  onSnapshot(remoteCandidatesRef, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        pc.addIceCandidate(new RTCIceCandidate(change.doc.data()));
      }
    });
  });

  return pc;
};
