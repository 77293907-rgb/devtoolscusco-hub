/* =========================================================
   data.js — Catálogo de productos de Inkari Art
   ========================================================= */

const PRODUCTOS = [
  // --- TEXTILES (4) ---
  {
    id: 't1',
    nombre: 'Chompa de Alpaca',
    descripcion: 'Tejido suave y abrigador con diseños geométricos andinos hechos a mano.',
    precio: 180.00,
    categoria: 'Textiles',
    imagen: 'https://http2.mlstatic.com/D_NQ_NP_635052-MPE93925978450_102025-O.webp'
  },
  {
    id: 't2',
    nombre: 'Bufanda de Alpaca',
    descripcion: 'Hilado a mano con tintes naturales extraídos de plantas del Valle Sagrado.',
    precio: 85.00,
    categoria: 'Textiles',
    imagen: 'https://pe.kunastores.com/cdn/shop/files/D10548DP0200XXC0002-CHAPEL-2026_2.jpg?format=webp&v=1775565183&width=1600'
  },
  {
    id: 't3',
    nombre: 'Chullo Cusqueño',
    descripcion: 'Gorro tradicional con orejeras y pompones, símbolo de identidad andina.',
    precio: 45.00,
    categoria: 'Textiles',
    imagen: 'https://www.chaku-alpaca.com/cdn/shop/files/MG_2533-2026.jpg?v=1770748677&width=1946'
  },
  {
    id: 't4',
    nombre: 'Manta Tejida a Mano',
    descripcion: 'Pieza tradicional con iconografía Inca, perfecta como tapiz decorativo.',
    precio: 250.00,
    categoria: 'Textiles',
    imagen: 'https://cdn.faire.com/fastly/c7fb22a6513a791e9d678f3f1e18ecb40fa59286565807ebdfadfba4e349250c.jpeg'
  },

  // --- GASTRONOMÍA (3) ---
  {
    id: 'g1',
    nombre: 'Café de Altura Cusco',
    descripcion: 'Café orgánico de especialidad, cultivado a más de 1,800 msnm en La Convención.',
    precio: 35.00,
    categoria: 'Gourmet',
    imagen: 'https://cafequillabamba.com/wp-content/uploads/2026/08/cafe-altura-1200x1200.jpg'
  },
  {
    id: 'g2',
    nombre: 'Chocolate Orgánico 70%',
    descripcion: 'Tableta de chocolate fino de aroma con cacao nativo cusqueño.',
    precio: 25.00,
    categoria: 'Gourmet',
    imagen: 'https://peruvianecofarmers.com/wp-content/uploads/2023/11/IMG_20231109_102233280-02-scaled.jpeg'
  },
  {
    id: 'g3',
    nombre: 'Sal Rosada de Maras',
    descripcion: 'Sal gourmet extraída a mano de las minas de sal pre-incas de Maras.',
    precio: 15.00,
    categoria: 'Gourmet',
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStzzULPYlOeHryTUaPKhh_r51Eb3J6swe3IW22wt40ZIKMMH42AiHwlzg&s=10'
  },

  // --- CERÁMICA Y ARTE (3) ---
  {
    id: 'c1',
    nombre: 'Toro de Pucará',
    descripcion: 'Cerámica tradicional que protege el hogar y atrae la prosperidad.',
    precio: 65.00,
    categoria: 'Cerámica',
    imagen: 'https://www.arteyceramica.com.pe/wp-content/uploads/2022/04/WFAD22002-3.webp'
  },
  {
    id: 'c2',
    nombre: 'Mates Burilados',
    descripcion: 'Pequeñas esculturas talladas en madera que narran la vida andina.',
    precio: 120.00,
    categoria: 'Cerámica',
    imagen: 'https://yerbamateargentina.org.ar/imagenes/archivos/noticias/79233_imagen_1227x747xrecortarxagrandar.jpg?random=1608576631'
  },
  {
    id: 'c3',
    nombre: 'Retablo Ayacuchano',
    descripcion: 'Caja de madera con esculturas coloridas de fiestas y costumbres peruanas.',
    precio: 195.00,
    categoria: 'Arte',
    imagen: 'https://trexperienceperu.com/sites/default/files/retablos_ayacuchanos.jpg'
  },

  // --- JOYERÍA (2) ---
  {
    id: 'j1',
    nombre: 'Dije de Plata Chakan',
    descripcion: 'Cruz andina de plata 950, representa el encuentro de los tres mundos.',
    precio: 150.00,
    categoria: 'Joyería',
    imagen: 'https://i.etsystatic.com/54898630/r/il/7690cb/8650567811/il_fullxfull.8650567811_e862.jpg'
  },
  {
    id: 'j2',
    nombre: 'Aretes de Plata y Spondylus',
    descripcion: 'Joyería fina con incrustaciones de concha Spondylus (mullu) de la costa.',
    precio: 220.00,
    categoria: 'Joyería',
    imagen: 'https://d15yqn4xt8exgp.cloudfront.net/media/products/BOO000525/inka-products-boucles-doreilles-rondes-ceramique-artisanale-perles-rocailles-1-20240430161853.zoom.jpg'
  }
];