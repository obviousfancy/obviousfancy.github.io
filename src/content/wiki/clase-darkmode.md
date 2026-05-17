---
titulo: "Clase — Dark/Light Mode con toggle manual"
descripcion: "Cómo implementar dark mode con variables CSS, JavaScript puro y persistencia en localStorage. Teoría completa de cada concepto."
tecnologias: [CSS, JavaScript, Astro]
hashtags: "#DarkMode #JavaScript #CSS #WebDev"
estado: Completado
orden: 9
---

## ¿Cómo funciona el dark mode?

Hay dos enfoques para implementar dark mode:

### Opción A — Automático por el sistema operativo

```css
@media (prefers-color-scheme: light) {
    /* estilos cuando el SO está en modo claro */
}
```

El problema: el usuario no puede cambiarlo desde tu sitio — solo respeta la preferencia del sistema.

### Opción B — Toggle manual con JavaScript ✅

Se agrega o quita un atributo en el `<html>` y CSS reacciona a ese atributo. Es el enfoque que usamos.

```html
<!-- Dark mode -->
<html data-theme="dark">

<!-- Light mode -->
<html data-theme="light">
```

La magia: **solo cambias las variables CSS** — todo el sitio se actualiza automáticamente porque todo usa `var(--bg-0)`, `var(--fg-0)`, etc.

---

## Paso 1 — Variables de light mode en CSS

En `global.css`, debajo del `:root`, se declaran los colores claros bajo el selector `[data-theme="light"]`:

```css
:root {
    /* dark mode — valores por defecto */
    --bg-0: oklch(0.135 0.015 230);
    --fg-0: oklch(0.97 0.005 230);
    /* ... resto de variables ... */
}

[data-theme="light"] {
    /* light mode — sobreescribe las variables del :root */
    --bg-0: oklch(0.985 0.003 230);
    --bg-1: oklch(0.965 0.005 230);
    --bg-2: oklch(0.935 0.008 230);
    --bg-3: oklch(0.895 0.010 230);
    --fg-0: oklch(0.18 0.018 230);
    --fg-1: oklch(0.35 0.020 230);
    --fg-2: oklch(0.50 0.020 230);
    --fg-3: oklch(0.62 0.020 230);
}
```

### ¿Por qué funciona?

Cuando el `<html>` tiene `data-theme="light"`, el selector `[data-theme="light"]` activa y sobreescribe las variables del `:root`. Como todo el sitio usa `var(--bg-0)` en lugar de colores hardcodeados, todo cambia automáticamente.

Si hubiera colores hardcodeados como `bg-gray-900` el dark mode no los afectaría — por eso es crítico usar variables en todo.

---

## Paso 2 — El botón en el Navbar

En `src/components/Navbar.astro` se agrega un `<button>` con `id` para poder seleccionarlo desde JavaScript:

```astro
<button id="theme-toggle" class="ml-auto p-2 w-9 h-9 rounded-full hover:bg-(--bg-2)">
  <span id="theme-icon" class="text-(--fg-1) text-lg">🌙</span>
</button>
```

### Clases importantes

| Clase | Efecto |
|-------|--------|
| `ml-auto` | Empuja el botón al extremo derecho del navbar |
| `w-9 h-9` | Ancho y alto iguales — necesario para que `rounded-full` forme un círculo |
| `rounded-full` | Hace el elemento completamente circular |
| `id="theme-toggle"` | Identificador único para seleccionarlo desde JS |

### `<button>` vs `<a>`

| Etiqueta | Para qué |
|----------|----------|
| `<a href="">` | Navegar a otra página |
| `<button>` | Ejecutar una acción con JavaScript |

El toggle es una acción, no una navegación — por eso va `<button>`.

---

## Paso 3 — JavaScript básico

### Conceptos fundamentales de JS usados

**Seleccionar elementos del DOM:**
```javascript
document.querySelector('#mi-id')      // por id — el # es obligatorio
document.querySelector('.mi-clase')   // por clase
document.querySelector('button')      // por etiqueta HTML
document.documentElement              // el elemento <html>
```

El `#` en `querySelector` significa "busca por id". Sin el `#` buscaría una etiqueta HTML llamada `theme-toggle` que no existe.

**Leer y cambiar atributos:**
```javascript
// Leer un atributo
element.getAttribute('data-theme')    // devuelve "dark" o "light"

// Cambiar un atributo
element.setAttribute('data-theme', 'light')
```

**Escuchar eventos:**
```javascript
elemento.addEventListener('click', () => {
    // esto se ejecuta cuando el elemento es clickeado
})
```

**localStorage — memoria persistente del navegador:**
```javascript
localStorage.setItem('theme', 'light')  // guardar
localStorage.getItem('theme')           // leer — devuelve null si no existe
```

`localStorage` persiste aunque el usuario cierre la pestaña o el navegador. Ideal para guardar preferencias.

**Operador ternario — if/else en una línea:**
```javascript
// if/else normal
if (tema === 'dark') {
    icono = '🌙'
} else {
    icono = '☀️'
}

// Ternario — equivalente en una línea
icono = tema === 'dark' ? '🌙' : '☀️'
//                      ↑ si true  ↑ si false
```

**Operador `||` para valor por defecto:**
```javascript
const tema = localStorage.getItem('theme') || 'dark'
// Si getItem devuelve null → usa 'dark'
```

### Verificar que el elemento existe

`querySelector` puede devolver `null` si no encuentra el elemento. TypeScript avisa de esto. La solución es verificar antes de usar:

```javascript
const boton = document.querySelector('#theme-toggle')
if (boton) {
    // solo ejecuta si el elemento existe
    boton.addEventListener('click', () => { ... })
}
```

---

## El script completo del Navbar

```javascript
<script>
  const botonToggle = document.querySelector('#theme-toggle')
  const iconoTema = document.querySelector('#theme-icon')
  const html = document.documentElement

  if (botonToggle && iconoTema) {
    // Aplicar tema guardado al cargar
    const temaGuardado = localStorage.getItem('theme') || 'dark'
    html.setAttribute('data-theme', temaGuardado)
    iconoTema.textContent = temaGuardado === 'dark' ? '🌙' : '☀️'

    // Toggle al hacer click
    botonToggle.addEventListener('click', () => {
      const temaActual = html.getAttribute('data-theme') || 'dark'
      const nuevoTema = temaActual === 'dark' ? 'light' : 'dark'

      html.setAttribute('data-theme', nuevoTema)
      localStorage.setItem('theme', nuevoTema)
      iconoTema.textContent = nuevoTema === 'dark' ? '🌙' : '☀️'
    })
  }
</script>
```

---

## Paso 4 — Eliminar el flash de tema incorrecto

### El problema: Flash of Incorrect Theme (FOIT)

Sin solución, al cargar la página hay un destello negro breve:

```
1. Navegador carga la página
2. Pinta el HTML con dark (el default)  ← flash negro visible
3. El JavaScript corre y cambia a light
```

El JS corre **después** de que la página ya se pintó — por eso aparece el destello.

### La solución: script inline en el `<head>`

En `src/layouts/Layout.astro`, dentro del `<head>` **antes de cualquier otra cosa**:

```html
<head>
  <script is:inline>
    const tema = localStorage.getItem('theme') || 'dark'
    document.documentElement.setAttribute('data-theme', tema)
  </script>
  <!-- resto del head -->
</head>
```

Dos líneas que leen `localStorage` y aplican el tema **antes de que el navegador pinte nada**.

### `is:inline` — por qué es importante

Por defecto Astro procesa y optimiza todos los `<script>`:

```
Sin is:inline → Astro agrupa y hace async el script
               → se ejecuta después de pintar la página
               → flash posible en producción

Con is:inline  → Astro no toca el script
               → se ejecuta síncronamente donde está declarado
               → bloquea el pintado hasta ejecutarse
               → sin flash garantizado
```

Es análogo a `volatile` en C embebido — sin él probablemente funciona, pero con él garantizas el comportamiento exacto sin importar las optimizaciones.

---

## Selectores CSS para atributos

El mismo principio del toggle funciona para cualquier atributo HTML:

```css
/* Cuando <html> tiene data-theme="light" */
[data-theme="light"] { ... }

/* Cuando <html> tiene data-theme="dark" */
[data-theme="dark"] { ... }

/* Cuando cualquier elemento tiene data-active="true" */
[data-active="true"] { ... }

/* Cuando un input está deshabilitado */
input[disabled] { ... }
```

Los selectores de atributo van entre corchetes `[]` y pueden combinar nombre y valor.

---

## Flujo completo del sistema

```
Usuario visita la página
│
├── <script is:inline> en <head>
│   └── Lee localStorage → aplica data-theme al <html>
│       (antes de pintar, sin flash)
│
├── CSS detecta data-theme
│   └── Activa las variables correctas (:root o [data-theme="light"])
│
├── Todo el sitio usa var(--bg-0), var(--fg-0)...
│   └── Se pinta con los colores correctos desde el inicio
│
└── Usuario hace click en 🌙/☀️
    ├── JS cambia data-theme en <html>
    ├── CSS reacciona automáticamente
    ├── JS actualiza el ícono
    └── JS guarda en localStorage para la próxima visita
```

---

## Lo aprendido

- Dark mode con variables CSS = solo cambiar el valor de las variables, todo lo demás es automático
- `[data-atributo="valor"]` en CSS selecciona elementos por atributo
- `querySelector('#id')` — el `#` es obligatorio para seleccionar por id
- `localStorage` persiste preferencias entre sesiones
- Operador ternario `condición ? valorSiTrue : valorSiFalse`
- `||` para valores por defecto cuando algo puede ser `null`
- `is:inline` garantiza ejecución síncrona antes del pintado
- FOIT (Flash of Incorrect Theme) se elimina con un script inline en el `<head>`
