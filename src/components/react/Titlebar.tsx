import { useState, useEffect } from 'react'
import CommandPalette from './CommandPalette'

interface TitlebarProps {
    currentPath: string
}

const TABS = [
    { id: 'home', label: 'home.tsx', path: '/' },
    { id: 'projects', label: 'proyectos/', path: '/proyectos' },
    { id: 'blog', label: 'blog/', path: '/blog' },
]

export default function Titlebar({ currentPath }: TitlebarProps) {
    const [paletteOpen, setPaletteOpen] = useState(false)
    const [theme, setTheme] = useState<'dark' | 'light'>('dark')

    useEffect(() => {
        const saved = (localStorage.getItem('theme') || 'dark') as 'dark' | 'light'
        setTheme(saved)
    }, [])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault()
                setPaletteOpen(true)
            }
            if (e.key === 'Escape') setPaletteOpen(false)
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        setTheme(newTheme)
        document.documentElement.setAttribute('data-theme', newTheme)
        localStorage.setItem('theme', newTheme)
    }

    const toggleSidebar = () => {
        window.dispatchEvent(new CustomEvent('toggle-sidebar'))
    }

    const getActiveTab = () => {
        if (currentPath === '/') return 'home'
        if (currentPath.startsWith('/proyectos')) return 'projects'
        if (currentPath.startsWith('/blog')) return 'blog'
        return 'home'
    }
    const activeTab = getActiveTab()

    const getCrumb = () => {
        if (currentPath === '/') return 'home.tsx'
        const parts = currentPath.split('/').filter(Boolean)
        return parts.join(' / ')
    }

    return (
        <>
            <div className="titlebar">
                {/* Dots decorativos */}
                <div className="dots">
                    <span className="dot r"></span>
                    <span className="dot y"></span>
                    <span className="dot g"></span>
                </div>

                {/* Botón hamburguesa */}
                <button
                    onClick={toggleSidebar}
                    title="Menú"
                    style={{ padding: '4px 6px', fontSize: 14 }}
                >
                    ☰
                </button>

                {/* Breadcrumb */}
                <div className="crumb">
                    obviousfancy
                    <span className="sep">/</span>
                    MejoLab
                    <span className="sep">—</span>
                    {getCrumb()}
                </div>

                {/* Botones derecha */}
                <div className="right">
                    <button onClick={() => setPaletteOpen(true)}>
                        buscar… <span className="kbd">⌘K</span>
                    </button>
                    <button onClick={toggleTheme} title="Cambiar tema">
                        {theme === 'dark' ? '🌙' : '☀️'}
                    </button>
                </div>
            </div>

            {/* Pestañas */}
            <div className="tabs" style={{ gridColumn: '1 / -1' }}>
                {TABS.map(tab => (
                    <a
                        key={tab.id}
                        href={tab.path}
                        className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                    >
                        <span className="dotty"></span>
                        <span>{tab.label}</span>
                    </a>
                ))}
            </div>

            {paletteOpen && (
                <CommandPalette onClose={() => setPaletteOpen(false)} />
            )}
        </>
    )
}
