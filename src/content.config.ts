import {defineCollection,z} from 'astro:content';
import { glob } from 'astro/loaders'   // ← línea nueva

const proyectos =  defineCollection({

    loader: glob({ pattern: "**/*.md", base: "./src/content/proyectos" }),
    schema: z.object({
        titulo: z.string(),
        descripcion: z.string(),
        tecnologias: z.array(z.string()),
        hashtags: z.string(),
        github: z.string().optional(),
        estado: z.enum(['En desarrollo', 'Completado','Pausado','Abandonado']),
        orden: z.number(),
        youtube: z.string().url().optional(),
        imagen: z.string().url().optional()
    })
})

export const collections = { proyectos }