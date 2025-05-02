"use client"

import type React from "react"
import { useState } from "react"
import {
  Phone,
  ChevronDown,
  ChevronUp,
  Shield,
  Webhook,
  BarChart2,
  Database,
  Mic,
  Plus,
  Settings,
  HelpCircle,
} from "lucide-react"
import { cn } from "../lib/utils"

interface AgentSettingsProps {
  agentId: string
}

type SettingSection =
  | "functions"
  | "knowledgeBase"
  | "speechSettings"
  | "callSettings"
  | "postCallAnalysis"
  | "securitySettings"
  | "webhookSettings"

const AgentSettings: React.FC<AgentSettingsProps> = ({ agentId }) => {
  const [expandedSections, setExpandedSections] = useState<SettingSection[]>(["callSettings"])

  const toggleSection = (section: SettingSection) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const isSectionExpanded = (section: SettingSection) => {
    return expandedSections.includes(section)
  }

  return (
    <div className="bg-white dark:bg-dark-200 rounded-xl shadow-sm border border-gray-100 dark:border-dark-100 overflow-hidden">
      {/* Functions Section */}
      <SectionHeader
        icon={<Settings className="w-5 h-5" />}
        title="Functions"
        isExpanded={isSectionExpanded("functions")}
        onClick={() => toggleSection("functions")}
      />
      {isSectionExpanded("functions") && (
        <div className="p-6 border-b border-gray-200 dark:border-dark-100">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Enable your agent with capabilities such as calendar bookings, call termination, etc.
          </p>
          <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-dark-100 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-50 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      )}

      {/* Knowledge Base Section */}
      <SectionHeader
        icon={<Database className="w-5 h-5" />}
        title="Knowledge Base"
        isExpanded={isSectionExpanded("knowledgeBase")}
        onClick={() => toggleSection("knowledgeBase")}
      />
      {isSectionExpanded("knowledgeBase") && (
        <div className="p-6 border-b border-gray-200 dark:border-dark-100">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Add knowledge base to provide context to the agent.
          </p>
          <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-dark-100 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-50 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      )}

      {/* Speech Settings Section */}
      <SectionHeader
        icon={<Mic className="w-5 h-5" />}
        title="Speech Settings"
        isExpanded={isSectionExpanded("speechSettings")}
        onClick={() => toggleSection("speechSettings")}
      />
      {isSectionExpanded("speechSettings") && (
        <div className="p-6 border-b border-gray-200 dark:border-dark-100 space-y-6">
          {/* Background Sound */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Background Sound</label>
            </div>
            <div className="flex items-center">
              <div className="relative flex-1">
                <select className="w-full p-2.5 bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-dark-100 rounded-lg text-gray-900 dark:text-white appearance-none">
                  <option>None</option>
                  <option>Office</option>
                  <option>Cafe</option>
                  <option>Nature</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </div>
              <button className="p-2 ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Responsiveness */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <label className="text-sm font-medium text-gray-900 dark:text-white mr-2">Responsiveness</label>
                <HelpCircle className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">1</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              Control how fast the agent responds after users finish speaking.
            </p>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                defaultValue="1"
                className="w-full h-2 bg-gray-200 dark:bg-dark-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Interruption Sensitivity */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <label className="text-sm font-medium text-gray-900 dark:text-white mr-2">
                  Interruption Sensitivity
                </label>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">0.8</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              Control how sensitively AI can be interrupted by human speech.
            </p>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                defaultValue="0.8"
                className="w-full h-2 bg-gray-200 dark:bg-dark-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Enable Backchanneling */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Enable Backchanneling</label>
              <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-dark-100 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-dark-100 peer-checked:bg-primary"></div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Enables the agent to use affirmations like 'yeah' or 'uh-huh' during conversations, indicating active
              listening and engagement.
            </p>
          </div>

          {/* Transcription Mode */}
          <div>
            <div className="mb-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Transcription Mode</label>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Balance between speed and accuracy.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="optimize-speed"
                  type="radio"
                  name="transcription-mode"
                  defaultChecked
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary dark:focus:ring-primary-400 dark:ring-offset-dark-200 focus:ring-2 dark:bg-dark-100 dark:border-dark-100"
                />
                <label htmlFor="optimize-speed" className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                  Optimize for speed
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="optimize-accuracy"
                  type="radio"
                  name="transcription-mode"
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary dark:focus:ring-primary-400 dark:ring-offset-dark-200 focus:ring-2 dark:bg-dark-100 dark:border-dark-100"
                />
                <label htmlFor="optimize-accuracy" className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                  Optimize for accuracy
                </label>
                <HelpCircle className="w-4 h-4 text-gray-400 dark:text-gray-500 ml-2" />
              </div>
            </div>
          </div>

          {/* Boosted Keywords */}
          <div>
            <div className="mb-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Boosted Keywords</label>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Provide a customized list of keywords to expand our models' vocabulary.
              </p>
            </div>
            <input
              type="text"
              placeholder="Split by comma. Example: Retell,Walmart"
              className="w-full p-2.5 bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-dark-100 rounded-lg text-gray-900 dark:text-white"
            />
          </div>

          {/* Enable Speech Normalization */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <label className="text-sm font-medium text-gray-900 dark:text-white mr-2">
                  Enable Speech Normalization
                </label>
                <HelpCircle className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-dark-100 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-dark-100 peer-checked:bg-primary"></div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              It converts text elements like numbers, currency, and dates into human-like spoken forms.{" "}
              <a href="#" className="text-primary dark:text-primary-400">
                Learn more
              </a>
            </p>
          </div>

          {/* Enable Transcript Formatting */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Enable Transcript Formatting</label>
              <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-dark-100 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-dark-100 peer-checked:bg-primary"></div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Prevent agent errors like phone numbers being formatted as timestamps.
            </p>
          </div>

          {/* Reminder Message Frequency */}
          <div>
            <div className="mb-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Reminder Message Frequency</label>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Control how often AI will send a reminder message.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                defaultValue="10"
                min="1"
                className="w-16 p-2 bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-dark-100 rounded-lg text-gray-900 dark:text-white"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">seconds</span>
              <input
                type="number"
                defaultValue="1"
                min="1"
                className="w-16 p-2 bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-dark-100 rounded-lg text-gray-900 dark:text-white"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">times</span>
            </div>
          </div>

          {/* Pronunciation */}
          <div>
            <div className="mb-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Pronunciation</label>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Guide the model to pronounce a word, name, or phrase in a specific way.{" "}
                <a href="#" className="text-primary dark:text-primary-400">
                  Learn more
                </a>
              </p>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-dark-100 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-50 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>
      )}

      {/* Call Settings Section */}
      <SectionHeader
        icon={<Phone className="w-5 h-5" />}
        title="Call Settings"
        isExpanded={isSectionExpanded("callSettings")}
        onClick={() => toggleSection("callSettings")}
      />
      {isSectionExpanded("callSettings") && (
        <div className="p-6 border-b border-gray-200 dark:border-dark-100 space-y-6">
          {/* Voicemail Detection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Voicemail Detection</label>
              <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-dark-100 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-dark-100 peer-checked:bg-primary"></div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Hang up or leave a voicemail if a voicemail is detected.
            </p>
          </div>

          {/* End Call on Silence */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">End Call on Silence</label>
              <span className="text-sm font-medium text-gray-900 dark:text-white">10.0 m</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="20"
                step="0.5"
                defaultValue="10"
                className="w-full h-2 bg-gray-200 dark:bg-dark-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Max Call Duration */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Max Call Duration</label>
              <span className="text-sm font-medium text-gray-900 dark:text-white">1.00 h</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="2"
                step="0.05"
                defaultValue="1"
                className="w-full h-2 bg-gray-200 dark:bg-dark-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Pause Before Speaking */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Pause Before Speaking</label>
              <span className="text-sm font-medium text-gray-900 dark:text-white">0 s</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              The duration before the assistant starts speaking at the beginning of the call.
            </p>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                defaultValue="0"
                className="w-full h-2 bg-gray-200 dark:bg-dark-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Ring Duration */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Ring Duration</label>
              <span className="text-sm font-medium text-gray-900 dark:text-white">30 s</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              The max ringing duration before the outbound call / transfer call is deemed no answer.
            </p>
            <div className="relative">
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                defaultValue="30"
                className="w-full h-2 bg-gray-200 dark:bg-dark-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Post-Call Analysis Section */}
      <SectionHeader
        icon={<BarChart2 className="w-5 h-5" />}
        title="Post-Call Analysis"
        isExpanded={isSectionExpanded("postCallAnalysis")}
        onClick={() => toggleSection("postCallAnalysis")}
      />
      {isSectionExpanded("postCallAnalysis") && (
        <div className="p-6 border-b border-gray-200 dark:border-dark-100">
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-900 dark:text-white">Post Call Data Retrieval</label>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Define the information that you need to extract from the call.{" "}
              <a href="#" className="text-primary dark:text-primary-400">
                Learn more
              </a>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-dark-100 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-50 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
            <div className="relative flex-1">
              <select className="w-full p-2.5 bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-dark-100 rounded-lg text-gray-900 dark:text-white appearance-none">
                <option>GPT-4o Mini</option>
                <option>GPT-4o</option>
                <option>Claude 3 Opus</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security & Fallback Settings Section */}
      <SectionHeader
        icon={<Shield className="w-5 h-5" />}
        title="Security & Fallback Settings"
        isExpanded={isSectionExpanded("securitySettings")}
        onClick={() => toggleSection("securitySettings")}
      />
      {isSectionExpanded("securitySettings") && (
        <div className="p-6 border-b border-gray-200 dark:border-dark-100 space-y-6">
          {/* Opt Out Sensitive Data Storage */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <label className="text-sm font-medium text-gray-900 dark:text-white mr-2">
                  Opt Out Sensitive Data Storage
                </label>
                <HelpCircle className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-dark-100 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-dark-100 peer-checked:bg-primary"></div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Control whether Retell should store sensitive data.{" "}
              <a href="#" className="text-primary dark:text-primary-400">
                Learn more
              </a>
            </p>
          </div>

          {/* Opt In Secure URLs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <label className="text-sm font-medium text-gray-900 dark:text-white mr-2">Opt In Secure URLs</label>
                <HelpCircle className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-dark-100 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-dark-100 peer-checked:bg-primary"></div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Add security signatures to URLs. The URLs expire after 24 hours.{" "}
              <a href="#" className="text-primary dark:text-primary-400">
                Learn more
              </a>
            </p>
          </div>

          {/* Fallback Voice ID */}
          <div>
            <div className="mb-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Fallback Voice ID</label>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                If the current voice provider fails, assign a fallback voice to continue the call.
              </p>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-dark-100 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-50 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          {/* Default Dynamic Variables */}
          <div>
            <div className="mb-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Default Dynamic Variables</label>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Set fallback values for dynamic variables across all endpoints if they are not provided.
              </p>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-dark-100 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-50 transition-colors">
              <Settings className="w-4 h-4" />
              <span>Set Up</span>
            </button>
          </div>
        </div>
      )}

      {/* Webhook Settings Section */}
      <SectionHeader
        icon={<Webhook className="w-5 h-5" />}
        title="Webhook Settings"
        isExpanded={isSectionExpanded("webhookSettings")}
        onClick={() => toggleSection("webhookSettings")}
      />
      {isSectionExpanded("webhookSettings") && (
        <div className="p-6 border-b border-gray-200 dark:border-dark-100 space-y-6">
          {/* Inbound Call Webhook URL */}
          <div>
            <div className="mb-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Inbound Call Webhook URL</label>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                The webhook has been migrated to phone level webhook.{" "}
                <a href="#" className="text-primary dark:text-primary-400">
                  Learn more
                </a>
              </p>
            </div>
            <input
              type="text"
              placeholder="Enter webhook URL"
              className="w-full p-2.5 bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-dark-100 rounded-lg text-gray-900 dark:text-white"
            />
          </div>

          {/* Agent Level Webhook URL */}
          <div>
            <div className="mb-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Agent Level Webhook URL</label>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Webhook URL to receive events from Retell.{" "}
                <a href="#" className="text-primary dark:text-primary-400">
                  Learn more
                </a>
              </p>
            </div>
            <input
              type="text"
              placeholder="Enter webhook URL"
              className="w-full p-2.5 bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-dark-100 rounded-lg text-gray-900 dark:text-white"
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Section Header Component
const SectionHeader: React.FC<{
  icon: React.ReactNode
  title: string
  isExpanded: boolean
  onClick: () => void
}> = ({ icon, title, isExpanded, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between p-4 text-left transition-colors",
        isExpanded
          ? "bg-gray-50 dark:bg-dark-100 border-b border-gray-200 dark:border-dark-100"
          : "hover:bg-gray-50 dark:hover:bg-dark-100 border-b border-gray-200 dark:border-dark-100",
      )}
    >
      <div className="flex items-center space-x-3">
        <div
          className={cn(
            "text-primary dark:text-primary-400",
            isExpanded ? "text-primary-600 dark:text-primary-300" : "",
          )}
        >
          {icon}
        </div>
        <h3
          className={cn(
            "text-base font-medium",
            isExpanded ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300",
          )}
        >
          {title}
        </h3>
      </div>
      {isExpanded ? (
        <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      )}
    </button>
  )
}

export default AgentSettings
