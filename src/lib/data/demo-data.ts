/**
 * Datos de DEMOSTRACIÓN.
 *
 * Se usan automáticamente cuando `DATABASE_URL` no está configurada, para que la
 * web se pueda desarrollar, previsualizar y compilar sin base de datos. Las marcas y
 * los ASIN (prefijo `B0DEMO`) son ficticios: sustitúyelos por productos reales
 * a través de `POST /api/v1/products/sync` o con `npm run db:seed`.
 */
import type { Article, Category, Product } from "../types";
import { defaultAuthor, siteConfig } from "../site";

const now = "2026-11-01T09:00:00.000Z";

export const demoCategories: Category[] = [
  {
    id: "cat-sillas",
    name: "Sillas ergonómicas",
    slug: "sillas-ergonomicas",
    description: "Sillas de oficina con soporte lumbar regulable, reposabrazos 4D y mecanismos sincronizados.",
    icon: "armchair",
    parentId: null,
  },
  {
    id: "cat-escritorios",
    name: "Escritorios elevables",
    slug: "escritorios-elevables",
    description: "Mesas de altura regulable eléctricas para alternar entre trabajar sentado y de pie.",
    icon: "table",
    parentId: null,
  },
  {
    id: "cat-monitores",
    name: "Monitores y soportes",
    slug: "monitores-y-soportes",
    description: "Brazos articulados y soportes para colocar la pantalla a la altura de los ojos.",
    icon: "monitor",
    parentId: null,
  },
  {
    id: "cat-perifericos",
    name: "Teclados y ratones ergonómicos",
    slug: "perifericos-ergonomicos",
    description: "Teclados partidos y ratones verticales para reducir la tensión en muñecas y antebrazos.",
    icon: "mouse",
    parentId: null,
  },
  {
    id: "cat-accesorios",
    name: "Accesorios de postura",
    slug: "accesorios-postura",
    description: "Reposapiés, cojines lumbares y otros accesorios que completan un puesto saludable.",
    icon: "footprints",
    parentId: null,
  },
];

type DemoProductInput = Omit<Product, "categorySlug" | "categoryName" | "createdAt" | "updatedAt" | "isAvailable"> &
  Partial<Pick<Product, "isAvailable">>;

const rawProducts: DemoProductInput[] = [
  {
    id: "prod-ergovia-pro",
    asin: "B0DEMO0001",
    title: "Ergovia Pro Mesh — Silla ergonómica con lumbar dinámico",
    slug: "ergovia-pro-mesh",
    brand: "Ergovia",
    verdict:
      "La silla con mejor relación calidad-precio que hemos probado: lumbar adaptativo, reposabrazos 4D y malla transpirable por menos de 300 €.",
    description: `## Nuestra experiencia tras 6 semanas de uso

Hemos usado la **Ergovia Pro Mesh** como silla principal durante seis semanas en jornadas de 8–9 horas. Lo primero que destaca es el **soporte lumbar dinámico**: se desplaza con la espalda cuando te reclinas en lugar de quedarse fijo, algo que normalmente solo encuentras en sillas de más de 500 €.

### Ajustes

- Altura del asiento: 44–54 cm (válida para personas de 1,60 a 1,90 m).
- Profundidad de asiento regulable en 5 cm, clave si tienes los muslos largos.
- Reposabrazos 4D con almohadilla blanda.
- Mecanismo sincronizado con bloqueo en 4 posiciones.

### ¿Para quién es?

Para teletrabajadores que pasan más de 6 horas sentados y quieren una silla seria sin pagar precio de gama alta. Si superas los 120 kg, mira opciones con base reforzada.`,
    features: {
      "Material respaldo": "Malla elástica",
      "Soporte lumbar": "Dinámico, regulable en altura",
      Reposabrazos: "4D",
      "Altura asiento": "44–54 cm",
      "Carga máxima": "136 kg",
      Reposacabezas: "Sí, 3D",
      Garantía: "3 años",
    },
    pros: [
      "Lumbar dinámico que acompaña el movimiento",
      "Profundidad de asiento regulable",
      "Malla muy transpirable en verano",
      "Montaje en menos de 20 minutos",
    ],
    cons: ["El reposacabezas queda bajo para personas de más de 1,90 m", "Ruedas duras en suelos de madera"],
    priceCurrent: 279.99,
    priceOriginal: 349.99,
    currency: "EUR",
    discountPercent: 20,
    amazonUrlEs: null,
    amazonUrlUs: null,
    imageUrl: "/images/demo/silla.svg",
    galleryImages: [],
    categoryId: "cat-sillas",
    rating: 4.6,
    reviewCount: 3184,
    editorialRating: 9.1,
    badge: "Mejor Calidad-Precio",
    isFeatured: true,
  },
  {
    id: "prod-lumbra-executive",
    asin: "B0DEMO0002",
    title: "Lumbra Executive X — Silla de oficina con cojín lumbar y piel sintética",
    slug: "lumbra-executive-x",
    brand: "Lumbra",
    verdict:
      "Cómoda y con aspecto premium, pero menos regulable que la Ergovia. Buena opción si priorizas acolchado y estética.",
    description: `## Análisis

La **Lumbra Executive X** apuesta por el acolchado grueso y la piel sintética. En las primeras horas resulta muy cómoda, aunque en verano acumula más calor que una silla de malla.

El cojín lumbar es independiente y se sujeta con una cinta elástica: funciona, pero se desplaza con el uso y hay que recolocarlo.`,
    features: {
      "Material respaldo": "Piel sintética",
      "Soporte lumbar": "Cojín extraíble",
      Reposabrazos: "Abatibles",
      "Altura asiento": "46–56 cm",
      "Carga máxima": "150 kg",
      Reposacabezas: "Integrado",
      Garantía: "2 años",
    },
    pros: ["Acolchado muy confortable", "Admite hasta 150 kg", "Estética de dirección"],
    cons: ["Calurosa en verano", "Lumbar no regulable en profundidad", "Reposabrazos sin ajuste de altura"],
    priceCurrent: 189.9,
    priceOriginal: 229.9,
    currency: "EUR",
    discountPercent: 17,
    amazonUrlEs: null,
    amazonUrlUs: null,
    imageUrl: "/images/demo/silla.svg",
    galleryImages: [],
    categoryId: "cat-sillas",
    rating: 4.3,
    reviewCount: 8921,
    editorialRating: 7.6,
    badge: "Top Ventas",
    isFeatured: false,
  },
  {
    id: "prod-deskora-flow2",
    asin: "B0DEMO0003",
    title: "Deskora Flow 2 — Escritorio elevable eléctrico doble motor 160×80",
    slug: "deskora-flow-2",
    brand: "Deskora",
    verdict:
      "Estable incluso a máxima altura, silencioso y con memoria de 4 posiciones. El escritorio elevable que recomendamos a la mayoría.",
    description: `## Probado durante 2 meses

El **Deskora Flow 2** usa **dos motores** y una estructura en T invertida que elimina casi por completo el tambaleo a 115 cm, la altura típica para trabajar de pie de una persona de 1,80 m.

### Lo que más nos gustó

- Sube de 62 a 127 cm en unos 20 segundos y a solo 45 dB.
- Sistema anticolisión que detiene la mesa si encuentra un obstáculo.
- Panel con 4 memorias y recordatorio para cambiar de postura.

### A tener en cuenta

El tablero de 160×80 pesa bastante: el montaje es más cómodo entre dos personas.`,
    features: {
      Motores: "2",
      "Rango de altura": "62–127 cm",
      "Carga máxima": "120 kg",
      Tablero: "160 × 80 cm",
      Memorias: "4 posiciones",
      Ruido: "45 dB",
      Anticolisión: "Sí",
      Garantía: "5 años",
    },
    pros: ["Muy estable a cualquier altura", "Silencioso", "Rango de altura amplio", "Garantía de 5 años en motores"],
    cons: ["Montaje pesado para una sola persona", "Pasacables básico"],
    priceCurrent: 449,
    priceOriginal: 529,
    currency: "EUR",
    discountPercent: 15,
    amazonUrlEs: null,
    amazonUrlUs: null,
    imageUrl: "/images/demo/escritorio.svg",
    galleryImages: [],
    categoryId: "cat-escritorios",
    rating: 4.7,
    reviewCount: 2210,
    editorialRating: 9.3,
    badge: "Top Ventas",
    isFeatured: true,
  },
  {
    id: "prod-deskora-lite",
    asin: "B0DEMO0004",
    title: "Deskora Lite — Escritorio elevable eléctrico motor único 120×60",
    slug: "deskora-lite",
    brand: "Deskora",
    verdict: "La forma más económica de empezar a trabajar de pie. Ideal para pisos pequeños y monitores ligeros.",
    description: `## Análisis

El **Deskora Lite** es un escritorio de un solo motor pensado para espacios reducidos. Cumple de sobra con un portátil y un monitor de 27", aunque a partir de 110 cm aparece algo de vibración al teclear con fuerza.`,
    features: {
      Motores: "1",
      "Rango de altura": "72–117 cm",
      "Carga máxima": "70 kg",
      Tablero: "120 × 60 cm",
      Memorias: "3 posiciones",
      Ruido: "50 dB",
      Anticolisión: "No",
      Garantía: "2 años",
    },
    pros: ["Precio muy contenido", "Ocupa poco espacio", "Montaje sencillo"],
    cons: ["Ligera vibración a gran altura", "Altura mínima de 72 cm (alta para personas bajas)"],
    priceCurrent: 199.99,
    priceOriginal: 239.99,
    currency: "EUR",
    discountPercent: 17,
    amazonUrlEs: null,
    amazonUrlUs: null,
    imageUrl: "/images/demo/escritorio.svg",
    galleryImages: [],
    categoryId: "cat-escritorios",
    rating: 4.4,
    reviewCount: 5120,
    editorialRating: 8.0,
    badge: "Mejor Calidad-Precio",
    isFeatured: false,
  },
  {
    id: "prod-armly-dual",
    asin: "B0DEMO0005",
    title: "Armly Dual — Brazo articulado para dos monitores de 17 a 32\"",
    slug: "armly-dual",
    brand: "Armly",
    verdict:
      "Libera media mesa y permite colocar las pantallas a la altura de los ojos. Pistones de gas suaves y gestión de cables integrada.",
    description: `## Análisis

El **Armly Dual** sujeta dos monitores de hasta 9 kg cada uno con pistones de gas regulables. La clave ergonómica es poder subir la pantalla hasta que el borde superior quede a la altura de los ojos, algo que la mayoría de soportes de serie no permite.`,
    features: {
      Pantallas: "2 × 17–32\"",
      "Peso por brazo": "2–9 kg",
      VESA: "75×75 / 100×100",
      Anclaje: "Abrazadera o pasacables",
      Rotación: "360°",
      Garantía: "10 años",
    },
    pros: ["Movimiento fluido", "Gestión de cables oculta", "Garantía de 10 años"],
    cons: ["No apto para monitores ultrapanorámicos pesados"],
    priceCurrent: 89.99,
    priceOriginal: 109.99,
    currency: "EUR",
    discountPercent: 18,
    amazonUrlEs: null,
    amazonUrlUs: null,
    imageUrl: "/images/demo/monitor.svg",
    galleryImages: [],
    categoryId: "cat-monitores",
    rating: 4.6,
    reviewCount: 4402,
    editorialRating: 8.8,
    badge: null,
    isFeatured: true,
  },
  {
    id: "prod-keyvia-split",
    asin: "B0DEMO0006",
    title: "Keyvia Split — Teclado ergonómico partido inalámbrico",
    slug: "keyvia-split",
    brand: "Keyvia",
    verdict:
      "Reduce la desviación cubital de las muñecas. Requiere una o dos semanas de adaptación, pero la diferencia en antebrazos se nota.",
    description: `## Análisis

El **Keyvia Split** separa el teclado en dos mitades con inclinación negativa opcional. Tras dos semanas de adaptación recuperamos la velocidad de escritura habitual y notamos menos tensión en los antebrazos al final del día.`,
    features: {
      Diseño: "Partido con tienda (tenting) ajustable",
      Conexión: "Bluetooth 5.1 + receptor USB",
      Batería: "Hasta 3 meses",
      Distribución: "Español (ISO) con Ñ",
      "Reposamuñecas": "Integrado",
      Garantía: "2 años",
    },
    pros: ["Distribución española con Ñ", "Reposamuñecas acolchado", "Multidispositivo (3 equipos)"],
    cons: ["Curva de aprendizaje", "Teclas de función pequeñas"],
    priceCurrent: 129,
    priceOriginal: 149,
    currency: "EUR",
    discountPercent: 13,
    amazonUrlEs: null,
    amazonUrlUs: null,
    imageUrl: "/images/demo/teclado.svg",
    galleryImages: [],
    categoryId: "cat-perifericos",
    rating: 4.5,
    reviewCount: 1873,
    editorialRating: 8.6,
    badge: null,
    isFeatured: false,
  },
  {
    id: "prod-mousea-vertical",
    asin: "B0DEMO0007",
    title: "Mousea Vertical — Ratón ergonómico vertical recargable",
    slug: "mousea-vertical",
    brand: "Mousea",
    verdict: "Coloca la mano en posición de \"apretón de manos\" y alivia la muñeca por menos de 40 €.",
    description: `## Análisis

Con un ángulo de 57°, el **Mousea Vertical** reduce la pronación del antebrazo. Es una de las inversiones más baratas y efectivas para prevenir molestias de túnel carpiano en quienes usan mucho el ratón.`,
    features: {
      Ángulo: "57°",
      Conexión: "2,4 GHz + Bluetooth",
      DPI: "800–4000",
      Batería: "Recargable USB-C",
      Mano: "Diestra (versión zurda disponible)",
      Garantía: "2 años",
    },
    pros: ["Precio muy bajo", "Alivia la tensión de muñeca", "Clics silenciosos"],
    cons: ["Pequeño para manos grandes", "Rueda algo ruidosa"],
    priceCurrent: 34.99,
    priceOriginal: 44.99,
    currency: "EUR",
    discountPercent: 22,
    amazonUrlEs: null,
    amazonUrlUs: null,
    imageUrl: "/images/demo/raton.svg",
    galleryImages: [],
    categoryId: "cat-perifericos",
    rating: 4.4,
    reviewCount: 12650,
    editorialRating: 8.4,
    badge: "Mejor Calidad-Precio",
    isFeatured: true,
  },
  {
    id: "prod-footly-reposapies",
    asin: "B0DEMO0008",
    title: "Footly Balance — Reposapiés ergonómico basculante",
    slug: "footly-balance",
    brand: "Footly",
    verdict: "Imprescindible si tu mesa es fija y no llegas a apoyar bien los pies. Fomenta el movimiento de tobillos.",
    description: `## Análisis

El **Footly Balance** permite apoyar los pies con un ángulo de 90–110° en las rodillas aunque la silla esté alta. Su base basculante invita a mover los tobillos, lo que mejora la circulación en jornadas largas.`,
    features: {
      Superficie: "45 × 35 cm",
      Inclinación: "0–20° basculante",
      Altura: "3 niveles (10–16 cm)",
      Material: "Polipropileno con textura antideslizante",
      Garantía: "2 años",
    },
    pros: ["Mejora la postura con mesas fijas", "Base basculante", "Superficie antideslizante"],
    cons: ["Algo voluminoso para mochila"],
    priceCurrent: 39.9,
    priceOriginal: null,
    currency: "EUR",
    discountPercent: null,
    amazonUrlEs: null,
    amazonUrlUs: null,
    imageUrl: "/images/demo/reposapies.svg",
    galleryImages: [],
    categoryId: "cat-accesorios",
    rating: 4.5,
    reviewCount: 2987,
    editorialRating: 8.2,
    badge: null,
    isFeatured: false,
  },
];

export const demoProducts: Product[] = rawProducts.map((p) => {
  const category = demoCategories.find((c) => c.id === p.categoryId);
  return {
    ...p,
    isAvailable: p.isAvailable ?? true,
    categorySlug: category?.slug ?? null,
    categoryName: category?.name ?? null,
    createdAt: now,
    updatedAt: now,
  };
});

const fisio = {
  name: "Laura Méndez",
  slug: "laura-mendez",
  role: "Fisioterapeuta colegiada especializada en ergonomía laboral",
  bio: "Más de 10 años tratando lesiones musculoesqueléticas de trabajadores de oficina. Revisa todas las guías de salud de ErgoTopLab.",
  url: `${siteConfig.url}/sobre-nosotros#laura-mendez`,
  credentials: ["Grado en Fisioterapia", "Máster en Ergonomía y Psicosociología Aplicada"],
  sameAs: [],
};

export const demoArticles: Article[] = [
  {
    id: "art-setup-teletrabajo",
    title: "Cómo montar un puesto de teletrabajo ergonómico: guía paso a paso (2026)",
    slug: "puesto-teletrabajo-ergonomico",
    excerpt:
      "Altura de silla, mesa y monitor, distancia a la pantalla y los accesorios que de verdad marcan la diferencia. Con medidas exactas y checklist final.",
    author: fisio,
    featuredImage: null,
    categoryId: null,
    seoTitle: "Puesto de teletrabajo ergonómico: medidas y guía paso a paso",
    seoDescription:
      "Aprende a ajustar silla, mesa y monitor con medidas exactas para teletrabajar sin dolor de espalda ni cuello. Guía revisada por una fisioterapeuta.",
    status: "published",
    publishedAt: "2026-10-12T08:00:00.000Z",
    createdAt: "2026-10-12T08:00:00.000Z",
    updatedAt: now,
    relatedProductIds: ["prod-ergovia-pro", "prod-deskora-flow2", "prod-armly-dual", "prod-mousea-vertical"],
    content: `Pasar 8 horas al día frente al ordenador en una mesa de comedor es la receta perfecta para el dolor cervical y lumbar. La buena noticia: **corregir el 80 % de los problemas solo requiere ajustar cuatro alturas**. En esta guía te explicamos cuáles, con medidas concretas.

## 1. Empieza por la silla, no por la mesa

La silla define la posición de todo lo demás. Ajusta en este orden:

1. **Altura del asiento**: los pies apoyados en el suelo y las rodillas a 90–100°.
2. **Profundidad**: deben quedar 2–3 dedos entre el borde del asiento y la parte trasera de la rodilla.
3. **Soporte lumbar**: a la altura de la cintura, rellenando la curva natural de la espalda.
4. **Reposabrazos**: a la altura del codo con los hombros relajados.

Si tu silla no permite estos ajustes, es el primer elemento que conviene cambiar. Esta es la que recomendamos por calidad-precio:

{{product:B0DEMO0001}}

## 2. La mesa: los codos mandan

Con la silla ya ajustada, la superficie de trabajo debe quedar **a la altura de los codos o 2–3 cm por debajo**. Para una persona de 1,75 m suele estar entre 68 y 72 cm sentado, y entre 105 y 112 cm de pie.

Si tu mesa es fija y demasiado alta, sube la silla y añade un reposapiés. Si quieres alternar posturas, un escritorio elevable es la mejor inversión a largo plazo:

{{product:B0DEMO0003}}

## 3. El monitor: a un brazo de distancia

- **Distancia**: entre 50 y 75 cm (aproximadamente la longitud de tu brazo extendido).
- **Altura**: el borde superior de la pantalla a la altura de los ojos o ligeramente por debajo.
- **Inclinación**: 10–20° hacia atrás.

Con portátil, la pantalla siempre queda demasiado baja: usa un soporte o un monitor externo con brazo articulado.

## 4. Teclado y ratón: muñecas neutras

Las muñecas deben quedar rectas, sin doblarse hacia arriba ni hacia los lados. Un ratón vertical es una de las mejoras más baratas y eficaces:

{{product:B0DEMO0007}}

## 5. Muévete cada 30–45 minutos

Ninguna postura es buena si se mantiene horas. La recomendación de la mayoría de guías de salud laboral es **cambiar de postura cada 30–45 minutos** y levantarte al menos 2–3 minutos cada hora.

## Checklist rápido

| Elemento | Medida objetivo |
| --- | --- |
| Rodillas | 90–100° |
| Codos | 90–110°, a la altura de la mesa |
| Pantalla | Borde superior a la altura de los ojos |
| Distancia a pantalla | 50–75 cm |
| Pausas | Cada 30–45 min |`,
    faqs: [
      {
        question: "¿A qué altura debe estar la mesa para teletrabajar?",
        answer:
          "A la altura de tus codos con los hombros relajados, normalmente entre 68 y 72 cm para una persona de 1,75 m trabajando sentada.",
      },
      {
        question: "¿A qué distancia debe estar el monitor?",
        answer: "Entre 50 y 75 cm de los ojos, más o menos la longitud del brazo extendido.",
      },
      {
        question: "¿Es mejor trabajar de pie o sentado?",
        answer:
          "Lo mejor es alternar. Mantener cualquier postura durante horas genera fatiga; un escritorio elevable facilita cambiar cada 30–45 minutos.",
      },
    ],
  },
  {
    id: "art-dolor-lumbar",
    title: "Dolor lumbar por estar sentado: causas y 9 soluciones prácticas",
    slug: "dolor-lumbar-trabajar-sentado",
    excerpt:
      "Por qué duele la zona baja de la espalda tras horas frente al ordenador y qué cambios en tu puesto y tus hábitos lo alivian, explicado por una fisioterapeuta.",
    author: fisio,
    featuredImage: null,
    categoryId: null,
    seoTitle: "Dolor lumbar al trabajar sentado: causas y soluciones",
    seoDescription:
      "Causas del dolor lumbar en teletrabajadores y 9 soluciones prácticas: ajustes de silla, pausas activas, ejercicios y accesorios recomendados.",
    status: "published",
    publishedAt: "2026-09-28T08:00:00.000Z",
    createdAt: "2026-09-28T08:00:00.000Z",
    updatedAt: now,
    relatedProductIds: ["prod-ergovia-pro", "prod-footly-reposapies"],
    content: `El dolor lumbar es la molestia más frecuente entre quienes trabajan sentados. En la mayoría de los casos no se debe a una lesión, sino a **mantener la misma postura demasiado tiempo** con un soporte inadecuado.

> Esta guía es informativa y no sustituye la valoración de un profesional sanitario. Si el dolor se irradia a la pierna, aparece hormigueo o no mejora en unas semanas, consulta con tu médico.

## Por qué aparece

- **Pérdida de la curva lumbar**: al sentarnos sin apoyo, la pelvis rota hacia atrás y la zona lumbar se "aplana".
- **Musculatura inactiva**: glúteos y abdomen dejan de trabajar y la carga recae sobre ligamentos y discos.
- **Pies sin apoyo**: si los pies cuelgan, el borde del asiento comprime los muslos y la pelvis se desplaza.

## 9 soluciones prácticas

1. Ajusta el soporte lumbar a la altura de la cintura.
2. Siéntate al fondo del asiento.
3. Apoya los pies completamente (usa un reposapiés si no llegas).
4. Coloca la pantalla a la altura de los ojos para no encorvarte.
5. Levántate 2–3 minutos cada hora.
6. Alterna sentado y de pie si puedes.
7. Haz movilidad pélvica (retroversión/anteversión) 10 repeticiones cada pausa.
8. Fortalece el core 3 veces por semana.
9. Revisa la profundidad del asiento.

## Accesorios que ayudan

Una silla con lumbar regulable resuelve la mayoría de los casos:

{{product:B0DEMO0001}}

Y si tu mesa no es regulable, un reposapiés corrige la posición de la pelvis:

{{product:B0DEMO0008}}`,
    faqs: [
      {
        question: "¿Un cojín lumbar sirve de algo?",
        answer:
          "Sí, si tu silla no tiene soporte lumbar regulable. Debe colocarse a la altura de la cintura y rellenar la curva sin empujarte hacia delante.",
      },
      {
        question: "¿Cuánto tiempo puedo estar sentado sin descanso?",
        answer: "Se recomienda levantarse al menos 2–3 minutos cada 30–60 minutos.",
      },
    ],
  },
  {
    id: "art-escritorio-elevable",
    title: "¿Merece la pena un escritorio elevable? Guía de compra 2026",
    slug: "escritorio-elevable-merece-la-pena",
    excerpt:
      "Motor simple o doble, rango de altura, estabilidad y tablero: todo lo que debes mirar antes de comprar un escritorio de pie, con nuestras recomendaciones.",
    author: defaultAuthor,
    featuredImage: null,
    categoryId: "cat-escritorios",
    seoTitle: "¿Merece la pena un escritorio elevable? Guía de compra",
    seoDescription:
      "Qué mirar al comprar un escritorio elevable eléctrico: motores, rango de altura, estabilidad y medidas. Comparamos los mejores modelos.",
    status: "published",
    publishedAt: "2026-10-30T08:00:00.000Z",
    createdAt: "2026-10-30T08:00:00.000Z",
    updatedAt: now,
    relatedProductIds: ["prod-deskora-flow2", "prod-deskora-lite"],
    content: `Un escritorio elevable no hace milagros por sí solo, pero **facilita el hábito más saludable en el teletrabajo: cambiar de postura con frecuencia**. Estas son las claves para elegir bien.

## Motor simple o doble

- **Un motor**: más barato y ligero. Suficiente para un portátil y un monitor.
- **Dos motores**: más estable, más rápido y con mayor carga. Recomendable si usas dos monitores o tableros de más de 140 cm.

## Rango de altura

Comprueba que la altura **mínima** te sirve sentado y la **máxima** de pie. Una regla rápida: tu altura en cm × 0,4 (sentado) y × 0,62 (de pie).

## Estabilidad

Es el factor que más diferencia a los modelos buenos de los mediocres. Las estructuras en T invertida y los dos motores reducen el tambaleo al teclear de pie.

## Nuestras recomendaciones

Para la mayoría:

{{product:B0DEMO0003}}

Si tienes poco espacio o presupuesto:

{{product:B0DEMO0004}}`,
    faqs: [
      {
        question: "¿Cuántas horas hay que estar de pie con un escritorio elevable?",
        answer:
          "No se trata de estar de pie todo el día. Alternar 30–45 minutos sentado con 15–30 minutos de pie es un buen punto de partida.",
      },
      {
        question: "¿Qué carga necesito?",
        answer: "Con un portátil y un monitor, 70 kg es suficiente. Con dos monitores y brazo, busca 100 kg o más.",
      },
    ],
  },
];
