import { useState, useEffect } from 'react'

const tips = [
    "💡 Hi! I'm Clippy! Click on Fatih.exe to explore the CV!",
    "🎮 Fatih is a game developer! Type 'games' to learn more.",
    "📧 Need contact info? Type 'contact' in the chat!",
    "🛠️ Curious about skills? Type 'skills' in the chat!",
    "🎯 Want to see projects? Type 'projects'!",
    "🥚 Psst... try typing 'secret' in the chat! 🤫",
]

function Clippy({ onClose }) {
    const [currentTip, setCurrentTip] = useState(0)
    const [isWaving, setIsWaving] = useState(true)
    const [clicks, setClicks] = useState(0)

    useEffect(() => {
        const waveTimer = setTimeout(() => setIsWaving(false), 2000)

        const tipTimer = setInterval(() => {
            setCurrentTip(prev => (prev + 1) % tips.length)
        }, 5000)

        return () => {
            clearTimeout(waveTimer)
            clearInterval(tipTimer)
        }
    }, [])

    const handleClippyClick = () => {
        setClicks(prev => prev + 1)
        setIsWaving(true)
        setTimeout(() => setIsWaving(false), 500)
    }

    return (
        <div
            className="fixed bottom-[60px] right-[20px] z-[100] flex items-end gap-2"
            style={{ animation: 'clippy-appear 0.5s ease-out' }}
        >
            {/* Speech Bubble */}
            <div className="win95-window max-w-[250px] p-3 relative">
                <div className="text-sm leading-relaxed">
                    {clicks >= 5
                        ? "🎉 Stop poking me! Here's a tip: I'm ticklish! 😆"
                        : tips[currentTip]
                    }
                </div>
                <button
                    onClick={onClose}
                    className="absolute top-1 right-1 text-xs hover:bg-[#000080] hover:text-white px-1"
                >
                    ✕
                </button>
                <div
                    className="absolute -right-2 bottom-4 w-0 h-0"
                    style={{
                        borderTop: '8px solid transparent',
                        borderBottom: '8px solid transparent',
                        borderLeft: '8px solid #c0c0c0',
                    }}
                />
            </div>

            {/* Clippy Character */}
            <div
                className={`cursor-pointer ${isWaving ? 'animate-bounce' : 'animate-wiggle'}`}
                onClick={handleClippyClick}
            >
                <svg width="60" height="80" viewBox="0 0 60 80" className="drop-shadow-lg">
                    <ellipse cx="30" cy="25" rx="20" ry="20" fill="#c0c0c0" stroke="#808080" strokeWidth="2" />
                    <ellipse cx="22" cy="22" rx="6" ry="8" fill="white" />
                    <ellipse cx="38" cy="22" rx="6" ry="8" fill="white" />
                    <circle cx="24" cy="24" r="3" fill="#000" />
                    <circle cx="40" cy="24" r="3" fill="#000" />
                    <path d="M16 14 Q22 10 28 14" stroke="#808080" strokeWidth="2" fill="none" />
                    <path d="M32 14 Q38 10 44 14" stroke="#808080" strokeWidth="2" fill="none" />
                    <path d="M22 32 Q30 40 38 32" stroke="#808080" strokeWidth="2" fill="none" />
                    <path d="M20 45 L20 70 Q20 75 30 75 Q40 75 40 70 L40 45"
                        stroke="#808080" strokeWidth="4" fill="none" />
                    <path d="M25 50 L25 65 Q25 68 30 68 Q35 68 35 65 L35 50"
                        stroke="#c0c0c0" strokeWidth="3" fill="none" />
                </svg>
            </div>
        </div>
    )
}

export default Clippy
