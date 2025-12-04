function Desktop({ onIconClick, onRecycleBinClick, onMyComputerClick }) {
    const handleIconClick = (callback) => {
        if (callback) callback()
    }

    const icons = [
        {
            id: 'fatih',
            label: 'Fatih.exe',
            icon: (
                <svg width="48" height="48" viewBox="0 0 48 48" className="pixelated drop-shadow-lg">
                    <rect x="6" y="6" width="36" height="36" fill="#c0c0c0" />
                    <rect x="6" y="6" width="36" height="2" fill="#ffffff" />
                    <rect x="6" y="6" width="2" height="36" fill="#ffffff" />
                    <rect x="40" y="6" width="2" height="36" fill="#808080" />
                    <rect x="6" y="40" width="36" height="2" fill="#808080" />
                    <rect x="8" y="8" width="32" height="8" fill="#000080" />
                    <rect x="8" y="18" width="32" height="22" fill="#ffffff" />
                    <circle cx="24" cy="28" r="8" fill="#ffcc00" />
                    <rect x="20" y="25" width="3" height="3" fill="#000000" />
                    <rect x="25" y="25" width="3" height="3" fill="#000000" />
                    <rect x="21" y="31" width="6" height="2" fill="#000000" />
                </svg>
            ),
            onClick: () => handleIconClick(onIconClick)
        },
        {
            id: 'mycomputer',
            label: 'My Computer',
            icon: (
                <svg width="48" height="48" viewBox="0 0 48 48" className="pixelated drop-shadow-lg">
                    <rect x="6" y="4" width="36" height="28" fill="#c0c0c0" />
                    <rect x="6" y="4" width="36" height="2" fill="#ffffff" />
                    <rect x="6" y="4" width="2" height="28" fill="#ffffff" />
                    <rect x="40" y="4" width="2" height="28" fill="#808080" />
                    <rect x="6" y="30" width="36" height="2" fill="#808080" />
                    <rect x="10" y="8" width="28" height="18" fill="#000080" />
                    <rect x="10" y="8" width="28" height="2" fill="#0000ff" />
                    <rect x="18" y="32" width="12" height="4" fill="#808080" />
                    <rect x="14" y="36" width="20" height="4" fill="#c0c0c0" />
                    <rect x="14" y="36" width="20" height="2" fill="#ffffff" />
                    <rect x="36" y="26" width="4" height="2" fill="#00ff00" />
                </svg>
            ),
            onClick: () => handleIconClick(onMyComputerClick)
        },
        {
            id: 'recycle',
            label: 'Recycle Bin',
            icon: (
                <svg width="48" height="48" viewBox="0 0 48 48" className="pixelated drop-shadow-lg">
                    <rect x="10" y="14" width="28" height="30" fill="#808080" />
                    <rect x="10" y="14" width="28" height="2" fill="#c0c0c0" />
                    <rect x="10" y="14" width="2" height="30" fill="#c0c0c0" />
                    <rect x="8" y="8" width="32" height="6" fill="#808080" />
                    <rect x="8" y="8" width="32" height="2" fill="#c0c0c0" />
                    <rect x="18" y="4" width="12" height="6" fill="#808080" />
                    <rect x="18" y="4" width="12" height="2" fill="#c0c0c0" />
                    <rect x="16" y="20" width="2" height="20" fill="#404040" />
                    <rect x="23" y="20" width="2" height="20" fill="#404040" />
                    <rect x="30" y="20" width="2" height="20" fill="#404040" />
                </svg>
            ),
            onClick: () => handleIconClick(onRecycleBinClick)
        }
    ]

    return (
        <div className="absolute inset-0 p-4">
            {/* Icons - Left aligned like Windows 95 */}
            <div className="flex flex-col items-start gap-2">
                {icons.map((icon) => (
                    <div
                        key={icon.id}
                        className="desktop-icon-container flex flex-col items-center justify-start p-2 rounded select-none cursor-pointer w-[85px]"
                        onClick={icon.onClick}
                    >
                        <div className="w-12 h-12 flex items-center justify-center">
                            {icon.icon}
                        </div>
                        <span
                            className="text-white text-sm font-bold text-center leading-tight mt-1"
                            style={{
                                textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000'
                            }}
                        >
                            {icon.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* Scanlines overlay for retro effect */}
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.03]"
                style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
                }}
            />
        </div>
    )
}

export default Desktop
