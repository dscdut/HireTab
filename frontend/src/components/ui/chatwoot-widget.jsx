// ...existing code...
"use client"

import { useEffect } from "react"

const ChatWootWidget = () => {
    useEffect(() => {
        const webhookUrl = import.meta.env.VITE_N8N_CHAT_WEBHOOK_URL
        // Import CSS for n8n chat
        const link = document.createElement("link")
        link.href = "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css"
        link.rel = "stylesheet"
        document.head.appendChild(link)

        // Add custom CSS for blue color scheme
        const style = document.createElement("style")
        style.textContent = `
            /* Override chat heading style */
            .n8n-chat .chat-heading {
                display: flex !important;
                flex-direction: column !important;
                font-size: 10px !important;
                align-items: flex-start !important;
                justify-content: flex-start !important;
            }
            :root {
                --chat--color-primary: #2563eb;
                --chat--color-primary-shade-50: #1d4ed8;
                --chat--color-primary-shade-100: #1e40af;
                --chat--color-secondary: #3b82f6;
                --chat--color-secondary-shade-50: #2563eb;
                --chat--color-white: #ffffff;
                --chat--color-light: #f8fafc;
                --chat--color-light-shade-50: #e2e8f0;
                --chat--color-light-shade-100: #cbd5e1;
                --chat--color-medium: #94a3b8;
                --chat--color-dark: #1e293b;
                --chat--color-disabled: #64748b;
                --chat--color-typing: #475569;

                --chat--spacing: 0.75rem;
                --chat--border-radius: 0.5rem;
                --chat--transition-duration: 0.3s;

                --chat--window--width: 380px;
                --chat--window--height: 580px;

                --chat--header--background: #ffffff;
                --chat--header--color: #1e293b;
                --chat--header--padding: 0.75rem 1rem;
                --chat--header--border-radius: 0.5rem 0.5rem 0 0;

                --chat--message--bot--background: #f1f5f9;
                --chat--message--bot--color: #334155;
                --chat--message--bot--border: 1px solid #e2e8f0;
                --chat--message--user--background: #2563eb;
                --chat--message--user--color: var(--chat--color-white);
                --chat--message--user--border: none;

                --chat--toggle--background: #2563eb;
                --chat--toggle--hover--background: #1d4ed8;
                --chat--toggle--active--background: #1e40af;
                --chat--toggle--color: var(--chat--color-white);
                --chat--toggle--size: 56px;

                --chat--textarea--border: 1px solid #e2e8f0;
                --chat--textarea--focus--border: 2px solid #2563eb;

                /* Submit button color */
                --chat--button--background: #2563eb;
                --chat--button--color: #fff;
                --chat--button--hover--background: #1d4ed8;
                --chat--button--active--background: #1e40af;
            }

            .n8n-chat {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                line-height: 1.4;
            }
            
            .n8n-chat .chat-header {
                background: #fff;
                border-bottom: 1px solid #e5e7eb;
                padding: 0.5rem 1.25rem 0.5rem 1rem;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                min-height: 48px;
                max-height: 56px;
                width: 100%;
                box-sizing: border-box;
            }

            .n8n-chat .chat-header .header-left {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: center;
            }

            .n8n-chat .chat-header .title {
                font-size: 15px;
                font-weight: 600;
                color: #1e293b;
                margin: 0;
                line-height: 1.1;
                letter-spacing: -0.5px;
                display: block;
            }

            .n8n-chat .chat-header .subtitle {
                font-size: 12px;
                color: #64748b;
                margin: 0;
                line-height: 1.2;
                font-weight: 400;
                display: block;
                margin-top: 2px;
            }
            /* Always force subtitle to new line */
            .n8n-chat .chat-header .title + .subtitle {
                display: block;
            }

            .n8n-chat .chat-header .header-actions {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            /* Optional: style for back and close icons if you add them */
            .n8n-chat .chat-header .header-icon {
                width: 22px;
                height: 22px;
                color: #64748b;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: background 0.15s;
            }
            .n8n-chat .chat-header .header-icon:hover {
                background: #f1f5f9;
            }

            .n8n-chat .message {
                font-size: 14px;
                line-height: 1.4;
                margin: 0.5rem 0;
                max-width: 280px;
                padding: 0.5rem 0.75rem;
            }
            
            .n8n-chat .message-user {
                background: #2563eb;
                color: white;
                border-radius: 16px 16px 4px 16px;
                margin-left: auto;
                margin-right: 1rem;
                font-size: 14px;
            }
            
            .n8n-chat .message-bot {
                background: #ffffff;
                color: #000000;
                border-radius: 16px 16px 16px 4px;
                margin-left: 1rem;
                margin-right: auto;
                font-size: 14px;
                border: 1px solid #e5e7eb;
            }
            /* Force override for bot message background and border */
            .n8n-chat .chat-message.chat-message-from-bot:not(.chat-message-transparent) {
                background-color: #fff !important;
                border: 1px solid #e5e7eb !important;
            }
            .n8n-chat .chat-input {
                padding: 0.75rem 1rem;
                border-top: 1px solid #e5e7eb;
                background: white;
            }
            
            .n8n-chat .chat-input input,
            .n8n-chat .chat-input textarea {
                font-size: 14px;
                padding: 0.75rem 1rem;
                border: 1px solid #d1d5db;
                border-radius: 20px;
                background: #f9fafb;
            }
            
            .n8n-chat .chat-input input:focus,
            .n8n-chat .chat-input textarea:focus {
                border-color: #2563eb;
                background: white;
                outline: none;
            }
            
            .n8n-chat .chat-toggle {
                width: 56px;
                height: 56px;
                border-radius: 50%;
                box-shadow: 0 4px 20px rgba(37, 99, 235, 0.25);
                transition: all 0.3s ease;
            }
            
            .n8n-chat .chat-toggle:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 25px rgba(37, 99, 235, 0.35);
            }
            
            .n8n-chat .chat-window {
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
                border: 1px solid #e5e7eb;
                overflow: hidden;
                background: white;
            }
            
            .n8n-chat .chat-footer {
                padding: 0.5rem;
                text-align: center;
                font-size: 11px;
                color: #9ca3af;
                background: #f9fafb;
                border-top: 1px solid #f3f4f6;
            }

            /* Make chat window header corners more rounded */
            .n8n-chat .chat-window {
                border-radius: 12px 12px 12px 12px;
            }

            /* Submit button color and always visible */
            .n8n-chat .chat-input button[type="submit"],
            .n8n-chat button[type="submit"] {
                background: var(--chat--button--background) !important;
                color: var(--chat--button--color) !important;
                border: none;
                border-radius: 20px;
                padding: 0.5rem 1.25rem;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.2s;
                display: inline-block !important;
                opacity: 1 !important;
                visibility: visible !important;
            }
            .n8n-chat .chat-input button[type="submit"]:hover,
            .n8n-chat button[type="submit"]:hover {
                background: var(--chat--button--hover--background) !important;
            }
            .n8n-chat .chat-input button[type="submit"]:active,
            .n8n-chat button[type="submit"]:active {
                background: var(--chat--button--active--background) !important;
            }
            /* Fix for button being hidden when typing */
            .n8n-chat .chat-input button[type="submit"][style*="display: none"],
            .n8n-chat button[type="submit"][style*="display: none"] {
                display: inline-block !important;
                opacity: 1 !important;
                visibility: visible !important;
            }
        `
        document.head.appendChild(style)

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
                    "We're HireTab. How can I assist you today?"
                ],
                i18n: {
                    en: {
                        title: "HireTab",
                        subtitle: "",
                        inputPlaceholder: "Type your message",
                        getStarted: "New Conversation",
                        footer: "Powered by GDSC"
                    }
                },
                metadata: {
                    source: "hiretab-website",
                    version: "1.0.0"
                }
            });
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
        }
    }, [])

    return <div id="n8n-chat"></div>
}

export default ChatWootWidget