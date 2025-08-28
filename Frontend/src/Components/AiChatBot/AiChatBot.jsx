import { useState } from "react";
import summuryAPI from "../../Common/index";

export default function AiChatBot() {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    try {
      const res = await fetch(summuryAPI.aiChat.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Sorry, something went wrong." },
      ]);
    }

    setInput("");
  };

  return (
    <div>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full shadow-lg transition duration-300 font-semibold z-50"
        >
          Ask AI 🤖
        </button>
      )}

      {/* Small Popup Chat */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-72 h-96 bg-white shadow-xl rounded-xl flex flex-col border border-gray-200 z-40">
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 font-semibold flex justify-between items-center rounded-t-xl">
            <span>AI Assistant 🤖</span>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:text-gray-200 text-sm font-medium"
            >
              ✖
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50 space-y-2 text-sm">
            {messages.length === 0 && (
              <p className="text-gray-500 text-center mt-10">
                👋 Hi! How can I help you today?
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-xl max-w-[75%] shadow ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-900 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-2 border-t bg-white flex">
            <input
              className="flex-1 border rounded-l-lg p-2 text-sm focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-lg"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
