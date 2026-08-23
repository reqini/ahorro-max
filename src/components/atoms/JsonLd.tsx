/** Emite un bloque de datos estructurados (schema.org) como <script type="application/ld+json">. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
