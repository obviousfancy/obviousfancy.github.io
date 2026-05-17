---
titulo: "Clase CSS — Variables CSS e identidad visual"
descripcion: "Cómo funciona CSS, variables CSS para un sistema de diseño consistente, y cómo combinar Tailwind con CSS puro."
tecnologias: [CSS, Tailwind]
hashtags: "#CSS #Tailwind #DesignSystem #WebDev"
estado: Completado
orden: 7
---

## CSS básico — la estructura

```css
selector {
    propiedad: valor;
}
```

- **Selector** → a qué elemento HTML le aplicas el estilo
- **Propiedad** → qué quieres cambiar  
- **Valor** → a qué lo cambias

Cada declaración termina en `;` — igual que en C.

### Tipos de selectores

| Selector | A qué apunta | Ejemplo |
|----------|-------------|---------|
| `body` | El `<body>` | `body { background: black; }` |
| `h1` | Todos los `<h1>` | `h1 { font-size: 2rem; }` |
| `.card` | `class="card"` | `.card { padding: 16px; }` |
| `#nav` | `id="nav"` | `#nav { position: fixed; }` |
| `:root` | Raíz del documento | `:root { --color: red; }` |

## Variables CSS — el concepto más importante

Definen un valor **una sola vez** reutilizable en todo el sitio. Si cambias el color del acento, cambia en todos lados automáticamente.

### Declarar variables en `:root`

```css
:root {
    --bg-0: oklch(0.135 0.015 230);
    --accent: oklch(0.78 0.14 195);
    --fg-0: oklch(0.97 0.005 230);
}
```

### Usar variables con `var()`

```css
body {
    background: var(--bg-0);
    color: var(--fg-0);
}
```

## El sistema de colores `oklch`

`oklch` es un espacio de color moderno más preciso que hex o rgb. Tiene tres parámetros:

```
oklch(lightness chroma hue)
       0-1        0-0.4  0-360
```

| Parámetro | Efecto |
|-----------|--------|
| `lightness` | 0 = negro, 1 = blanco |
| `chroma` | 0 = gris, mayor = más saturado |
| `hue` | 0-360, el tono (230 = azul-cyan) |

### Opacidad con `/`

```css
oklch(0.20 0.02 230 / 0.55)   /* 55% opaco */
oklch(0.20 0.02 230 / 1)      /* 100% sólido */
oklch(0.20 0.02 230 / 0)      /* invisible */
```

## La paleta completa del portfolio

```css
:root {
    /* Fondos — de más oscuro a más claro */
    --bg-0: oklch(0.135 0.015 230);   /* fondo de página */
    --bg-1: oklch(0.175 0.018 230);   /* navbar */
    --bg-2: oklch(0.215 0.020 230);   /* tarjetas */
    --bg-3: oklch(0.260 0.022 230);   /* hover de tarjetas */

    /* Bordes */
    --border: oklch(0.32 0.025 230);
    --border-soft: oklch(0.26 0.022 230);

    /* Texto — de más brillante a más apagado */
    --fg-0: oklch(0.97 0.005 230);    /* texto principal */
    --fg-1: oklch(0.78 0.012 230);    /* texto secundario */
    --fg-2: oklch(0.58 0.018 230);    /* texto apagado */
    --fg-3: oklch(0.42 0.020 230);    /* texto muy apagado */

    /* Acentos */
    --accent:   oklch(0.78 0.14 195); /* cyan principal */
    --accent-2: oklch(0.82 0.13 145); /* verde */
    --accent-3: oklch(0.78 0.13 250); /* azul-violeta */
    --warn:     oklch(0.82 0.13 75);  /* amarillo */
    --danger:   oklch(0.72 0.18 25);  /* rojo */

    /* Tipografía */
    --font-mono: 'JetBrains Mono', ui-monospace, monospace;
    --font-sans: 'IBM Plex Sans', system-ui, sans-serif;

    /* Grid de fondo */
    --grid: linear-gradient(to right, oklch(0.22 0.02 230 / 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, oklch(0.22 0.02 230 / 0.4) 1px, transparent 1px);
}

body {
    background: var(--bg-0);
    background-image: var(--grid);
    background-size: 32px 32px;
    color: var(--fg-0);
    font-family: var(--font-mono);
}
```

## Cargar fuentes de Google Fonts

En el `<head>` del Layout:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
```

- `preconnect` — se conecta anticipadamente para carga más rápida
- La tercera línea carga la fuente en sí
- Nombres con espacios van entre comillas en CSS: `'JetBrains Mono'`

## Tailwind v4 con variables CSS

En Tailwind v4 puedes usar variables CSS directamente sin `var()`:

```html
<!-- Tailwind v3 -->
<div class="bg-[var(--bg-1)]">

<!-- Tailwind v4 — más limpio -->
<div class="bg-(--bg-1)">
```

Funciona para cualquier propiedad:

```html
<nav class="bg-(--bg-1) text-(--fg-0)">
<a class="hover:bg-(--bg-2) text-(--fg-1)">
<span class="text-(--accent)">
```

## Jerarquía visual con variables

Los nombres `--fg-0`, `--fg-1`, `--fg-2`, `--fg-3` no son arbitrarios — crean jerarquía:

```
--fg-0  → título principal (más brillante)
--fg-1  → descripción
--fg-2  → metadatos
--fg-3  → texto muy secundario, placeholders
```

Lo mismo para fondos:

```
--bg-0  → fondo de página (más oscuro)
--bg-1  → navbar
--bg-2  → tarjetas
--bg-3  → hover de tarjetas (más claro)
```

## Tailwind no sobreescribe CSS puro

Si tienes una clase de Tailwind hardcodeada y una variable CSS apuntando al mismo elemento, Tailwind puede ganar dependiendo de la especificidad. La solución: usar variables CSS en lugar de clases hardcodeadas.

```html
<!-- ❌ Tailwind gana sobre el CSS de las variables -->
<body class="bg-gray-900 text-white">

<!-- ✅ Todo viene de las variables -->
<body>   <!-- el CSS de global.css aplica sin conflicto -->
```

## Glass morphism — próximamente

El efecto de vidrio esmerilado requiere:

1. Fondo semitransparente con opacidad
2. `backdrop-filter: blur()` para el desenfoque

```css
.card-glass {
    background: oklch(0.20 0.02 230 / 0.55);  /* semitransparente */
    backdrop-filter: blur(14px);               /* desenfoque */
    border: 1px solid oklch(0.40 0.025 230 / 0.5);
}
```

Se implementa en la siguiente clase.

## Lo aprendido

- CSS: `selector { propiedad: valor; }` — igual que en C con `;`
- Variables CSS en `:root` con `--nombre: valor`
- `var(--nombre)` para usar la variable
- `oklch` es más preciso que hex — lightness, chroma, hue
- Opacidad en colores con `/`: `oklch(l c h / 0.5)`
- Tailwind v4: `bg-(--variable)` sin necesidad de `var()`
- Las clases hardcodeadas de Tailwind pueden sobreescribir variables CSS
