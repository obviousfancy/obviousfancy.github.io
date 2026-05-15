# 📚 Guía Astro + Tailwind — Referencia Personal

> Documentación de todo lo aprendido durante el desarrollo del portfolio personal.
> Sirve como referencia rápida y como mini-wiki para consultar después.

---

## 📑 Índice

1. [Conceptos fundamentales](#1-conceptos-fundamentales)
2. [Setup del proyecto](#2-setup-del-proyecto)
3. [Estructura de un archivo `.astro`](#3-estructura-de-un-archivo-astro)
4. [Etiquetas HTML semánticas](#4-etiquetas-html-semánticas)
5. [Componentes en Astro](#5-componentes-en-astro)
6. [Layouts y `<slot />`](#6-layouts-y-slot-)
7. [Sistema de rutas (file-based routing)](#7-sistema-de-rutas-file-based-routing)
8. [Tailwind: anatomía de una clase](#8-tailwind-anatomía-de-una-clase)
9. [Catálogo completo de clases Tailwind](#9-catálogo-completo-de-clases-tailwind)
10. [Flexbox con Tailwind](#10-flexbox-con-tailwind)
11. [Grid con Tailwind](#11-grid-con-tailwind)
12. [Modificadores (hover, focus, dark, responsive)](#12-modificadores-hover-focus-dark-responsive)
13. [Valores arbitrarios](#13-valores-arbitrarios)
14. [Comentarios](#14-comentarios)
15. [Comandos útiles](#15-comandos-útiles)
16. [Recursos](#16-recursos)

---

## 1. Conceptos fundamentales

Toda página web se compone de tres capas. Esto nunca cambia, sin importar la herramienta:

| Capa | Función | Analogía |
|------|---------|----------|
| **HTML** | Estructura y contenido | Los ladrillos |
| **CSS**  | Estilo visual | La pintura |
| **JS**   | Comportamiento e interactividad | El motor |

### ¿Qué es cada herramienta?

| Herramienta | Tipo | Para qué sirve |
|-------------|------|----------------|
| **Astro** | Framework | Organiza el sitio, genera HTML estático, soporta Markdown |
| **Tailwind** | Librería CSS | Sistema de clases utilitarias para escribir CSS rápido |
| **Bootstrap** | Librería CSS | Componentes preconstruidos (alternativa a Tailwind, menos flexible) |
| **Vite** | Build tool | Compilador y servidor de desarrollo (Astro lo usa por debajo) |

---

## 2. Setup del proyecto

```bash
# Crear el proyecto (con template mínimo, sin TypeScript)
npm create astro@latest mi-portfolio

# Entrar al proyecto
cd mi-portfolio

# Agregar Tailwind
npx astro add tailwind

# Levantar el servidor de desarrollo
npm run dev          # http://localhost:4321

# Compilar para producción
npm run build        # genera la carpeta /dist con HTML estático

# Vista previa del build
npm run preview
```

### Estructura típica de carpetas

```
mi-portfolio/
├── src/
│   ├── pages/              ← cada .astro aquí = una URL
│   │   ├── index.astro     ← ruta /
│   │   ├── proyectos.astro ← ruta /proyectos
│   │   └── blog.astro      ← ruta /blog
│   ├── components/         ← componentes reutilizables (Navbar, Footer...)
│   ├── layouts/            ← plantillas globales
│   ├── content/            ← Markdown del blog/wiki (opcional)
│   └── styles/
│       └── global.css      ← CSS global con Tailwind
├── public/                 ← imágenes, PDFs, favicon
├── astro.config.mjs        ← configuración
└── package.json
```

---

## 3. Estructura de un archivo `.astro`

Un archivo `.astro` tiene dos partes separadas por `---`:

```astro
---
// Frontmatter: aquí va JavaScript / TypeScript
// imports, variables, lógica
import Layout from '../layouts/Layout.astro'
const titulo = "Mi portfolio"
---

<!-- Template: aquí va el HTML que se renderiza -->
<Layout>
  <h1>{titulo}</h1>
</Layout>
```

Las llaves `{}` permiten insertar variables del frontmatter en el HTML.

---

## 4. Etiquetas HTML semánticas

Cada etiqueta tiene un **propósito**, no solo un estilo. Importa para SEO, accesibilidad y mantenimiento.

| Etiqueta | Propósito | Cuándo usarla |
|----------|-----------|---------------|
| `<html>` | Raíz del documento | Una sola por página |
| `<head>` | Metadatos invisibles | Title, links, scripts |
| `<body>` | Contenido visible | Una sola por página |
| `<header>` | Cabecera de página o sección | Logo, navegación principal |
| `<nav>` | Bloque de navegación | Menús, breadcrumbs |
| `<main>` | Contenido principal | Una sola por página |
| `<section>` | Sección temática | Hero, "Sobre mí", etc. |
| `<article>` | Contenido autónomo | Posts de blog, tarjetas de proyecto |
| `<aside>` | Contenido relacionado | Sidebar, notas |
| `<footer>` | Pie de página o sección | Copyright, links secundarios |
| `<h1>` a `<h6>` | Títulos jerárquicos | `h1` solo uno por página |
| `<p>` | Párrafo de texto | Bloques de texto largo |
| `<a href="">` | Enlace | Navegación a otra página/sección |
| `<button>` | Acción | Ejecutar JS, enviar formulario |
| `<img src="" alt="">` | Imagen | El `alt` es obligatorio por accesibilidad |
| `<div>` | Contenedor genérico | Cuando no hay nada semántico que aplique |
| `<span>` | Contenedor genérico inline | Para envolver texto pequeño |
| `<ul>` / `<ol>` / `<li>` | Listas | No ordenadas, ordenadas, ítems |
| `<form>` / `<input>` / `<label>` | Formularios | Contacto, búsqueda |

### Ejemplo: Hero correcto

```astro
<section class="h-screen flex flex-col items-center justify-center">
  <h1 class="text-4xl font-bold">Jonathan Mejorado</h1>
  <h2 class="text-2xl text-gray-300">Embedded Systems Engineer</h2>
  <a href="/proyectos" class="mt-8 bg-blue-500 px-6 py-2 rounded">
    Ver proyectos
  </a>
</section>
```

---

## 5. Componentes en Astro

Un **componente** es una pieza de UI reutilizable. Se guarda en `src/components/`.

### Crear un componente

`src/components/Navbar.astro`:

```astro
---
// Si necesitas lógica
---

<nav class="bg-gray-800 text-white px-8 py-4 flex gap-10">
  <span>Obviousfancy</span>
  <a href="/">Inicio</a>
  <a href="/proyectos">Proyectos</a>
</nav>
```

### Usar un componente

```astro
---
import Navbar from '../components/Navbar.astro'
---

<Navbar />
```

> ⚠️ Importante: los componentes se usan con **mayúscula inicial** y se importan en el frontmatter.

### Componentes con props (parámetros)

```astro
---
// src/components/Boton.astro
const { texto, url, color = "blue" } = Astro.props
---

<a href={url} class={`bg-${color}-500 px-4 py-2 rounded`}>
  {texto}
</a>
```

Uso:

```astro
<Boton texto="Ver más" url="/proyectos" color="red" />
```

---

## 6. Layouts y `<slot />`

Un **Layout** es un componente especial que envuelve páginas completas. Evita repetir `<html>`, `<head>`, `<Navbar />` en cada página.

`src/layouts/Layout.astro`:

```astro
---
import '../styles/global.css'
import Navbar from '../components/Navbar.astro'

const { title = "Obviousfancy" } = Astro.props
---

<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title}</title>
  </head>
  <body class="bg-gray-900 text-white">
    <Navbar />
    <main>
      <slot />              <!-- aquí se inserta el contenido de la página -->
    </main>
  </body>
</html>
```

Uso en una página:

```astro
---
import Layout from '../layouts/Layout.astro'
---

<Layout title="Proyectos | Obviousfancy">
  <h1>Mis proyectos</h1>
</Layout>
```

### Múltiples slots con nombre

```astro
<!-- En el Layout -->
<aside><slot name="sidebar" /></aside>
<main><slot /></main>

<!-- En la página -->
<Layout>
  <div slot="sidebar">Contenido del sidebar</div>
  <p>Contenido principal</p>
</Layout>
```

---

## 7. Sistema de rutas (file-based routing)

Astro usa **enrutamiento basado en archivos**. La ubicación del archivo en `src/pages/` determina su URL.

| Archivo | URL |
|---------|-----|
| `src/pages/index.astro` | `/` |
| `src/pages/proyectos.astro` | `/proyectos` |
| `src/pages/blog/index.astro` | `/blog` |
| `src/pages/blog/post-1.astro` | `/blog/post-1` |
| `src/pages/proyectos/[slug].astro` | `/proyectos/cualquier-cosa` (dinámica) |

### Rutas dinámicas

`src/pages/proyectos/[slug].astro`:

```astro
---
export function getStaticPaths() {
  return [
    { params: { slug: 'smartlight' } },
    { params: { slug: 'hexconverter' } },
  ]
}
const { slug } = Astro.params
---

<h1>Proyecto: {slug}</h1>
```

---

## 8. Tailwind: anatomía de una clase

Tailwind usa **clases utilitarias**: cada una hace una sola cosa. Se combinan para construir cualquier diseño.

### Patrón general

```
[propiedad]-[valor]
```

Ejemplos:
- `bg-blue-500`  → background, blue, intensidad 500
- `text-2xl`     → text size, extra large 2
- `p-4`          → padding, 4 unidades (16px)
- `mt-8`         → margin-top, 8 unidades (32px)

### Escala numérica del espaciado

1 unidad = **4px**

| Clase | Pixeles |
|-------|---------|
| `p-0` | 0px |
| `p-1` | 4px |
| `p-2` | 8px |
| `p-4` | 16px |
| `p-6` | 24px |
| `p-8` | 32px |
| `p-12` | 48px |
| `p-16` | 64px |
| `p-24` | 96px |
| `p-32` | 128px |

---

## 9. Catálogo completo de clases Tailwind

### 🎨 Colores

Los colores siguen el patrón `[propiedad]-[color]-[intensidad]`.

**Colores disponibles:** `slate, gray, zinc, neutral, stone, red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose`

**Intensidades:** 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

**Colores especiales sin escala:** `black`, `white`, `transparent`, `current`

```html
<div class="bg-blue-500 text-white">Hola</div>
<div class="bg-black text-gray-300">Adiós</div>
```

| Prefijo | Aplica a |
|---------|----------|
| `bg-` | Background |
| `text-` | Color de texto |
| `border-` | Color de borde |
| `ring-` | Anillo de focus |
| `divide-` | Separadores entre hijos |
| `placeholder-` | Color del placeholder |

### ✏️ Texto

| Clase | Efecto |
|-------|--------|
| `text-xs` `text-sm` `text-base` `text-lg` | Tamaños pequeños |
| `text-xl` `text-2xl` `text-3xl` ... `text-9xl` | Tamaños grandes |
| `font-thin` `font-light` `font-normal` `font-medium` | Peso ligero |
| `font-semibold` `font-bold` `font-extrabold` `font-black` | Peso fuerte |
| `italic` `not-italic` | Cursiva |
| `underline` `line-through` `no-underline` | Decoración |
| `text-left` `text-center` `text-right` `text-justify` | Alineación |
| `uppercase` `lowercase` `capitalize` | Mayúsculas |
| `tracking-tight` `tracking-normal` `tracking-wide` | Espaciado entre letras |
| `leading-tight` `leading-normal` `leading-loose` | Altura de línea |
| `truncate` | Corta texto con `...` |

```html
<h1 class="text-4xl font-bold tracking-tight">Título grande</h1>
<p class="text-sm text-gray-400 italic">Texto secundario</p>
```

### 📦 Espaciado

| Prefijo | Significado | Ejemplo |
|---------|-------------|---------|
| `m-N` | Margin (todos los lados) | `m-4` |
| `mx-N` | Margin horizontal | `mx-auto` (centrar) |
| `my-N` | Margin vertical | `my-8` |
| `mt-N` `mb-N` `ml-N` `mr-N` | Margin top/bottom/left/right | `mt-8` |
| `p-N` | Padding (todos los lados) | `p-4` |
| `px-N` `py-N` | Padding horizontal / vertical | `px-6 py-2` |
| `pt-N` `pb-N` `pl-N` `pr-N` | Padding top/bottom/left/right | `pt-12` |
| `space-x-N` `space-y-N` | Espacio entre hijos | `space-y-4` |
| `gap-N` | Espacio en flex/grid | `gap-6` |

```html
<div class="mx-auto p-8 space-y-4">
  <p>Centrado horizontalmente con espacio entre hijos</p>
</div>
```

### 📐 Tamaño

| Clase | Efecto |
|-------|--------|
| `w-N` | Width (escala numérica) |
| `w-full` | 100% del padre |
| `w-screen` | 100% del viewport |
| `w-1/2` `w-1/3` `w-2/3` `w-1/4` `w-3/4` | Fracciones |
| `w-auto` | Automático |
| `h-N` `h-full` `h-screen` | Lo mismo para altura |
| `min-w-0` `min-w-full` | Width mínimo |
| `max-w-xs` `max-w-md` `max-w-xl` `max-w-2xl` ... `max-w-7xl` | Width máximo |

```html
<div class="w-full h-screen max-w-4xl mx-auto">
  Contenedor centrado de ancho limitado
</div>
```

### 🔲 Bordes y esquinas

| Clase | Efecto |
|-------|--------|
| `border` | Borde de 1px |
| `border-2` `border-4` `border-8` | Bordes más gruesos |
| `border-t` `border-b` `border-l` `border-r` | Borde por lado |
| `border-gray-300` | Color del borde |
| `border-solid` `border-dashed` `border-dotted` | Estilo |
| `rounded` | Esquinas ligeramente redondeadas |
| `rounded-md` `rounded-lg` `rounded-xl` `rounded-2xl` | Más redondeo |
| `rounded-full` | Círculo completo |
| `rounded-t-lg` `rounded-b-lg` | Solo arriba/abajo |

```html
<button class="border-2 border-blue-500 rounded-lg px-4 py-2">
  Botón con borde
</button>
```

### 🌑 Sombras

| Clase | Efecto |
|-------|--------|
| `shadow-sm` `shadow` `shadow-md` `shadow-lg` `shadow-xl` `shadow-2xl` | Niveles de sombra |
| `shadow-none` | Sin sombra |
| `shadow-inner` | Sombra interna |
| `shadow-blue-500/50` | Sombra de color con opacidad |

### 🎯 Posicionamiento

| Clase | Efecto |
|-------|--------|
| `static` `relative` `absolute` `fixed` `sticky` | Tipo de posición |
| `top-0` `bottom-0` `left-0` `right-0` | Offset |
| `inset-0` | Top+bottom+left+right = 0 |
| `z-0` `z-10` `z-50` `z-auto` | z-index |

```html
<nav class="sticky top-0 z-50 bg-gray-800">
  Navbar fijo arriba al hacer scroll
</nav>
```

### 🔄 Display

| Clase | Efecto |
|-------|--------|
| `block` | Bloque |
| `inline-block` | En línea pero con tamaño |
| `inline` | En línea |
| `flex` | Flexbox |
| `inline-flex` | Flex inline |
| `grid` | Grid |
| `hidden` | Oculto |

### 🌈 Opacidad y efectos

| Clase | Efecto |
|-------|--------|
| `opacity-0` `opacity-50` `opacity-100` | Transparencia |
| `blur-sm` `blur` `blur-lg` | Desenfoque |
| `brightness-50` `brightness-100` `brightness-150` | Brillo |
| `contrast-50` `contrast-100` `contrast-150` | Contraste |
| `grayscale` | Escala de grises |
| `invert` | Invertir colores |

### ⚡ Transiciones y animaciones

| Clase | Efecto |
|-------|--------|
| `transition` | Transición de propiedades comunes |
| `transition-all` | Todas las propiedades |
| `duration-150` `duration-300` `duration-500` | Duración en ms |
| `ease-in` `ease-out` `ease-in-out` | Función de tiempo |
| `delay-100` `delay-300` | Retraso |
| `animate-spin` | Rotación infinita |
| `animate-ping` | Pulso |
| `animate-pulse` | Pulsación suave |
| `animate-bounce` | Rebote |

```html
<button class="bg-blue-500 hover:bg-blue-700 transition duration-300">
  Botón con transición suave
</button>
```

### 🎭 Transformaciones

| Clase | Efecto |
|-------|--------|
| `scale-95` `scale-100` `scale-110` | Escalar |
| `rotate-45` `rotate-90` `-rotate-12` | Rotar |
| `translate-x-4` `translate-y-2` | Mover |
| `skew-x-12` `skew-y-6` | Inclinar |

### 🖱️ Cursor

| Clase | Efecto |
|-------|--------|
| `cursor-pointer` | Mano |
| `cursor-not-allowed` | Prohibido |
| `cursor-wait` | Reloj de espera |
| `cursor-text` | Texto |

---

## 10. Flexbox con Tailwind

Flexbox = sistema de distribución en **una dimensión** (fila o columna).

### Activar flex

```html
<div class="flex">   <!-- hijos en fila -->
<div class="flex flex-col">   <!-- hijos en columna -->
```

### Direcciones

| Clase | Dirección |
|-------|-----------|
| `flex-row` | Horizontal (por defecto) |
| `flex-row-reverse` | Horizontal invertido |
| `flex-col` | Vertical |
| `flex-col-reverse` | Vertical invertido |

### Alineación en el eje principal (`justify-`)

| Clase | Efecto |
|-------|--------|
| `justify-start` | Al inicio |
| `justify-center` | Centrado |
| `justify-end` | Al final |
| `justify-between` | Distribuye con espacio entre ellos |
| `justify-around` | Espacio alrededor |
| `justify-evenly` | Espacio idéntico entre todos |

### Alineación en el eje secundario (`items-`)

| Clase | Efecto |
|-------|--------|
| `items-start` | Arriba |
| `items-center` | Centrado vertical |
| `items-end` | Abajo |
| `items-stretch` | Estirar al alto del contenedor |
| `items-baseline` | Línea base del texto |

### Otros

| Clase | Efecto |
|-------|--------|
| `flex-wrap` | Permite saltar a varias líneas |
| `flex-nowrap` | Una sola línea |
| `gap-N` | Espacio entre hijos |
| `flex-1` | Ocupa todo el espacio disponible |
| `flex-grow` `flex-shrink` | Crecer / encoger |

### Centrar todo (truco)

```html
<div class="flex items-center justify-center h-screen">
  <p>Centrado total vertical y horizontal</p>
</div>
```

---

## 11. Grid con Tailwind

Grid = sistema de distribución en **dos dimensiones** (filas y columnas).

### Activar grid

```html
<div class="grid grid-cols-3 gap-4">
  <div>Columna 1</div>
  <div>Columna 2</div>
  <div>Columna 3</div>
</div>
```

### Columnas y filas

| Clase | Efecto |
|-------|--------|
| `grid-cols-1` a `grid-cols-12` | Número de columnas |
| `grid-rows-1` a `grid-rows-6` | Número de filas |
| `col-span-2` `col-span-3` | Un elemento ocupa N columnas |
| `row-span-2` | Un elemento ocupa N filas |
| `col-start-2` `col-end-4` | Posición específica |

### Ejemplo de galería de proyectos

```html
<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <article class="bg-gray-800 p-6 rounded">Proyecto 1</article>
  <article class="bg-gray-800 p-6 rounded">Proyecto 2</article>
  <article class="bg-gray-800 p-6 rounded">Proyecto 3</article>
</section>
```

---

## 12. Modificadores (hover, focus, dark, responsive)

Los modificadores se ponen como **prefijo** seguido de dos puntos.

### Estados de interacción

| Modificador | Cuándo aplica |
|-------------|---------------|
| `hover:` | Al pasar el mouse |
| `focus:` | Al hacer foco (click/tab) |
| `active:` | Al estar presionando |
| `disabled:` | Cuando está deshabilitado |
| `visited:` | Links ya visitados |
| `group-hover:` | Cuando el padre `.group` recibe hover |

```html
<button class="bg-blue-500 hover:bg-blue-700 active:scale-95 transition">
  Click me
</button>
```

### Modo oscuro

```html
<body class="bg-white dark:bg-gray-900 text-black dark:text-white">
  Cambia automáticamente según el modo del SO o por toggle JS
</body>
```

### Responsive (breakpoints)

| Prefijo | Min-width | Uso típico |
|---------|-----------|------------|
| sin prefijo | 0px | Móvil (base) |
| `sm:` | 640px | Móvil grande |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Laptop |
| `xl:` | 1280px | Desktop |
| `2xl:` | 1536px | Pantalla grande |

**Filosofía mobile-first**: las clases sin prefijo aplican siempre, y las prefijadas se *superponen* cuando se alcanza ese tamaño.

```html
<h1 class="text-2xl md:text-4xl lg:text-6xl">
  Pequeño en móvil, grande en desktop
</h1>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- 1 columna en móvil, 2 en tablet, 3 en desktop -->
</div>
```

---

## 13. Valores arbitrarios

Cuando necesitas un valor exacto que no existe en la escala de Tailwind, usa corchetes:

```html
<div class="bg-[#ff5733]">Color hex exacto</div>
<div class="w-[420px]">Ancho específico en pixeles</div>
<div class="text-[14px]">Tamaño exacto</div>
<div class="mt-[37px]">Margin específico</div>
```

⚠️ Úsalo solo cuando es necesario — la consistencia visual viene de usar la escala estándar.

---

## 14. Comentarios

```astro
---
// Comentario en el frontmatter (JavaScript)
/* También funciona el bloque */
---

<!-- Comentario en HTML, no se renderiza en el navegador -->

<style>
  /* Comentario en CSS */
</style>

<script>
  // Comentario en JavaScript
</script>
```

---

## 15. Comandos útiles

### Astro

```bash
npm run dev              # Servidor de desarrollo
npm run build            # Compilar para producción
npm run preview          # Vista previa del build
npx astro add tailwind   # Agregar Tailwind
npx astro add react      # Agregar React (componentes interactivos)
npx astro add mdx        # Agregar soporte para MDX (Markdown + JSX)
npx astro add sitemap    # Generar sitemap automático
```

### Git para el portfolio

```bash
git init
git add .
git commit -m "feat: setup inicial con Astro + Tailwind"
git remote add origin https://github.com/obviousfancy/obviousfancy.github.io.git
git branch -M main
git push -u origin main
```

### Deploy a GitHub Pages

En `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://obviousfancy.github.io',
  // base: '/portfolio',  // solo si NO es el repo {usuario}.github.io
})
```

Luego configurar GitHub Actions para deploy automático (se cubrirá en una clase futura).

---

## 16. Recursos

- 📘 [Documentación oficial de Astro](https://docs.astro.build/)
- 🎨 [Documentación de Tailwind](https://tailwindcss.com/docs)
- 🔍 [Tailwind Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet) — referencia visual rápida
- 🧩 [Tailwind Play](https://play.tailwindcss.com/) — sandbox online para probar
- 🎭 [Heroicons](https://heroicons.com/) — íconos SVG gratis
- ✨ [Hero Patterns](https://heropatterns.com/) — fondos SVG
- 🌈 [UI Colors](https://uicolors.app/) — generador de paletas Tailwind
- 📚 [MDN Web Docs](https://developer.mozilla.org/) — referencia HTML/CSS/JS

---

## 📝 Convenciones de commits (referencia tu README)

Mantén tu estilo de commits del README:

| Tipo | Para |
|------|------|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `docs` | Documentación |
| `style` | Cambios de estilo visual |
| `refactor` | Reorganización sin cambiar funcionalidad |
| `chore` | Mantenimiento, dependencias |

---

> 🚀 **Próximos temas a documentar** (conforme avancemos):
> - Dark mode con toggle JavaScript
> - Internacionalización (i18n) Español / Inglés
> - Animaciones con Motion / View Transitions
> - Blog con Markdown y Content Collections
> - Deploy a GitHub Pages con Actions
> - SEO básico y Open Graph
> - Formulario de contacto
> - Buscador interno

---

*Última actualización: Clase 5 — Layout completo*
