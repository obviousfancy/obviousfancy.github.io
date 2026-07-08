import { useState, useEffect } from 'react'

interface SidebarProps {
    currentPath: string
}

interface SidebarItem {
    id: string
    label: string
    icon: string
    route: string
    badge?: number
    live?: boolean
}

interface SidebarGroup {
    group: string
    items: SidebarItem[]
}

const GROUPS: SidebarGroup[] = [
    {
        group: '/',
        items: [
            { id: 'home', label: 'home.tsx', icon: '▶', route: '/' },
            { id: 'sobre', label: 'sobre-mi.md', icon: '◆', route: '/sobre-mi' },
            { id: 'now', label: 'now.md', icon: '◆', route: '/now', live: true },
        ]
    },
    {
        group: '/WORK',
        items: [
            { id: 'proyectos', label: 'proyectos/', icon: '▾', route: '/proyectos', badge: 4 },
            { id: 'prototipos', label: 'prototipos/', icon: '▾', route: '/prototipos', badge: 7 },
            { id: 'stack', label: 'stack.yaml', icon: '≡', route: '/stack' },
            { id: 'uses', label: 'uses.md', icon: '◇', route: '/uses' },
        ]
    },
    {
        group: '/NOTES',
        items: [
            { id: 'wiki', label: 'wiki/', icon: '▾', route: '/wiki', badge: 32 },
            { id: 'blog', label: 'blog/', icon: '▾', route: '/blog', badge: 12 },
            { id: 'lectura', label: 'lectura.md', icon: '◆', route: '/lectura' },
        ]
    },
    {
        group: '/META',
        items: [
            { id: 'changelog', label: 'CHANGELOG.md', icon: '△', route: '/changelog' },
            { id: 'contacto', label: 'contacto.sh', icon: '$', route: '/contacto' },
        ]
    },
]

export default function Sidebar({ currentPath }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

    // Escuchar el evento del botón hamburguesa en Titlebar
    useEffect(() => {
        const handler = () => setIsOpen(prev => !prev)
        window.addEventListener('toggle-sidebar', handler)
        return () => window.removeEventListener('toggle-sidebar', handler)
    }, [])

    // Cerrar al hacer click fuera del sidebar
    useEffect(() => {
        if (!isOpen) return
        const handler = (e: MouseEvent) => {
            const sidebar = document.getElementById('sidebar-panel')
            if (sidebar && !sidebar.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [isOpen])

    const toggleSection = (groupName: string) => {
        const next = new Set(collapsed)
        if (next.has(groupName)) {
            next.delete(groupName)
        } else {
            next.add(groupName)
        }
        setCollapsed(next)
    }

    const isActive = (route: string) => {
        if (route === '/') return currentPath === '/'
        return currentPath.startsWith(route)
    }

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop semitransparente */}
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 40,
                    background: 'oklch(0.10 0.015 230 / 0.4)',
                }}
                onClick={() => setIsOpen(false)}
            />

            {/* Panel de la sidebar */}
            <aside
                id="sidebar-panel"
                className="sidebar"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    height: '100vh',
                    width: 260,
                    zIndex: 50,
                    boxShadow: '4px 0 24px oklch(0 0 0 / 0.4)',
                    animation: 'slideIn 0.2s ease',
                }}
            >
                {/* Header de proyecto */}
                <div style={{ padding: '4px 14px 14px', borderBottom: '1px solid var(--border-soft)', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="av" style={{ width: 24, height: 24 }}>M</div>
                        <div style={{ color: 'var(--fg-0)', fontWeight: 600 }}>MejoLab</div>
                    </div>
                    <div style={{ color: 'var(--fg-3)', fontSize: 10.5, marginTop: 6 }}>
                        v0.4.2 · main · 2026-05-22
                    </div>
                </div>

                {/* Grupos de archivos */}
                {GROUPS.map(group => (
                    <div key={group.group}>
                        <div
                            className="sb-section"
                            onClick={() => toggleSection(group.group)}
                            style={{ cursor: 'pointer' }}
                        >
                            {group.group}
                        </div>
                        {!collapsed.has(group.group) && group.items.map(item => (
                            <a
                                key={item.id}
                                href={item.route}
                                className={`sb-item ${isActive(item.route) ? 'active' : ''}`}
                                onClick={() => setIsOpen(false)}
                            >
                                <span className="ic">{item.icon}</span>
                                <span>{item.label}</span>
                                {item.live && <span className="pulse" style={{ marginLeft: 6 }}></span>}
                                {item.badge !== undefined && (
                                    <span className="badge">{item.badge}</span>
                                )}
                            </a>
                        ))}
                    </div>
                ))}

                {/* Footer */}
                <div className="sb-foot">
                    <div className="who">
                        <div className="av">O</div>
                        <div>
                            <div>obviousfancy</div>
                            <div style={{ fontSize: 10, color: 'var(--fg-3)' }}>el ingeniero del taller</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span className="pulse"></span>
                        <span>Disponible para colaboraciones — Q2 2026</span>
                    </div>
                </div>
            </aside>
        </>
    )
}
