// src/components/Chat.js
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Report.css";
import backgroundImage from "./assets/background.png";
import backButton from "./assets/icon/back-button.png";
import { firestore } from "./firebase";

const Chat = () => {
  const location = useLocation();
  const chatId = location.state?.chatId;
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const q = query(
      collection(firestore, `chats/${chatId}/messages`),
      orderBy("timestamp")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
    });
    console.log("chatId", chatId);
    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (message.trim()) {
      await addDoc(collection(firestore, `chats/${chatId}/messages`), {
        text: message,
        timestamp: serverTimestamp(),
        sender: "customer",
        chatId: chatId,
      });
      setMessage("");
    }
  };

  return (
    <div
      style={{
        fontFamily: "Coiny, sans-serif",
      }}
    >
      <div className="aboutus-header" style={{ position: "relative" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            position: "absolute",
            top: "50%",
            left: "10px",
            transform: "translateY(-50%)",
            backgroundColor: "transparent",
            border: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <img
            src={backButton}
            alt="back"
            style={{
              width: "30px",
            }}
          />
        </button>
        <h2>Customer Service</h2>
      </div>
      <div
        className="about-us"
        style={{
          padding: "10px",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100vw",
          height: "100vh",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // padding: "50px",
          }}
        >
          <div id="chat-container">
            <input
              type="text"
              id="message-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button id="send-button" onClick={sendMessage}>
              Send
            </button>
            <div id="chat-box">
              {messages.map((msg, index) => (
                <div key={index}>
                  <strong>
                    {msg.sender === "customer" ? "You" : "Admin"}:
                  </strong>{" "}
                  {msg.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
