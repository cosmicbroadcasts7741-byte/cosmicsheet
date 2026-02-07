import { db } from "../firebase";
import { doc, collection, addDoc, onSnapshot } from "firebase/firestore";

export const createPeerConnection = (chatId, isCaller) => {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  const callRef = doc(db, "chats", chatId, "calls", "activeCall");

  const localCandidatesRef = collection(
    callRef,
    isCaller ? "callerCandidates" : "receiverCandidates",
  );

  const remoteCandidatesRef = collection(
    callRef,
    isCaller ? "receiverCandidates" : "callerCandidates",
  );

  // 🔥 SEND ICE CANDIDATES
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      addDoc(localCandidatesRef, event.candidate.toJSON());
    }
  };

  // 🔥 RECEIVE ICE CANDIDATES
  onSnapshot(remoteCandidatesRef, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        pc.addIceCandidate(new RTCIceCandidate(change.doc.data()));
      }
    });
  });

  return pc;
};
