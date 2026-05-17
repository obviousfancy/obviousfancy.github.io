---
titulo: "Clase CSS 2 — Glass Morphism y efectos visuales avanzados"
descripcion: "Cómo crear el efecto de vidrio esmerilado, usar color-mix(), backdrop-filter y el grid de fondo. Teoría completa de cada propiedad."
tecnologias: [CSS, Tailwind]
hashtags: "#CSS #GlassMorphism #WebDev #DesignSystem"
estado: Completado
orden: 8
---

## ¿Qué es Glass Morphism?

Es una tendencia de diseño donde los elementos parecen **vidrio esmerilado** — semitransparentes, con el contenido detrás desenfocado. Lo ves en:

- macOS y iOS (menús, notificaciones)
- Windows 11 (Fluent Design)
- El diseño de Claude Design que usamos como referencia

Para que funcione necesitas exactamente **tres ingredientes**. Sin alguno de ellos el efecto no se logra.

---

## Ingrediente 1 — Fondo semitransparente

Un fondo sólido bloquea todo lo que está detrás. El glass morphism necesita que se vea algo detrás del elemento.

### Opacidad en `oklch`

```css
/* Sólido — no funciona para glass */
background: oklch(0.175 0.018 230);

/* Semitransparente — el / define la opacidad */
background: oklch(0.175 0.018 230 / 0.55);
/*                                   ↑
/*                    0 = invisible, 1 = sólido */
```

El `/` es parte de la sintaxis del color — no es división matemática.

### El problema con variables CSS y opacidad

No puedes agregar opacidad directamente a una variable:

```css
/* ❌ Esto no funciona */
background: var(--bg-1) / 0.55;

/* ❌ Tampoco esto */
background: var(--bg-1, 0.55);
```

La solución es `color-mix()`.

---

## `color-mix()` — mezclar colores en CSS

`color-mix()` mezcla dos colores en un espacio de color determinado. Permite agregar opacidad a una variable CSS sin hardcodear el valor del color.

### Sintaxis

```css
color-mix(in espacio-de-color, color1 porcentaje, color2)
```

### Para opacidad

```css
/* Mezcla --bg-1 con transparent al 55% */
background: color-mix(in oklch, var(--bg-1) 55%, transparent);

/* Equivale aproximadamente a */
background: oklch(0.175 0.018 230 / 0.55);
```

La ventaja de `color-mix()` es que **usa la variable** — si cambias `--bg-1` en el futuro, el glass morphism se actualiza automáticamente. Con el valor hardcodeado tendrías que cambiarlo en dos lugares.

### Más ejemplos de color-mix

```css
/* 30% opaco — casi transparente */
background: color-mix(in oklch, var(--bg-1) 30%, transparent);

/* 80% opaco — casi sólido */
background: color-mix(in oklch, var(--bg-1) 80%, transparent);

/* Mezclar dos colores */
background: color-mix(in oklch, var(--accent) 40%, var(--bg-0));
```

---

## Ingrediente 2 — `backdrop-filter`

Es la propiedad CSS que aplica efectos visuales a lo que está **detrás** del elemento. El más usado es `blur()`.

```css
backdrop-filter: blur(14px);
```

### ¿Cómo funciona?

Imagina poner un vidrio esmerilado sobre una imagen — la imagen sigue visible pero desenfocada. `backdrop-filter: blur()` hace exactamente eso.

### Valores comunes de blur

| Valor | Efecto |
|-------|--------|
| `blur(4px)` | Desenfoque sutil |
| `blur(8px)` | Moderado |
| `blur(14px)` | El que usamos — notable pero no exagerado |
| `blur(24px)` | Muy pronunciado |

### Requiere fondo semitransparente

```css
/* ❌ No se nota — el fondo sólido tapa todo */
.card {
    background: var(--bg-1);
    backdrop-filter: blur(14px);
}

/* ✅ Funciona — se ve lo que hay detrás */
.card {
    background: color-mix(in oklch, var(--bg-1) 55%, transparent);
    backdrop-filter: blur(14px);
}
```

---

## Ingrediente 3 — Borde sutil

Las tarjetas glass tienen un borde muy tenue que las define visualmente sin ser agresivo.

```css
border: 1px solid var(--border-soft);
```

### Anatomía de `border`

```css
border: grosor  tipo    color;
border: 1px     solid   var(--border-soft);
```

| Propiedad | Opciones |
|-----------|----------|
| Grosor | `1px`, `2px`, `4px`... |
| Tipo | `solid`, `dashed`, `dotted`, `none` |
| Color | Cualquier color o variable |

### Borde con opacidad

Para un borde aún más sutil puedes agregar opacidad al color:

```css
border: 1px solid oklch(0.40 0.025 230 / 0.5);
/* o con variable: */
border: 1px solid color-mix(in oklch, var(--border-soft) 50%, transparent);
```

---

## La clase `.card-glass` completa

```css
.card-glass {
    background: color-mix(in oklch, var(--bg-1) 55%, transparent);
    backdrop-filter: blur(14px);
    border: 1px solid var(--border-soft);
}

.card-glass:hover {
    background: color-mix(in oklch, var(--bg-2) 55%, transparent);
}
```

### Hover en CSS puro

La pseudo-clase `:hover` aplica estilos cuando el mouse está sobre el elemento:

```css
.elemento {
    /* estilo base */
}

.elemento:hover {
    /* estilo al pasar el mouse */
}
```

Es equivalente al `hover:` de Tailwind pero en CSS puro. Cuando tienes una clase CSS personalizada como `.card-glass`, el hover va en el CSS — no en el HTML.

---

## Cómo combinar CSS puro con Tailwind

Una clase CSS personalizada y clases de Tailwind pueden convivir en el mismo elemento:

```html
<a class="card-glass block p-6 rounded-lg hover:-translate-y-2 transition duration-500">
```

- `card-glass` → viene de `global.css`
- `block p-6 rounded-lg` → Tailwind
- `hover:-translate-y-2 transition duration-500` → Tailwind

### Conflictos — cuándo Tailwind gana

Tailwind puede sobreescribir tu CSS si ambos definen la misma propiedad:

```html
<!-- ❌ bg-(--bg-2) de Tailwind sobreescribe el background de .card-glass -->
<a class="card-glass bg-(--bg-2)">

<!-- ✅ Sin conflicto — solo .card-glass define el background -->
<a class="card-glass">
```

La regla: si `.card-glass` define `background`, no pongas ninguna clase `bg-` de Tailwind en el mismo elemento.

---

## Grid de fondo

El grid de cuadrícula del fondo usa `background-image` con gradientes lineales:

```css
:root {
    --grid: linear-gradient(to right, oklch(0.22 0.02 230 / 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, oklch(0.22 0.02 230 / 0.4) 1px, transparent 1px);
}
```

### ¿Cómo funciona?

Son dos gradientes superpuestos:
- El primero dibuja líneas **verticales** (de izquierda a derecha, 1px de color luego transparente)
- El segundo dibuja líneas **horizontales** (de arriba a abajo, 1px de color luego transparente)

Juntos forman la cuadrícula.

### `background-size` — el tamaño de cada celda

Sin `background-size` el gradiente se estira al 100%. Necesitas definir el tamaño de cada repetición:

```css
body {
    background-image: var(--grid);
    background-size: 40px 40px;  /* celda de 40x40px */
}
```

| Valor | Resultado |
|-------|-----------|
| `32px 32px` | Cuadrícula fina |
| `40px 40px` | Cuadrícula normal |
| `64px 64px` | Cuadrícula grande |

---

## `linear-gradient()` — teoría completa

Un gradiente lineal es una transición suave entre dos o más colores en una dirección.

```css
linear-gradient(dirección, color1, color2)
```

### Direcciones

```css
linear-gradient(to right, red, blue)   /* izquierda a derecha */
linear-gradient(to bottom, red, blue)  /* arriba a abajo */
linear-gradient(to left, red, blue)    /* derecha a izquierda */
linear-gradient(45deg, red, blue)      /* diagonal */
```

### Con paradas específicas (color stops)

```css
/* La línea de 1px del grid */
linear-gradient(to right, oklch(0.22 0.02 230 / 0.4) 1px, transparent 1px)
/*                         color hasta 1px             ↑   transparente después */
```

Esto crea una línea de exactamente 1px de ancho — de ahí el efecto de cuadrícula.

---

## `background` vs `background-image`

Son propiedades diferentes aunque relacionadas:

| Propiedad | Para qué |
|-----------|----------|
| `background` | Color de fondo sólido |
| `background-image` | Imagen o gradiente de fondo |
| `background-size` | Tamaño del fondo |
| `background-position` | Posición del fondo |

Cuando usas `background` (shorthand) puede sobreescribir `background-image`. Por eso es mejor declararlos por separado:

```css
/* ❌ background puede sobreescribir background-image */
body {
    background: var(--bg-0);
    background-image: var(--grid);  /* puede perderse */
}

/* ✅ Orden correcto — background-image después */
body {
    background: var(--bg-0);
    background-image: var(--grid);
    background-size: 40px 40px;
}
```

---

## Resumen visual del efecto completo

```
Página
│
├── body
│   ├── background: --bg-0 (oscuro)
│   └── background-image: --grid (cuadrícula encima)
│
└── .card-glass
    ├── background: --bg-1 al 55% (semitransparente)
    ├── backdrop-filter: blur(14px) (desenfoca el grid detrás)
    └── border: 1px solid --border-soft (borde sutil)
```

El grid del fondo se ve a través de las tarjetas — eso es lo que da profundidad.

---

## Lo aprendido

- Glass morphism = fondo semitransparente + backdrop-filter + borde sutil
- `color-mix()` agrega opacidad a variables CSS sin hardcodear colores
- `backdrop-filter: blur()` desenfoca lo que hay detrás del elemento
- `.clase:hover {}` maneja hover en CSS puro — sin Tailwind
- El grid de fondo son dos `linear-gradient` superpuestos
- `background-size` define el tamaño de repetición del grid
- Las clases CSS y Tailwind conviven — pero cuidado con los conflictos de propiedad
