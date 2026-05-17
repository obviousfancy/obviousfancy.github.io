---
titulo: "Clase 03 y 04 — Componentes, Navbar y Landing page"
descripcion: "Cómo crear componentes reutilizables en Astro, el Navbar y la sección Hero de la landing."
tecnologias: [Astro, Tailwind]
hashtags: "#Astro #Componentes #WebDev #Portfolio"
estado: Completado
orden: 3
---

## ¿Qué es un componente?

Un componente es una pieza de UI que escribes **una sola vez** y reutilizas donde quieras.

El problema que resuelve: si el navbar está copiado en 20 páginas y cambias un link, tienes que editar 20 archivos. Con un componente lo editas una vez y cambia en todas partes.

## Semántica HTML — cada etiqueta tiene un propósito

No todas las etiquetas son iguales. Cada una le dice al navegador, a Google y a lectores de pantalla qué tipo de contenido es:

| Etiqueta | Propósito | Cuándo usarla |
|----------|-----------|---------------|
| `<nav>` | Navegación | Menús, breadcrumbs |
| `<section>` | Sección temática | Hero, "Sobre mí" |
| `<article>` | Contenido autónomo | Posts, tarjetas |
| `<h1>` a `<h6>` | Títulos jerárquicos | Solo un `h1` por página |
| `<a href="">` | Enlace | Ir a otra página |
| `<button>` | Acción | Ejecutar JavaScript |
| `<div>` | Contenedor genérico | Cuando nada semántico aplica |
| `<p>` | Párrafo | Bloques de texto |

### `<a>` vs `<button>` — la regla

```html
<!-- ¿Quieres ir a otra página? → <a> -->
<a href="/proyectos">Ver proyectos</a>

<!-- ¿Quieres ejecutar algo? → <button> -->
<button onclick="abrirMenu()">Menú</button>
```

## Crear un componente en Astro

Los componentes viven en `src/components/`. El archivo es `.astro`:

```astro
<!-- src/components/Navbar.astro -->
<nav class="bg-(--bg-1) text-(--fg-0) px-8 py-4 flex gap-10 items-center">
  <span>Obviousfancy</span>
  <a href="/" class="hover:bg-(--bg-2) text-(--fg-1) font-bold py-2 px-4 rounded">
    Inicio
  </a>
  <a href="/proyectos" class="hover:bg-(--bg-2) text-(--fg-1) font-bold py-2 px-4 rounded">
    Proyectos
  </a>
</nav>
```

## Usar un componente

Se importa en el frontmatter `---` y se usa como etiqueta HTML con **mayúscula inicial**:

```astro
---
import Navbar from '../components/Navbar.astro'
---

<Navbar />
```

> ⚠️ La mayúscula inicial distingue componentes de etiquetas HTML normales.

## Flexbox para el Navbar

Para poner elementos en fila horizontal:

```html
<nav class="flex gap-10 items-center">
  <!-- los hijos quedan en fila -->
</nav>
```

| Clase | Efecto |
|-------|--------|
| `flex` | Activa modo flexible (fila) |
| `flex-col` | Cambia a columna |
| `gap-N` | Espacio entre hijos (N × 4px) |
| `items-center` | Centra verticalmente |
| `justify-center` | Centra horizontalmente |
| `justify-between` | Distribuye con espacio entre ellos |

## La Landing page — sección Hero

El Hero es la primera sección visible. Para centrar todo en pantalla:

```astro
<section class="h-screen flex flex-col items-center justify-center">
  <h1 class="text-4xl font-bold">Jonathan Mejorado</h1>
  <h2 class="text-2xl text-(--fg-1) mt-4">Embedded Systems Engineer</h2>

  <div class="flex gap-4 mt-8">
    <a href="/proyectos" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition">
      Ver proyectos
    </a>
    <a href="https://github.com/obviousfancy" class="bg-(--bg-2) hover:bg-(--bg-3) text-(--fg-0) font-bold py-2 px-4 rounded transition">
      GitHub
    </a>
  </div>
</section>
```

### Clases clave del Hero

| Clase | Efecto |
|-------|--------|
| `h-screen` | Altura = 100% de la pantalla |
| `flex flex-col` | Columna vertical |
| `items-center` | Centra horizontalmente |
| `justify-center` | Centra verticalmente |

## Hover y transiciones

El modificador `hover:` aplica estilos al pasar el mouse. Sin `transition` el cambio es brusco:

```html
<!-- Cambio brusco -->
<button class="bg-blue-500 hover:bg-blue-700">Click</button>

<!-- Cambio suave -->
<button class="bg-blue-500 hover:bg-blue-700 transition duration-300">Click</button>
```

| Clase | Efecto |
|-------|--------|
| `transition` | Suaviza las propiedades comunes |
| `duration-150` | 150ms |
| `duration-300` | 300ms |
| `duration-500` | 500ms |

## Comentarios en Astro

```astro
---
// Comentario en el frontmatter (JavaScript)
---

<!-- Comentario en HTML, no se renderiza en el navegador -->
```

## Lo aprendido

- Un componente se escribe una vez y se reutiliza en cualquier página
- Mayúscula inicial distingue componentes de etiquetas HTML
- `flex` pone hijos en fila, `flex-col` en columna
- `h-screen` + `flex` + `items-center` + `justify-center` = centrado total
- `hover:` + `transition` = interacciones suaves
- `<a>` para navegar, `<button>` para acciones
