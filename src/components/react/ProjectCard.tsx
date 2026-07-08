import { useState } from 'react'
import StatusPill from './StatusPill'

interface Metric {
    k: string
    v: string
}

interface ProjectCardProps {
    id: string
    title: string
    year: string
    tag: string
    summary: string
    stack: string[]
    status: 'ship' | 'beta' | 'alpha' | 'wip'
    role: string
    color?: string
    metrics?: Metric[]
    url?: string
}

// Bloque de estadística con borde izquierdo del color del acento
function StatBlock({ label, value, accent = 'accent' }: { label: string; value: string; accent?: string }) {
    return (
        <div style={{
            borderLeft: `2px solid var(--${accent})`,
            paddingLeft: 12,
        }}>
            <div style={{
                fontSize: 10.5,
                color: 'var(--fg-3)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontFamily: 'var(--font-mono)',
            }}>
                {label}
            </div>
            <div style={{
                fontSize: 18,
                color: 'var(--fg-0)',
                fontWeight: 600,
                marginTop: 2,
                fontFamily: 'var(--font-mono)',
            }}>
                {value}
            </div>
        </div>
    )
}

// Placeholder de imagen con patrón de rayas diagonales
function Placeholder({ label, accent = 'accent' }: { label: string; accent?: string }) {
    return (
        <div style={{
            position: 'relative',
            height: 160,
            borderRadius: 6,
            overflow: 'hidden',
            border: '1px solid var(--border-soft)',
            background: 'repeating-linear-gradient(135deg, var(--bg-2) 0 12px, var(--bg-1) 12px 24px)',
        }}>
            <div style={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                placeItems: 'center',
                color: 'var(--fg-3)',
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
            }}>
                [ {label} ]
            </div>
            <div style={{
                position: 'absolute',
                top: 8,
                left: 8,
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: `var(--${accent})`,
            }}></div>
        </div>
    )
}

export default function ProjectCard({
    id, title, year, tag, summary, stack, status, role, color = 'accent', metrics = [], url
}: ProjectCardProps) {
    const [expanded, setExpanded] = useState(false)

    const handleClick = (e: React.MouseEvent) => {
        // Si tiene url y no se está expandiendo, navegar
        // Si no, solo toggle
        e.preventDefault()
        setExpanded(!expanded)
    }

    return (
        <div
            className="card card-glass fade-in"
            style={{
                padding: 'var(--density-pad)',
                cursor: 'pointer',
                position: 'relative',
            }}
            onClick={handleClick}
        >
            {/* Header con año, título y status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                <div style={{ minWidth: 0 }}>
                    <div style={{
                        fontSize: 10.5,
                        color: 'var(--fg-3)',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-mono)',
                    }}>
                        {year}
                    </div>
                    <h3 style={{ fontSize: 18, margin: '4px 0 6px', color: 'var(--fg-0)' }}>
                        {title}
                    </h3>
                    <div style={{ fontSize: 11.5, color: 'var(--fg-2)', fontFamily: 'var(--font-mono)' }}>
                        {tag}
                    </div>
                </div>
                <StatusPill status={status} />
            </div>

            {/* Placeholder de imagen */}
            <Placeholder label={`screenshot · ${id}`} accent={color} />

            {/* Descripción */}
            <p style={{
                fontSize: 12.5,
                color: 'var(--fg-1)',
                margin: '14px 0 12px',
                lineHeight: 1.6,
                fontFamily: 'var(--font-sans)',
            }}>
                {summary}
            </p>

            {/* Stack como tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
                {stack.map(s => (
                    <span key={s} className="tag">{s}</span>
                ))}
            </div>

            {/* Sección expandible con métricas */}
            {expanded && metrics.length > 0 && (
                <div
                    className="fade-in"
                    style={{
                        borderTop: '1px solid var(--border-soft)',
                        paddingTop: 14,
                        marginTop: 4,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 12,
                    }}
                >
                    {metrics.map(m => (
                        <StatBlock key={m.k} label={m.k} value={m.v} accent={color} />
                    ))}
                </div>
            )}

            {/* Footer */}
            <div style={{
                marginTop: 12,
                fontSize: 10.5,
                color: 'var(--fg-3)',
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                gap: 14,
            }}>
                <span>role · {role}</span>
                <span style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
                    <span style={{ color: 'var(--accent)' }}>
                        {expanded ? '▾ ocultar' : '▸ leer más'}
                    </span>
                    {url && (
                        <a
                            href={url}
                            onClick={e => e.stopPropagation()}
                            style={{ color: 'var(--accent-3)' }}
                        >
                            → abrir
                        </a>
                    )}
                </span>
            </div>
        </div>
    )
}
