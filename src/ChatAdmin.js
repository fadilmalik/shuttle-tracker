import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import backgroundImage from "./assets/background.png";
import backButton from "./assets/icon/back-button.png";
import { firestore } from "./firebase"; // Adjust this import according to your actual firebase config file's location

const ChatAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authenticated = location.state?.authenticated || false;
  const [chats, setChats] = useState([]);

  if (!authenticated) {
    navigate("/login");
  }

  useEffect(() => {
    const q = query(
      collection(firestore, "chats"),
      orderBy("createdAt", "desc")
    );
    // loaded all documents from the "chats" collection

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedChats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("loadedChats", loadedChats);
      setChats(loadedChats);
    });

    return () => unsubscribe();
  }, []);

  const navigateToChat = (chatId) => {
    navigate("/chat-customer", { state: { chatId: chatId, sender: "admin" } });
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
        <h2>Admin Service</h2>
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
            style={{
              width: "100%",
              maxWidth: "500px",
              padding: "20px",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: "10px",
            }}
          >
            <h1
              style={{
                textAlign: "center",
                fontSize: "1.5rem",
                marginBottom: "20px",
              }}
            >
              All Chats
            </h1>
            <ul>
              {chats.map((chat) => (
                <li
                  key={chat.id}
                  onClick={() => navigateToChat(chat.id)}
                  style={{
                    cursor: "pointer",
                    padding: "10px",
                    margin: "10px 0",
                    borderRadius: "5px",
                    border: "1px solid #000",
                  }}
                >
                  Date: {chat.createdAt}
                  <br /> Last Message: {chat.lastMessage}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAdmin;
