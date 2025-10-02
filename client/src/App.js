import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import styles from "./style.module.css";

function App() {
  const messagesEndRef = useRef();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loader, setLoader] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setInput("");
    setMessages((prev) => [...prev, userMessage]);
    setLoader(true);
    try {
      const res = await axios.post("http://localhost:8000/api/chat", {
        message: userMessage.content,
      });

      if (res?.data?.reply) {
        const botMessage = { role: "assistant", content: res.data.reply };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        role: "assistant",
        content: error?.response?.data?.error || "Something went wrong",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoader(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={styles.container}>
      <h2>ChatGPT Clone</h2>
      <div className={styles.msgDiv}>
        {messages?.length === 0 ? (
          <p className={styles.initialText}>
            Hi, I'm a Chat Bot. What can I help you with today?
          </p>
        ) : (
          messages?.map((msg, i) => (
            <div
              key={i}
              className={`${styles.msgWrapper} ${
                msg.role === "user" ? styles.user : "assistant"
              }`}
            >
              <div
                className={styles.msgInnerDiv}
                style={{
                  backgroundColor: msg.role === "user" ? "#e3f2fd" : "#f5f5f5",
                }}
              >
                <p>
                  <strong>{msg.role === "user" ? "You" : "Chat Bot"}</strong>
                </p>
                {msg.content.split("\n").map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputBar}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className={styles.searchBar}
          placeholder="Ask anything..."
        />
        <button onClick={sendMessage} className={styles.btnStyle}>
          {loader ? "Loading..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default App;
