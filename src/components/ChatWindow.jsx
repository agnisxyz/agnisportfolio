import { useState, useRef, useEffect } from 'react'
import { X, Send } from 'lucide-react'
import { useChatbot } from '../hooks/useChatbot'

function ChatWindow({ onClose, onMinimize, position, setPosition, isMinimized }) {
    const [inputValue, setInputValue] = useState('')
    const { messages, sendMessage, isTyping, displayedText } = useChatbot()
    const chatAreaRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (chatAreaRef.current) {
            chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight
        }
    }, [messages, isTyping])

    // Dragging functionality
    const handleMouseDown = (e) => {
        if (e.target.closest('.title-bar-draggable')) {
            setIsDragging(true)
            setDragOffset({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            })
        }
    }

    const handleMouseMove = (e) => {
        if (isDragging) {
            const newX = Math.max(0, Math.min(window.innerWidth - 600, e.clientX - dragOffset.x))
            const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffset.y))
            setPosition({ x: newX, y: newY })
        }
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
            return () => {
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
            }
        }
    }, [isDragging, dragOffset])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (inputValue.trim()) {
            sendMessage(inputValue.trim())
            setInputValue('')
        }
    }

    if (isMinimized) {
        return null
    }

    return (
        <div
            className="win95-window absolute flex flex-col window-open"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: 'min(1200px, calc(100vw - 20px))',
                height: 'min(800px, calc(100vh - 60px))',
                zIndex: 100
            }}
            onMouseDown={handleMouseDown}
        >
            {/* Title Bar */}
            <div className="title-bar-gradient title-bar-draggable h-[26px] flex items-center justify-between px-2 cursor-move select-none">
                <div className="flex items-center gap-2">
                    <span className="text-white text-lg font-bold truncate">💬 Agnis - AI Chat</span>
                </div>
                <div className="flex items-center gap-[3px]">
                    {/* Minimize Button */}
                    <button
                        onClick={onMinimize}
                        className="close-button w-[18px] h-[16px]"
                        title="Minimize"
                    >
                        <span className="text-black text-xs">_</span>
                    </button>
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="close-button w-[18px] h-[16px]"
                        title="Close"
                    >
                        <X size={12} className="text-black" strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* Menu Bar (decorative) */}
            <div className="bg-[#c0c0c0] border-b border-[#808080] px-2 py-1 flex gap-6 text-base">
                <span className="hover:bg-[#000080] hover:text-white px-2 cursor-default">File</span>
                <span className="hover:bg-[#000080] hover:text-white px-2 cursor-default">Edit</span>
                <span className="hover:bg-[#000080] hover:text-white px-2 cursor-default">View</span>
                <span className="hover:bg-[#000080] hover:text-white px-2 cursor-default">Help</span>
            </div>

            {/* Chat Content Area */}
            <div className="flex-1 p-3 flex flex-col gap-3 min-h-0">
                {/* Messages Area */}
                <div
                    ref={chatAreaRef}
                    className="chat-area flex-1 p-4 overflow-y-auto min-h-0"
                >
                    {messages.map((msg, index) => (
                        <div key={index} className={`mb-3 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                            <span
                                className={`inline-block p-3 max-w-[80%] text-left text-base ${msg.type === 'user'
                                    ? 'bg-[#000080] text-white'
                                    : 'bg-[#c0c0c0] border-2 border-[#808080]'
                                    }`}
                                style={{ wordBreak: 'break-word' }}
                            >
                                <span className="font-bold text-sm block mb-2">
                                    {msg.type === 'user' ? '> You:' : '> Agnis.exe:'}
                                </span>
                                <span className="whitespace-pre-wrap leading-relaxed">{msg.text}</span>
                            </span>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="text-left mb-3">
                            <span
                                className="inline-block p-3 bg-[#c0c0c0] border-2 border-[#808080]"
                                style={{ minWidth: '300px', minHeight: '80px' }}
                            >
                                <span className="font-bold text-sm block mb-2">&gt; Agnis.exe:</span>
                                <span className="whitespace-pre-wrap leading-relaxed">{displayedText}</span>
                                <span className="cursor-blink text-xl">▌</span>
                            </span>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask me about skills, projects, experience..."
                        className="win95-input flex-1 text-lg p-3"
                        disabled={isTyping}
                    />
                    <button
                        type="submit"
                        className="win95-button px-6 text-lg"
                        disabled={isTyping || !inputValue.trim()}
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>

            {/* Status Bar */}
            <div className="bg-[#c0c0c0] border-t border-white px-3 py-1 text-sm flex justify-between">
                <div className="win95-sunken px-3 flex-1 mr-2">
                    {isTyping ? '⏳ Processing...' : '✅ Ready'}
                </div>
                <div className="win95-sunken px-3">
                    📨 {messages.length} messages
                </div>
            </div>
        </div>
    )
}

export default ChatWindow
