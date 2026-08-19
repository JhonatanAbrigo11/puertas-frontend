/**
 * Fotografías realistas alineadas al NOMBRE de cada producto.
 * Cada imagen muestra el producto instalado/completo, no perfiles ni interiores genéricos.
 */
const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop`;

const us = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=900&auto=format&fit=crop&q=80`;

export const productImageUris: Record<string, string> = {
  // ── VENTANAS DE ALUMINIO ──────────────────────────────────────────────────
  /** Ventana Corrediza 2 Hojas — vano con dos hojas corredizas de vidrio */
  'ventana-corrediza-2h': us('1525570665650-76bb26af503d'),
  /** Ventana Corrediza 3 Hojas — sistema corredizo de varias hojas en vano amplio */
  'ventana-corrediza-3h': px(28272351),
  /** Ventana Batiente — ventana abatible con marco y vidrio en fachada */
  'ventana-batiente': us('1586853236092-0e7e5c84b475'),
  /** Ventana Proyectable — ventana con apertura inclinada hacia el exterior */
  'ventana-proyectable': us('1743685873224-11544a4d9378'),

  // ── MAMPARAS & DIVISIONES DE VIDRIO ───────────────────────────────────────
  /** Mampara Fija — panel fijo de vidrio sin apertura */
  'mampara-fija': px(13603622),
  /** Mampara Corrediza — mampara de vidrio con hoja deslizante */
  'mampara-corrediza': us('1497366754035-f200968a6e72'),
  /** División de Oficina — módulos divisorios de vidrio en oficina */
  'division-oficina': px(5511093),
  /** Mampara de Baño — cabina de ducha con vidrio templado */
  'mampara-bano': px(8142053),

  // ── FACHADAS EN ALUCOBOND (ACM) ───────────────────────────────────────────
  /** Fachada ACM — revestimiento exterior en paneles de aluminio compuesto */
  'fachada-acm': px(7078885),
  /** Fachada ACM + Vidrio — fachada mixta con paneles ACM y muro cortina */
  'fachada-acm-vidrio': px(20106893),
  /** Revestimiento ACM — forrado arquitectónico en paneles ACM */
  'revestimiento-acm': px(35022841),

  // ── VITRINAS COMERCIALES ──────────────────────────────────────────────────
  /** Vitrina Recta — mostrador recto de vidrio para exhibición */
  'vitrina-recta': px(15247808),
  /** Vitrina Esquinera — escaparate en esquina con vidrio */
  'vitrina-esquinera': px(35175923),
  /** Vitrina con Puertas Corredizas — vitrina comercial con acceso corredizo */
  'vitrina-puertas-corredizas': px(18102042),
  /** Vitrina Exhibidora — torre vertical de exhibición en vidrio */
  'vitrina-exhibidora': px(17273249),

  // ── PÉRGOLAS & POLICARBONATO ──────────────────────────────────────────────
  /** Pérgola de Aluminio — estructura exterior con lamas de aluminio */
  'pergola-aluminio': px(33993508),
  /** Pérgola con Policarbonato — pérgola con cubierta translúcida */
  'pergola-policarbonato': px(37560455),
  /** Cubierta de Policarbonato — techo transparente / marquesina */
  'cubierta-policarbonato': px(9989504),

  // ── PUERTAS ───────────────────────────────────────────────────────────────
  /** Puerta Corrediza — puerta corrediza de aluminio hacia exterior/terraza */
  'puerta-corrediza': px(37588542),
  /** Puerta Batiente — puerta de acceso abatible con marco y vidrio */
  'puerta-batiente': px(12709862),
  /** Puerta de Aluminio — puerta sólida/ciega de aluminio */
  'puerta-aluminio': px(10727928),
  /** Puerta Corrediza de Vidrio — puerta suspendida de cristal templado */
  'puerta-corrediza-vidrio': px(34574609),
};
