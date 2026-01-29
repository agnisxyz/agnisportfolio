import { useState, useEffect, useRef } from 'react'

// Grid settings for snap-to-grid
const GRID_SIZE = 110 // pixels between grid points
const GRID_OFFSET_X = 20 // starting X offset
const GRID_OFFSET_Y = 20 // starting Y offset

function Desktop({ onIconClick, onRecycleBinClick, onMyComputerClick, onProjectsClick }) {
    // Load saved positions from localStorage or use defaults
    const getInitialPositions = () => {
        const saved = localStorage.getItem('desktopIconPositions_v2')
        if (saved) {
            return JSON.parse(saved)
        }
        // Default grid positions - each icon in different position
        return {
            mycomputer: { gridX: 0, gridY: 0 },
            recycle: { gridX: 0, gridY: 1 },
            projects: { gridX: 0, gridY: 2 },
            agnis: { gridX: 0, gridY: 3 }
        }
    }

    const [iconPositions, setIconPositions] = useState(getInitialPositions)
    const [draggingIcon, setDraggingIcon] = useState(null)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const [hasDragged, setHasDragged] = useState(false)
    const [tempPosition, setTempPosition] = useState(null)
    const desktopRef = useRef(null)

    // Save positions to localStorage when they change
    useEffect(() => {
        localStorage.setItem('desktopIconPositions_v2', JSON.stringify(iconPositions))
    }, [iconPositions])

    // Convert grid position to pixel position
    const gridToPixel = (gridX, gridY) => ({
        x: GRID_OFFSET_X + gridX * GRID_SIZE,
        y: GRID_OFFSET_Y + gridY * GRID_SIZE
    })

    // Convert pixel position to nearest grid position
    const pixelToGrid = (x, y, desktopWidth, desktopHeight) => {
        const maxGridX = Math.floor((desktopWidth - GRID_OFFSET_X - 100) / GRID_SIZE)
        const maxGridY = Math.floor((desktopHeight - GRID_OFFSET_Y - 100) / GRID_SIZE)

        const gridX = Math.round((x - GRID_OFFSET_X) / GRID_SIZE)
        const gridY = Math.round((y - GRID_OFFSET_Y) / GRID_SIZE)

        return {
            gridX: Math.max(0, Math.min(maxGridX, gridX)),
            gridY: Math.max(0, Math.min(maxGridY, gridY))
        }
    }

    // Check if a grid position is occupied by another icon
    const isPositionOccupied = (gridX, gridY, excludeIconId) => {
        return Object.entries(iconPositions).some(([id, pos]) => {
            if (id === excludeIconId) return false
            return pos.gridX === gridX && pos.gridY === gridY
        })
    }

    // Find nearest unoccupied grid position
    const findNearestFreePosition = (gridX, gridY, excludeIconId, desktopWidth, desktopHeight) => {
        if (!isPositionOccupied(gridX, gridY, excludeIconId)) {
            return { gridX, gridY }
        }

        const maxGridX = Math.floor((desktopWidth - GRID_OFFSET_X - 100) / GRID_SIZE)
        const maxGridY = Math.floor((desktopHeight - GRID_OFFSET_Y - 100) / GRID_SIZE)

        // Search in expanding squares
        for (let distance = 1; distance <= Math.max(maxGridX, maxGridY) + 1; distance++) {
            for (let dx = -distance; dx <= distance; dx++) {
                for (let dy = -distance; dy <= distance; dy++) {
                    if (Math.abs(dx) !== distance && Math.abs(dy) !== distance) continue

                    const newX = gridX + dx
                    const newY = gridY + dy

                    if (newX >= 0 && newX <= maxGridX && newY >= 0 && newY <= maxGridY) {
                        if (!isPositionOccupied(newX, newY, excludeIconId)) {
                            return { gridX: newX, gridY: newY }
                        }
                    }
                }
            }
        }

        return { gridX, gridY } // Fallback to original
    }

    const handleMouseDown = (e, iconId) => {
        e.preventDefault()
        e.stopPropagation()
        const iconElement = e.currentTarget
        const rect = iconElement.getBoundingClientRect()
        setDraggingIcon(iconId)
        setHasDragged(false)
        setTempPosition(null)
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        })
    }

    const handleMouseMove = (e) => {
        if (!draggingIcon || !desktopRef.current) return

        setHasDragged(true)

        const desktopRect = desktopRef.current.getBoundingClientRect()
        const newX = e.clientX - desktopRect.left - dragOffset.x
        const newY = e.clientY - desktopRect.top - dragOffset.y

        setTempPosition({ x: newX, y: newY })
    }

    const handleMouseUp = () => {
        if (draggingIcon && hasDragged && desktopRef.current && tempPosition) {
            const desktopRect = desktopRef.current.getBoundingClientRect()

            const { gridX, gridY } = pixelToGrid(
                tempPosition.x,
                tempPosition.y,
                desktopRect.width,
                desktopRect.height
            )

            const freePos = findNearestFreePosition(
                gridX,
                gridY,
                draggingIcon,
                desktopRect.width,
                desktopRect.height
            )

            setIconPositions(prev => ({
                ...prev,
                [draggingIcon]: freePos
            }))
        }

        setDraggingIcon(null)
        setTempPosition(null)
    }

    useEffect(() => {
        if (draggingIcon) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
            return () => {
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
            }
        }
    }, [draggingIcon, dragOffset, hasDragged, tempPosition])

    const handleIconClick = (e, callback) => {
        if (!hasDragged && callback) {
            callback()
        }
    }

    // Icon definitions - all same size now
    const icons = [
        {
            id: 'mycomputer',
            label: 'My Computer',
            icon: (
                <svg width="80" height="80" viewBox="0 0 48 48" className="pixelated drop-shadow-lg">
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
            callback: onMyComputerClick
        },
        {
            id: 'recycle',
            label: 'Recycle Bin',
            icon: (
                <svg width="80" height="80" viewBox="0 0 48 48" className="pixelated drop-shadow-lg">
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
            callback: onRecycleBinClick
        },
        {
            id: 'projects',
            label: 'Projects',
            icon: (
                <svg width="80" height="80" viewBox="0 0 48 48" className="pixelated drop-shadow-lg">
                    <rect x="4" y="12" width="40" height="32" fill="#c0a000" />
                    <rect x="4" y="12" width="40" height="2" fill="#ffff00" />
                    <rect x="4" y="12" width="2" height="32" fill="#ffff00" />
                    <rect x="42" y="12" width="2" height="32" fill="#806000" />
                    <rect x="4" y="42" width="40" height="2" fill="#806000" />
                    <rect x="4" y="8" width="16" height="6" fill="#c0a000" />
                    <rect x="4" y="8" width="16" height="2" fill="#ffff00" />
                    <rect x="4" y="8" width="2" height="6" fill="#ffff00" />
                    <rect x="6" y="18" width="36" height="24" fill="#ffcc00" />
                    <rect x="6" y="18" width="36" height="2" fill="#ffff80" />
                    <rect x="6" y="18" width="2" height="24" fill="#ffff80" />
                    <rect x="16" y="26" width="16" height="8" fill="#404040" />
                    <rect x="14" y="28" width="4" height="4" fill="#404040" />
                    <rect x="30" y="28" width="4" height="4" fill="#404040" />
                    <rect x="19" y="28" width="2" height="2" fill="#00ff00" />
                    <rect x="27" y="28" width="2" height="2" fill="#ff0000" />
                </svg>
            ),
            callback: onProjectsClick
        },
        {
            id: 'agnis',
            label: 'Agnis.exe',
            icon: (
                <svg width="80" height="80" viewBox="0 0 48 48" className="pixelated drop-shadow-lg">
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
            callback: onIconClick
        }
    ]

    return (
        <div ref={desktopRef} className="absolute inset-0 p-4">
            {/* Draggable Icons */}
            {icons.map((icon) => {
                const isDraggingThis = draggingIcon === icon.id

                let positionStyle
                if (isDraggingThis && tempPosition) {
                    positionStyle = {
                        left: `${tempPosition.x}px`,
                        top: `${tempPosition.y}px`
                    }
                } else {
                    const pos = iconPositions[icon.id] || { gridX: 0, gridY: 0 }
                    const pixelPos = gridToPixel(pos.gridX, pos.gridY)
                    positionStyle = {
                        left: `${pixelPos.x}px`,
                        top: `${pixelPos.y}px`
                    }
                }

                return (
                    <div
                        key={icon.id}
                        className={`desktop-icon-container absolute flex flex-col items-center justify-start p-2 rounded select-none cursor-pointer w-[100px] ${isDraggingThis ? 'opacity-70 z-50' : 'transition-all duration-150'
                            }`}
                        style={{
                            ...positionStyle,
                            cursor: isDraggingThis ? 'grabbing' : 'pointer'
                        }}
                        onMouseDown={(e) => handleMouseDown(e, icon.id)}
                        onClick={(e) => handleIconClick(e, icon.callback)}
                    >
                        <div className="w-20 h-20 flex items-center justify-center">
                            {icon.icon}
                        </div>
                        <span
                            className="text-white text-sm font-bold text-center leading-tight mt-2"
                            style={{
                                textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000'
                            }}
                        >
                            {icon.label}
                        </span>
                    </div>
                )
            })}

            {/* Scanlines overlay */}
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
