"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, Volume2, Phone, MessageSquare, Send, RefreshCw } from "lucide-react"
import { Conversation } from "@11labs/client"
import { Loader } from "./Loader"
import { cn } from "../lib/utils"

interface CallTestingProps {
  agentId: string
}

type TestTab = "audio" | "llm"

const CallTesting: React.FC<CallTestingProps> = ({ agentId }) => {
  // Tab state
  const [activeTab, setActiveTab] = useState<TestTab>("audio")

  // Audio testing states
  const [conversation, setConversation] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // LLM chat testing states
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "(AI remains silent until user greets)" },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  const requestMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      setHasPermission(true)
      return true
    } catch (error) {
      console.error("Microphone permission denied:", error)
      setHasPermission(false)
      return false
    }
  }

  const toggleConversation = async () => {
    if (isConnected) {
      if (conversation) {
        await conversation.endSession()
        setConversation(null)
      }
    } else {
      setIsLoading(true)
      try {
        const permission = await requestMicrophonePermission()
        if (!permission) {
          alert("Microphone permission is required for the conversation.")
          return
        }

        const conv = await Conversation.startSession({
          agentId,
          onConnect: () => {
            console.log("Connected")
            setIsConnected(true)
          },
          onDisconnect: () => {
            console.log("Disconnected")
            setIsConnected(false)
            setIsSpeaking(false)
          },
          onError: (error) => {
            console.error("Conversation error:", error)
            alert("An error occurred during the conversation.")
          },
          onModeChange: (mode) => {
            console.log("Mode changed:", mode)
            setIsSpeaking(mode.mode === "speaking")
          },
        })

        setConversation(conv)
      } catch (error) {
        console.error("Error starting conversation:", error)
        alert("Failed to start conversation. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    try {
      setIsSending(true)

      // Add user message to chat
      setMessages((prev) => [...prev, { role: "user", content: inputMessage }])

      // Simulate API call to get agent response
      // In a real implementation, you would call your backend API here
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `This is a simulated response to: "${inputMessage}". In a real implementation, this would come from the agent API.`,
          },
        ])
        setIsSending(false)
      }, 1000)

      // Clear input
      setInputMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
      setIsSending(false)
    }
  }

  const handleNewChat = () => {
    setMessages([{ role: "assistant", content: "(AI remains silent until user greets)" }])
  }

  useEffect(() => {
    return () => {
      if (conversation) {
        conversation.endSession()
      }
    }
  }, [conversation])

  return (
    <div className="sticky top-8">
      <div className="bg-white dark:bg-dark-200 rounded-xl shadow-sm border border-gray-100 dark:border-dark-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-dark-100">
          <h2 className="text-lg font-heading font-bold text-gray-900 dark:text-white">Test Your Agent</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {activeTab === "audio"
              ? "Click the microphone to start a conversation"
              : "Send a message to test your agent"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-dark-100">
          <button
            onClick={() => setActiveTab("audio")}
            className={cn(
              "flex items-center justify-center space-x-2 px-6 py-3 text-sm font-medium transition-colors",
              activeTab === "audio"
                ? "text-primary dark:text-primary-400 border-b-2 border-primary dark:border-primary-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200",
            )}
          >
            <Phone className="w-4 h-4" />
            <span>Test Audio</span>
          </button>
          <button
            onClick={() => setActiveTab("llm")}
            className={cn(
              "flex items-center justify-center space-x-2 px-6 py-3 text-sm font-medium transition-colors",
              activeTab === "llm"
                ? "text-primary dark:text-primary-400 border-b-2 border-primary dark:border-primary-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200",
            )}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Test LLM</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "audio" ? (
            <div className="flex flex-col items-center">
              {/* Audio Testing UI - Existing functionality */}
              {hasPermission === false && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-6 py-4 bg-red-50 dark:bg-red-500/10 border-b border-red-100 dark:border-red-500/20 w-full mb-6"
                >
                  <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
                    <MicOff className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Microphone Access Required</p>
                      <p className="text-xs mt-0.5 text-red-500 dark:text-red-300">
                        Please allow microphone access to test the voice agent
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Status indicator */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <motion.div
                  animate={{ opacity: [0.5, 1] }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                    isLoading
                      ? "bg-gray-100 dark:bg-dark-100 text-gray-600 dark:text-gray-400"
                      : isConnected
                        ? isSpeaking
                          ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                          : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                        : "bg-gray-100 dark:bg-dark-100 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    className={`w-2 h-2 rounded-full mr-2 ${
                      isLoading
                        ? "bg-gray-500 dark:bg-gray-400"
                        : isConnected
                          ? isSpeaking
                            ? "bg-primary-500 dark:bg-primary-400"
                            : "bg-red-500 dark:bg-red-400"
                          : "bg-gray-500 dark:bg-gray-400"
                    }`}
                  />
                  {isLoading
                    ? "Initializing..."
                    : isConnected
                      ? isSpeaking
                        ? "Agent Speaking"
                        : "Listening..."
                      : "Ready"}
                </motion.div>
              </motion.div>

              {/* Main microphone button */}
              <motion.button
                onClick={toggleConversation}
                disabled={isLoading}
                className="relative outline-none group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Ripple effect */}
                <AnimatePresence>
                  {isConnected && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="absolute inset-0"
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.2],
                          opacity: [0.3, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeOut",
                        }}
                        className={`absolute inset-0 rounded-full ${
                          isSpeaking ? "bg-primary-500/20 dark:bg-primary-400/20" : "bg-red-500/20 dark:bg-red-400/20"
                        }`}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Main button background */}
                <motion.div
                  animate={{
                    scale: isSpeaking ? [1, 1.05, 1] : 1,
                  }}
                  transition={{
                    scale: {
                      duration: 1,
                      repeat: isSpeaking ? Number.POSITIVE_INFINITY : 0,
                      ease: "easeInOut",
                    },
                  }}
                  className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isLoading
                      ? "bg-gray-100 dark:bg-dark-100"
                      : isConnected
                        ? isSpeaking
                          ? "bg-primary shadow-lg shadow-primary/30 dark:shadow-primary/20"
                          : "bg-red-500 shadow-lg shadow-red-500/30 dark:shadow-red-500/20"
                        : "bg-gray-100 dark:bg-dark-100 shadow-lg hover:shadow-xl hover:bg-gray-200 dark:hover:bg-dark-50"
                  }`}
                >
                  {/* Icon container */}
                  <motion.div
                    animate={{
                      scale: isConnected ? [1, 1.1, 1] : 1,
                    }}
                    transition={{
                      duration: 1,
                      repeat: isConnected ? Number.POSITIVE_INFINITY : 0,
                      ease: "easeInOut",
                    }}
                    className={`transition-colors duration-300 ${
                      isLoading
                        ? "text-gray-400 dark:text-gray-500"
                        : isConnected
                          ? "text-white"
                          : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400"
                    }`}
                  >
                    {isLoading ? (
                      <Loader />
                    ) : isSpeaking ? (
                      <Volume2 className="w-8 h-8" />
                    ) : (
                      <Mic className="w-8 h-8" />
                    )}
                  </motion.div>
                </motion.div>
              </motion.button>

              {/* End Call Button */}
              {isConnected && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  onClick={toggleConversation}
                  className="mt-6 flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm font-medium">End Call</span>
                </motion.button>
              )}
            </div>
          ) : (
            <div className="flex flex-col h-[500px]">
              {/* LLM Chat Testing UI */}
              <div className="flex items-center justify-between mb-3 px-2">
                <button
                  onClick={handleNewChat}
                  className="flex items-center space-x-1 text-xs text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>New test chat</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 px-2">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-3 rounded-lg max-w-[85%]",
                      message.role === "user"
                        ? "bg-primary text-white ml-auto"
                        : "bg-gray-100 dark:bg-dark-100 text-gray-800 dark:text-gray-200",
                    )}
                  >
                    {message.content}
                  </div>
                ))}
              </div>

              {/* Message input */}
              <div className="flex items-center space-x-2 mt-auto">
                <button className="p-2 rounded-full bg-gray-100 dark:bg-dark-100 text-gray-500 dark:text-gray-400">
                  <RefreshCw className="w-5 h-5" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full px-4 py-2 rounded-full border border-gray-200 dark:border-dark-100 bg-white dark:bg-dark-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-400"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage()
                      }
                    }}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={isSending || !inputMessage.trim()}
                  className={cn(
                    "p-2 rounded-full bg-primary text-white",
                    (isSending || !inputMessage.trim()) && "opacity-50 cursor-not-allowed",
                  )}
                >
                  {isSending ? <Loader /> : <Send className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CallTesting
