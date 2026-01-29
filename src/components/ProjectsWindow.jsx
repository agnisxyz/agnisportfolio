import { useState, useEffect } from 'react'
import { X, ExternalLink, Github } from 'lucide-react'
import { projects } from '../data/projectsData'

function ProjectsWindow({ onClose, onMinimize, position, setPosition, isMinimized }) {
    const [selectedProject, setSelectedProject] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

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
            const newX = Math.max(0, Math.min(window.innerWidth - 700, e.clientX - dragOffset.x))
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

    if (isMinimized) {
        return null
    }

    // Render media (image, gif, or video)
    const renderMedia = (project) => {
        if (!project.media) return null

        const { type, url } = project.media

        if (type === 'video') {
            return (
                <div className="relative w-full max-h-[250px] bg-black rounded overflow-hidden border-2 border-[#808080]" style={{ borderStyle: 'inset' }}>
                    <video
                        src={url}
                        controls
                        className="w-full h-full max-h-[250px] object-contain"
                        poster={project.media.poster}
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            )
        }

        // image or gif
        return (
            <div className="w-full max-h-[250px] bg-black rounded overflow-hidden border-2 border-[#808080] flex items-center justify-center" style={{ borderStyle: 'inset' }}>
                <img
                    src={url}
                    alt={project.name}
                    className="max-w-full max-h-[250px] object-contain"
                />
            </div>
        )
    }

    return (
        <div
            className="win95-window absolute flex flex-col window-open"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: 'min(1300px, calc(100vw - 20px))',
                height: 'min(850px, calc(100vh - 60px))',
                zIndex: 100
            }}
            onMouseDown={handleMouseDown}
        >
            {/* Title Bar */}
            <div className="title-bar-gradient title-bar-draggable h-[26px] flex items-center justify-between px-2 cursor-move select-none">
                <div className="flex items-center gap-2">
                    <span className="text-white text-lg font-bold truncate">📁 Projects</span>
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

            {/* Menu Bar */}
            <div className="bg-[#c0c0c0] border-b border-[#808080] px-2 py-1 flex gap-6 text-base">
                <span className="hover:bg-[#000080] hover:text-white px-2 cursor-default">File</span>
                <span className="hover:bg-[#000080] hover:text-white px-2 cursor-default">Edit</span>
                <span className="hover:bg-[#000080] hover:text-white px-2 cursor-default">View</span>
                <span className="hover:bg-[#000080] hover:text-white px-2 cursor-default">Help</span>
            </div>

            {/* Address Bar */}
            <div className="bg-[#c0c0c0] border-b border-[#808080] px-2 py-1 flex items-center gap-2">
                <span className="text-sm">Address:</span>
                <div className="win95-input flex-1 px-2 py-1 text-sm bg-white">
                    C:\Users\Agnis\Projects
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex min-h-0">
                {/* Left Panel - File List */}
                <div className="w-[300px] bg-white border-r-2 border-[#808080] overflow-y-auto p-2">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            onClick={() => setSelectedProject(project)}
                            className={`flex items-center gap-3 p-3 cursor-pointer select-none rounded ${selectedProject?.id === project.id
                                ? 'bg-[#000080] text-white'
                                : 'hover:bg-[#e0e0e0]'
                                }`}
                        >
                            <span className="text-3xl">{project.icon}</span>
                            <div className="flex flex-col">
                                <span className="font-bold">{project.name}</span>
                                <span className={`text-xs ${selectedProject?.id === project.id ? 'text-gray-300' : 'text-gray-500'
                                    }`}>
                                    {project.year}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Panel - Details */}
                <div className="flex-1 bg-white p-6 overflow-y-auto">
                    {selectedProject ? (
                        <div className="space-y-5">
                            {/* Project Header */}
                            <div className="flex items-center gap-4 border-b-2 border-[#c0c0c0] pb-4">
                                <span className="text-6xl">{selectedProject.icon}</span>
                                <div>
                                    <h2 className="text-3xl font-bold">{selectedProject.name}</h2>
                                    <p className="text-gray-600 text-lg">{selectedProject.description}</p>
                                </div>
                            </div>

                            {/* Media Section */}
                            {selectedProject.media && (
                                <div>
                                    <h3 className="font-bold text-lg mb-3">📺 Preview</h3>
                                    {renderMedia(selectedProject)}
                                </div>
                            )}

                            {/* Details */}
                            <div>
                                <h3 className="font-bold text-lg mb-2">📝 Description</h3>
                                <p className="text-gray-700 bg-[#f0f0f0] p-4 border-2 border-[#808080] text-base leading-relaxed" style={{
                                    borderStyle: 'inset'
                                }}>
                                    {selectedProject.details}
                                </p>
                            </div>

                            {/* Technologies */}
                            <div>
                                <h3 className="font-bold text-lg mb-2">🛠️ Technologies</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedProject.technologies.map((tech, index) => (
                                        <span
                                            key={index}
                                            className="px-4 py-2 bg-[#c0c0c0] border-2 text-sm font-bold"
                                            style={{
                                                borderColor: '#fff #808080 #808080 #fff'
                                            }}
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Links */}
                            <div>
                                <h3 className="font-bold text-lg mb-2">🔗 Links</h3>
                                <div className="flex gap-3">
                                    {selectedProject.links.github && (
                                        <a
                                            href={selectedProject.links.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="win95-button px-5 py-2 flex items-center gap-2 text-base"
                                        >
                                            <Github size={18} />
                                            GitHub
                                        </a>
                                    )}
                                    {selectedProject.links.demo && (
                                        <a
                                            href={selectedProject.links.demo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="win95-button px-5 py-2 flex items-center gap-2 text-base"
                                        >
                                            <ExternalLink size={18} />
                                            Demo
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500">
                            <div className="text-center">
                                <span className="text-8xl mb-6 block">📂</span>
                                <p className="text-xl">Select a project</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Status Bar */}
            <div className="bg-[#c0c0c0] border-t border-white px-3 py-1 text-sm flex justify-between">
                <div className="win95-sunken px-3 flex-1 mr-2">
                    {selectedProject ? `🎮 ${selectedProject.name} selected` : `📁 ${projects.length} project(s)`}
                </div>
                <div className="win95-sunken px-3">
                    🎮 Games
                </div>
            </div>
        </div>
    )
}

export default ProjectsWindow
