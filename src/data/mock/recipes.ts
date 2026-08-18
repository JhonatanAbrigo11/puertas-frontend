import { Recipe } from '../../core/domain/entities/Recipe';

export const mockRecipes: Record<string, Recipe> = {
  // === VENTANAS DE ALUMINIO ===
  'ventana-corrediza-2h': {
    productId: 'ventana-corrediza-2h',
    items: [
      {
        materialId: 'perfil-aluminio-marco-20',
        formulaDescription: 'Marco perimetral: 2 × (Ancho + Alto)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((2 * (widthCm + heightCm)) / 100) * quantity,
      },
      {
        materialId: 'perfil-aluminio-hoja-20',
        formulaDescription: 'Hojas corredizas (2): (2 × Ancho + 4 × Alto)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((2 * widthCm + 4 * heightCm) / 100) * quantity,
      },
      {
        materialId: 'vidrio-claro-6mm',
        formulaDescription: 'Área de vidrio: Ancho × Alto',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((widthCm * heightCm) / 10000) * quantity,
      },
      {
        materialId: 'felpa-hermetica',
        formulaDescription: 'Felpa selladora: 2 × (Ancho + Alto)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((2 * (widthCm + heightCm)) / 100) * quantity,
      },
      {
        materialId: 'empaque-vinil-u',
        formulaDescription: 'Empaque vinil vidrio: 2 × (Ancho + Alto)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((2 * (widthCm + heightCm)) / 100) * quantity,
      },
      {
        materialId: 'ruedas-nylon-doble',
        formulaDescription: 'Rodamientos: 4 por unidad',
        calculate: ({ quantity }) => 4 * quantity,
      },
      {
        materialId: 'cerradura-ventana-pico-loro',
        formulaDescription: 'Cierre central: 1 por unidad',
        calculate: ({ quantity }) => 1 * quantity,
      },
      {
        materialId: 'tornillos-autorroscantes',
        formulaDescription: 'Tornillería inox: 16 por unidad',
        calculate: ({ quantity }) => 16 * quantity,
      },
      {
        materialId: 'silicona-estructural',
        formulaDescription: 'Sellado exterior: 1 tubo por ventana',
        calculate: ({ quantity }) => 1 * quantity,
      },
    ],
  },

  'ventana-corrediza-3h': {
    productId: 'ventana-corrediza-3h',
    items: [
      {
        materialId: 'perfil-aluminio-marco-20',
        formulaDescription: 'Marco perimetral 3 vías: 2 × (Ancho + Alto)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((2 * (widthCm + heightCm)) / 100) * quantity,
      },
      {
        materialId: 'perfil-aluminio-hoja-20',
        formulaDescription: 'Hojas corredizas (3): (3 × Ancho + 6 × Alto)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((3 * widthCm + 6 * heightCm) / 100) * quantity,
      },
      {
        materialId: 'vidrio-claro-6mm',
        formulaDescription: 'Área de vidrio: Ancho × Alto',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((widthCm * heightCm) / 10000) * quantity,
      },
      {
        materialId: 'felpa-hermetica',
        formulaDescription: 'Felpa selladora: 3 × (Ancho + Alto)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((3 * (widthCm + heightCm)) / 100) * quantity,
      },
      {
        materialId: 'ruedas-nylon-doble',
        formulaDescription: 'Rodamientos: 6 por unidad (2 por hoja)',
        calculate: ({ quantity }) => 6 * quantity,
      },
      {
        materialId: 'cerradura-ventana-pico-loro',
        formulaDescription: 'Cierre embutido: 2 por unidad',
        calculate: ({ quantity }) => 2 * quantity,
      },
      {
        materialId: 'tornillos-autorroscantes',
        formulaDescription: 'Tornillería: 24 por ventana',
        calculate: ({ quantity }) => 24 * quantity,
      },
    ],
  },

  'ventana-batiente': {
    productId: 'ventana-batiente',
    items: [
      {
        materialId: 'perfil-puerta-batiente',
        formulaDescription: 'Marco batiente perimetral: 2 × (Ancho + Alto)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((2 * (widthCm + heightCm)) / 100) * quantity,
      },
      {
        materialId: 'perfil-aluminio-hoja-20',
        formulaDescription: 'Hoja batiente: 2 × (Ancho + Alto)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((2 * (widthCm + heightCm)) / 100) * quantity,
      },
      {
        materialId: 'vidrio-claro-6mm',
        formulaDescription: 'Área cristal: Ancho × Alto',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((widthCm * heightCm) / 10000) * quantity,
      },
      {
        materialId: 'bisagras-aluminio-pesadas',
        formulaDescription: 'Bisagras reforzadas: 2 por ventana',
        calculate: ({ quantity }) => 2 * quantity,
      },
      {
        materialId: 'empaque-vinil-u',
        formulaDescription: 'Empaque de estanqueidad: 2 × (Ancho + Alto)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((2 * (widthCm + heightCm)) / 100) * quantity,
      },
      {
        materialId: 'tornillos-autorroscantes',
        formulaDescription: 'Fijaciones: 16 tornillos',
        calculate: ({ quantity }) => 16 * quantity,
      },
    ],
  },

  'ventana-proyectable': {
    productId: 'ventana-proyectable',
    items: [
      {
        materialId: 'perfil-aluminio-marco-20',
        formulaDescription: 'Marco proyectable: 2 × (Ancho + Alto)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((2 * (widthCm + heightCm)) / 100) * quantity,
      },
      {
        materialId: 'perfil-aluminio-hoja-20',
        formulaDescription: 'Hoja proyectable: 2 × (Ancho + Alto)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((2 * (widthCm + heightCm)) / 100) * quantity,
      },
      {
        materialId: 'vidrio-laminado-6mm',
        formulaDescription: 'Vidrio laminado acústico: Ancho × Alto',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((widthCm * heightCm) / 10000) * quantity,
      },
      {
        materialId: 'brazo-proyectable-inox',
        formulaDescription: 'Brazos de fricción inox: 1 par por ventana',
        calculate: ({ quantity }) => 1 * quantity,
      },
      {
        materialId: 'cerradura-ventana-pico-loro',
        formulaDescription: 'Seguro de cierre: 1 por ventana',
        calculate: ({ quantity }) => 1 * quantity,
      },
      {
        materialId: 'tornillos-autorroscantes',
        formulaDescription: 'Tornillería: 14 por ventana',
        calculate: ({ quantity }) => 14 * quantity,
      },
    ],
  },

  // === MAMPARAS & DIVISIONES ===
  'mampara-fija': {
    productId: 'mampara-fija',
    items: [
      {
        materialId: 'perfil-aluminio-marco-20',
        formulaDescription: 'Canal ' + 'U' + ' perimetral: 2 × (Ancho + Alto)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((2 * (widthCm + heightCm)) / 100) * quantity,
      },
      {
        materialId: 'vidrio-claro-8mm',
        formulaDescription: 'Cristal templado 8mm: Ancho × Alto',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((widthCm * heightCm) / 10000) * quantity,
      },
      {
        materialId: 'silicona-estructural',
        formulaDescription: 'Sellador estructural: 2 tubos',
        calculate: ({ quantity }) => 2 * quantity,
      },
      {
        materialId: 'tornillos-autorroscantes',
        formulaDescription: 'Anclajes: 12 tornillos',
        calculate: ({ quantity }) => 12 * quantity,
      },
    ],
  },

  'mampara-corrediza': {
    productId: 'mampara-corrediza',
    items: [
      {
        materialId: 'tubo-soporte-mampara',
        formulaDescription: 'Tubo y Riel Inox superior: Ancho',
        calculate: ({ widthCm, quantity }) => (widthCm / 100) * quantity,
      },
      {
        materialId: 'perfil-aluminio-riel-inf',
        formulaDescription: 'Guía inferior perimetral: Ancho',
        calculate: ({ widthCm, quantity }) => (widthCm / 100) * quantity,
      },
      {
        materialId: 'vidrio-claro-8mm',
        formulaDescription: 'Vidrio templado 8mm: Ancho × Alto',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((widthCm * heightCm) / 10000) * quantity,
      },
      {
        materialId: 'ruedas-mampara-pesada',
        formulaDescription: 'Garruchas inox: 4 unidades',
        calculate: ({ quantity }) => 4 * quantity,
      },
      {
        materialId: 'tirador-puerta-acero',
        formulaDescription: 'Tirador tubular inox: 1 por mampara',
        calculate: ({ quantity }) => 1 * quantity,
      },
      {
        materialId: 'silicona-estructural',
        formulaDescription: 'Sellador perimetral: 1 tubo',
        calculate: ({ quantity }) => 1 * quantity,
      },
    ],
  },

  'division-oficina': {
    productId: 'division-oficina',
    items: [
      {
        materialId: 'perfil-aluminio-marco-20',
        formulaDescription: 'Perfilería perimetral: 2 × (Ancho + Alto)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((2 * (widthCm + heightCm)) / 100) * quantity,
      },
      {
        materialId: 'vidrio-claro-8mm',
        formulaDescription: 'Vidrio templado acústico: Ancho × Alto',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((widthCm * heightCm) / 10000) * quantity,
      },
      {
        materialId: 'empaque-vinil-u',
        formulaDescription: 'Empaques de fijación: 2 × (Ancho + Alto)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((2 * (widthCm + heightCm)) / 100) * quantity,
      },
      {
        materialId: 'escuadras-alineacion',
        formulaDescription: 'Escuadras de anclaje: 8 unidades',
        calculate: ({ quantity }) => 8 * quantity,
      },
      {
        materialId: 'tornillos-autorroscantes',
        formulaDescription: 'Fijaciones a muro/suelo: 16 tornillos',
        calculate: ({ quantity }) => 16 * quantity,
      },
    ],
  },

  'mampara-bano': {
    productId: 'mampara-bano',
    items: [
      {
        materialId: 'tubo-soporte-mampara',
        formulaDescription: 'Riel y perfilería inox: (Ancho + Alto)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((widthCm + heightCm) / 100) * quantity,
      },
      {
        materialId: 'vidrio-esmerilado-8mm',
        formulaDescription: 'Vidrio esmerilado satinado: Ancho × Alto',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((widthCm * heightCm) / 10000) * quantity,
      },
      {
        materialId: 'ruedas-mampara-pesada',
        formulaDescription: 'Rodamientos inox sellados: 4 unidades',
        calculate: ({ quantity }) => 4 * quantity,
      },
      {
        materialId: 'tirador-puerta-acero',
        formulaDescription: 'Tirador botón inox: 1 unidad',
        calculate: ({ quantity }) => 1 * quantity,
      },
      {
        materialId: 'silicona-estructural',
        formulaDescription: 'Sellador fungicida antimoho: 1 tubo',
        calculate: ({ quantity }) => 1 * quantity,
      },
    ],
  },

  // === FACHADAS EN ALUCOBOND (ACM) ===
  'fachada-acm': {
    productId: 'fachada-acm',
    items: [
      {
        materialId: 'perfil-tubular-pergola-3x2',
        formulaDescription: 'Subestructura tubular: (3 × Ancho + 3 × Alto)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((3 * widthCm + 3 * heightCm) / 100) * quantity,
      },
      {
        materialId: 'panel-acm-4mm',
        formulaDescription: 'Panel ACM 4mm (+15% pestañas de pliegue)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((widthCm * heightCm * 1.15) / 10000) * quantity,
      },
      {
        materialId: 'silicona-estructural',
        formulaDescription: 'Sellador de juntas ACM: 4 tubos',
        calculate: ({ quantity }) => 4 * quantity,
      },
      {
        materialId: 'tornillos-autorroscantes',
        formulaDescription: 'Tornillos y remaches estructurales: 40 por panel',
        calculate: ({ quantity }) => 40 * quantity,
      },
    ],
  },

  'fachada-acm-vidrio': {
    productId: 'fachada-acm-vidrio',
    items: [
      {
        materialId: 'perfil-tubular-pergola-3x2',
        formulaDescription: 'Estructura mixta: (3 × Ancho + 3 × Alto)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((3 * widthCm + 3 * heightCm) / 100) * quantity,
      },
      {
        materialId: 'panel-acm-4mm',
        formulaDescription: 'Panel ACM (50% área fachada)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((widthCm * heightCm * 0.55) / 10000) * quantity,
      },
      {
        materialId: 'vidrio-laminado-6mm',
        formulaDescription: 'Vidrio templado muro cortina (50% área)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((widthCm * heightCm * 0.5) / 10000) * quantity,
      },
      {
        materialId: 'silicona-estructural',
        formulaDescription: 'Sellador estructural: 5 tubos',
        calculate: ({ quantity }) => 5 * quantity,
      },
      {
        materialId: 'tornillos-autorroscantes',
        formulaDescription: 'Fijaciones estructurales: 50 unidades',
        calculate: ({ quantity }) => 50 * quantity,
      },
    ],
  },

  'revestimiento-acm': {
    productId: 'revestimiento-acm',
    items: [
      {
        materialId: 'perfil-tubular-pergola-3x2',
        formulaDescription: 'Estructura rastrelada: (2 × Ancho + 3 × Alto)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((2 * widthCm + 3 * heightCm) / 100) * quantity,
      },
      {
        materialId: 'panel-acm-4mm',
        formulaDescription: 'Panel ACM 4mm arquitectónico (+10% merma)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((widthCm * heightCm * 1.1) / 10000) * quantity,
      },
      {
        materialId: 'tornillos-autorroscantes',
        formulaDescription: 'Tornillería oculta: 30 unidades',
        calculate: ({ quantity }) => 30 * quantity,
      },
    ],
  },

  // === VITRINAS COMERCIALES ===
  'vitrina-recta': {
    productId: 'vitrina-recta',
    items: [
      {
        materialId: 'perfil-vitrina-angulo',
        formulaDescription: 'Estructura esquinera vitrina: 4 × (Ancho + Alto)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((4 * (widthCm + heightCm)) / 100) * quantity,
      },
      {
        materialId: 'vidrio-claro-6mm',
        formulaDescription: 'Vidrio templado 6mm (4 caras + repisas)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((widthCm * heightCm * 2.8) / 10000) * quantity,
      },
      {
        materialId: 'escuadras-alineacion',
        formulaDescription: 'Escuadras de armado: 12 unidades',
        calculate: ({ quantity }) => 12 * quantity,
      },
      {
        materialId: 'empaque-vinil-u',
        formulaDescription: 'Empaque perimetral: 4 × (Ancho + Alto)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((4 * (widthCm + heightCm)) / 100) * quantity,
      },
      {
        materialId: 'tornillos-autorroscantes',
        formulaDescription: 'Tornillería ensamble: 24 unidades',
        calculate: ({ quantity }) => 24 * quantity,
      },
    ],
  },

  'vitrina-esquinera': {
    productId: 'vitrina-esquinera',
    items: [
      {
        materialId: 'perfil-vitrina-angulo',
        formulaDescription: 'Perfiles angulares reforzados: 5 × (Ancho + Alto)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((5 * (widthCm + heightCm)) / 100) * quantity,
      },
      {
        materialId: 'vidrio-claro-6mm',
        formulaDescription: 'Vidrio templado 6mm: 3.2 × Área base',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((widthCm * heightCm * 3.2) / 10000) * quantity,
      },
      {
        materialId: 'escuadras-alineacion',
        formulaDescription: 'Escuadras de ensamble: 16 unidades',
        calculate: ({ quantity }) => 16 * quantity,
      },
      {
        materialId: 'tornillos-autorroscantes',
        formulaDescription: 'Tornillería: 30 unidades',
        calculate: ({ quantity }) => 30 * quantity,
      },
    ],
  },

  'vitrina-puertas-corredizas': {
    productId: 'vitrina-puertas-corredizas',
    items: [
      {
        materialId: 'perfil-vitrina-angulo',
        formulaDescription: 'Marco perimetral vitrina: 4 × (Ancho + Alto)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((4 * (widthCm + heightCm)) / 100) * quantity,
      },
      {
        materialId: 'perfil-aluminio-riel-inf',
        formulaDescription: 'Riel corredera puertas: Ancho',
        calculate: ({ widthCm, quantity }) => (widthCm / 100) * quantity,
      },
      {
        materialId: 'vidrio-claro-6mm',
        formulaDescription: 'Vidrios exhibidor y puertas: 3.0 × Área',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((widthCm * heightCm * 3.0) / 10000) * quantity,
      },
      {
        materialId: 'ruedas-nylon-doble',
        formulaDescription: 'Garruchas para puertas vitrina: 4 unidades',
        calculate: ({ quantity }) => 4 * quantity,
      },
      {
        materialId: 'cerradura-ventana-pico-loro',
        formulaDescription: 'Cerradura de sierra para vitrina: 1 unidad',
        calculate: ({ quantity }) => 1 * quantity,
      },
    ],
  },

  'vitrina-exhibidora': {
    productId: 'vitrina-exhibidora',
    items: [
      {
        materialId: 'perfil-vitrina-angulo',
        formulaDescription: 'Estructura anodizada: 4 × (Ancho + Alto)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((4 * (widthCm + heightCm)) / 100) * quantity,
      },
      {
        materialId: 'vidrio-claro-8mm',
        formulaDescription: 'Repisas de vidrio templado 8mm: 2.5 × Área',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((widthCm * heightCm * 2.5) / 10000) * quantity,
      },
      {
        materialId: 'escuadras-alineacion',
        formulaDescription: 'Soportes de repisa: 12 unidades',
        calculate: ({ quantity }) => 12 * quantity,
      },
      {
        materialId: 'tornillos-autorroscantes',
        formulaDescription: 'Tornillería: 20 unidades',
        calculate: ({ quantity }) => 20 * quantity,
      },
    ],
  },

  // === PÉRGOLAS MODERNAS & POLICARBONATO ===
  'pergola-aluminio': {
    productId: 'pergola-aluminio',
    items: [
      {
        materialId: 'perfil-tubular-pergola-4x4',
        formulaDescription: 'Columnas de soporte 4"x4": 4 × Alto',
        calculate: ({ heightCm, quantity }) =>
          ((4 * heightCm) / 100) * quantity,
      },
      {
        materialId: 'perfil-tubular-pergola-3x2',
        formulaDescription: 'Vigas y viguetas 3"x2": 6 × Ancho',
        calculate: ({ widthCm, quantity }) =>
          ((6 * widthCm) / 100) * quantity,
      },
      {
        materialId: 'escuadras-alineacion',
        formulaDescription: 'Escuadras estructurales pesadas: 16 unidades',
        calculate: ({ quantity }) => 16 * quantity,
      },
      {
        materialId: 'tornillos-autorroscantes',
        formulaDescription: 'Pernos y tornillos de anclaje: 48 unidades',
        calculate: ({ quantity }) => 48 * quantity,
      },
    ],
  },

  'pergola-policarbonato': {
    productId: 'pergola-policarbonato',
    items: [
      {
        materialId: 'perfil-tubular-pergola-4x4',
        formulaDescription: 'Columnas 4"x4": 4 × Alto',
        calculate: ({ heightCm, quantity }) =>
          ((4 * heightCm) / 100) * quantity,
      },
      {
        materialId: 'perfil-tubular-pergola-3x2',
        formulaDescription: 'Vigas y correas de soporte: 5 × Ancho',
        calculate: ({ widthCm, quantity }) =>
          ((5 * widthCm) / 100) * quantity,
      },
      {
        materialId: 'policarbonato-alveolar-10mm',
        formulaDescription: 'Cubierta Policarbonato Alveolar 10mm: Ancho × Alto',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((widthCm * heightCm * 1.05) / 10000) * quantity,
      },
      {
        materialId: 'silicona-estructural',
        formulaDescription: 'Sellador neutro UV: 3 tubos',
        calculate: ({ quantity }) => 3 * quantity,
      },
      {
        materialId: 'tornillos-autorroscantes',
        formulaDescription: 'Tornillos autoperforantes con arandela: 40 unidades',
        calculate: ({ quantity }) => 40 * quantity,
      },
    ],
  },

  'cubierta-policarbonato': {
    productId: 'cubierta-policarbonato',
    items: [
      {
        materialId: 'perfil-tubular-pergola-3x2',
        formulaDescription: 'Vigas de apoyo: 4 × Ancho',
        calculate: ({ widthCm, quantity }) =>
          ((4 * widthCm) / 100) * quantity,
      },
      {
        materialId: 'policarbonato-compacto-4mm',
        formulaDescription: 'Plancha Policarbonato Compacto 4mm: Ancho × Alto',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((widthCm * heightCm) / 10000) * quantity,
      },
      {
        materialId: 'empaque-vinil-u',
        formulaDescription: 'Empaques de estanqueidad: 2 × (Ancho + Alto)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((2 * (widthCm + heightCm)) / 100) * quantity,
      },
      {
        materialId: 'tornillos-autorroscantes',
        formulaDescription: 'Fijaciones de cubierta: 32 unidades',
        calculate: ({ quantity }) => 32 * quantity,
      },
    ],
  },

  // === PUERTAS RESIDENCIALES & CORREDIZAS ===
  'puerta-corrediza': {
    productId: 'puerta-corrediza',
    items: [
      {
        materialId: 'perfil-puerta-batiente',
        formulaDescription: 'Marco perimetral pesado: 2 × (Ancho + Alto)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((2 * (widthCm + heightCm)) / 100) * quantity,
      },
      {
        materialId: 'perfil-aluminio-hoja-20',
        formulaDescription: 'Hojas corredizas (2): 2 × Ancho + 4 × Alto',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((2 * widthCm + 4 * heightCm) / 100) * quantity,
      },
      {
        materialId: 'vidrio-claro-6mm',
        formulaDescription: 'Vidrio templado 6mm: Ancho × Alto',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((widthCm * heightCm) / 10000) * quantity,
      },
      {
        materialId: 'ruedas-nylon-doble',
        formulaDescription: 'Carretillas de rodamiento: 4 unidades',
        calculate: ({ quantity }) => 4 * quantity,
      },
      {
        materialId: 'tirador-puerta-acero',
        formulaDescription: 'Tirador tubular inox: 1 unidad',
        calculate: ({ quantity }) => 1 * quantity,
      },
      {
        materialId: 'felpa-hermetica',
        formulaDescription: 'Felpa cortaviento: 2 × (Ancho + Alto)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((2 * (widthCm + heightCm)) / 100) * quantity,
      },
      {
        materialId: 'tornillos-autorroscantes',
        formulaDescription: 'Tornillería inox: 20 unidades',
        calculate: ({ quantity }) => 20 * quantity,
      },
    ],
  },

  'puerta-batiente': {
    productId: 'puerta-batiente',
    items: [
      {
        materialId: 'perfil-puerta-batiente',
        formulaDescription: 'Marco batiente y hojas: 4 × (Ancho + Alto)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((4 * (widthCm + heightCm)) / 100) * quantity,
      },
      {
        materialId: 'vidrio-claro-6mm',
        formulaDescription: 'Vidrio templado de seguridad: Ancho × Alto',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((widthCm * heightCm) / 10000) * quantity,
      },
      {
        materialId: 'bisagras-aluminio-pesadas',
        formulaDescription: 'Bisagras de 3 alas reforzadas: 3 unidades',
        calculate: ({ quantity }) => 3 * quantity,
      },
      {
        materialId: 'tirador-puerta-acero',
        formulaDescription: 'Cerradura con manija inox: 1 juego',
        calculate: ({ quantity }) => 1 * quantity,
      },
      {
        materialId: 'empaque-vinil-u',
        formulaDescription: 'Goma amortiguadora acústica: 2 × (Ancho + Alto)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((2 * (widthCm + heightCm)) / 100) * quantity,
      },
      {
        materialId: 'tornillos-autorroscantes',
        formulaDescription: 'Tornillos de anclaje: 18 unidades',
        calculate: ({ quantity }) => 18 * quantity,
      },
    ],
  },

  'puerta-aluminio': {
    productId: 'puerta-aluminio',
    items: [
      {
        materialId: 'perfil-puerta-batiente',
        formulaDescription: 'Marco y travesaños ciegos: 5 × (Ancho + Alto)',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((5 * (widthCm + heightCm)) / 100) * quantity,
      },
      {
        materialId: 'panel-acm-4mm',
        formulaDescription: 'Doble panel ciego de aluminio/ACM: 2 × Área',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((widthCm * heightCm * 2) / 10000) * quantity,
      },
      {
        materialId: 'bisagras-aluminio-pesadas',
        formulaDescription: 'Bisagras reforzadas: 3 unidades',
        calculate: ({ quantity }) => 3 * quantity,
      },
      {
        materialId: 'tirador-puerta-acero',
        formulaDescription: 'Cerradura de seguridad multipunto: 1 unidad',
        calculate: ({ quantity }) => 1 * quantity,
      },
      {
        materialId: 'tornillos-autorroscantes',
        formulaDescription: 'Tornillería pesada: 24 unidades',
        calculate: ({ quantity }) => 24 * quantity,
      },
    ],
  },

  'puerta-corrediza-vidrio': {
    productId: 'puerta-corrediza-vidrio',
    items: [
      {
        materialId: 'tubo-soporte-mampara',
        formulaDescription: 'Riel superior tipo Spider en Inox: 1.5 × Ancho',
        calculate: ({ widthCm, quantity }) =>
          ((1.5 * widthCm) / 100) * quantity,
      },
      {
        materialId: 'vidrio-claro-8mm',
        formulaDescription: 'Cristal templado 8mm de seguridad: Ancho × Alto',
        calculate: ({ widthCm, heightCm, quantity }) =>
          ((widthCm * heightCm) / 10000) * quantity,
      },
      {
        materialId: 'ruedas-mampara-pesada',
        formulaDescription: 'Garruchas inox visibles spider: 2 unidades',
        calculate: ({ quantity }) => 2 * quantity,
      },
      {
        materialId: 'tirador-puerta-acero',
        formulaDescription: 'Tirador tubular inox de 40cm: 1 unidad',
        calculate: ({ quantity }) => 1 * quantity,
      },
      {
        materialId: 'silicona-estructural',
        formulaDescription: 'Sellador y topes amortiguadores: 1 tubo',
        calculate: ({ quantity }) => 1 * quantity,
      },
    ],
  },
};
