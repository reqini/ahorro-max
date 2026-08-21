/**
 * Lista de precios minorista de Ahorra Max, tal como la maneja el negocio: la
 * bebida se vende por pack cerrado y también por unidad suelta, y esos dos
 * precios conviven en la misma fila.
 *
 * Generado desde `Lista_Precios_Minorista_AhorraMax.xlsx` (14/08/2026). Es la
 * copia en código de la lista: sirve de respaldo cuando la base no responde y
 * como semilla para cargarla. La fuente viva sigue siendo Supabase, que se
 * actualiza importando el mismo Excel desde /admin/productos.
 */

export interface ArticuloLista {
  /** Identificador estable del artículo; también nombra su foto. */
  slug: string
  nombre: string
  marca: string
  categoria: string
  /** Cómo viene: "Pack x24 · 473ml · lata". */
  presentacion: string
  /** Unidades por pack cerrado. */
  unidades: number
  /** Lo que paga el consumidor final por una unidad suelta. */
  precioUnitario: string
  /** Lo que sale cada unidad llevando el pack cerrado. */
  precioUnitarioPack: string
  /** Precio del pack cerrado completo. */
  precioPack: string
  /** La lista no da precio por menor: solo se vende el pack cerrado. */
  soloPack: boolean
}

/** Fecha de la lista vigente, para mostrarla y que se note que está al día. */
export const LISTA_ACTUALIZADA = '2026-08-14'

/** Orden en que se muestran las categorías: el mismo del Excel. */
export const CATEGORIAS_LISTA = ['Gaseosas', 'Energizantes', 'Aguas y jugos', 'Cervezas', 'Aperitivos'] as const

export const LISTA_MINORISTA: ArticuloLista[] = [
  // ── Gaseosas ──
  { slug: 'coca-cola-600ml-x6', nombre: 'Coca-Cola 600ml x6', marca: 'Coca-Cola', categoria: 'Gaseosas', presentacion: 'Pack x6 · 600ml', unidades: 6, precioUnitario: '1654', precioUnitarioPack: '1654', precioPack: '9923', soloPack: true },
  { slug: 'coca-cola-zero-600ml-x6', nombre: 'Coca-Cola Zero 600ml x6', marca: 'Coca-Cola', categoria: 'Gaseosas', presentacion: 'Pack x6 · 600ml', unidades: 6, precioUnitario: '1654', precioUnitarioPack: '1654', precioPack: '9923', soloPack: true },
  { slug: 'sprite-600ml-x6', nombre: 'Sprite 600ml x6', marca: 'Sprite', categoria: 'Gaseosas', presentacion: 'Pack x6 · 600ml', unidades: 6, precioUnitario: '1654', precioUnitarioPack: '1654', precioPack: '9923', soloPack: true },
  { slug: 'coca-cola-lata-354ml-x6', nombre: 'Coca-Cola Lata 354ml x6', marca: 'Coca-Cola', categoria: 'Gaseosas', presentacion: 'Pack x6 · 354ml · lata', unidades: 6, precioUnitario: '1434', precioUnitarioPack: '1434', precioPack: '8607', soloPack: true },
  { slug: 'coca-cola-zero-lata-354ml-x6', nombre: 'Coca-Cola Zero Lata 354ml x6', marca: 'Coca-Cola', categoria: 'Gaseosas', presentacion: 'Pack x6 · 354ml · lata', unidades: 6, precioUnitario: '1434', precioUnitarioPack: '1434', precioPack: '8607', soloPack: true },
  { slug: 'sprite-lata-354ml-x6', nombre: 'Sprite Lata 354ml x6', marca: 'Sprite', categoria: 'Gaseosas', presentacion: 'Pack x6 · 354ml · lata', unidades: 6, precioUnitario: '1434', precioUnitarioPack: '1434', precioPack: '8607', soloPack: true },
  { slug: 'sprite-zero-lata-354ml-x6', nombre: 'Sprite Zero Lata 354ml x6', marca: 'Sprite', categoria: 'Gaseosas', presentacion: 'Pack x6 · 354ml · lata', unidades: 6, precioUnitario: '1434', precioUnitarioPack: '1434', precioPack: '8607', soloPack: true },
  { slug: 'coca-cola-1-75l-x8', nombre: 'Coca-Cola 1,75L x8', marca: 'Coca-Cola', categoria: 'Gaseosas', presentacion: 'Pack x8 · 1,75L', unidades: 8, precioUnitario: '4200', precioUnitarioPack: '3812', precioPack: '30500', soloPack: false },
  { slug: 'coca-cola-zero-1-75l-x8', nombre: 'Coca-Cola Zero 1,75L x8', marca: 'Coca-Cola', categoria: 'Gaseosas', presentacion: 'Pack x8 · 1,75L', unidades: 8, precioUnitario: '4200', precioUnitarioPack: '3812', precioPack: '30500', soloPack: false },
  { slug: 'sprite-1-75l-x8', nombre: 'Sprite 1,75L x8', marca: 'Sprite', categoria: 'Gaseosas', presentacion: 'Pack x8 · 1,75L', unidades: 8, precioUnitario: '4200', precioUnitarioPack: '3812', precioPack: '30500', soloPack: false },
  { slug: 'coca-cola-2-25l-x8', nombre: 'Coca-Cola 2,25L x8', marca: 'Coca-Cola', categoria: 'Gaseosas', presentacion: 'Pack x8 · 2,25L', unidades: 8, precioUnitario: '5300', precioUnitarioPack: '4725', precioPack: '37800', soloPack: false },
  { slug: 'coca-cola-zero-2-25l-x8', nombre: 'Coca-Cola Zero 2,25L x8', marca: 'Coca-Cola', categoria: 'Gaseosas', presentacion: 'Pack x8 · 2,25L', unidades: 8, precioUnitario: '5300', precioUnitarioPack: '4725', precioPack: '37800', soloPack: false },
  { slug: 'sprite-2-25l-x8', nombre: 'Sprite 2,25L x8', marca: 'Sprite', categoria: 'Gaseosas', presentacion: 'Pack x8 · 2,25L', unidades: 8, precioUnitario: '5300', precioUnitarioPack: '4725', precioPack: '37800', soloPack: false },
  { slug: 'pepsi-lata-354ml-x24', nombre: 'Pepsi Lata 354ml x24', marca: 'Pepsi', categoria: 'Gaseosas', presentacion: 'Pack x24 · 354ml · lata', unidades: 24, precioUnitario: '1146', precioUnitarioPack: '1146', precioPack: '27500', soloPack: true },
  { slug: 'pepsi-black-lata-354ml-x24', nombre: 'Pepsi Black Lata 354ml x24', marca: 'Pepsi', categoria: 'Gaseosas', presentacion: 'Pack x24 · 354ml · lata', unidades: 24, precioUnitario: '1167', precioUnitarioPack: '1167', precioPack: '28000', soloPack: true },
  { slug: 'seven-up-lata-354ml-x24', nombre: 'Seven Up Lata 354ml x24', marca: 'Seven Up', categoria: 'Gaseosas', presentacion: 'Pack x24 · 354ml · lata', unidades: 24, precioUnitario: '1146', precioUnitarioPack: '1146', precioPack: '27500', soloPack: true },
  { slug: 'seven-up-free-lata-473ml-x24', nombre: 'Seven Up Free Lata 473ml x24', marca: 'Seven Up', categoria: 'Gaseosas', presentacion: 'Pack x24 · 473ml · lata', unidades: 24, precioUnitario: '1167', precioUnitarioPack: '1167', precioPack: '28000', soloPack: true },
  { slug: 'paso-de-los-toros-tonica-lata-354ml-x24', nombre: 'Paso de los Toros Tónica Lata 354ml x24', marca: 'Paso de los Toros', categoria: 'Gaseosas', presentacion: 'Pack x24 · 354ml · lata', unidades: 24, precioUnitario: '1146', precioUnitarioPack: '1146', precioPack: '27500', soloPack: true },
  { slug: 'paso-de-los-toros-pomelo-lata-354ml-x24', nombre: 'Paso de los Toros Pomelo Lata 354ml x24', marca: 'Paso de los Toros', categoria: 'Gaseosas', presentacion: 'Pack x24 · 354ml · lata', unidades: 24, precioUnitario: '1146', precioUnitarioPack: '1146', precioPack: '27500', soloPack: true },
  // ── Energizantes ──
  { slug: 'speed-energizante-250ml-x24', nombre: 'Speed Energizante 250ml x24', marca: 'Speed', categoria: 'Energizantes', presentacion: 'Pack x24 · 250ml', unidades: 24, precioUnitario: '1480', precioUnitarioPack: '1350', precioPack: '32400', soloPack: false },
  { slug: 'speed-xl-473ml-x12', nombre: 'Speed XL 473ml x12', marca: 'Speed', categoria: 'Energizantes', presentacion: 'Pack x12 · 473ml', unidades: 12, precioUnitario: '2650', precioUnitarioPack: '1188', precioPack: '28500', soloPack: false },
  { slug: 'red-bull-250ml-x24', nombre: 'Red Bull 250ml x24', marca: 'Red Bull', categoria: 'Energizantes', presentacion: 'Pack x24 · 250ml', unidades: 24, precioUnitario: '2550', precioUnitarioPack: '2321', precioPack: '55700', soloPack: false },
  // ── Aguas y jugos ──
  { slug: 'agua-eco-de-los-andes-500ml-x12', nombre: 'Agua Eco de los Andes 500ml x12', marca: 'Eco de los Andes', categoria: 'Aguas y jugos', presentacion: 'Pack x12 · 500ml', unidades: 12, precioUnitario: '858', precioUnitarioPack: '858', precioPack: '10300', soloPack: true },
  { slug: 'agua-glaciar-500ml-x12', nombre: 'Agua Glaciar 500ml x12', marca: 'Glaciar', categoria: 'Aguas y jugos', presentacion: 'Pack x12 · 500ml', unidades: 12, precioUnitario: '900', precioUnitarioPack: '900', precioPack: '10800', soloPack: true },
  { slug: 'agua-villavicencio-500ml-x12', nombre: 'Agua Villavicencio 500ml x12', marca: 'Villavicencio', categoria: 'Aguas y jugos', presentacion: 'Pack x12 · 500ml', unidades: 12, precioUnitario: '983', precioUnitarioPack: '983', precioPack: '11800', soloPack: true },
  { slug: 'agua-sierra-de-los-padres-600ml-x12', nombre: 'Agua Sierra de los Padres 600ml x12', marca: 'Sierra de los Padres', categoria: 'Aguas y jugos', presentacion: 'Pack x12 · 600ml', unidades: 12, precioUnitario: '667', precioUnitarioPack: '667', precioPack: '8000', soloPack: true },
  { slug: 'agua-villavicencio-premium-500ml-x12', nombre: 'Agua Villavicencio Premium 500ml x12', marca: 'Villavicencio', categoria: 'Aguas y jugos', presentacion: 'Pack x12 · 500ml', unidades: 12, precioUnitario: '1208', precioUnitarioPack: '1208', precioPack: '14500', soloPack: true },
  { slug: 'agua-villavicencio-1-5l-x6', nombre: 'Agua Villavicencio 1,5L x6', marca: 'Villavicencio', categoria: 'Aguas y jugos', presentacion: 'Pack x6 · 1,5L', unidades: 6, precioUnitario: '1517', precioUnitarioPack: '1517', precioPack: '9100', soloPack: true },
  { slug: 'agua-villavicencio-con-gas-1-5l-x6', nombre: 'Agua Villavicencio con gas 1,5L x6', marca: 'Villavicencio', categoria: 'Aguas y jugos', presentacion: 'Pack x6 · 1,5L', unidades: 6, precioUnitario: '1650', precioUnitarioPack: '1650', precioPack: '9900', soloPack: true },
  { slug: 'agua-villavicencio-2l-x6', nombre: 'Agua Villavicencio 2L x6', marca: 'Villavicencio', categoria: 'Aguas y jugos', presentacion: 'Pack x6 · 2L', unidades: 6, precioUnitario: '1792', precioUnitarioPack: '1792', precioPack: '10750', soloPack: true },
  { slug: 'agua-sierra-de-los-padres-2l-x6', nombre: 'Agua Sierra de los Padres 2L x6', marca: 'Sierra de los Padres', categoria: 'Aguas y jugos', presentacion: 'Pack x6 · 2L', unidades: 6, precioUnitario: '1217', precioUnitarioPack: '1217', precioPack: '7300', soloPack: true },
  { slug: 'cepita-naranja-1l-x8', nombre: 'Cepita Naranja 1L x8', marca: 'Cepita', categoria: 'Aguas y jugos', presentacion: 'Pack x8 · 1L', unidades: 8, precioUnitario: '1919', precioUnitarioPack: '1919', precioPack: '15350', soloPack: true },
  // ── Cervezas ──
  { slug: 'cerveza-quilmes-473ml-x24', nombre: 'Cerveza Quilmes 473ml x24', marca: 'Quilmes', categoria: 'Cervezas', presentacion: 'Pack x24 · 473ml', unidades: 24, precioUnitario: '1762', precioUnitarioPack: '1762', precioPack: '42300', soloPack: true },
  { slug: 'cerveza-quilmes-473ml-x6', nombre: 'Cerveza Quilmes 473ml x6', marca: 'Quilmes', categoria: 'Cervezas', presentacion: 'Pack x6 · 473ml', unidades: 6, precioUnitario: '1983', precioUnitarioPack: '1983', precioPack: '11900', soloPack: true },
  { slug: 'cerveza-quilmes-0-473ml-x24', nombre: 'Cerveza Quilmes 0% 473ml x24', marca: 'Quilmes', categoria: 'Cervezas', presentacion: 'Pack x24 · 473ml', unidades: 24, precioUnitario: '1312', precioUnitarioPack: '1312', precioPack: '31500', soloPack: true },
  { slug: 'cerveza-quilmes-0-473ml-x6', nombre: 'Cerveza Quilmes 0% 473ml x6', marca: 'Quilmes', categoria: 'Cervezas', presentacion: 'Pack x6 · 473ml', unidades: 6, precioUnitario: '1350', precioUnitarioPack: '1350', precioPack: '8100', soloPack: true },
  { slug: 'cerveza-schneider-473ml-x24', nombre: 'Cerveza Schneider 473ml x24', marca: 'Schneider', categoria: 'Cervezas', presentacion: 'Pack x24 · 473ml', unidades: 24, precioUnitario: '1746', precioUnitarioPack: '1746', precioPack: '41900', soloPack: true },
  { slug: 'cerveza-schneider-473ml-x6', nombre: 'Cerveza Schneider 473ml x6', marca: 'Schneider', categoria: 'Cervezas', presentacion: 'Pack x6 · 473ml', unidades: 6, precioUnitario: '2017', precioUnitarioPack: '2017', precioPack: '12100', soloPack: true },
  { slug: 'cerveza-schneider-remix-limon-473ml-x24', nombre: 'Cerveza Schneider Remix Limón 473ml x24', marca: 'Schneider', categoria: 'Cervezas', presentacion: 'Pack x24 · 473ml', unidades: 24, precioUnitario: '1883', precioUnitarioPack: '1883', precioPack: '45200', soloPack: true },
  { slug: 'cerveza-schneider-remix-limon-473ml-x6', nombre: 'Cerveza Schneider Remix Limón 473ml x6', marca: 'Schneider', categoria: 'Cervezas', presentacion: 'Pack x6 · 473ml', unidades: 6, precioUnitario: '2250', precioUnitarioPack: '2250', precioPack: '13500', soloPack: true },
  { slug: 'cerveza-amstel-473ml-x24', nombre: 'Cerveza Amstel 473ml x24', marca: 'Amstel', categoria: 'Cervezas', presentacion: 'Pack x24 · 473ml', unidades: 24, precioUnitario: '1746', precioUnitarioPack: '1746', precioPack: '41900', soloPack: true },
  { slug: 'cerveza-amstel-473ml-x6', nombre: 'Cerveza Amstel 473ml x6', marca: 'Amstel', categoria: 'Cervezas', presentacion: 'Pack x6 · 473ml', unidades: 6, precioUnitario: '2017', precioUnitarioPack: '2017', precioPack: '12100', soloPack: true },
  { slug: 'cerveza-isenbeck-473ml-x24', nombre: 'Cerveza Isenbeck 473ml x24', marca: 'Isenbeck', categoria: 'Cervezas', presentacion: 'Pack x24 · 473ml', unidades: 24, precioUnitario: '1458', precioUnitarioPack: '1458', precioPack: '35000', soloPack: true },
  { slug: 'cerveza-isenbeck-473ml-x6', nombre: 'Cerveza Isenbeck 473ml x6', marca: 'Isenbeck', categoria: 'Cervezas', presentacion: 'Pack x6 · 473ml', unidades: 6, precioUnitario: '1633', precioUnitarioPack: '1633', precioPack: '9800', soloPack: true },
  { slug: 'cerveza-grolsch-473ml-x24', nombre: 'Cerveza Grolsch 473ml x24', marca: 'Grolsch', categoria: 'Cervezas', presentacion: 'Pack x24 · 473ml', unidades: 24, precioUnitario: '1958', precioUnitarioPack: '1958', precioPack: '47000', soloPack: true },
  { slug: 'cerveza-grolsch-473ml-x6', nombre: 'Cerveza Grolsch 473ml x6', marca: 'Grolsch', categoria: 'Cervezas', presentacion: 'Pack x6 · 473ml', unidades: 6, precioUnitario: '2150', precioUnitarioPack: '2150', precioPack: '12900', soloPack: true },
  { slug: 'cerveza-budweiser-473ml-x24', nombre: 'Cerveza Budweiser 473ml x24', marca: 'Budweiser', categoria: 'Cervezas', presentacion: 'Pack x24 · 473ml', unidades: 24, precioUnitario: '2042', precioUnitarioPack: '2042', precioPack: '49000', soloPack: true },
  { slug: 'cerveza-budweiser-473ml-x6', nombre: 'Cerveza Budweiser 473ml x6', marca: 'Budweiser', categoria: 'Cervezas', presentacion: 'Pack x6 · 473ml', unidades: 6, precioUnitario: '2233', precioUnitarioPack: '2233', precioPack: '13400', soloPack: true },
  { slug: 'cerveza-michelob-ultra-473ml-x24', nombre: 'Cerveza Michelob Ultra 473ml x24', marca: 'Michelob', categoria: 'Cervezas', presentacion: 'Pack x24 · 473ml', unidades: 24, precioUnitario: '1708', precioUnitarioPack: '1708', precioPack: '41000', soloPack: true },
  { slug: 'cerveza-michelob-ultra-473ml-x6', nombre: 'Cerveza Michelob Ultra 473ml x6', marca: 'Michelob', categoria: 'Cervezas', presentacion: 'Pack x6 · 473ml', unidades: 6, precioUnitario: '1817', precioUnitarioPack: '1817', precioPack: '10900', soloPack: true },
  { slug: 'cerveza-andes-ipa-473ml-x24', nombre: 'Cerveza Andes IPA 473ml x24', marca: 'Andes', categoria: 'Cervezas', presentacion: 'Pack x24 · 473ml', unidades: 24, precioUnitario: '2000', precioUnitarioPack: '2000', precioPack: '48000', soloPack: true },
  { slug: 'cerveza-andes-ipa-473ml-x6', nombre: 'Cerveza Andes IPA 473ml x6', marca: 'Andes', categoria: 'Cervezas', presentacion: 'Pack x6 · 473ml', unidades: 6, precioUnitario: '2250', precioUnitarioPack: '2250', precioPack: '13500', soloPack: true },
  { slug: 'cerveza-andes-roja-473ml-x24', nombre: 'Cerveza Andes Roja 473ml x24', marca: 'Andes', categoria: 'Cervezas', presentacion: 'Pack x24 · 473ml', unidades: 24, precioUnitario: '2000', precioUnitarioPack: '2000', precioPack: '48000', soloPack: true },
  { slug: 'cerveza-andes-roja-473ml-x6', nombre: 'Cerveza Andes Roja 473ml x6', marca: 'Andes', categoria: 'Cervezas', presentacion: 'Pack x6 · 473ml', unidades: 6, precioUnitario: '2250', precioUnitarioPack: '2250', precioPack: '13500', soloPack: true },
  { slug: 'cerveza-andes-negra-473ml-x24', nombre: 'Cerveza Andes Negra 473ml x24', marca: 'Andes', categoria: 'Cervezas', presentacion: 'Pack x24 · 473ml', unidades: 24, precioUnitario: '2000', precioUnitarioPack: '2000', precioPack: '48000', soloPack: true },
  { slug: 'cerveza-andes-negra-473ml-x6', nombre: 'Cerveza Andes Negra 473ml x6', marca: 'Andes', categoria: 'Cervezas', presentacion: 'Pack x6 · 473ml', unidades: 6, precioUnitario: '2250', precioUnitarioPack: '2250', precioPack: '13500', soloPack: true },
  { slug: 'cerveza-andes-rubia-473ml-x24', nombre: 'Cerveza Andes Rubia 473ml x24', marca: 'Andes', categoria: 'Cervezas', presentacion: 'Pack x24 · 473ml', unidades: 24, precioUnitario: '1917', precioUnitarioPack: '1917', precioPack: '46000', soloPack: true },
  { slug: 'cerveza-andes-rubia-473ml-x6', nombre: 'Cerveza Andes Rubia 473ml x6', marca: 'Andes', categoria: 'Cervezas', presentacion: 'Pack x6 · 473ml', unidades: 6, precioUnitario: '2083', precioUnitarioPack: '2083', precioPack: '12500', soloPack: true },
  { slug: 'cerveza-stella-artois-473ml-x24', nombre: 'Cerveza Stella Artois 473ml x24', marca: 'Stella Artois', categoria: 'Cervezas', presentacion: 'Pack x24 · 473ml', unidades: 24, precioUnitario: '2417', precioUnitarioPack: '2417', precioPack: '58000', soloPack: true },
  { slug: 'cerveza-stella-artois-473ml-x6', nombre: 'Cerveza Stella Artois 473ml x6', marca: 'Stella Artois', categoria: 'Cervezas', presentacion: 'Pack x6 · 473ml', unidades: 6, precioUnitario: '2583', precioUnitarioPack: '2583', precioPack: '15500', soloPack: true },
  { slug: 'cerveza-heineken-473ml-x24', nombre: 'Cerveza Heineken 473ml x24', marca: 'Heineken', categoria: 'Cervezas', presentacion: 'Pack x24 · 473ml', unidades: 24, precioUnitario: '2604', precioUnitarioPack: '2604', precioPack: '62500', soloPack: true },
  { slug: 'cerveza-heineken-473ml-x6', nombre: 'Cerveza Heineken 473ml x6', marca: 'Heineken', categoria: 'Cervezas', presentacion: 'Pack x6 · 473ml', unidades: 6, precioUnitario: '2967', precioUnitarioPack: '2967', precioPack: '17800', soloPack: true },
  { slug: 'cerveza-warsteiner-473ml-x24', nombre: 'Cerveza Warsteiner 473ml x24', marca: 'Warsteiner', categoria: 'Cervezas', presentacion: 'Pack x24 · 473ml', unidades: 24, precioUnitario: '1833', precioUnitarioPack: '1833', precioPack: '44000', soloPack: true },
  { slug: 'cerveza-warsteiner-473ml-x6', nombre: 'Cerveza Warsteiner 473ml x6', marca: 'Warsteiner', categoria: 'Cervezas', presentacion: 'Pack x6 · 473ml', unidades: 6, precioUnitario: '2067', precioUnitarioPack: '2067', precioPack: '12400', soloPack: true },
  { slug: 'cerveza-corona-porron-330ml-x24', nombre: 'Cerveza Corona Porrón 330ml x24', marca: 'Corona', categoria: 'Cervezas', presentacion: 'Pack x24 · 330ml', unidades: 24, precioUnitario: '2708', precioUnitarioPack: '2708', precioPack: '65000', soloPack: true },
  { slug: 'cerveza-corona-porron-330ml-x6', nombre: 'Cerveza Corona Porrón 330ml x6', marca: 'Corona', categoria: 'Cervezas', presentacion: 'Pack x6 · 330ml', unidades: 6, precioUnitario: '2833', precioUnitarioPack: '2833', precioPack: '17000', soloPack: true },
  { slug: 'cerveza-heineken-porron-330ml-x24', nombre: 'Cerveza Heineken Porrón 330ml x24', marca: 'Heineken', categoria: 'Cervezas', presentacion: 'Pack x24 · 330ml', unidades: 24, precioUnitario: '2708', precioUnitarioPack: '2708', precioPack: '65000', soloPack: true },
  { slug: 'cerveza-heineken-porron-330ml-x6', nombre: 'Cerveza Heineken Porrón 330ml x6', marca: 'Heineken', categoria: 'Cervezas', presentacion: 'Pack x6 · 330ml', unidades: 6, precioUnitario: '2833', precioUnitarioPack: '2833', precioPack: '17000', soloPack: true },
  { slug: 'cerveza-sol-porron-330ml-x24', nombre: 'Cerveza Sol Porrón 330ml x24', marca: 'Sol', categoria: 'Cervezas', presentacion: 'Pack x24 · 330ml', unidades: 24, precioUnitario: '2562', precioUnitarioPack: '2562', precioPack: '61500', soloPack: true },
  { slug: 'cerveza-sol-porron-330ml-x6', nombre: 'Cerveza Sol Porrón 330ml x6', marca: 'Sol', categoria: 'Cervezas', presentacion: 'Pack x6 · 330ml', unidades: 6, precioUnitario: '2700', precioUnitarioPack: '2700', precioPack: '16200', soloPack: true },
  { slug: 'cerveza-stella-artois-porron-330ml-x24', nombre: 'Cerveza Stella Artois Porrón 330ml x24', marca: 'Stella Artois', categoria: 'Cervezas', presentacion: 'Pack x24 · 330ml', unidades: 24, precioUnitario: '2250', precioUnitarioPack: '2250', precioPack: '54000', soloPack: true },
  { slug: 'cerveza-stella-artois-porron-330ml-x6', nombre: 'Cerveza Stella Artois Porrón 330ml x6', marca: 'Stella Artois', categoria: 'Cervezas', presentacion: 'Pack x6 · 330ml', unidades: 6, precioUnitario: '2475', precioUnitarioPack: '2475', precioPack: '14850', soloPack: true },
  { slug: 'cerveza-corona-0-330ml-x24', nombre: 'Cerveza Corona 0% 330ml x24', marca: 'Corona', categoria: 'Cervezas', presentacion: 'Pack x24 · 330ml', unidades: 24, precioUnitario: '1958', precioUnitarioPack: '1958', precioPack: '47000', soloPack: true },
  { slug: 'cerveza-corona-0-330ml-x6', nombre: 'Cerveza Corona 0% 330ml x6', marca: 'Corona', categoria: 'Cervezas', presentacion: 'Pack x6 · 330ml', unidades: 6, precioUnitario: '2150', precioUnitarioPack: '2150', precioPack: '12900', soloPack: true },
  { slug: 'cerveza-heineken-laton-710ml-x24', nombre: 'Cerveza Heineken Latón 710ml x24', marca: 'Heineken', categoria: 'Cervezas', presentacion: 'Pack x24 · 710ml', unidades: 24, precioUnitario: '4375', precioUnitarioPack: '4375', precioPack: '105000', soloPack: true },
  { slug: 'cerveza-heineken-laton-710ml-x6', nombre: 'Cerveza Heineken Latón 710ml x6', marca: 'Heineken', categoria: 'Cervezas', presentacion: 'Pack x6 · 710ml', unidades: 6, precioUnitario: '4800', precioUnitarioPack: '4800', precioPack: '28800', soloPack: true },
  { slug: 'cerveza-schneider-laton-710ml-x24', nombre: 'Cerveza Schneider Latón 710ml x24', marca: 'Schneider', categoria: 'Cervezas', presentacion: 'Pack x24 · 710ml', unidades: 24, precioUnitario: '2708', precioUnitarioPack: '2708', precioPack: '65000', soloPack: true },
  { slug: 'cerveza-schneider-laton-710ml-x6', nombre: 'Cerveza Schneider Latón 710ml x6', marca: 'Schneider', categoria: 'Cervezas', presentacion: 'Pack x6 · 710ml', unidades: 6, precioUnitario: '2917', precioUnitarioPack: '2917', precioPack: '17500', soloPack: true },
  { slug: 'cerveza-amstel-laton-710ml-x24', nombre: 'Cerveza Amstel Latón 710ml x24', marca: 'Amstel', categoria: 'Cervezas', presentacion: 'Pack x24 · 710ml', unidades: 24, precioUnitario: '2583', precioUnitarioPack: '2583', precioPack: '62000', soloPack: true },
  { slug: 'cerveza-amstel-laton-710ml-x6', nombre: 'Cerveza Amstel Latón 710ml x6', marca: 'Amstel', categoria: 'Cervezas', presentacion: 'Pack x6 · 710ml', unidades: 6, precioUnitario: '2800', precioUnitarioPack: '2800', precioPack: '16800', soloPack: true },
  // ── Aperitivos ──
  { slug: 'fernet-branca-750ml-x12', nombre: 'Fernet Branca 750ml x12', marca: 'Branca', categoria: 'Aperitivos', presentacion: 'Pack x12 · 750ml', unidades: 12, precioUnitario: '18000', precioUnitarioPack: '16800', precioPack: '201600', soloPack: false },
  { slug: 'aperol-750ml-x6', nombre: 'Aperol 750ml x6', marca: 'Aperol', categoria: 'Aperitivos', presentacion: 'Pack x6 · 750ml', unidades: 6, precioUnitario: '9900', precioUnitarioPack: '9360', precioPack: '56160', soloPack: false },
  { slug: 'campari-750ml-x12', nombre: 'Campari 750ml x12', marca: 'Campari', categoria: 'Aperitivos', presentacion: 'Pack x12 · 750ml', unidades: 12, precioUnitario: '9900', precioUnitarioPack: '9360', precioPack: '112320', soloPack: false },
  { slug: 'cynar-750ml-x6', nombre: 'Cynar 750ml x6', marca: 'Cynar', categoria: 'Aperitivos', presentacion: 'Pack x6 · 750ml', unidades: 6, precioUnitario: '10450', precioUnitarioPack: '9500', precioPack: '57000', soloPack: false },
  { slug: 'jagermeister-700ml-x6', nombre: 'Jägermeister 700ml x6', marca: 'Jägermeister', categoria: 'Aperitivos', presentacion: 'Pack x6 · 700ml', unidades: 6, precioUnitario: '32100', precioUnitarioPack: '29000', precioPack: '174000', soloPack: false },
  { slug: 'gancia-950ml-x12', nombre: 'Gancia 950ml x12', marca: 'Gancia', categoria: 'Aperitivos', presentacion: 'Pack x12 · 950ml', unidades: 12, precioUnitario: '8500', precioUnitarioPack: '7800', precioPack: '93600', soloPack: false },
]
