import { useState, useEffect } from 'react'
import { Monitor } from 'lucide-react'

function Taskbar({ isWindowOpen, isWindowMinimized, onWindowClick, onStartClick, isStartMenuOpen }) {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    }

    return (
        <div className="h-[32px] bg-[#c0c0c0] flex items-center px-1 border-t-2 border-white shadow-[inset_0_1px_0_#dfdfdf]">
            {/* Start Button */}
            <button
                onClick={onStartClick}
                className={`win95-button flex items-center gap-1 h-[24px] px-2 mr-2 ${isStartMenuOpen ? 'taskbar-button-active' : ''
                    }`}
            >
                {/* Windows Logo Icon */}
                <svg width="18" height="18" viewBox="0 0 16 16" className="pixelated">
                    <rect x="1" y="1" width="6" height="6" fill="#ff0000" />
                    <rect x="9" y="1" width="6" height="6" fill="#00ff00" />
                    <rect x="1" y="9" width="6" height="6" fill="#0000ff" />
                    <rect x="9" y="9" width="6" height="6" fill="#ffff00" />
                    <rect x="7" y="0" width="2" height="16" fill="#c0c0c0" />
                    <rect x="0" y="7" width="16" height="2" fill="#c0c0c0" />
                </svg>
                <span className="font-bold text-base">Start</span>
            </button>

            {/* Separator */}
            <div className="h-[22px] w-[2px] bg-[#808080] border-r border-white mr-2"></div>

            {/* Quick Launch Area */}
            <div className="flex items-center gap-1 mr-2">
                <button className="win95-button p-1 h-[22px] w-[24px] flex items-center justify-center" title="Show Desktop">
                    <svg width="14" height="14" viewBox="0 0 14 14" className="pixelated">
                        <rect x="1" y="1" width="12" height="10" fill="#000080" />
                        <rect x="2" y="2" width="10" height="8" fill="#008080" />
                    </svg>
                </button>
            </div>

            {/* Separator */}
            <div className="h-[22px] w-[2px] bg-[#808080] border-r border-white mr-2"></div>

            {/* Window Buttons Area */}
            <div className="flex-1 flex items-center gap-1">
                {isWindowOpen && (
                    <button
                        onClick={onWindowClick}
                        className={`win95-button flex items-center gap-1 h-[24px] px-2 min-w-[160px] justify-start ${!isWindowMinimized ? 'taskbar-button-active' : ''
                            }`}
                    >
                        <Monitor size={16} />
                        <span className="text-base truncate">Fatih - Chat</span>
                    </button>
                )}
            </div>

            {/* System Tray */}
            <div className="flex items-center gap-1">
                {/* Volume Icon */}
                <div className="px-1 cursor-pointer" title="Volume">
                    🔊
                </div>

                {/* Clock */}
                <div className="win95-sunken h-[22px] px-3 flex items-center">
                    <span className="text-base">{formatTime(time)}</span>
                </div>
            </div>
        </div>
    )
}

export default Taskbar
