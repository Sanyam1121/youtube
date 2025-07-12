import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

export function ChatInterface() {
  const [selectedConversation, setSelectedConversation] = useState<Id<"conversations"> | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const conversations = useQuery(api.chat.getConversations) || [];
  const messages = useQuery(
    api.chat.getMessages,
    selectedConversation ? { conversationId: selectedConversation } : "skip"
  ) || [];
  
  const createConversation = useMutation(api.chat.createConversation);
  const sendMessage = useMutation(api.chat.sendMessage);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleNewConversation = async () => {
    const title = `Chat ${new Date().toLocaleDateString()}`;
    const conversationId = await createConversation({ title });
    setSelectedConversation(conversationId);
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversation || isLoading) return;
    
    setIsLoading(true);
    try {
      await sendMessage({
        conversationId: selectedConversation,
        content: messageInput.trim(),
      });
      setMessageInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={handleNewConversation}
            className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          >
            + New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <button
              key={conversation._id}
              onClick={() => setSelectedConversation(conversation._id)}
              className={`w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                selectedConversation === conversation._id ? "bg-blue-50 border-l-4 border-l-primary" : ""
              }`}
            >
              <div className="truncate text-sm font-medium">{conversation.title}</div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(conversation._creationTime).toLocaleDateString()}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <div className="text-4xl mb-4">🤖</div>
                  <p>Start a conversation with your AI assistant!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.role === "user"
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className={`text-xs mt-1 ${
                        message.role === "user" ? "text-blue-100" : "text-gray-500"
                      }`}>
                        {new Date(message._creationTime).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                      <span>AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim() || isLoading}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-2xl font-semibold mb-2">Welcome to AI Chat</h2>
              <p className="mb-4">Select a conversation or start a new one to begin chatting</p>
              <button
                onClick={handleNewConversation}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
              >
                Start New Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
