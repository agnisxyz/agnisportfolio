import { AlertTriangle } from 'lucide-react'

function ErrorPopup({ message, onClose }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-[200]">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20" onClick={onClose} />

            {/* Error Window */}
            <div className="win95-window relative flex flex-col min-w-[350px] max-w-[500px] animate-bounce-in">
                {/* Title Bar */}
                <div className="title-bar-gradient h-[22px] flex items-center justify-between px-2 select-none">
                    <span className="text-white text-sm font-bold">ℹ️ Information</span>
                    <button
                        onClick={onClose}
                        className="close-button w-[16px] h-[14px]"
                    >
                        <span className="text-black text-xs font-bold">×</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 flex gap-4 items-start">
                    <div className="text-4xl">
                        <AlertTriangle size={40} className="text-yellow-500" />
                    </div>
                    <div className="flex-1 whitespace-pre-wrap text-base leading-relaxed">
                        {message}
                    </div>
                </div>

                {/* Buttons */}
                <div className="p-3 flex justify-center gap-3 border-t border-[#808080]">
                    <button
                        onClick={onClose}
                        className="win95-button px-8 py-1 text-base font-bold"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ErrorPopup
