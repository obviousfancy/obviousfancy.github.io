---
titulo: "Clase 08 — Content Collections con Markdown"
descripcion: "Cómo migrar de datos hardcodeados a archivos Markdown con esquema tipado. El enfoque profesional para manejar contenido."
tecnologias: [Astro, Markdown, TypeScript]
hashtags: "#Astro #Markdown #ContentCollections #WebDev"
estado: Completado
orden: 6
---

## El problema con datos hardcodeados

Con `getStaticPaths()` hardcodeado, agregar un proyecto significa editar código. La documentación larga es imposible de meter.

La solución profesional: **Content Collections** — cada proyecto es un archivo `.md`.

```
src/content/proyectos/
├── smartlight.md
├── hexconverter.md
└── serialmcu.md
```

Agregar un proyecto = crear un archivo. Sin tocar código.

## Estructura de un archivo Markdown de proyecto

Cada archivo tiene dos partes:

```markdown
---
titulo: SmartLight
descripcion: Panel LED basado en ESP32 con soporte CCT y WS2812B.
tecnologias: [ESP32, WS2812B, KiCad, C++]
hashtags: "#LED #ESP32 #CCT"
github: https://github.com/obviousfancy/smartlight
estado: En desarrollo
orden: 1
---

## El problema que resuelve

Texto libre en Markdown...

## Decisiones de diseño

¿Por qué MOSFET y no relay? Porque...

## Próximos pasos

- [ ] Diseño final del PCB
- [ ] Carcasa impresa en 3D
```

La parte entre `---` se llama **frontmatter** — metadata estructurada. Lo de abajo es Markdown libre.

## Configurar la colección — `src/content.config.ts`

> ⚠️ En Astro v6 el archivo se llama `content.config.ts` (en la raíz de `src/`), no `content/config.ts`.

```typescript
import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const proyectos = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/proyectos" }),
  schema: z.object({
    titulo:       z.string(),
    descripcion:  z.string(),
    tecnologias:  z.array(z.string()),
    hashtags:     z.string(),
    github:       z.string().optional(),
    estado:       z.enum(['En desarrollo', 'Completado', 'Pausado', 'Abandonado']),
    orden:        z.number(),
    youtube:      z.string().url().optional(),
    imagen:       z.string().optional(),
  })
})

export const collections = { proyectos }
```

### ¿Qué hace cada parte?

- **`glob`** — busca todos los archivos `.md` en la carpeta especificada
- **`schema`** — define qué campos son obligatorios y qué tipo debe tener cada uno
- **`z.string()`** — campo obligatorio de texto
- **`z.string().optional()`** — campo opcional de texto
- **`z.enum([...])`** — solo acepta los valores listados
- **`z.array(z.string())`** — array de strings

Si un `.md` le falta un campo obligatorio del schema, Astro avisa con error en lugar de fallar silenciosamente.

## Leer la colección en `proyectos.astro`

```astro
---
import Layout from '../layouts/Layout.astro'
import TarjetaProyecto from '../components/Tarjetaproyecto.astro'
import { getCollection } from 'astro:content'

const proyectos = await getCollection('proyectos')
const proyectosOrdenados = proyectos.sort((a, b) => a.data.orden - b.data.orden)
---

<Layout>
  <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8 pb-16 max-w-6xl mx-auto">
    {proyectosOrdenados.map(proyecto => (
      <TarjetaProyecto
        titulo={proyecto.data.titulo}
        descripcion={proyecto.data.descripcion}
        tecnologias={proyecto.data.tecnologias.join(' · ')}
        hashtags={proyecto.data.hashtags}
        url={`/proyectos/${proyecto.id}`}
      />
    ))}
  </section>
</Layout>
```

### `.join(' · ')` — array a string

Las tecnologías son un array `['ESP32', 'WS2812B']`. Para mostrarlas como texto `ESP32 · WS2812B` se usa `.join()`:

```javascript
['ESP32', 'WS2812B', 'KiCad'].join(' · ')
// → "ESP32 · WS2812B · KiCad"
```

## Rutas dinámicas con Content Collections

En `src/pages/proyectos/[slug].astro` — Astro v6:

```astro
---
import Layout from '../../layouts/Layout.astro'
import { getCollection, render } from 'astro:content'

export async function getStaticPaths() {
  const proyectos = await getCollection('proyectos')
  return proyectos.map(proyecto => ({
    params: { slug: proyecto.id },
    props: { proyecto }
  }))
}

const { proyecto } = Astro.props
const { Content } = await render(proyecto)
const { titulo, descripcion, tecnologias, github, estado } = proyecto.data
---

<Layout>
  <div class="max-w-3xl mx-auto px-8 py-16">
    <a href="/proyectos" class="text-(--fg-3) hover:text-(--fg-0) transition">
      ← Volver a proyectos
    </a>
    <h1 class="text-5xl font-bold mt-6">{titulo}</h1>
    <p class="text-(--fg-1) text-xl mt-4">{descripcion}</p>

    <div class="flex gap-2 mt-6 flex-wrap">
      {tecnologias.map((tech: string) => (
        <span class="bg-(--bg-3) text-(--fg-1) text-sm px-3 py-1 rounded-full">
          {tech}
        </span>
      ))}
    </div>

    <!-- Aquí se renderiza el Markdown del archivo .md -->
    <div class="prose prose-invert mt-12">
      <Content />
    </div>
  </div>
</Layout>
```

## Cambios de Astro v5 a v6

| v5 | v6 |
|----|----|
| `src/content/config.ts` | `src/content.config.ts` |
| `type: 'content'` en defineCollection | Se elimina `type`, se usa `loader` |
| `proyecto.slug` | `proyecto.id` |
| `await proyecto.render()` | `import { render }` + `await render(proyecto)` |

## Lo aprendido

- Content Collections = cada proyecto es un archivo `.md`
- El frontmatter define la metadata, el cuerpo es Markdown libre
- El schema de Zod valida los datos en tiempo de compilación
- `getCollection()` lee todos los archivos de la colección
- `render()` convierte el Markdown a HTML para mostrarlo
- En Astro v6 `slug` se renombró a `id`
