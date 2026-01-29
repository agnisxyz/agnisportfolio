import { useState, useCallback, useEffect, useRef } from 'react'

const responses = {
    greeting: "Hello! 👋 I'm Agnis's interactive CV. You can ask me about: skills, projects, experience, education, contact, or about!",
    skills: "🛠️ My Skills:\n\n• Unity & C# (5+ years)\n• Unreal Engine & Blueprints\n• Game Design & Level Design\n• 3D Modeling (Blender)\n• Shader Programming\n• Multiplayer & Networking\n• Git & Version Control\n• Agile/Scrum methodology",
    projects: "🎮 My Projects:\n\n1. 'Shadow Runner' - 2D Platformer (Unity)\n2. 'Space Colony' - Strategy game (Unreal)\n3. 'Puzzle Master' - Mobile puzzle game\n4. 'VR Explorer' - VR experience",
    experience: "💼 My Experience:\n\n• Senior Game Developer @ XYZ Studios (2021-Present)\n• Game Developer @ ABC Games (2019-2021)\n• Junior Developer @ Indie Studio (2017-2019)\n\nTotal: 7+ years in game development.",
    education: "🎓 My Education:\n\n• Computer Engineering BSc\n• Unity Certified Developer\n• Unreal Engine Certified\n• Various online courses & certifications",
    contact: "📧 Contact Me:\n\n• Email: agnis@example.com\n• LinkedIn: linkedin.com/in/agnis\n• GitHub: github.com/agnis\n• Portfolio: agnis.dev",
    about: "👨‍💻 About Me:\n\nHi! I'm Agnis, a passionate game developer. Gaming has been my life since childhood, and now I create my own games. I'm especially interested in indie games and innovative mechanics.",
    help: "❓ Help:\n\nYou can ask about:\n• skills - My abilities\n• projects - My work\n• experience - Work history\n• education - My background\n• contact - How to reach me\n• about - Who I am",
    thanks: "😊 You're welcome! Feel free to ask anything else!",
    default: "🤔 I don't have info on that. Type 'help' to see available topics!"
}

export function useChatbot() {
    const [messages, setMessages] = useState([
        { type: 'bot', text: responses.greeting }
    ])
    const [isTyping, setIsTyping] = useState(false)
    const [displayedText, setDisplayedText] = useState('')
    const typingIntervalRef = useRef(null)

    const getResponse = (input) => {
        const lowerInput = input.toLowerCase()

        if (lowerInput.includes('skill')) return responses.skills
        if (lowerInput.includes('project')) return responses.projects
        if (lowerInput.includes('experience') || lowerInput.includes('job')) return responses.experience
        if (lowerInput.includes('education') || lowerInput.includes('school')) return responses.education
        if (lowerInput.includes('contact') || lowerInput.includes('email')) return responses.contact
        if (lowerInput.includes('about') || lowerInput.includes('who')) return responses.about
        if (lowerInput.includes('help') || lowerInput.includes('?')) return responses.help
        if (lowerInput.includes('thank')) return responses.thanks
        if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) return responses.greeting

        return responses.default
    }

    const typeText = useCallback((fullText, onComplete) => {
        let currentIndex = 0
        setDisplayedText('')

        typingIntervalRef.current = setInterval(() => {
            if (currentIndex < fullText.length) {
                setDisplayedText(fullText.substring(0, currentIndex + 1))
                currentIndex++
            } else {
                clearInterval(typingIntervalRef.current)
                typingIntervalRef.current = null
                onComplete()
            }
        }, 20)
    }, [])

    const sendMessage = useCallback((text) => {
        setMessages(prev => [...prev, { type: 'user', text }])
        setIsTyping(true)

        const response = getResponse(text)

        setTimeout(() => {
            typeText(response, () => {
                setMessages(prev => [...prev, { type: 'bot', text: response }])
                setDisplayedText('')
                setIsTyping(false)
            })
        }, 300)
    }, [typeText])

    useEffect(() => {
        return () => {
            if (typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current)
            }
        }
    }, [])

    return { messages, sendMessage, isTyping, displayedText }
}
