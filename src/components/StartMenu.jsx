import { FolderOpen, Settings, Power, HelpCircle, Gamepad2 } from 'lucide-react'

function StartMenu({ onClose, onOpenChat, onShutdown }) {
    const menuItems = [
        { icon: <FolderOpen size={20} />, label: 'Programs', submenu: true },
        { icon: <Gamepad2 size={20} />, label: 'Games', submenu: true },
        { icon: <Settings size={20} />, label: 'Settings', submenu: true },
        { icon: <HelpCircle size={20} />, label: 'Help', onClick: onOpenChat },
        { divider: true },
        { icon: <Power size={20} />, label: 'Shut Down...', onClick: onShutdown, special: true },
    ]

    return (
        <>
            {/* Backdrop to close menu */}
            <div
                className="fixed inset-0 z-[150]"
                onClick={onClose}
            />

            {/* Start Menu */}
            <div
                className="win95-window absolute bottom-[32px] left-0 z-[160] min-w-[200px]"
                style={{ boxShadow: '4px 4px 8px rgba(0,0,0,0.3)' }}
            >
                {/* Blue sidebar */}
                <div className="flex">
                    <div className="w-[28px] bg-gradient-to-b from-[#000080] to-[#1084d0] flex items-end justify-center pb-2">
                        <span
                            className="text-white font-bold text-sm"
                            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                        >
                            Windows 95
                        </span>
                    </div>

                    {/* Menu Items */}
                    <div className="flex-1 py-1">
                        {menuItems.map((item, index) => (
                            item.divider ? (
                                <div key={index} className="h-[2px] mx-2 my-1 bg-[#808080] border-b border-white" />
                            ) : (
                                <div
                                    key={index}
                                    onClick={() => {
                                        if (item.onClick) {
                                            item.onClick()
                                        } else {
                                            onClose()
                                        }
                                    }}
                                    className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#000080] hover:text-white ${item.special ? 'text-black' : ''
                                        }`}
                                >
                                    <span className="w-6 flex justify-center">{item.icon}</span>
                                    <span className="flex-1 text-base">{item.label}</span>
                                    {item.submenu && <span className="text-xs">▶</span>}
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default StartMenu
