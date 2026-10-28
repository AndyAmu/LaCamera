import fs from "node:fs";
import path from "node:path";

export interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  text: string;
  initials?: string;
  url?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  paragraphs: string[];
}

export interface FaqCategory {
  category: string;
  items: FaqItem[];
}

export const IMAGES = {
  logo: "/images/logo-light.png",
  logoFallback: "https://estudiolacamera.com.ar/gui/img/logo-light.png",
  hero: "/images/hero-abogado-consulta.webp",
  heroFallback: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1000&q=80",
  coffee: "/images/cafe-estudio.webp",
  coffeeFallback: "/images/taza-de-cafe.jpg",
  ogImage: "/images/og-estudio-la-camera.jpg",
};

// Leer dinámicamente datos de reseñas desde el archivo de caché
let dynamicReviews = {
  rating: "5,0",
  ratingValue: 5.0,
  count: 293,
};

try {
  const cachePath = path.resolve(process.cwd(), "public/api/data/reviews-cache.json");
  if (fs.existsSync(cachePath)) {
    const raw = fs.readFileSync(cachePath, "utf-8");
    const parsed = JSON.parse(raw);
    if (parsed.count) {
      dynamicReviews.count = Number(parsed.count);
    }
    if (parsed.rating !== undefined) {
      dynamicReviews.ratingValue = Number(parsed.rating);
      dynamicReviews.rating = Number(parsed.rating).toFixed(1).replace(".", ",");
    }
  }
} catch (_) {}

export const siteData = {
  images: IMAGES,
  name: "Estudio La Cámera",
  specialty: "Accidentes de tránsito",
  domain: "https://estudiolacamera.com.ar",
  address: {
    full: "Martín y Omar 129, Piso 2, Of. 211, B1642DHC San Isidro, Provincia de Buenos Aires",
    short: "Martín y Omar 129, Piso 2, Of. 211, San Isidro",
    streetAddress: "Martín y Omar 129, Piso 2, Of. 211",
    postalCode: "B1642DHC",
    city: "San Isidro",
    state: "Provincia de Buenos Aires",
    country: "AR",
  },
  hours: "Lunes a viernes de 8 a 16 h",
  meetings: "Solo con turno previo",
  googleMapsUrl: "https://maps.app.goo.gl/beQFR5Lyw3yD5Mih9",
  phone: {
    display: "11 5879-4246",
    raw: "+5491158794246",
    href: "tel:+5491158794246",
  },
  whatsapp: {
    international: "+54 9 11 5879-4246",
    message: "Hola, tuve un accidente de tránsito y quiero hacer una consulta.",
    url: "https://wa.me/5491158794246?text=Hola%2C%20tuve%20un%20accidente%20de%20tr%C3%A1nsito%20y%20quiero%20hacer%20una%20consulta.",
  },
  email: "info@estudiolacamera.com.ar",
  reviews: {
    rating: dynamicReviews.rating,
    ratingValue: dynamicReviews.ratingValue,
    count: dynamicReviews.count,
    display: `★ ${dynamicReviews.rating} · ${dynamicReviews.count} reseñas en Google`,
  },
  zones: [
    "CABA",
    "GBA Zona Norte",
    "San Miguel",
    "José C. Paz",
    "San Isidro",
    "Vicente López",
    "San Martín",
    "Moreno",
  ],
  officialDefinition: "Estudio La Cámera es un estudio jurídico de San Isidro especializado exclusivamente en accidentes de tránsito en CABA y GBA Zona Norte.",
  logo: {
    url: IMAGES.logo,
    externalUrl: IMAGES.logoFallback,
    alt: "Estudio La Cámera – Abogados especialistas en accidentes de tránsito",
  },
  meta: {
    title: "Abogados de accidentes de tránsito en CABA y Gran Buenos Aires Zona Norte | Estudio La Cámera",
    description: "Abogados de accidentes de tránsito en San Miguel, José C. Paz, CABA y San Isidro. Consulta sin cargo, honorarios a resultado y cheque a tu nombre.",
    ogTitle: "Estudio La Cámera – Abogados de accidentes de tránsito en CABA y Gran Buenos Aires Zona Norte",
    ogDescription: "¿Tuviste un accidente? Consulta sin cargo, honorarios a resultado y cheque a tu nombre. ★ 5,0 en Google.",
    ogImage: "/images/og-estudio-la-camera.jpg",
  },
  hero: {
    eyebrow: "Abogados especialistas en accidentes de tránsito en CABA y GBA",
    title: "Tuviste un accidente. Nosotros nos ocupamos del reclamo.",
    subtitle: "Te asesoramos sin cargo y te acompañamos desde el primer día hasta que cobrás. Cobramos solo si vos cobrás, y el cheque sale a tu nombre.",
    zoneNotice: "Atendemos en CABA y GBA Zona Norte.",
  },
  trustBar: [
    {
      icon: "star",
      title: `★ ${dynamicReviews.rating} en Google`,
      subtitle: `${dynamicReviews.count} personas nos calificaron`,
    },
    {
      icon: "chat",
      title: "Consulta sin cargo",
      subtitle: "Te decimos si tenés reclamo, sin compromiso",
    },
    {
      icon: "handshake",
      title: "Honorarios a resultado",
      subtitle: "Cobramos solo si vos cobrás",
    },
    {
      icon: "check",
      title: "Cheque a tu nombre",
      subtitle: "La indemnización la cobrás vos, directamente",
    },
  ],
  howWeWork: [
    {
      step: 1,
      icon: "chat",
      title: "Consulta sin cargo",
      timeframe: "En el día",
      text: "Nos contás qué pasó por WhatsApp, por teléfono o en una reunión en el estudio, con turno previo. Analizamos tu caso y te decimos si tenés reclamo y cómo seguir.",
    },
    {
      step: 2,
      icon: "folder",
      title: "Armamos tu caso",
      timeframe: "2 a 4 semanas",
      text: "Reunimos la documentación, evaluamos tus lesiones con nuestro médico legista y los daños del vehículo con nuestros peritos y talleres.",
    },
    {
      step: 3,
      icon: "people",
      title: "Reclamo y negociación",
      timeframe: "3 a 6 meses",
      text: "Presentamos el reclamo a la aseguradora y negociamos por vos. Si hace falta, vamos a la mediación, que es obligatoria en Provincia de Buenos Aires y en CABA.",
    },
    {
      step: 4,
      icon: "money",
      title: "Cobrás",
      timeframe: "Al cierre del acuerdo",
      text: "Cuando se llega a un acuerdo, cobrás con un cheque a tu nombre. Si no hay acuerdo, iniciamos la demanda y seguimos a tu lado.",
    },
  ],
  cases: [
    {
      id: "autos",
      icon: "car",
      title: "Accidentes con autos",
      summary: "Choques entre autos, como conductor o como acompañante.",
      fullText: "Si chocaste con tu auto o ibas de acompañante, podés reclamar los daños del vehículo, tus lesiones, los gastos médicos y los días sin trabajar. Como acompañante, el reclamo puede dirigirse a los dos conductores y sus aseguradoras. Nos ocupamos de todo el trámite con el seguro y te mantenemos al tanto de cada paso.",
    },
    {
      id: "peatones",
      icon: "pedestrian",
      title: "Peatones",
      summary: "Si te atropelló un vehículo mientras caminabas.",
      fullText: "Como peatón, sos la parte más expuesta de un accidente y la ley te da una protección especial. Podés reclamar al conductor y a su aseguradora por tus lesiones, tratamientos, gastos y daño psicológico. Aunque hayas cruzado fuera de la senda peatonal, puede haber reclamo: lo evaluamos en la consulta sin cargo.",
    },
    {
      id: "motos-bicicletas",
      icon: "bike",
      title: "Motos y bicicletas",
      summary: "Accidentes en moto, bicicleta o monopatín.",
      fullText: "En moto o en bici, las lesiones suelen ser más graves y los tratamientos más largos. Por eso es clave documentar bien el daño desde el principio. Nuestro médico legista evalúa tus lesiones y nuestros peritos, los daños del vehículo, para que el reclamo refleje todo lo que perdiste.",
    },
    {
      id: "transporte-publico",
      icon: "bus",
      title: "Transporte público",
      summary: "Colectivos, trenes, subte, taxis y autos de aplicación.",
      fullText: "Si te lastimaste viajando en colectivo, tren, subte, taxi o auto de aplicación, en CABA o en el conurbano, la empresa de transporte tiene la obligación de llevarte sano y salvo a destino. Una frenada brusca, una caída al subir o bajar o un choque pueden dar lugar a un reclamo. Guardá el boleto, el comprobante de la tarjeta SUBE o el registro del viaje.",
    },
    {
      id: "aseguradoras",
      icon: "shield",
      title: "Reclamos a aseguradoras",
      summary: "Cuando el seguro rechaza el siniestro o te ofrece poco.",
      fullText: "Muchas veces la aseguradora rechaza el siniestro, demora la respuesta o hace una primera oferta baja. Antes de aceptar o firmar cualquier recibo, consultanos. Revisamos tu póliza, calculamos lo que te corresponde y negociamos por vos.",
    },
    {
      id: "particulares",
      icon: "user",
      title: "Reclamos a particulares",
      summary: "Cuando el responsable no tiene seguro o no responde.",
      fullText: "Si el otro conductor no tenía seguro, tenía la póliza vencida o directamente no responde, igual podés reclamar. En esos casos el reclamo se dirige al responsable y, si corresponde, al titular del vehículo. Te explicamos las opciones y el camino más conveniente para tu caso.",
    },
  ],
  sampleReviews: [
    {
      id: "g-rev-1",
      name: "Graciela Amarilla",
      rating: 5,
      date: "Hace 4 meses",
      initials: "GA",
      text: "Quiero agradecer al Dr Alejandro Lacamera por su profesionalismo, compromiso y acompañamiento durante todo el proceso judicial. Gracias a su dedicación y excelente trabajo, el juicio ha concluido favorablemente y ahora solo resta esperar la próxima fecha de cobro. Siempre se mostró atento, claro en sus explicaciones y dispuesto a responder cada consulta, brindando tranquilidad y confianza en cada etapa. Recomiendo sus servicios a quienes necesiten un abogado responsable, comprometido y altamente capacitado.",
      url: "https://maps.app.goo.gl/Zj1T18TmRbmXDLwV8",
    },
    {
      id: "g-rev-2",
      name: "Ignacio De La Torre",
      rating: 5,
      date: "2 semanas atrás",
      initials: "IT",
      text: "Mi experiencia con el Estudio La Camera fue excelente. Después de un proceso judicial bastante largo, puedo decir que siempre me sentí acompañado, respaldado y contenido hasta el final, logrando un resultado muy favorable y una resolución excelente. Quiero destacar especialmente a Alejandro La Camera por su profesionalismo y conducción, y a Florencia Centofanti, quien me acompañó durante todo este camino con una atención y una calidad humana excepcionales. Estoy muy agradecido con todo el equipo y los recomiendo plenamente por su compromiso, dedicación y, sobre todo, por estar presentes hasta alcanzar el mejor resultado posible.",
      url: "https://maps.app.goo.gl/Y4pszD4LEEgc9BLp6",
    },
    {
      id: "g-rev-3",
      name: "Gabriel Acevedo",
      rating: 5,
      date: "4 semanas atrás",
      initials: "GA",
      text: "Excelente servicio, se interesan por tu caso, no solo cómo abogados si no como personas, y siempre, te ayudan a tomar la mejor decisión. Les interesa lo que te pasa, siempre están pendientes y te mantienen al tanto de lo que sucede, con informes constantes. 1000% recomendados, en una palabra Los mejores...!!!",
      url: "https://maps.app.goo.gl/JYYhamMcd6PhsxoK8",
    },
    {
      id: "g-rev-4",
      name: "Yeremi Garcia",
      rating: 5,
      date: "Editado Hace un mes",
      initials: "YG",
      text: "Si buscan una profesional comprometido y eficaz Alejandro es el mejor, desde el primer día me acompañó y buscó los mejores profesionales para evaluar mi salud y acompañarme en este proceso, ya estamos esperando la fecha de cobro. Una vez más gracias acompañarnos profesionalmente y aún más por la calidez de persona ya que hoy en día es difícil conseguir todo esto junto.",
      url: "https://maps.app.goo.gl/cgin5gbZ4BvxFvu7A",
    },
    {
      id: "g-rev-5",
      name: "Daniel Olivos",
      rating: 5,
      date: "Editado Hace 3 meses",
      initials: "DO",
      text: "Quiero expresar mi más sincero agradecimiento por el compromiso, la dedicación y la calidad humana que recibí durante todo mi proceso. Desde el primer momento me brindó tranquilidad, confianza y un acompañamiento constante, siempre con profesionalismo, honestidad y empatía. En momentos tan importantes, contar con alguien que realmente se preocupa por sus clientes marca una gran diferencia. Gracias por defender mis intereses con tanta responsabilidad y por estar presente en cada paso. Lo recomiendo con los ojos cerrados a cualquier persona que busque un abogado de excelencia y, sobre todo, una persona de confianza.",
      url: "https://maps.app.goo.gl/dVNxxQ6YDL7Ug46B6",
    },
    {
      id: "g-rev-6",
      name: "Brenda Quattrocchi",
      rating: 5,
      date: "Hace 4 meses",
      initials: "BQ",
      text: "Excelente abogado. Muy profesional, atento y comprometido durante todo el proceso. Gracias a su trabajo logramos ganar el juicio. Siempre estuvo disponible para responder mis consultas con mucha tranquilidad y paciencia Totalmente recomendable.",
      url: "https://maps.app.goo.gl/5dAosuXVSH7Qpp3a9",
    },
    {
      id: "g-rev-7",
      name: "Graciela Amarilla",
      rating: 5,
      date: "Hace 4 meses",
      initials: "GA",
      text: "Quiero agradecer al Dr Alejandro Lacamera por su profesionalismo, compromiso y acompañamiento durante todo el proceso judicial. Gracias a su dedicación y excelente trabajo, el juicio ha concluido favorablemente y ahora solo resta esperar la próxima fecha de cobro. Siempre se mostró atento, claro en sus explicaciones y dispuesto a responder cada consulta, brindando tranquilidad y confianza en cada etapa.",
      url: "https://maps.app.goo.gl/at3Uih6rdXe8mEvj7",
    },
    {
      id: "g-rev-8",
      name: "Jose Luis Caza",
      rating: 5,
      date: "Editado Hace 4 meses",
      initials: "JC",
      text: "Excelente atencion y siguimiento por parte del dr. alejandro la camera y todo su estudio, en mi caso el resultado fue favorable y durante todo el proceso me mantuvieron informado sobre cada paso a seguir. Destaco la claridad para explicar las cosas y el acompañamiento. Muy conforme con el trabajo realizado. Super recomendable.",
      url: "https://maps.app.goo.gl/pCgBjhFybpCJsugw8",
    },
    {
      id: "g-rev-9",
      name: "Rodrigo Sebastian Bonazzola",
      rating: 5,
      date: "Editado Hace un mes",
      initials: "RB",
      text: "Abogado god level, profesional, simpático, le gusta better call saul, gracias a Alejandro y su equipo (y Camila) gane un juicio que no creía ganar (mi primer juicio), mi hermano me lo recomendó y yo se los recomiendo a ustedes, cuando tengan un accidente de tránsito no duden en ir a Estudio La Cámera.",
      url: "https://maps.app.goo.gl/95Wmj5LufsNqg7GGA",
    },
    {
      id: "g-rev-10",
      name: "Genesis Guevara",
      rating: 5,
      date: "Editado Hace 4 meses",
      initials: "GG",
      text: "Excelente trabajo realizado en mi caso. Desde el primer momento me brindaron acompañamiento, claridad y profesionalismo. Gracias a su compromiso y dedicación, pudimos obtener la mejor resolución. Los recomiendo totalmente por su responsabilidad y calidad humana, por resolver mi caso de manera tan eficiente y precisa.",
      url: "https://maps.app.goo.gl/sfDTgeciA1tKDDwM7",
    },
  ],
  whatToDoSteps: [
    {
      step: 1,
      icon: "phoneAlert",
      title: "Ponete a salvo",
      text: "Si hay heridos, llamá al 911 y esperá la asistencia. Tu salud es lo primero.",
    },
    {
      step: 2,
      icon: "camera",
      title: "Sacá fotos",
      text: "Fotografiá los vehículos, las patentes, los daños, la posición en la calle y los semáforos o carteles cercanos.",
    },
    {
      step: 3,
      icon: "idCard",
      title: "Pedí los datos del otro conductor",
      text: "Nombre, DNI, registro, patente, aseguradora y número de póliza.",
    },
    {
      step: 4,
      icon: "users",
      title: "Buscá testigos",
      text: "Anotá el nombre y el teléfono de quienes vieron el accidente.",
    },
    {
      step: 5,
      icon: "bell",
      title: "Denunciá el siniestro",
      text: "Avisá a tu aseguradora dentro de las 72 horas. Si hubo lesionados, hacé también la denuncia policial.",
    },
    {
      step: 6,
      icon: "pencilSlash",
      title: "No firmes nada sin asesorarte",
      text: "No aceptes ofertas ni firmes recibos del seguro antes de consultarnos. La consulta es sin cargo.",
    },
  ],
  faqCategories: [
    {
      category: "Qué hacer después del accidente",
      items: [
        {
          id: "que-tengo-que-hacer-despues-de-un-choque",
          question: "¿Qué tengo que hacer después de un choque?",
          paragraphs: [
            "Después de un choque, primero ponete a salvo y, si hay heridos, llamá al 911. Después sacá fotos de los vehículos, las patentes y el lugar, pedí los datos del otro conductor y de su seguro, anotá a los testigos y denunciá el siniestro a tu aseguradora dentro de los 3 días.",
            "No firmes nada ni aceptes dinero en el lugar. En Estudio La Cámera te guiamos paso a paso desde el primer momento, sin cargo.",
          ],
        },
        {
          id: "en-cuanto-tiempo-tengo-que-denunciar-el-accidente-al-seguro",
          question: "¿En cuánto tiempo tengo que denunciar el accidente al seguro?",
          paragraphs: [
            "Tenés 3 días corridos desde el accidente para hacer la denuncia ante tu aseguradora, según la Ley de Seguros 17.418. Hacela aunque creas que no tuviste la culpa o que los daños son menores: si no denunciás a tiempo, la aseguradora puede poner trabas a la cobertura.",
            "Si estuviste internado o no pudiste hacerla por una causa justificada, el plazo puede extenderse. Guardá el comprobante de la denuncia.",
          ],
        },
        {
          id: "tengo-que-hacer-la-denuncia-policial",
          question: "¿Tengo que hacer la denuncia policial?",
          paragraphs: [
            "La denuncia policial es necesaria cuando en el accidente hubo personas lesionadas o fallecidas y la policía no la inició por su cuenta. Si solo hubo daños materiales, alcanza con la denuncia ante la aseguradora, aunque conviene dejar constancia escrita de todo lo que pasó.",
            "La denuncia se hace en la comisaría de la zona donde ocurrió el accidente. Pedí una copia: es una prueba importante para el reclamo.",
          ],
        },
        {
          id: "tengo-que-ir-al-medico-aunque-no-me-duela-nada",
          question: "¿Tengo que ir al médico aunque no me duela nada?",
          paragraphs: [
            "Sí. Después de un accidente conviene hacer una consulta médica dentro de las 24 horas, aunque te sientas bien. Algunas lesiones, como las cervicales o las internas, aparecen días después, y el registro médico temprano es una prueba clave para reclamar.",
            "Guardá todos los informes, estudios, recetas y comprobantes de gastos. En Estudio La Cámera, nuestro médico legista evalúa tus lesiones para incluirlas en el reclamo.",
          ],
        },
        {
          id: "que-documentacion-necesito-para-reclamar",
          question: "¿Qué documentación necesito para reclamar?",
          paragraphs: [
            "Para reclamar por un accidente de tránsito necesitás tu DNI, el registro de conducir, la cédula del vehículo, la póliza del seguro, la denuncia del siniestro, fotos de los daños y el presupuesto de reparación. Si hubo lesiones, sumá los informes médicos y los datos de la denuncia policial.",
            "Si te falta algo, no te preocupes: en la consulta sin cargo te decimos qué conseguir y te ayudamos a reunirlo.",
          ],
        },
        {
          id: "puedo-arreglar-el-auto-antes-de-cobrar",
          question: "¿Puedo arreglar el auto antes de cobrar?",
          paragraphs: [
            "Conviene esperar a que la aseguradora inspeccione el vehículo antes de repararlo. Si necesitás usarlo y no podés esperar, sacá fotos detalladas de todos los daños, pedí un presupuesto por escrito y guardá las facturas: así el daño queda probado aunque el auto ya esté arreglado.",
            "Tenés derecho a elegir el taller, siempre que los costos sean razonables. Con nuestros talleres propios presupuestamos y reparamos tu vehículo.",
          ],
        },
      ],
    },
    {
      category: "Mi caso",
      items: [
        {
          id: "que-tipos-de-accidentes-atienden",
          question: "¿Qué tipos de accidentes atienden?",
          paragraphs: [
            "En Estudio La Cámera atendemos exclusivamente accidentes de tránsito: choques entre autos, peatones atropellados, accidentes en moto, bicicleta o monopatín, lesiones en colectivos, trenes, subte, taxis y autos de aplicación, reclamos a aseguradoras y reclamos a particulares sin seguro. Trabajamos en CABA y GBA Zona Norte: San Miguel, José C. Paz, San Isidro, Vicente López, San Martín y Moreno.",
            "Si tu caso no entra en esta lista, consultanos igual: te decimos sin cargo si tenés reclamo.",
          ],
        },
        {
          id: "puedo-reclamar-si-iba-de-acompanante-o-en-colectivo",
          question: "¿Puedo reclamar si iba de acompañante o en colectivo?",
          paragraphs: [
            "Sí. Si ibas de acompañante, podés reclamar a los conductores involucrados y a sus aseguradoras, sin importar quién tuvo la culpa. Si ibas en colectivo, tren o taxi, la empresa de transporte tiene la obligación de llevarte sano y salvo a destino y responde por tus lesiones.",
            "Guardá el boleto, el registro de la tarjeta SUBE o el comprobante del viaje en la aplicación, y anotá la línea, el interno o la patente.",
          ],
        },
        {
          id: "que-pasa-si-el-otro-dice-que-la-culpa-fue-mia-o-fue-compartida",
          question: "¿Qué pasa si el otro dice que la culpa fue mía o fue compartida?",
          paragraphs: [
            "Igual podés reclamar. Que el otro conductor te atribuya la culpa en su denuncia no define el caso: la responsabilidad se determina con pruebas, como fotos, testigos y pericias. Si la culpa fue compartida, en general podés cobrar la parte del daño que le corresponde al otro conductor.",
            "En Estudio La Cámera trabajamos con ingenieros mecánicos que reconstruyen cómo fue el accidente.",
          ],
        },
        {
          id: "que-hago-si-el-otro-no-tenia-seguro-o-se-dio-a-la-fuga",
          question: "¿Qué hago si el otro no tenía seguro o se dio a la fuga?",
          paragraphs: [
            "Si el otro conductor no tenía seguro, igual podés reclamarle a él y al titular del vehículo, que responden con su patrimonio. Si se dio a la fuga, hacé la denuncia policial, buscá testigos y cámaras de la zona, y anotá cualquier dato del vehículo, como la patente o el color.",
            "Según tu póliza, tu propia aseguradora también puede cubrir parte de los daños. Lo revisamos en la consulta.",
          ],
        },
        {
          id: "que-danos-puedo-reclamar",
          question: "¿Qué daños puedo reclamar?",
          paragraphs: [
            "Después de un accidente de tránsito podés reclamar la reparación integral del daño: los arreglos del vehículo, las lesiones y la incapacidad que te hayan quedado, los gastos médicos y de traslado, los días sin trabajar, el daño psicológico y el daño moral. Cada rubro se calcula según tu caso.",
            "Para que el reclamo refleje todo, nuestros médicos legistas y psicólogos evalúan las lesiones y las secuelas.",
          ],
        },
      ],
    },
    {
      category: "Costos y forma de trabajo",
      items: [
        {
          id: "cuanto-cobra-un-abogado-por-un-accidente-de-transito",
          question: "¿Cuánto cobra un abogado por un accidente de tránsito?",
          paragraphs: [
            "En Estudio La Cámera trabajamos con honorarios a resultado: no pagás nada por adelantado y cobramos un porcentaje solo si vos cobrás la indemnización. Además, la consulta inicial es sin cargo y el cheque de la indemnización sale a tu nombre.",
            "El porcentaje se acuerda por escrito desde el inicio, para que sepas exactamente cuánto vas a cobrar.",
          ],
        },
        {
          id: "la-consulta-tiene-costo",
          question: "¿La consulta tiene costo?",
          paragraphs: [
            "No. En Estudio La Cámera la consulta es sin cargo y sin compromiso. Nos contás qué pasó por WhatsApp, por teléfono o en una reunión en el estudio con turno previo, analizamos tu caso y te decimos si tenés derecho a reclamar y cómo seguir. Recién después decidís si querés avanzar.",
            "Si preferís conocernos en persona, te esperamos en el estudio, en San Isidro: el café corre por nuestra cuenta.",
          ],
        },
        {
          id: "por-que-el-cheque-sale-a-mi-nombre",
          question: "¿Por qué el cheque sale a mi nombre?",
          paragraphs: [
            "En Estudio La Cámera el cheque de la indemnización sale a nombre del cliente, no del estudio. Así cobrás vos directamente, sabés exactamente cuánto te pagaron y tenés la tranquilidad de que el dinero llega a tus manos sin intermediarios.",
            "Los honorarios del estudio se pagan después, según lo acordado por escrito al inicio.",
          ],
        },
        {
          id: "donde-esta-el-estudio-y-en-que-zonas-atienden",
          question: "¿Dónde está el estudio y en qué zonas atienden?",
          paragraphs: [
            "Estudio La Cámera está en Martín y Omar 129, Piso 2, Oficina 211, San Isidro, Provincia de Buenos Aires. Atendemos casos de accidentes de tránsito en CABA y GBA Zona Norte: San Miguel, José C. Paz, San Isidro, Vicente López, San Martín y Moreno. También podés hacer tu consulta por WhatsApp o por teléfono.",
            "Atendemos de lunes a viernes de 8 a 16 h. Las reuniones en el estudio son con turno previo.",
          ],
        },
      ],
    },
    {
      category: "Aseguradoras",
      items: [
        {
          id: "conviene-aceptar-la-primera-oferta-del-seguro",
          question: "¿Conviene aceptar la primera oferta del seguro?",
          paragraphs: [
            "Antes de aceptar cualquier oferta de la aseguradora, conviene que un abogado la revise. Las primeras ofertas suelen cubrir solo una parte del daño, y al firmar un acuerdo o un recibo en general renunciás a reclamar el resto, aunque después aparezcan nuevas lesiones o gastos.",
            "En Estudio La Cámera calculamos lo que te corresponde y negociamos por vos con la aseguradora.",
          ],
        },
        {
          id: "que-hago-si-la-aseguradora-rechaza-el-siniestro-o-no-responde",
          question: "¿Qué hago si la aseguradora rechaza el siniestro o no responde?",
          paragraphs: [
            "Si la aseguradora rechaza el siniestro, demora la respuesta o no contesta, no tenés que resignarte. El reclamo puede seguir por la vía legal: en Provincia de Buenos Aires y en CABA primero se pasa por una mediación obligatoria y, si no hay acuerdo, se inicia una demanda contra el responsable, citando a su aseguradora.",
            "Guardá todas las comunicaciones con la aseguradora.",
          ],
        },
      ],
    },
    {
      category: "Plazos y proceso",
      items: [
        {
          id: "hasta-cuanto-puedo-reclamar-por-un-accidente-de-transito",
          question: "¿Hasta cuándo puedo reclamar por un accidente de tránsito?",
          paragraphs: [
            "En Argentina tenés 3 años desde el día del accidente para reclamar los daños al responsable, según el artículo 2561 del Código Civil y Comercial. Pasado ese plazo, el derecho a reclamar prescribe. Por eso conviene consultar cuanto antes, mientras las pruebas están frescas.",
            "Los reclamos contra tu propia aseguradora pueden tener un plazo distinto.",
          ],
        },
        {
          id: "cuanto-tarda-un-reclamo-por-accidente-de-transito",
          question: "¿Cuánto tarda un reclamo por accidente de tránsito?",
          paragraphs: [
            "Depende de cada caso. Si se llega a un acuerdo con la aseguradora, el reclamo puede resolverse en algunos meses. Si no hay acuerdo y hay que iniciar un juicio, el proceso suele durar alrededor de 3 años, aunque en cualquier etapa se puede cerrar un acuerdo.",
            "En Estudio La Cámera te mantenemos al tanto de cada paso y te avisamos cada novedad de tu caso.",
          ],
        },
        {
          id: "es-obligatoria-la-mediacion-antes-de-un-juicio-por-accidente-de-transito",
          question: "¿Es obligatoria la mediación antes de un juicio por accidente de tránsito?",
          paragraphs: [
            "Sí. En Provincia de Buenos Aires y en la Ciudad de Buenos Aires, antes de iniciar un juicio por un accidente de tránsito hay que pasar por una mediación previa obligatoria. En Provincia la regula la Ley 13.951 y en CABA, la Ley 26.589. Las partes intentan llegar a un acuerdo con un mediador, en un plazo de hasta 60 días.",
            "El plazo puede prorrogarse si las partes lo acuerdan. En la mediación te representamos y defendemos tu reclamo.",
          ],
        },
      ],
    },
  ],
  accidentTypes: [
    "Choque con auto (conductor o acompañante)",
    "Peatón",
    "Moto, bicicleta o monopatín",
    "Transporte público (colectivo, tren, subte, taxi o auto de aplicación)",
    "Reclamo a una aseguradora",
    "Reclamo a un particular sin seguro",
    "Otro",
  ],
};
