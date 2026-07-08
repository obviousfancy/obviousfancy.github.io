import { useState, useEffect, useRef } from 'react'

// Tipos de líneas que pueden aparecer en la terminal
type Line =
    | { type: 'prompt'; cmd: string }
    | { type: 'output'; content: React.ReactNode }
    | { type: 'spacer' }

// Las respuestas estáticas de cada comando
const COMMANDS: Record<string, () => React.ReactNode> = {
    'whoami --verbose': () => (
        <div style={{ paddingLeft: 0 }}>
            <Row k="handle" v="obviousfancy" />
            <Row k="brand" v="MejoLab" />
            <Row k="rol" v="Embedded Systems Engineer · Firmware · Hardware" />
            <Row k="stack" v="STM32 · ESP32 · KiCad · Kotlin · C/C++" />
            <Row k="location" v="México" />
            <Row k="estado" v={<span style={{ color: 'var(--accent-2)' }}>● disponible para colaboraciones — Q2 2026</span>} />
            <Row k="contact" v={<a href="mailto:contact@mejolab.com" style={{ color: 'var(--accent-3)' }}>contact@mejolab.com</a>} />
        </div>
    ),
    'whoami': () => <span>obviousfancy</span>,
    'cat manifesto.md': () => (
        <p style={{ margin: '8px 0 0', fontFamily: 'var(--font-sans)', maxWidth: '68ch', lineHeight: 1.7, color: 'var(--fg-1)' }}>
            Diseño y construyo cosas que tocan el mundo físico: firmware que corre cerca del metal,
            PCBs que llegan del horno de reflow, sistemas que hacen ruido o miden voltajes. También
            hago videojuegos en Unreal porque me gusta el otro lado del problema —el simbólico.
            Documento todo lo que rompo. Si está aquí, es porque pensé que a alguien más le serviría.
        </p>
    ),
    'help': () => (
        <div style={{ color: 'var(--fg-1)' }}>
            <div>Comandos disponibles:</div>
            <div style={{ paddingLeft: 16, marginTop: 4 }}>
                <div><span style={{ color: 'var(--accent)' }}>whoami</span> — quién soy</div>
                <div><span style={{ color: 'var(--accent)' }}>skills</span> — mi stack técnico</div>
                <div><span style={{ color: 'var(--accent)' }}>projects</span> — proyectos activos</div>
                <div><span style={{ color: 'var(--accent)' }}>contact</span> — cómo contactarme</div>
                <div><span style={{ color: 'var(--accent)' }}>clear</span> — limpiar terminal</div>
            </div>
        </div>
    ),
    'skills': () => (
        <div>
            <Row k="firmware" v="C/C++ · Rust · STM32 HAL · ESP-IDF" />
            <Row k="hardware" v="KiCad · Altium · Fusion 360" />
            <Row k="mobile" v="Kotlin · Android Studio · Jetpack Compose" />
            <Row k="web" v="Astro · React · Tailwind · TypeScript" />
        </div>
    ),
    'projects': () => (
        <div>
            <Row k="smartlight" v="Panel LED ESP32 con CCT y WS2812B" />
            <Row k="hexconverter" v="App Android para debugging de MCUs" />
            <Row k="serialmcu" v="Comunicación serial USB OTG desde Android" />
        </div>
    ),
    'contact': () => (
        <div>
            <Row k="email" v={<a href="mailto:contact@mejolab.com">contact@mejolab.com</a>} />
            <Row k="github" v={<a href="https://github.com/obviousfancy">github.com/obviousfancy</a>} />
        </div>
    ),
    'sudo rm -rf /': () => (
        <span style={{ color: 'var(--warn)' }}>jaja no.</span>
    ),
}

// Secuencia inicial que se ejecuta automáticamente al cargar
const INTRO_SEQUENCE = [
    'whoami --verbose',
    'cat manifesto.md',
    'help',
]

// Helper para renderizar una fila clave-valor
function Row({ k, v }: { k: string; v: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', gap: 24 }}>
            <span style={{ color: 'var(--fg-3)', minWidth: 90 }}>{k}</span>
            <span style={{ color: 'var(--fg-0)' }}>{v}</span>
        </div>
    )
}

function Prompt({ cmd }: { cmd: string }) {
    return (
        <div style={{ fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: 'var(--accent-2)' }}>obviousfancy</span>
            <span style={{ color: 'var(--fg-3)' }}>@</span>
            <span style={{ color: 'var(--accent)' }}>mejolab</span>
            <span style={{ color: 'var(--fg-3)' }}>:~$</span>
            {' '}
            <span style={{ color: 'var(--fg-0)' }}>{cmd}</span>
        </div>
    )
}

export default function Terminal() {
    const [lines, setLines] = useState<Line[]>([])
    const [currentInput, setCurrentInput] = useState('')
    const [isTyping, setIsTyping] = useState(true)
    const [introDone, setIntroDone] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const bodyRef = useRef<HTMLDivElement>(null)

    // Animación typewriter para la secuencia inicial
    useEffect(() => {
        if (introDone) return

        let cancelled = false
        const runIntro = async () => {
            for (const cmd of INTRO_SEQUENCE) {
                if (cancelled) return

                // Escribir el comando letra por letra
                for (let i = 1; i <= cmd.length; i++) {
                    if (cancelled) return
                    setLines(prev => {
                        const last = prev[prev.length - 1]
                        // Si la última línea es un prompt en progreso, actualizar
                        if (last?.type === 'prompt' && last.cmd === cmd.slice(0, i - 1)) {
                            return [...prev.slice(0, -1), { type: 'prompt', cmd: cmd.slice(0, i) }]
                        }
                        // Si no, agregar nueva línea prompt
                        return [...prev, { type: 'prompt', cmd: cmd.slice(0, i) }]
                    })
                    await sleep(30)
                }

                await sleep(200)

                // Agregar la salida del comando
                if (cancelled) return
                const output = COMMANDS[cmd]
                if (output) {
                    setLines(prev => [
                        ...prev,
                        { type: 'output', content: output() },
                        { type: 'spacer' },
                    ])
                }
                await sleep(400)
            }

            setIsTyping(false)
            setIntroDone(true)
        }

        runIntro()
        return () => { cancelled = true }
    }, [])

    // Auto-scroll al fondo cuando se agregan líneas
    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight
        }
    }, [lines])

    // Manejar input del usuario después del intro
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const cmd = currentInput.trim()
        if (!cmd) return

        if (cmd === 'clear') {
            setLines([])
            setCurrentInput('')
            return
        }

        const output = COMMANDS[cmd]
        setLines(prev => [
            ...prev,
            { type: 'prompt', cmd },
            output
                ? { type: 'output', content: output() }
                : { type: 'output', content: <span style={{ color: 'var(--fg-3)' }}>comando no encontrado: {cmd}. Prueba con "help"</span> },
            { type: 'spacer' },
        ])
        setCurrentInput('')
    }

    return (
        <div
            className="terminal card-glass fade-in"
            style={{
                fontFamily: 'var(--font-mono)',
                borderRadius: 8,
                maxWidth: '4xl',
                width: '100%',
                margin: '0 auto',
                overflow: 'hidden',
            }}
            onClick={() => inputRef.current?.focus()}
        >
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                borderBottom: '1px solid var(--border-soft)',
            }}>
                <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ width: 11, height: 11, borderRadius: '50%', background: 'oklch(0.65 0.18 25)' }}></span>
                    <span style={{ width: 11, height: 11, borderRadius: '50%', background: 'oklch(0.80 0.14 80)' }}></span>
                    <span style={{ width: 11, height: 11, borderRadius: '50%', background: 'oklch(0.78 0.14 145)' }}></span>
                </div>
                <span style={{ color: 'var(--fg-3)', fontSize: 11, marginLeft: 8 }}>
                    obviousfancy@mejolab : ~ — zsh
                </span>
            </div>

            {/* Body */}
            <div
                ref={bodyRef}
                style={{
                    padding: 18,
                    fontSize: 13,
                    lineHeight: 1.7,
                    maxHeight: 480,
                    overflowY: 'auto',
                }}
            >
                {lines.map((line, idx) => {
                    if (line.type === 'prompt') return <Prompt key={idx} cmd={line.cmd} />
                    if (line.type === 'output') return <div key={idx} style={{ marginTop: 4 }}>{line.content}</div>
                    if (line.type === 'spacer') return <div key={idx} style={{ height: 8 }}></div>
                    return null
                })}

                {/* Input activo después del intro */}
                {!isTyping && (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Prompt cmd="" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={currentInput}
                            onChange={e => setCurrentInput(e.target.value)}
                            style={{
                                flex: 1,
                                background: 'transparent',
                                border: 0,
                                outline: 'none',
                                color: 'var(--fg-0)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: 13,
                            }}
                            autoFocus
                        />
                        <span className="blink" style={{ color: 'var(--accent)' }}>▊</span>
                    </form>
                )}
            </div>
        </div>
    )
}

// Helper de sleep para la animación
function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
