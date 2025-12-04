import { useState, useEffect } from 'react'
import Desktop from './components/Desktop'
import Taskbar from './components/Taskbar'
import ChatWindow from './components/ChatWindow'
import ErrorPopup from './components/ErrorPopup'
import StartMenu from './components/StartMenu'

function App() {
    const [isPoweredOn, setIsPoweredOn] = useState(false)
    const [isWindowOpen, setIsWindowOpen] = useState(false)
    const [isWindowMinimized, setIsWindowMinimized] = useState(false)
    const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 })
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [showStartMenu, setShowStartMenu] = useState(false)
    const [bootPhase, setBootPhase] = useState(0) // 0: win95 logo, 1: tv effect, 2: desktop
    const [isShuttingDown, setIsShuttingDown] = useState(false)
    const [loadingProgress, setLoadingProgress] = useState(0)
    const [switchOn, setSwitchOn] = useState(false)

    const centerWindow = () => {
        const windowWidth = Math.min(1200, window.innerWidth - 20)
        const windowHeight = Math.min(800, window.innerHeight - 60)
        return {
            x: Math.max(0, (window.innerWidth - windowWidth) / 2),
            y: Math.max(0, (window.innerHeight - windowHeight - 32) / 2)
        }
    }

    useEffect(() => {
        if (!isPoweredOn) return

        // Loading progress
        const progressInterval = setInterval(() => {
            setLoadingProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval)
                    return 100
                }
                return prev + 3
            })
        }, 50)

        // Phase 1: After Windows 95 boot, show TV turn-on effect
        const phase1 = setTimeout(() => setBootPhase(1), 3000)

        // Phase 2: Desktop
        const phase2 = setTimeout(() => setBootPhase(2), 4500)

        return () => {
            clearTimeout(phase1)
            clearTimeout(phase2)
            clearInterval(progressInterval)
        }
    }, [isPoweredOn])

    const handlePowerOn = () => {
        setSwitchOn(true)
        setTimeout(() => {
            setIsPoweredOn(true)
        }, 200)
    }

    const openWindow = () => {
        setWindowPosition(centerWindow())
        setIsWindowOpen(true)
        setIsWindowMinimized(false)
        setShowStartMenu(false)
    }

    const closeWindow = () => {
        setIsWindowOpen(false)
        setIsWindowMinimized(false)
    }

    const minimizeWindow = () => {
        setIsWindowMinimized(true)
    }

    const restoreWindow = () => {
        setIsWindowMinimized(false)
    }

    const showErrorPopup = (message) => {
        setErrorMessage(message)
        setShowError(true)
    }

    const handleRecycleBin = () => {
        showErrorPopup("🗑️ Recycle Bin is empty!\n\nNo deleted items found.")
    }

    const handleMyComputer = () => {
        showErrorPopup("💾 System Information:\n\n• CPU: Pentium 166 MHz\n• RAM: 32 MB\n• HDD: 2.1 GB\n• OS: Windows 95 OSR2")
    }

    const handleShutdown = () => {
        setShowStartMenu(false)
        setIsShuttingDown(true)
    }

    const toggleStartMenu = () => {
        setShowStartMenu(!showStartMenu)
    }

    // Power Off Screen - Old 90s rocker switch
    if (!isPoweredOn) {
        return (
            <div className="h-screen w-screen bg-[#1a1a1a] flex flex-col items-center justify-center">
                {/* 90s Rocker Switch */}
                <div
                    className={`rocker-switch ${switchOn ? 'on' : ''}`}
                    onClick={handlePowerOn}
                >
                    <div className="rocker-frame">
                        <div className="rocker-button">
                            <span className="rocker-label-on">I</span>
                            <span className="rocker-label-off">O</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Boot Phase 0: Windows 95 Loading (FIRST)
    if (bootPhase === 0) {
        return (
            <div className="h-screen w-screen bg-black flex flex-col items-center justify-center">
                <div className="text-center">
                    <div className="flex gap-1 mb-8 justify-center logo-wave">
                        <div className="w-10 h-10 bg-[#ff0000]"></div>
                        <div className="w-10 h-10 bg-[#00ff00]"></div>
                        <div className="w-10 h-10 bg-[#0000ff]"></div>
                        <div className="w-10 h-10 bg-[#ffff00]"></div>
                    </div>

                    <div className="text-white text-xl mb-6">Starting Windows 95...</div>

                    <div className="w-[300px] h-[20px] bg-[#000080] border-2 border-[#808080] mx-auto">
                        <div
                            className="h-full bg-gradient-to-r from-[#0000aa] to-[#00aaff] transition-all duration-100"
                            style={{ width: `${loadingProgress}%` }}
                        ></div>
                    </div>

                    <div className="text-[#808080] text-xs mt-4">
                        Made By fatihgur
                    </div>
                </div>
            </div>
        )
    }

    // Boot Phase 1: TV Turn On Effect (AFTER Windows 95)
    if (bootPhase === 1) {
        return (
            <div className="h-screen w-screen bg-black flex items-center justify-center overflow-hidden">
                <div className="tv-turnon-effect"></div>
            </div>
        )
    }

    // TV Shutdown
    if (isShuttingDown) {
        return (
            <div className="h-screen w-screen bg-black flex items-center justify-center overflow-hidden">
                <div className="tv-shutdown-effect"></div>
            </div>
        )
    }

    // Desktop
    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden desktop-fade-in">
            <div className="flex-1 relative bg-[#008080]">
                <Desktop
                    onIconClick={openWindow}
                    onRecycleBinClick={handleRecycleBin}
                    onMyComputerClick={handleMyComputer}
                />

                {isWindowOpen && !isWindowMinimized && (
                    <ChatWindow
                        onClose={closeWindow}
                        onMinimize={minimizeWindow}
                        position={windowPosition}
                        setPosition={setWindowPosition}
                    />
                )}

                {showError && (
                    <ErrorPopup
                        message={errorMessage}
                        onClose={() => setShowError(false)}
                    />
                )}

                {showStartMenu && (
                    <StartMenu
                        onClose={() => setShowStartMenu(false)}
                        onOpenChat={openWindow}
                        onShutdown={handleShutdown}
                    />
                )}
            </div>

            <Taskbar
                isWindowOpen={isWindowOpen}
                isWindowMinimized={isWindowMinimized}
                onWindowClick={isWindowMinimized ? restoreWindow : minimizeWindow}
                onStartClick={toggleStartMenu}
                isStartMenuOpen={showStartMenu}
            />
        </div>
    )
}

export default App
