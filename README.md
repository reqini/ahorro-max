This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Lista de precios y fotos de los productos

El catálogo que se ve en el home y en `/catalogo` sale de la tabla `productos` de
Supabase. La lista vigente también vive en el repo (`src/constants/catalogo.ts`,
generada desde `Lista_Precios_Minorista_AhorraMax.xlsx`) y se usa como respaldo:
si la base no responde o todavía está vacía, la tienda igual muestra los artículos
y los precios en vez de quedar en blanco.

### Actualizar los precios

Cuando cambia la lista, hay dos caminos:

1. **Desde el panel** (lo habitual): entrar a `/admin/productos` e importar el
   Excel tal cual lo armás. Se entiende el formato de la lista —secciones por
   categoría, presentación, precio del pack y precio por unidad— además de la
   plantilla simple de cinco columnas. Los productos que ya existen se actualizan
   por nombre, así que reimportar no duplica nada.
2. **Desde Supabase**: correr `supabase/schema_catalogo_v2.sql` (una sola vez) y
   después `supabase/seed_lista_minorista.sql`, que deja cargada la lista completa.

Si además cambia la lista de referencia del repo, se regenera
`src/constants/catalogo.ts` a partir del mismo Excel. El importador y ese archivo
producen exactamente los mismos nombres de artículo, para que las dos vías no se
pisen.

### Cargar las fotos reales

Las fotos van a un bucket público de Supabase Storage llamado `productos`, que
crea `supabase/schema_catalogo_v2.sql`. Desde `/admin/productos` se pueden subir:

- **De a muchas**: el bloque "Fotos de los productos" toma varios archivos juntos
  y asigna cada uno al producto cuyo nombre coincide con el del archivo
  (`cerveza-quilmes-473ml-x24.jpg` → *Cerveza Quilmes 473ml x24*). El botón
  "Nombres de archivo" baja la lista de nombres esperados para renombrar las fotos
  sin adivinar.
- **De a una**: dentro de "🖼 Catálogo" de cada producto, subiendo el archivo o
  pegando la URL de la foto oficial de la marca.

Mientras un producto no tiene foto, la ficha muestra la marca sobre la silueta del
envase con el color de la marca, para que la grilla no se vea rota.
