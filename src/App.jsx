import { useState, useEffect } from 'react'
import Desktop from './components/Desktop'
import Taskbar from './components/Taskbar'
import ChatWindow from './components/ChatWindow'
import ErrorPopup from './components/ErrorPopup'
import StartMenu from './components/StartMenu'

function App() {
    const [appState, setAppState] = useState('intro')
    const [isWindowOpen, setIsWindowOpen] = useState(false)
    const [isWindowMinimized, setIsWindowMinimized] = useState(false)
    const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 })
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [showStartMenu, setShowStartMenu] = useState(false)
    const [loadingProgress, setLoadingProgress] = useState(0)
    const [bootPhase, setBootPhase] = useState(0)

    const centerWindow = () => {
        const windowWidth = Math.min(1200, window.innerWidth - 20)
        const windowHeight = Math.min(800, window.innerHeight - 60)
        return {
            x: Math.max(0, (window.innerWidth - windowWidth) / 2),
            y: Math.max(0, (window.innerHeight - windowHeight - 32) / 2)
        }
    }

    // Boot sequence
    useEffect(() => {
        if (appState !== 'booting') return

        setLoadingProgress(0)
        setBootPhase(0)

        const progressInterval = setInterval(() => {
            setLoadingProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval)
                    return 100
                }
                return prev + 2
            })
        }, 40)

        const phase1 = setTimeout(() => setBootPhase(1), 2000)
        const phase2 = setTimeout(() => setAppState('desktop'), 3000)

        return () => {
            clearTimeout(phase1)
            clearTimeout(phase2)
            clearInterval(progressInterval)
        }
    }, [appState])

    const handleStart = () => {
        setAppState('booting')
    }

    const handleRestart = () => {
        setAppState('booting')
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
        setIsWindowOpen(false)
        setAppState('shutting')
        setTimeout(() => {
            setAppState('shutdown')
        }, 1500)
    }

    const toggleStartMenu = () => {
        setShowStartMenu(!showStartMenu)
    }

    // Intro Screen - Simple Power Button
    if (appState === 'intro') {
        return (
            <div className="h-screen w-screen bg-black flex items-center justify-center">
                <div className="power-button" onClick={handleStart}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="power-icon">
                        <path d="M12 3v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M5.5 7.5A9 9 0 1 0 18.5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
            </div>
        )
    }

    // Shutdown Screen - Simple
    if (appState === 'shutdown') {
        return (
            <div className="h-screen w-screen bg-black flex flex-col items-center justify-center">
                <div className="text-center shutdown-fade-in">
                    <div className="text-white text-xl mb-2">
                        Thanks for visiting
                    </div>
                    <div className="text-[#888] text-sm mb-10">
                        — fatihgur
                    </div>

                    {/* Simple restart link */}
                    <div
                        onClick={handleRestart}
                        className="text-[#666] text-sm cursor-pointer hover:text-white transition-colors"
                    >
                        [ restart ]
                    </div>
                </div>
            </div>
        )
    }

    // Boot Phase 0: Windows 95 Loading
    if (appState === 'booting' && bootPhase === 0) {
        return (
            <div className="h-screen w-screen bg-black flex flex-col items-center justify-center">
                <div className="text-center">
                    <div className="flex gap-1 mb-8 justify-center logo-wave">
                        <div className="w-10 h-10 bg-[#ff0000] wave-1"></div>
                        <div className="w-10 h-10 bg-[#00ff00] wave-2"></div>
                        <div className="w-10 h-10 bg-[#0000ff] wave-3"></div>
                        <div className="w-10 h-10 bg-[#ffff00] wave-4"></div>
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

    // Boot Phase 1: TV Turn On Effect
    if (appState === 'booting' && bootPhase === 1) {
        return (
            <div className="h-screen w-screen bg-black flex items-center justify-center overflow-hidden">
                <div className="tv-turnon-effect"></div>
            </div>
        )
    }

    // TV Shutdown
    if (appState === 'shutting') {
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

                {isWindowOpen && (
                    <ChatWindow
                        onClose={closeWindow}
                        onMinimize={minimizeWindow}
                        position={windowPosition}
                        setPosition={setWindowPosition}
                        isMinimized={isWindowMinimized}
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
