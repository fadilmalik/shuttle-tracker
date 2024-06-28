// src/components/Chat.js
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Report.css";
import backgroundImage from "./assets/background.png";
import backButton from "./assets/icon/back-button.png";
import { firestore } from "./config/firebase";

const Chat = () => {
  const location = useLocation();
  const chatId = location.state?.chatId;
  const sender = location.state?.sender === "admin" ? "admin" : "customer";
  const authenticated = location.state?.authenticated || false;

  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  if (!chatId) {
    navigate("/");
  }
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
      // Reference to the chat document
      const chatRef = doc(firestore, `chats/${chatId}`);

      // Set or update the chat document with any initial fields you need
      // For example, setting a 'createdAt' timestamp or initializing other fields
      await setDoc(
        chatRef,
        {
          id: chatId,
          createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
          lastMessage: message,
        },
        { merge: true }
      ); // Merge ensures existing fields are not overwritten

      await addDoc(collection(firestore, `chats/${chatId}/messages`), {
        text: message,
        timestamp: serverTimestamp(),
        sender: sender,
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
          onClick={() => navigate(-1)}
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
        <h2>{sender === "admin" ? "Admin" : "Customer"} Service</h2>
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
          <div
            id="chat-container"
            style={{
              width: "100%",
              maxWidth: "500px",
              padding: "20px",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: "10px",
            }}
          >
            <input
              type="text"
              id="message-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              style={{
                width: "100%",
                padding: "10px",
                boxSizing: "border-box",
                borderRadius: "5px",
                border: "none",
                marginBottom: "10px",
              }}
            />
            <button
              id="send-button"
              onClick={sendMessage}
              style={{
                padding: "10px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                // bring to rught
                float: "right",
              }}
            >
              Send
            </button>
            <div
              id="chat-box"
              style={{
                marginTop: "20px",
                height: "75vh", // Set a fixed height
                overflowY: "auto", // Enable vertical scrolling
              }}
            >
              {messages.map((msg, index) => (
                <div key={index}>
                  <strong>
                    {msg.sender === "customer"
                      ? authenticated
                        ? "Customer"
                        : "You"
                      : "Admin"}
                    :
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
