"use client"

import { useCallback, useEffect, useState } from "react"

const ChatWootWidget = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const toggleChat = useCallback(() => {
        setIsChatOpen((prev) => !prev);
    }, []);

    useEffect(() => {
        const webhookUrl = import.meta.env.VITE_N8N_CHAT_WEBHOOK_URL
        // Import CSS for n8n chat
        const link = document.createElement("link")
        link.href = "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css"
        link.rel = "stylesheet"
        document.head.appendChild(link)

        // Add custom CSS for professional blue color scheme
        const style = document.createElement("style")
        style.textContent = `
            /* Import Inter (modern, clean) */
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');

            /* CSS Variables */
            :root {
                --chat--color-primary: #0ea5e9;
                --chat--color-header: #91aab5;
                --chat--color-primary-hover: #0284c7;
                --chat--color-primary-active: #0369a1;
                --chat--color-secondary: #38bdf8;
                --chat--color-accent: #06b6d4;
                --chat--color-white: #ffffff;
                --chat--color-light: #f8fafc;
                --chat--color-gray-50: #f8fafc;
                --chat--color-gray-100: #f1f5f9;
                --chat--color-gray-200: #e2e8f0;
                --chat--color-gray-300: #cbd5e1;
                --chat--color-gray-400: #94a3b8;
                --chat--color-gray-500: #64748b;
                --chat--color-gray-600: #475569;
                --chat--color-gray-700: #334155;
                --chat--color-gray-800: #1e293b;
                --chat--color-gray-900: #0f172a;
                
                --chat--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
                --chat--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                --chat--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
                --chat--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

                --chat--window--width: 420px;
                --chat--window--height: 680px;
                --chat--border-radius: 20px;
                --chat--border-radius-sm: 16px;
                --chat--border-radius-lg: 24px;
            }

            /* Global Chat Styles */
            .n8n-chat {
                /* Use Inter as the primary modern UI font with sensible fallbacks */
                font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
                font-size: 15px;
                line-height: 1.5;
                color: var(--chat--color-gray-800);
                font-weight: 400;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }

            /* Chat Window */
            .n8n-chat .chat-window {
                border-radius: var(--chat--border-radius);
                box-shadow: var(--chat--shadow-xl);
                overflow: hidden;
                background: var(--chat--color-white);
                backdrop-filter: blur(10px);
                width: var(--chat--window--width) !important;
                max-height: var(--chat--window--height) !important;
            }

            /* Chat Header - Modern style like in the image */
            .n8n-chat .chat-header {
                background: linear-gradient(135deg, #91aab5 0%, #38bdf8 100%);
                color: var(--chat--color-white);
                padding: 1.25rem 1.25rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-height: 70px;
                position: relative;
                overflow: hidden;
                border-radius: var(--chat--border-radius) var(--chat--border-radius) 0 0;
                box-shadow: 0 2px 10px rgba(14, 165, 233, 0.1);
            }

            .n8n-chat .chat-header .header-left {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                z-index: 2;
            }

            /* Profile Avatar */
            .n8n-chat .chat-header .avatar {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                font-size: 16px;
                border: 3px solid rgba(255, 255, 255, 0.3);
                text-shadow: none;
            }

            .n8n-chat .chat-header .avatar img {
                display: block;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                object-fit: cover;
            }

            .n8n-chat .chat-header .header-info {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
            }

            .n8n-chat .chat-header .title {
                font-size: 16px;
                font-weight: 600;
                margin: 0;
                line-height: 1.2;
                color: var(--chat--color-white);
                text-shadow: none;
            }

            .n8n-chat .chat-header .subtitle {
                font-size: 12px;
                opacity: 0.9;
                margin: 2px 0 0 0;
                font-weight: 400;
                line-height: 1.2;
                color: rgba(255, 255, 255, 0.8);
                display: flex;
                align-items: flex-start;
                gap: 0.25rem;
            }

            /* Close button */
            .n8n-chat .chat-header .close-btn {
                width: 32px;
                height: 32px;
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.1);
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
                color: rgba(255, 255, 255, 0.8);
                font-size: 18px;
                font-weight: 400;
                position: absolute;
                top: 50%;
                right: 1.25rem;
                transform: translateY(-50%);
                z-index: 10;
            }

            .n8n-chat .chat-header .close-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                color: var(--chat--color-white);
            }

            .n8n-chat .chat-header .close-btn::before {
                content: '×';
                font-size: 20px;
                line-height: 1;
            }

            /* Header Status Indicator */
            .n8n-chat .chat-header .status-indicator {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                z-index: 2;
                background: rgba(255,255,255,0.15);
                padding: 0.375rem 0.75rem;
                border-radius: 20px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.2);
            }

            .n8n-chat .chat-header .status-dot {
                width: 8px;
                height: 8px;
                background: #10b981;
                border-radius: 50%;
                animation: pulse-green 2s infinite;
                box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
            }

            @keyframes pulse-green {
                0% {
                    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
                }
                70% {
                    box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
                }
                100% {
                    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
                }
            }

            .n8n-chat .chat-header .status-text {
                font-size: 11px;
                font-weight: 600;
                color: rgba(255,255,255,0.95);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            /* Header Actions */
            .n8n-chat .chat-header .header-actions {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                z-index: 2;
            }

            .n8n-chat .chat-header .header-action {
                width: 32px;
                height: 32px;
                border-radius: 8px;
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
                backdrop-filter: blur(5px);
            }

            .n8n-chat .chat-header .header-action:hover {
                background: rgba(255,255,255,0.2);
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }

            .n8n-chat .chat-header .header-action svg {
                width: 16px;
                height: 16px;
                color: rgba(255,255,255,0.9);
            }

            /* Chat Messages Area */
            .n8n-chat .chat-messages {
                padding: 1.25rem;
                background: var(--chat--color-white);
                min-height: 420px;
                max-height: 420px;
                overflow-y: auto;
                scroll-behavior: smooth;
            }

            .n8n-chat .chat-messages::-webkit-scrollbar {
                width: 4px;
            }

            .n8n-chat .chat-messages::-webkit-scrollbar-track {
                background: transparent;
            }

            .n8n-chat .chat-messages::-webkit-scrollbar-thumb {
                background: var(--chat--color-gray-300);
                border-radius: 2px;
            }

            .n8n-chat .chat-messages::-webkit-scrollbar-thumb:hover {
                background: var(--chat--color-gray-400);
            }

            /* Message Styles - Like in the image */
            .n8n-chat .message,
            .n8n-chat .chat-message {
                margin-top: 5px !important;
                font-size: 14px;
                line-height: 1.4;
                max-width: 75%;
                border-radius: 18px;
                word-wrap: break-word;
                position: relative;
                animation: messageSlideIn 0.3s ease-out;
                clear: both;
            }

            @keyframes messageSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* User Messages - Red/Orange style like in image */
            .n8n-chat .message-user,
            .n8n-chat .chat-message.chat-message-from-user {
                background: var(--chat--color-primary);
                color: var(--chat--color-white);
                border-radius: 18px 18px 4px 18px;
                margin-left: auto;
                margin-right: 0;
                box-shadow: 0 2px 8px rgba(14, 165, 233, 0.2);
                font-weight: 500;
                float: right;
                clear: both;
            }

            /* Bot Messages - Clean white style */
            .n8n-chat .message-bot,
            .n8n-chat .chat-message.chat-message-from-bot {
                margin-top: 5px !important;
                background: var(--chat--color-gray-100) !important;
                color: var(--chat--color-gray-800) !important;
                border-radius: 18px 18px 18px 4px !important;
                margin-left: 0;
                margin-right: auto;
                border: 0.5px solid var(--chat--color-gray-300);
                box-shadow: none !important;
                position: relative;
                float: left;
                clear: both;
            }

            /* Message with emoji support */
            .n8n-chat .message-bot::before,
            .n8n-chat .chat-message.chat-message-from-bot::before {
                content: '';
                position: absolute;
                left: -8px;
                top: 50%;
                transform: translateY(-50%);
                width: 0;
                height: 0;
                border-top: 6px solid transparent;
                border-bottom: 6px solid transparent;
                border-right: 8px solid var(--chat--color-gray-100);
            }

            /* JSON Response Formatting */
            .n8n-chat .message-bot pre,
            .n8n-chat .chat-message-from-bot pre {
                background: var(--chat--color-gray-100);
                border: 1px solid var(--chat--color-gray-900) !important;
                border-radius: var(--chat--border-radius-sm);
                overflow-x: auto;
                font-size: 13px;
                line-height: 1.4;
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            }

            .n8n-chat .message-bot code,
            .n8n-chat .chat-message-from-bot code {
                background: var(--chat--color-gray-100);
                border-radius: 6px;
                font-size: 13px;
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                color: var(--chat--color-gray-700);
            }

            /* Lists in messages */
            .n8n-chat .message ul,
            .n8n-chat .chat-message ul {
                margin: 0.5rem 0;
                padding-left: 1.25rem;
                list-style-type: disc !important;
                list-style-position: outside !important;
            }

            .n8n-chat .message ol,
            .n8n-chat .chat-message ol {
                margin: 0.5rem 0;
                padding-left: 1.25rem;
                list-style-type: decimal !important;
                list-style-position: outside !important;
            }

            .n8n-chat .message li,
            .n8n-chat .chat-message li {
                margin: 0.25rem 0;
                display: list-item !important;
                list-style: inherit !important;
            }

            /* Chat Input Area */
            .n8n-chat .chat-layout .chat-footer,
            .n8n-chat .chat-footer {
                padding: 0.75rem !important;
                border-top: 1px solid var(--chat--color-gray-200) !important;
                background: var(--chat--color-white) !important;
                display: block !important;
            }

            .n8n-chat .chat-input {
                padding: 0 !important;
                border: 0 !important;
                background: transparent !important;
            }

            .n8n-chat .chat-inputs {
                width: 100% !important;
                display: flex !important;
                align-items: center !important;
                gap: 0.625rem !important;
            }

            .n8n-chat .chat-inputs textarea {
                flex: 1 !important;
                font-size: 14px !important;
                padding: 0.75rem 1rem !important;
                border: 1px solid var(--chat--color-gray-300) !important;
                border-radius: 999px !important;
                background: var(--chat--color-white) !important;
                color: var(--chat--color-gray-800) !important;
                resize: none !important;
                font-family: inherit !important;
                line-height: 1.4 !important;
                min-height: 44px !important;
                max-height: 160px !important;
                overflow-y: auto !important;
                scrollbar-width: none;
            }

            .n8n-chat .chat-inputs textarea::-webkit-scrollbar {
                display: none;
            }

            .n8n-chat .chat-inputs textarea:focus {
                border-color: var(--chat--color-primary) !important;
                outline: none !important;
                box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.12) !important;
            }

            .n8n-chat .chat-inputs textarea::placeholder {
                color: var(--chat--color-gray-400);
                font-weight: 400;
            }

            .n8n-chat .chat-inputs-controls {
                display: flex !important;
                align-items: center !important;
                gap: 0.5rem !important;
            }

            .n8n-chat .chat-input-send-button {
                background: var(--chat--color-primary) !important;
                color: var(--chat--color-white) !important;
                border: none !important;
                border-radius: 50% !important;
                width: 40px !important;
                height: 40px !important;
                min-width: 40px !important;
                padding: 0 !important;
                cursor: pointer !important;
                transition: all 0.2s ease !important;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                box-shadow: 0 2px 8px rgba(14, 165, 233, 0.2) !important;
            }

            .n8n-chat .chat-input-send-button:hover:not([disabled]) {
                background: var(--chat--color-primary-hover) !important;
                transform: scale(1.04);
                box-shadow: 0 4px 12px rgba(14, 165, 233, 0.28) !important;
            }

            .n8n-chat .chat-input-send-button:active:not([disabled]) {
                background: var(--chat--color-primary-active) !important;
                transform: scale(0.98);
            }

            .n8n-chat .chat-input-send-button::before {
                content: none !important;
            }

            .n8n-chat .chat-input-send-button svg {
                width: 18px !important;
                height: 18px !important;
                color: var(--chat--color-white) !important;
            }

            /* Chat Toggle Button */
            .n8n-chat .chat-toggle {
                width: 64px !important;
                height: 64px !important;
                border-radius: 50% !important;
                background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%) !important;
                box-shadow: var(--chat--shadow-lg) !important;
                border: none !important;
                transition: all 0.3s ease !important;
                cursor: pointer !important;
                display: ${isChatOpen ? 'none' : 'flex'} !important;
                align-items: center !important;
                justify-content: center !important;
            }

            .n8n-chat .chat-toggle:hover {
                transform: scale(1.08) !important;
                box-shadow: var(--chat--shadow-xl) !important;
            }

            .n8n-chat .chat-toggle:active {
                transform: scale(1.02) !important;
            }

            /* Typing Indicator */
            .n8n-chat .typing-indicator {
                padding: 0.75rem 1.125rem;
                margin: 0.75rem 0;
                background: var(--chat--color-white);
                border-radius: var(--chat--border-radius-lg) var(--chat--border-radius-lg) var(--chat--border-radius-lg) 6px;
                border: 1px solid var(--chat--color-gray-200);
                max-width: 85%;
                margin-left: 0;
                margin-right: auto;
                animation: pulse 1.5s infinite;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.6; }
            }

            /* Footer - Clean and minimal */
            .n8n-chat .chat-footer {
                padding: 0.75rem 1rem;
                text-align: center;
                font-size: 11px;
                color: var(--chat--color-gray-400);
                background: var(--chat--color-white);
                border-top: 1px solid var(--chat--color-gray-100);
                font-weight: 400;
                border-radius: 0 0 var(--chat--border-radius) var(--chat--border-radius);
            }

            /* Mobile Responsive - Enhanced for better UX */
            @media (max-width: 768px) {
                :root {
                    --chat--window--width: 100vw;
                    --chat--window--height: 100vh;
                    --chat--border-radius: 0px;
                }

                .n8n-chat .chat-window {
                    width: 100vw !important;
                    height: 100vh !important;
                    border-radius: 0 !important;
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    right: 0 !important;
                    bottom: 0 !important;
                    z-index: 9999 !important;
                    max-height: 100vh !important;
                }

                .n8n-chat .chat-header {
                    padding: 1rem 1rem 1rem 1rem;
                    min-height: 80px;
                    border-radius: 0;
                }

                .n8n-chat .chat-header .avatar {
                    width: 50px;
                    height: 50px;
                    border-width: 2px;
                }

                .n8n-chat .chat-header .title {
                    font-size: 15px;
                }

                .n8n-chat .chat-header .subtitle {
                    font-size: 11px;
                }

                .n8n-chat .chat-messages {
                    min-height: calc(100vh - 220px);
                    max-height: calc(100vh - 220px);
                    padding: 1rem;
                }

                .n8n-chat .message,
                .n8n-chat .chat-message {
                    max-width: 85%;
                    font-size: 15px;
                    padding: 0.875rem 1rem;
                }

                .n8n-chat .chat-input {
                    padding: 1rem;
                    gap: 0.5rem;
                    border-radius: 0;
                }

                .n8n-chat .chat-input input,
                .n8n-chat .chat-input textarea {
                    font-size: 16px; /* Prevents zoom on iOS */
                    padding: 0.875rem 1rem;
                }

                .n8n-chat .chat-input button[type="submit"],
                .n8n-chat button[type="submit"] {
                    width: 44px !important;
                    height: 44px !important;
                    min-width: 44px !important; /* Touch target size */
                }

                .n8n-chat .chat-toggle {
                    width: 56px !important;
                    height: 56px !important;
                    bottom: 20px !important;
                    right: 20px !important;
                }

                .n8n-chat .chat-footer {
                    padding: 0.75rem 1rem;
                    border-radius: 0;
                }
            }

            /* Tablet responsive */
            @media (min-width: 769px) and (max-width: 1024px) {
                :root {
                    --chat--window--width: 420px;
                    --chat--window--height: 600px;
                }

                .n8n-chat .chat-window {
                    width: 420px !important;
                    max-height: 600px !important;
                }

                .n8n-chat .chat-messages {
                    min-height: 440px;
                    max-height: 440px;
                }
            }

            /* Small mobile (iPhone SE, etc.) */
            @media (max-width: 480px) {
                .n8n-chat .chat-header {
                    padding: 0.875rem;
                    min-height: 70px;
                }

                .n8n-chat .chat-header .header-left {
                    gap: 0.5rem;
                }

                .n8n-chat .chat-header .avatar {
                    width: 44px;
                    height: 44px;
                }

                .n8n-chat .chat-header .title {
                    font-size: 14px;
                }

                .n8n-chat .chat-header .subtitle {
                    font-size: 10px;
                }

                .n8n-chat .chat-messages {
                    min-height: calc(100vh - 200px);
                    max-height: calc(100vh - 200px);
                    padding: 0.75rem;
                }

                .n8n-chat .message,
                .n8n-chat .chat-message {
                    font-size: 14px;
                    padding: 0.75rem 0.875rem;
                    max-width: 90%;
                }

                .n8n-chat .chat-input {
                    padding: 0.875rem;
                }
            }

            /* Landscape mobile */
            @media (max-height: 500px) and (orientation: landscape) {
                .n8n-chat .chat-header {
                    min-height: 60px;
                    padding: 0.75rem 1rem;
                }

                .n8n-chat .chat-messages {
                    min-height: calc(100vh - 180px);
                    max-height: calc(100vh - 180px);
                }

                .n8n-chat .chat-header .avatar {
                    width: 40px;
                    height: 40px;
                }
            }

            /* Dark mode support */
            @media (prefers-color-scheme: dark) {
                .n8n-chat .chat-window {
                    background: #1f2937;
                    border-color: #374151;
                }

                .n8n-chat .chat-messages {
                    background: #111827;
                }

                .n8n-chat .message-bot,
                .n8n-chat .chat-message-from-bot {
                    background: #1f2937 !important;
                    color: #f9fafb !important;
                    border-color: #374151 !important;
                }

                .n8n-chat .chat-input {
                    background: #1f2937;
                    border-color: #374151;
                }

                .n8n-chat .chat-input input,
                .n8n-chat .chat-input textarea {
                    background: #111827;
                    color: #f9fafb;
                    border-color: #4b5563;
                }

                .n8n-chat .chat-footer {
                    background: #111827;
                    color: #9ca3af;
                }
            }
        `
        document.head.appendChild(style)

        // Expose toggle function globally
        window.toggleHireTabChat = toggleChat;

        // Create script with ES module syntax - this is the fix
        const script = document.createElement("script")
        script.type = "module"
        script.textContent = `
            import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';

            createChat({
                webhookUrl: "${webhookUrl}",
                target: "#n8n-chat",
                mode: "window",
                showWelcomeScreen: false,
                loadPreviousSession: true,
                enableStreaming: false,
                initialMessages: [
                    "Hi there! 👋",
                    "Welcome to HireTab Support! I'm here to help you with any questions about our platform.",
                    "How can I assist you today? 🚀"
                ],
                i18n: {
                    en: {
                        title: "HireTab AI Assistant",
                        subtitle: "Ready to help",
                        inputPlaceholder: "Ask me anything...",
                        getStarted: "Start Conversation",
                        footer: "Powered by HireTab Intelligence"
                    }
                },
                metadata: {
                    source: "hiretab-website",
                    version: "1.0.0"
                }
            });

            // Enhance header: insert avatar, left-align title/subtitle and add close button
            (function enhanceChatHeader(){
                function tryInject(){
                    const root = document.querySelector('#n8n-chat');
                    if(!root) return false;
                    // n8n chat creates an element with class .n8n-chat inside target
                    const chatEl = root.querySelector('.n8n-chat') || root;
                    const header = chatEl.querySelector('.chat-header') || document.querySelector('.chat-header');
                    if(!header) return false;

                    // Inject close button if missing
                    if(!header.querySelector('.close-btn')){
                        const closeBtn = document.createElement('button');
                        closeBtn.className = 'close-btn';
                        closeBtn.setAttribute('aria-label', 'Close chat');
                        closeBtn.onclick = () => {
                            window.toggleHireTabChat && window.toggleHireTabChat();
                        };
                        header.appendChild(closeBtn);
                    }

                    // Inject avatar if missing
                    if(!header.querySelector('.avatar')){
                        const left = header.querySelector('.header-left') || header.querySelector('.header-info') || header;
                        const avatar = document.createElement('div');
                        avatar.className = 'avatar';
                        avatar.setAttribute('aria-hidden','true');
                        // use project logo if available
                        const img = document.createElement('img');
                        img.src = 'https://cdn3d.iconscout.com/3d/premium/thumb/bot-3d-icon-png-download-9666273.png';
                        img.alt = 'HireTab';
                        img.style.width = '100%';
                        img.style.height = '100%';
                        img.style.objectFit = 'cover';
                        img.style.borderRadius = '50%';
                        avatar.appendChild(img);
                        // prepend avatar to the left container
                        try{ left.prepend(avatar); }catch(e){ header.insertBefore(avatar, header.firstChild); }
                    }

                    // Left-align the title and subtitle
                    const headerInfo = header.querySelector('.header-info') || header.querySelector('.header-left') || header;
                    if(headerInfo){
                        headerInfo.style.alignItems = 'flex-start';
                        headerInfo.style.textAlign = 'left';
                    }
                    const title = header.querySelector('.title');
                    const subtitle = header.querySelector('.subtitle');
                    if(title) title.style.textAlign = 'left';
                    if(subtitle) subtitle.style.textAlign = 'left';

                    return true;
                }

                // Try immediately, then observe DOM changes as fallback
                if(tryInject()) return;
                const obs = new MutationObserver((mutations, observer) => {
                    if(tryInject()) observer.disconnect();
                });
                obs.observe(document.body, { childList: true, subtree: true });
                // Safety timeout fallback
                setTimeout(()=>{ tryInject(); obs.disconnect(); }, 3000);
            })();

            // Handle chat toggle button clicks
            (function handleToggleButton(){
                function tryAddToggleHandler(){
                    const toggleBtn = document.querySelector('#n8n-chat .chat-toggle');
                    if(!toggleBtn) return false;
                    
                    // Override the default click handler
                    const newToggleBtn = toggleBtn.cloneNode(true);
                    toggleBtn.parentNode.replaceChild(newToggleBtn, toggleBtn);
                    
                    newToggleBtn.onclick = () => {
                        window.toggleHireTabChat && window.toggleHireTabChat();
                    };
                    
                    return true;
                }

                // Try immediately, then observe DOM changes as fallback
                if(tryAddToggleHandler()) return;
                const obs = new MutationObserver((mutations, observer) => {
                    if(tryAddToggleHandler()) observer.disconnect();
                });
                obs.observe(document.body, { childList: true, subtree: true });
                // Safety timeout fallback
                setTimeout(()=>{ tryAddToggleHandler(); obs.disconnect(); }, 3000);
            })();
        `
        document.body.appendChild(script)

        // Cleanup function
        return () => {
            // Remove the added elements when component unmounts
            if (link.parentNode) {
                link.parentNode.removeChild(link)
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style)
            }
            if (script.parentNode) {
                script.parentNode.removeChild(script)
            }

            // Remove the chat container if it exists
            const chatContainer = document.getElementById("n8n-chat")
            if (chatContainer) {
                chatContainer.remove()
            }

            // Clean up global function
            if (window.toggleHireTabChat) {
                delete window.toggleHireTabChat;
            }
        }
    }, [isChatOpen, toggleChat])

    return (
        <div>
            <div id="n8n-chat"></div>
        </div>
    )
}

export default ChatWootWidget