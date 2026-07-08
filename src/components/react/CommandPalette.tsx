import{useState, useEffect,useRef} from 'react'

interface CommandPaletteProps{
    onClose: () => void;
}

interface Command{
    id: string
    label: string
    icon: string
    where: string 
    route: string
}

// Lista de páginas/comandos disponibles en el palette
const COMMANDS: Command[] = [
    { id: 'home', label: 'home.tsx', icon: '▶', where: '/', route: '/' },
    { id: 'sobre', label: 'sobre-mi.md', icon: '◆', where: '/', route: '/sobre-mi' },
    { id: 'now', label: 'now.md', icon: '◆', where: '/', route: '/now' },
    { id: 'proyectos', label: 'proyectos/', icon: '▾', where: '/WORK', route: '/proyectos' },
    { id: 'prototipos', label: 'prototipos/', icon: '▾', where: '/WORK', route: '/prototipos' },
    { id: 'stack', label: 'stack.yaml', icon: '≡', where: '/WORK', route: '/stack' },
    { id: 'uses', label: 'uses.md', icon: '◇', where: '/WORK', route: '/uses' },
    { id: 'wiki', label: 'wiki/', icon: '▾', where: '/NOTES', route: '/wiki' },
    { id: 'blog', label: 'blog/', icon: '▾', where: '/NOTES', route: '/blog' },
    { id: 'lectura', label: 'lectura.md', icon: '◆', where: '/NOTES', route: '/lectura' },
    { id: 'changelog', label: 'CHANGELOG.md', icon: '△', where: '/META', route: '/changelog' },
    { id: 'contacto', label: 'contacto.sh', icon: '$', where: '/META', route: '/contacto' },
]

export default function CommandPalette({ onClose }: CommandPaletteProps) {
    const [query, setQuery] = useState('')
    const [selectedIdx, setSelectedIdx] = useState(0)
    const inputRef = useRef<HTMLInputElement>(null)

    // Filtrar comandos por la query
    const filtered = COMMANDS.filter(cmd =>
        cmd.label.toLowerCase().includes(query.toLowerCase()) ||
        cmd.where.toLowerCase().includes(query.toLowerCase())
    )

    // Auto-focus al abrir
    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    // Reset selección al cambiar query
    useEffect(() => {
        setSelectedIdx(0)
    }, [query])

    // Navegación con teclado
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault()
                setSelectedIdx(idx => Math.min(idx + 1, filtered.length - 1))
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault()
                setSelectedIdx(idx => Math.max(idx - 1, 0))
            }
            if (e.key === 'Enter' && filtered[selectedIdx]) {
                window.location.href = filtered[selectedIdx].route
            }
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [filtered, selectedIdx])

    // Cerrar al hacer click en el backdrop
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose()
    }

    return (
        <div className="cmdk-backdrop" onClick={handleBackdropClick}>
            <div className="cmdk">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Buscar páginas, comandos…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <div className="cmdk-list">
                    <div className="cmdk-head">Navegación</div>
                    {filtered.length === 0 ? (
                        <div className="cmdk-item" style={{ color: 'var(--fg-3)' }}>
                            Sin resultados para "{query}"
                        </div>
                    ) : (
                        filtered.map((cmd, idx) => (
                            <a
                                key={cmd.id}
                                href={cmd.route}
                                className={`cmdk-item ${idx === selectedIdx ? 'sel' : ''}`}
                                onMouseEnter={() => setSelectedIdx(idx)}
                            >
                                <span className="ic">{cmd.icon}</span>
                                <span>{cmd.label}</span>
                                <span className="where">{cmd.where}</span>
                            </a>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}