// src/pages/Chat.jsx
import React, { useEffect, useState, useRef } from "react";
import { getAllMessages, sendMessage } from "../services/api";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("pmapp_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const res = await getAllMessages();
      if (res.status === 200) {
        const sorted = res.data.sort(
          (a, b) => new Date(a.sentAt) - new Date(b.sentAt)
        );
        setMessages(sorted);
      }
    } catch (err) {
      console.error("Error fetching chat:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const msg = {
      sender: user.name,
      message: input.trim(),
    };

    try {
      await sendMessage(msg);
      setInput("");
      fetchMessages();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between shadow">
        <h2 className="text-lg font-semibold">💬 Team Chat</h2>
        {user && (
          <span className="text-sm opacity-90">
            Logged in as <strong>{user.name}</strong>
          </span>
        )}
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {loading ? (
          <p className="text-gray-500 text-center">Loading chat...</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            No messages yet. Start the conversation! 💬
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === user?.name ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl shadow ${
                  msg.sender === user?.name
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none border"
                }`}
              >
                <p className="text-xs font-semibold mb-1 opacity-80">
                  {msg.sender}
                </p>
                <p className="wrap-break-word">{msg.message}</p>
                <span className="block text-[10px] mt-1 text-gray-300 text-right">
                  {new Date(msg.sentAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={handleSend}
        className="p-4 bg-white border-t flex items-center gap-3 shadow-inner"
      >
        <input
          type="text"
          className="flex-1 px-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 shadow"
        >
          Send
        </button>
      </form>
    </div>
  );
}
