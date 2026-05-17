---
titulo: "Clase 06 y 07 — Grid, componentes con props y rutas dinámicas"
descripcion: "Galería de proyectos con Grid, componentes que reciben datos, y páginas individuales con rutas dinámicas."
tecnologias: [Astro, Tailwind]
hashtags: "#Astro #Grid #WebDev #Portfolio"
estado: Completado
orden: 5
---

## Grid — distribución en dos dimensiones

Flexbox organiza elementos en una dimensión (fila o columna). Grid los organiza en **dos dimensiones** (filas y columnas) — perfecto para galerías.

```html
<section class="grid grid-cols-3 gap-6">
  <div>Tarjeta 1</div>
  <div>Tarjeta 2</div>
  <div>Tarjeta 3</div>
</section>
```

### Grid responsive

En Tailwind los prefijos `md:` y `lg:` aplican estilos según el tamaño de pantalla:

```html
<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

| Pantalla | Columnas |
|----------|----------|
| Móvil (base) | 1 columna |
| `md:` 768px+ | 2 columnas |
| `lg:` 1024px+ | 3 columnas |

Esta es la filosofía **mobile-first**: diseñas primero para móvil y agregas breakpoints para pantallas más grandes.

## Componentes con props

Un componente estático siempre se ve igual. Con **props** puede cambiar según los datos que recibe — como parámetros de una función en C.

### Definir props en el componente

```astro
---
// src/components/TarjetaProyecto.astro
const { titulo, descripcion, tecnologias, hashtags, url } = Astro.props
---

<a href={url} class="block bg-(--bg-2) p-6 rounded-lg hover:bg-(--bg-3) hover:-translate-y-2 transition duration-300">
  <h3 class="text-2xl font-bold text-(--fg-0)">{titulo}</h3>
  <p class="text-(--fg-1) mt-2">{descripcion}</p>
  <p class="text-sm text-(--accent) mt-4">{tecnologias}</p>
  <p class="text-sm text-(--fg-3) mt-4">{hashtags}</p>
</a>
```

### Usar el componente con props

```astro
<TarjetaProyecto
  titulo="SmartLight"
  descripcion="Panel LED con ESP32 y CCT"
  tecnologias="ESP32 · WS2812B · KiCad"
  hashtags="#LED #ESP32 #CCT"
  url="/proyectos/smartlight"
/>
```

### La tarjeta completa como link

Para que toda la tarjeta sea clickeable, el `<a>` debe envolver todo el contenido. La clase `block` hace que el `<a>` ocupe todo el bloque:

```html
<a href={url} class="block ...">
  <!-- todo esto es clickeable -->
</a>
```

### Hover con elevación

```html
class="hover:-translate-y-2 transition duration-300"
```

| Clase | Movimiento |
|-------|-----------|
| `hover:-translate-y-1` | 4px hacia arriba — sutil |
| `hover:-translate-y-2` | 8px — moderado |
| `hover:-translate-y-4` | 16px — exagerado |

Sin `transition` el movimiento es instantáneo y brusco.

## Rutas dinámicas — `[slug].astro`

En lugar de crear un archivo por proyecto, un solo archivo sirve para todos usando **parámetros dinámicos**:

```
src/pages/proyectos/[slug].astro
```

El `slug` es la parte variable de la URL. Para `/proyectos/smartlight` el slug es `smartlight`.

### getStaticPaths — declarar qué páginas existen

```astro
export async function getStaticPaths() {
  return [
    {
      params: { slug: 'smartlight' },
      props: {
        titulo: 'SmartLight',
        tecnologias: ['ESP32', 'WS2812B', 'KiCad'],
        estado: 'En desarrollo'
      }
    },
    {
      params: { slug: 'hexconverter' },
      props: { titulo: 'HexConverter', ... }
    }
  ]
}
```

Astro genera **solo** las páginas declaradas en `getStaticPaths`. Si el slug no está declarado → 404.

### Regla crítica

> El slug en `getStaticPaths()` y la `url` de la tarjeta deben ser **idénticos**.

```
params: { slug: 'smartlight' }  ↔  url="/proyectos/smartlight"
```

### Recibir los props en la página

```astro
const { titulo, tecnologias, estado } = Astro.props
```

### `.map()` para renderizar listas

Cuando un prop es un array (como `tecnologias`), se usa `.map()` para generar un elemento por cada ítem:

```astro
<div class="flex gap-2 flex-wrap">
  {tecnologias.map((tech: string) => (
    <span class="bg-(--bg-3) text-(--fg-1) text-sm px-3 py-1 rounded-full">
      {tech}
    </span>
  ))}
</div>
```

Es como un `for` de C: `tech` es cada elemento del array en cada iteración.

## Lo aprendido

- Grid organiza en dos dimensiones — ideal para galerías
- `md:` y `lg:` aplican estilos por breakpoint (mobile-first)
- Los props son como parámetros — hacen al componente flexible
- `block` en `<a>` hace que toda el área sea clickeable
- `[slug].astro` + `getStaticPaths()` = páginas dinámicas desde un solo archivo
- `.map()` recorre arrays y genera HTML por cada elemento
- Sin `props:` en `getStaticPaths`, `Astro.props` llega vacío
