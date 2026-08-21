-- Ejecutar en Supabase SQL Editor, después de schema_catalogo_v2.sql
-- Carga la lista de precios minorista vigente (Lista_Precios_Minorista_AhorraMax,
-- 14/08/2026). Es la misma que importa /admin/productos desde el Excel: esto sirve
-- para dejarla cargada de una sin pasar por el panel.
--
-- Actualiza por nombre en vez de borrar y reinsertar, así los productos conservan
-- su id (y con él la foto y las comparaciones de precio ya cargadas). Lo que no
-- está en la lista no se toca: si un producto salió de venta, ocultalo desde el panel.

WITH datos(nombre, marca, categoria, presentacion, precio_minorista, precio_mayorista, precio_pack, orden) AS (
  VALUES
    ('Coca-Cola 600ml x6', 'Coca-Cola', 'Gaseosas', 'Pack x6 · 600ml', '1654', '1654', '9923', 0),
    ('Coca-Cola Zero 600ml x6', 'Coca-Cola', 'Gaseosas', 'Pack x6 · 600ml', '1654', '1654', '9923', 1),
    ('Sprite 600ml x6', 'Sprite', 'Gaseosas', 'Pack x6 · 600ml', '1654', '1654', '9923', 2),
    ('Coca-Cola Lata 354ml x6', 'Coca-Cola', 'Gaseosas', 'Pack x6 · 354ml · lata', '1434', '1434', '8607', 3),
    ('Coca-Cola Zero Lata 354ml x6', 'Coca-Cola', 'Gaseosas', 'Pack x6 · 354ml · lata', '1434', '1434', '8607', 4),
    ('Sprite Lata 354ml x6', 'Sprite', 'Gaseosas', 'Pack x6 · 354ml · lata', '1434', '1434', '8607', 5),
    ('Sprite Zero Lata 354ml x6', 'Sprite', 'Gaseosas', 'Pack x6 · 354ml · lata', '1434', '1434', '8607', 6),
    ('Coca-Cola 1,75L x8', 'Coca-Cola', 'Gaseosas', 'Pack x8 · 1,75L', '4200', '3812', '30500', 7),
    ('Coca-Cola Zero 1,75L x8', 'Coca-Cola', 'Gaseosas', 'Pack x8 · 1,75L', '4200', '3812', '30500', 8),
    ('Sprite 1,75L x8', 'Sprite', 'Gaseosas', 'Pack x8 · 1,75L', '4200', '3812', '30500', 9),
    ('Coca-Cola 2,25L x8', 'Coca-Cola', 'Gaseosas', 'Pack x8 · 2,25L', '5300', '4725', '37800', 10),
    ('Coca-Cola Zero 2,25L x8', 'Coca-Cola', 'Gaseosas', 'Pack x8 · 2,25L', '5300', '4725', '37800', 11),
    ('Sprite 2,25L x8', 'Sprite', 'Gaseosas', 'Pack x8 · 2,25L', '5300', '4725', '37800', 12),
    ('Pepsi Lata 354ml x24', 'Pepsi', 'Gaseosas', 'Pack x24 · 354ml · lata', '1146', '1146', '27500', 13),
    ('Pepsi Black Lata 354ml x24', 'Pepsi', 'Gaseosas', 'Pack x24 · 354ml · lata', '1167', '1167', '28000', 14),
    ('Seven Up Lata 354ml x24', 'Seven Up', 'Gaseosas', 'Pack x24 · 354ml · lata', '1146', '1146', '27500', 15),
    ('Seven Up Free Lata 473ml x24', 'Seven Up', 'Gaseosas', 'Pack x24 · 473ml · lata', '1167', '1167', '28000', 16),
    ('Paso de los Toros Tónica Lata 354ml x24', 'Paso de los Toros', 'Gaseosas', 'Pack x24 · 354ml · lata', '1146', '1146', '27500', 17),
    ('Paso de los Toros Pomelo Lata 354ml x24', 'Paso de los Toros', 'Gaseosas', 'Pack x24 · 354ml · lata', '1146', '1146', '27500', 18),
    ('Speed Energizante 250ml x24', 'Speed', 'Energizantes', 'Pack x24 · 250ml', '1480', '1350', '32400', 19),
    ('Speed XL 473ml x12', 'Speed', 'Energizantes', 'Pack x12 · 473ml', '2650', '1188', '28500', 20),
    ('Red Bull 250ml x24', 'Red Bull', 'Energizantes', 'Pack x24 · 250ml', '2550', '2321', '55700', 21),
    ('Agua Eco de los Andes 500ml x12', 'Eco de los Andes', 'Aguas y jugos', 'Pack x12 · 500ml', '858', '858', '10300', 22),
    ('Agua Glaciar 500ml x12', 'Glaciar', 'Aguas y jugos', 'Pack x12 · 500ml', '900', '900', '10800', 23),
    ('Agua Villavicencio 500ml x12', 'Villavicencio', 'Aguas y jugos', 'Pack x12 · 500ml', '983', '983', '11800', 24),
    ('Agua Sierra de los Padres 600ml x12', 'Sierra de los Padres', 'Aguas y jugos', 'Pack x12 · 600ml', '667', '667', '8000', 25),
    ('Agua Villavicencio Premium 500ml x12', 'Villavicencio', 'Aguas y jugos', 'Pack x12 · 500ml', '1208', '1208', '14500', 26),
    ('Agua Villavicencio 1,5L x6', 'Villavicencio', 'Aguas y jugos', 'Pack x6 · 1,5L', '1517', '1517', '9100', 27),
    ('Agua Villavicencio con gas 1,5L x6', 'Villavicencio', 'Aguas y jugos', 'Pack x6 · 1,5L', '1650', '1650', '9900', 28),
    ('Agua Villavicencio 2L x6', 'Villavicencio', 'Aguas y jugos', 'Pack x6 · 2L', '1792', '1792', '10750', 29),
    ('Agua Sierra de los Padres 2L x6', 'Sierra de los Padres', 'Aguas y jugos', 'Pack x6 · 2L', '1217', '1217', '7300', 30),
    ('Cepita Naranja 1L x8', 'Cepita', 'Aguas y jugos', 'Pack x8 · 1L', '1919', '1919', '15350', 31),
    ('Cerveza Quilmes 473ml x24', 'Quilmes', 'Cervezas', 'Pack x24 · 473ml', '1762', '1762', '42300', 32),
    ('Cerveza Quilmes 473ml x6', 'Quilmes', 'Cervezas', 'Pack x6 · 473ml', '1983', '1983', '11900', 33),
    ('Cerveza Quilmes 0% 473ml x24', 'Quilmes', 'Cervezas', 'Pack x24 · 473ml', '1312', '1312', '31500', 34),
    ('Cerveza Quilmes 0% 473ml x6', 'Quilmes', 'Cervezas', 'Pack x6 · 473ml', '1350', '1350', '8100', 35),
    ('Cerveza Schneider 473ml x24', 'Schneider', 'Cervezas', 'Pack x24 · 473ml', '1746', '1746', '41900', 36),
    ('Cerveza Schneider 473ml x6', 'Schneider', 'Cervezas', 'Pack x6 · 473ml', '2017', '2017', '12100', 37),
    ('Cerveza Schneider Remix Limón 473ml x24', 'Schneider', 'Cervezas', 'Pack x24 · 473ml', '1883', '1883', '45200', 38),
    ('Cerveza Schneider Remix Limón 473ml x6', 'Schneider', 'Cervezas', 'Pack x6 · 473ml', '2250', '2250', '13500', 39),
    ('Cerveza Amstel 473ml x24', 'Amstel', 'Cervezas', 'Pack x24 · 473ml', '1746', '1746', '41900', 40),
    ('Cerveza Amstel 473ml x6', 'Amstel', 'Cervezas', 'Pack x6 · 473ml', '2017', '2017', '12100', 41),
    ('Cerveza Isenbeck 473ml x24', 'Isenbeck', 'Cervezas', 'Pack x24 · 473ml', '1458', '1458', '35000', 42),
    ('Cerveza Isenbeck 473ml x6', 'Isenbeck', 'Cervezas', 'Pack x6 · 473ml', '1633', '1633', '9800', 43),
    ('Cerveza Grolsch 473ml x24', 'Grolsch', 'Cervezas', 'Pack x24 · 473ml', '1958', '1958', '47000', 44),
    ('Cerveza Grolsch 473ml x6', 'Grolsch', 'Cervezas', 'Pack x6 · 473ml', '2150', '2150', '12900', 45),
    ('Cerveza Budweiser 473ml x24', 'Budweiser', 'Cervezas', 'Pack x24 · 473ml', '2042', '2042', '49000', 46),
    ('Cerveza Budweiser 473ml x6', 'Budweiser', 'Cervezas', 'Pack x6 · 473ml', '2233', '2233', '13400', 47),
    ('Cerveza Michelob Ultra 473ml x24', 'Michelob', 'Cervezas', 'Pack x24 · 473ml', '1708', '1708', '41000', 48),
    ('Cerveza Michelob Ultra 473ml x6', 'Michelob', 'Cervezas', 'Pack x6 · 473ml', '1817', '1817', '10900', 49),
    ('Cerveza Andes IPA 473ml x24', 'Andes', 'Cervezas', 'Pack x24 · 473ml', '2000', '2000', '48000', 50),
    ('Cerveza Andes IPA 473ml x6', 'Andes', 'Cervezas', 'Pack x6 · 473ml', '2250', '2250', '13500', 51),
    ('Cerveza Andes Roja 473ml x24', 'Andes', 'Cervezas', 'Pack x24 · 473ml', '2000', '2000', '48000', 52),
    ('Cerveza Andes Roja 473ml x6', 'Andes', 'Cervezas', 'Pack x6 · 473ml', '2250', '2250', '13500', 53),
    ('Cerveza Andes Negra 473ml x24', 'Andes', 'Cervezas', 'Pack x24 · 473ml', '2000', '2000', '48000', 54),
    ('Cerveza Andes Negra 473ml x6', 'Andes', 'Cervezas', 'Pack x6 · 473ml', '2250', '2250', '13500', 55),
    ('Cerveza Andes Rubia 473ml x24', 'Andes', 'Cervezas', 'Pack x24 · 473ml', '1917', '1917', '46000', 56),
    ('Cerveza Andes Rubia 473ml x6', 'Andes', 'Cervezas', 'Pack x6 · 473ml', '2083', '2083', '12500', 57),
    ('Cerveza Stella Artois 473ml x24', 'Stella Artois', 'Cervezas', 'Pack x24 · 473ml', '2417', '2417', '58000', 58),
    ('Cerveza Stella Artois 473ml x6', 'Stella Artois', 'Cervezas', 'Pack x6 · 473ml', '2583', '2583', '15500', 59),
    ('Cerveza Heineken 473ml x24', 'Heineken', 'Cervezas', 'Pack x24 · 473ml', '2604', '2604', '62500', 60),
    ('Cerveza Heineken 473ml x6', 'Heineken', 'Cervezas', 'Pack x6 · 473ml', '2967', '2967', '17800', 61),
    ('Cerveza Warsteiner 473ml x24', 'Warsteiner', 'Cervezas', 'Pack x24 · 473ml', '1833', '1833', '44000', 62),
    ('Cerveza Warsteiner 473ml x6', 'Warsteiner', 'Cervezas', 'Pack x6 · 473ml', '2067', '2067', '12400', 63),
    ('Cerveza Corona Porrón 330ml x24', 'Corona', 'Cervezas', 'Pack x24 · 330ml', '2708', '2708', '65000', 64),
    ('Cerveza Corona Porrón 330ml x6', 'Corona', 'Cervezas', 'Pack x6 · 330ml', '2833', '2833', '17000', 65),
    ('Cerveza Heineken Porrón 330ml x24', 'Heineken', 'Cervezas', 'Pack x24 · 330ml', '2708', '2708', '65000', 66),
    ('Cerveza Heineken Porrón 330ml x6', 'Heineken', 'Cervezas', 'Pack x6 · 330ml', '2833', '2833', '17000', 67),
    ('Cerveza Sol Porrón 330ml x24', 'Sol', 'Cervezas', 'Pack x24 · 330ml', '2562', '2562', '61500', 68),
    ('Cerveza Sol Porrón 330ml x6', 'Sol', 'Cervezas', 'Pack x6 · 330ml', '2700', '2700', '16200', 69),
    ('Cerveza Stella Artois Porrón 330ml x24', 'Stella Artois', 'Cervezas', 'Pack x24 · 330ml', '2250', '2250', '54000', 70),
    ('Cerveza Stella Artois Porrón 330ml x6', 'Stella Artois', 'Cervezas', 'Pack x6 · 330ml', '2475', '2475', '14850', 71),
    ('Cerveza Corona 0% 330ml x24', 'Corona', 'Cervezas', 'Pack x24 · 330ml', '1958', '1958', '47000', 72),
    ('Cerveza Corona 0% 330ml x6', 'Corona', 'Cervezas', 'Pack x6 · 330ml', '2150', '2150', '12900', 73),
    ('Cerveza Heineken Latón 710ml x24', 'Heineken', 'Cervezas', 'Pack x24 · 710ml', '4375', '4375', '105000', 74),
    ('Cerveza Heineken Latón 710ml x6', 'Heineken', 'Cervezas', 'Pack x6 · 710ml', '4800', '4800', '28800', 75),
    ('Cerveza Schneider Latón 710ml x24', 'Schneider', 'Cervezas', 'Pack x24 · 710ml', '2708', '2708', '65000', 76),
    ('Cerveza Schneider Latón 710ml x6', 'Schneider', 'Cervezas', 'Pack x6 · 710ml', '2917', '2917', '17500', 77),
    ('Cerveza Amstel Latón 710ml x24', 'Amstel', 'Cervezas', 'Pack x24 · 710ml', '2583', '2583', '62000', 78),
    ('Cerveza Amstel Latón 710ml x6', 'Amstel', 'Cervezas', 'Pack x6 · 710ml', '2800', '2800', '16800', 79),
    ('Fernet Branca 750ml x12', 'Branca', 'Aperitivos', 'Pack x12 · 750ml', '18000', '16800', '201600', 80),
    ('Aperol 750ml x6', 'Aperol', 'Aperitivos', 'Pack x6 · 750ml', '9900', '9360', '56160', 81),
    ('Campari 750ml x12', 'Campari', 'Aperitivos', 'Pack x12 · 750ml', '9900', '9360', '112320', 82),
    ('Cynar 750ml x6', 'Cynar', 'Aperitivos', 'Pack x6 · 750ml', '10450', '9500', '57000', 83),
    ('Jägermeister 700ml x6', 'Jägermeister', 'Aperitivos', 'Pack x6 · 700ml', '32100', '29000', '174000', 84),
    ('Gancia 950ml x12', 'Gancia', 'Aperitivos', 'Pack x12 · 950ml', '8500', '7800', '93600', 85)
),
actualizados AS (
  UPDATE productos p SET
    marca            = d.marca,
    categoria        = d.categoria,
    presentacion     = d.presentacion,
    precio_minorista = d.precio_minorista,
    precio_mayorista = d.precio_mayorista,
    precio_pack      = d.precio_pack,
    orden            = d.orden
  FROM datos d
  WHERE lower(btrim(p.nombre)) = lower(d.nombre)
  RETURNING p.id
)
INSERT INTO productos (nombre, marca, categoria, presentacion, precio_minorista, precio_mayorista, precio_pack, orden, activo)
SELECT d.nombre, d.marca, d.categoria, d.presentacion, d.precio_minorista, d.precio_mayorista, d.precio_pack, d.orden, true
FROM datos d
WHERE NOT EXISTS (
  SELECT 1 FROM productos p WHERE lower(btrim(p.nombre)) = lower(d.nombre)
);
