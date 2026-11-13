import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'modelProfile',
  title: 'Perfil de la Modelo',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre Completo',
      type: 'string',
    }),
    defineField({
      name: 'bio',
      title: 'Biografía / Sobre Mí',
      type: 'text',
    }),
    defineField({
      name: 'location',
      title: 'Ubicación',
      type: 'string',
      initialValue: 'Buenos Aires, Argentina',
    }),
    defineField({
      name: 'bookingEmail',
      title: 'Email de Booking / Contacto',
      type: 'string',
      initialValue: 'valentinapatri09@gmail.com',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram (URL)',
      type: 'url',
      description: 'Enlace al perfil de Instagram (ej: https://instagram.com/valentinapatri09)',
    }),
    defineField({
      name: 'compCard',
      title: 'Comp Card (PDF)',
      type: 'file',
      options: {
        accept: '.pdf',
      },
      description: 'Documento PDF descargable con el composite / comp card de la modelo',
    }),
    defineField({
      name: 'stats',
      title: 'Medidas (Stats)',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'height', title: 'Altura (cm)', type: 'string' }),
        defineField({ name: 'bust', title: 'Busto', type: 'string' }),
        defineField({ name: 'waist', title: 'Cintura', type: 'string' }),
        defineField({ name: 'hips', title: 'Cadera', type: 'string' }),
        defineField({ name: 'shoes', title: 'Talle de Zapatos', type: 'string' }),
        defineField({ name: 'eyes', title: 'Color de Ojos', type: 'string' }),
        defineField({ name: 'hair', title: 'Color de Pelo', type: 'string' }),
      ],
    }),
    defineField({
      name: 'measurements',
      title: 'Medidas Anteriores (Compatibilidad)',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      description: 'Campo original preservado para no perder datos existentes en la web.',
      fields: [
        defineField({ name: 'height', title: 'Altura (cm)', type: 'string' }),
        defineField({ name: 'bust', title: 'Busto', type: 'string' }),
        defineField({ name: 'waist', title: 'Cintura', type: 'string' }),
        defineField({ name: 'hips', title: 'Cadera', type: 'string' }),
        defineField({ name: 'shoes', title: 'Talle de Zapatos', type: 'string' }),
        defineField({ name: 'eyes', title: 'Color de Ojos', type: 'string' }),
        defineField({ name: 'hair', title: 'Color de Pelo', type: 'string' }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Galería del Portfolio',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Texto Alternativo / Descripción',
              type: 'string',
              description: 'Descripción breve de la fotografía para accesibilidad y SEO.',
            }),
            defineField({
              name: 'category',
              title: 'Categoría',
              type: 'string',
              options: {
                list: [
                  { title: 'Editorial', value: 'Editorial' },
                  { title: 'Comercial', value: 'Comercial' },
                  { title: 'Polaroids', value: 'Polaroids' },
                  { title: 'Pasarela', value: 'Pasarela' },
                ],
                layout: 'radio',
              },
              description: 'Clasificación de la imagen dentro del book/portfolio.',
            }),
            defineField({
              name: 'isHero',
              title: 'Portada Principal (Hero)',
              type: 'boolean',
              initialValue: false,
              description: 'Indica si esta foto es la imagen principal / portada.',
            }),
            defineField({
              name: 'visible',
              title: 'Visible en la Web',
              type: 'boolean',
              initialValue: true,
              description: 'Controla si la foto se muestra en la web sin necesidad de eliminarla.',
            }),
          ],
          preview: {
            select: {
              title: 'alt',
              category: 'category',
              media: 'asset',
              isHero: 'isHero',
              visible: 'visible',
            },
            prepare({ title, category, media, isHero, visible }) {
              const tags: string[] = []
              if (category) tags.push(category)
              if (isHero) tags.push('⭐ Hero')
              if (visible === false) tags.push('🚫 Oculto')

              return {
                title: title || 'Fotografía de Galería',
                subtitle: tags.length > 0 ? tags.join(' • ') : 'Visible (Sin categoría)',
                media,
              }
            },
          },
        }),
      ],
    }),
  ],
})
