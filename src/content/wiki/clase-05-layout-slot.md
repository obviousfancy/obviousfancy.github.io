---
titulo: "Clase 05 — Layout global y slot"
descripcion: "Cómo crear un Layout que envuelve todas las páginas y evita repetir código HTML."
tecnologias: [Astro, Tailwind]
hashtags: "#Astro #Layout #WebDev"
estado: Completado
orden: 4
---

## El problema que resuelve el Layout

Cada página necesita el mismo `<html>`, `<head>`, `<Navbar />` y estilos base. Sin Layout lo copies en cada página — igual que el navbar sin componentes.

La solución: un componente especial que **envuelve** páginas completas.

## Crear el Layout

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
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
    <title>{title}</title>
  </head>
  <body>
    <Navbar />
    <main>
      <slot />
    </main>
  </body>
</html>
```

## `<slot />` — la parte mágica

`<slot />` es el espacio donde se inserta el contenido de cada página. Es como un hueco que cada página rellena con su propio contenido.

## Usar el Layout en una página

Una vez que existe el Layout, cada página queda limpia:

```astro
---
import Layout from '../layouts/Layout.astro'
---

<Layout title="Proyectos | Obviousfancy">
  <section class="py-16 px-8">
    <h1>Mis Proyectos</h1>
  </section>
</Layout>
```

Todo lo que va dentro de `<Layout>` se inserta donde está `<slot />`.

## Props en el Layout

El Layout puede recibir props como cualquier componente. En el ejemplo, `title` permite cambiar el título de la pestaña por página:

```astro
<!-- En el Layout -->
const { title = "Obviousfancy" } = Astro.props
<title>{title}</title>

<!-- En la página -->
<Layout title="Blog | Obviousfancy">
```

El `= "Obviousfancy"` es el valor por defecto — si no se pasa `title`, usa ese.

## `<meta charset="UTF-8" />` — obligatorio

Sin esta línea el navegador no interpreta correctamente tildes, ñ y caracteres especiales del español. Siempre debe estar en el `<head>`.

## Sistema de rutas

Astro usa **enrutamiento basado en archivos**:

| Archivo | URL |
|---------|-----|
| `src/pages/index.astro` | `/` |
| `src/pages/proyectos.astro` | `/proyectos` |
| `src/pages/blog/index.astro` | `/blog` |

La raíz siempre es `/` — nunca `/index`.

## Lo aprendido

- El Layout evita repetir `<html>`, `<head>` y `<Navbar />` en cada página
- `<slot />` es donde se inserta el contenido de cada página
- `<meta charset="UTF-8" />` es obligatorio para español
- El sistema de rutas es por archivos — la ubicación define la URL
- La raíz del sitio siempre es `/`
