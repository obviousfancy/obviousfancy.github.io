interface StatusPillProps {
    status: 'ship' | 'beta' | 'alpha' | 'wip'
}

// Mapeo de estado a color y texto
const STATUS_MAP = {
    ship:  { color: 'accent-2', text: 'shipped' },
    beta:  { color: 'accent',   text: 'beta' },
    alpha: { color: 'warn',     text: 'alpha' },
    wip:   { color: 'accent-3', text: 'wip' },
}

export default function StatusPill({ status }: StatusPillProps) {
    const config = STATUS_MAP[status] || STATUS_MAP.wip

    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 10.5,
            fontFamily: 'var(--font-mono)',
            color: `var(--${config.color})`,
            padding: '2px 7px',
            borderRadius: 4,
            border: `1px solid color-mix(in oklch, var(--${config.color}) 35%, transparent)`,
            background: `color-mix(in oklch, var(--${config.color}) 8%, transparent)`,
        }}>
            <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: `var(--${config.color})`,
            }}></span>
            {config.text}
        </span>
    )
}
