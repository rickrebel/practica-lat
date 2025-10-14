import requests
import json
import unicodedata

# ---------------------------------------------------------------------------
# DATOS DE ORIGEN
# Aquí es donde colocarías la lista de proyectos que quieres insertar.
# ---------------------------------------------------------------------------
data_to_insert = [
    {
        "id": 1,
        "project_name": "Constituyentes",
        "is_assistance": "Sí",
        "description": "Constituyentes es una red de más de 110 líderes y activistas que articula a grupos históricamente excluidos para unir luchas aisladas, construir poder colectivo e impulsar cambios estructurales en México. Facilitamos espacios de diálogo, acción colectiva y acompañamiento técnico para cambiar de raíz las estructuras y las reglas del juego que producen desigualdad, injusticia y la crisis democrática.",
        "se_trata_de": "Construir en colectivo para lograr más. Articulamos activistas en más de 100 municipios, les ofrecemos acompañamiento técnico para aumentar su incidencia, y construimos espacios de solidaridad, cuidados y encuentro para fortalecer las resistencias y agendas comunes de movimientos sociales que han sido históricamente excluidos de la conversación pública. Nos enfocamos en la articulación, formación, organización, movilización e incidencia.",
        "nos_importa_por": "Nos importa porque América Latina vive cuatro crisis simultáneas e interconectadas que se están agravando: las crisis de la democracia, la desigualdad, la violencia y la degradación ambiental. Y porque percibimos que la única forma de superar estas múltiples crisis es mediante articular las diversas resistencias que han surgido desde los territorios más afectados por la desigualdad y construir un movimiento capaz de impulsar cambios estructurales.\\nEsta articulación no solo derivará en mejores propuestas de política pública construidas desde las voces de quienes han sido más afectados por la desigualdad, sino que mediante una ciudadanía activa que participa en su diseño e implementación, se podrá empezar a reducir la brecha de desconfianza y descontento con la democracia que limita su eficacia.",
        "queremos_lograr": "Nuestro objetivo es construir una ciudadanía participativa que se organice para modificar el contrato social en México a uno que reduzca las desigualdades y la injusticia, así como nos permita combatir la crisis climática que afrontamos. Buscamos construir nuevos consensos sociales para un país más justo, equitativo y sostenible, donde las decisiones se tomen desde la diversidad y la experiencia de los territorios. El resultado es un colectivo cohesionado y fortalecido que disputa la construcción de nuevas reglas, e incorpora a grupos históricamente excluidos en la toma de decisiones, fortaleciendo la democracia desde sus bases.",
        "trabajamos_con": "Open Society Foundations y un Consejo Asesor de 17 personas diversas y plurales.",
        "social_net_name_1": "facebook",
        "social_net_url_1": "https://www.facebook.com/constituyentesmexico",
        "social_net_name_2": "instagram",
        "social_net_url_2": "https://www.instagram.com/_constituyentes/",
        "social_net_name_3": "",
        "social_net_url_3": "",
        "website": "https://constituyentes.mx"
    },
    {
        "id": 2,
        "project_name": "MOVIMIENTOS SOCIALES Y CAMBIO SOCIAL EN AMÉRICA LATINA",
        "is_assistance": "No",
        "description": "Investigación sobre el impacto del financiamiento a movimientos sociales en Brasil, Colombia, Guatemala y México. El estudio, en alianza con Pulsante, analiza 150 movimientos para identificar cómo las donaciones, el acompañamiento y la arquitectura de apoyo filantrópico influyen en su capacidad de éxito y en el logro de sus metas de cambio estructural.",
        "se_trata_de": "Se trata de una radiografía de 150 movimientos sociales en Brasil, Colombia, Guatemala y México, realizada en alianza con Pulsante. A través de mapeo y entrevistas semiestructuradas a profundidad. El proyecto respondió las siguientes preguntas guía:\\n• Estrategias de Poder: ¿Qué tácticas y herramientas utilizan para construir poder?\\n• Innovación: ¿Cómo están innovando en sus narrativas y en sus modelos de acción colectiva?\\n• Identidad: ¿Quiénes son y qué demandan estos movimientos?",
        "nos_importa_por": "Los movimientos sociales son los principales motores de la democratización y el cambio sistémico en América Latina, desafiando las estructuras que generan desigualdad, exclusión y violencia. Sin embargo, enfrentan un estrechamiento del espacio cívico y la dificultad de traducir el descontento en cambio real.\\nPara acelerar la transición hacia democracias más justas, es indispensable que el sector filantrópico y los aliados entiendan y evalúen de forma estratégica cómo su arquitectura de financiamiento afecta la capacidad de estos actores para alcanzar el reconocimiento pleno de sus derechos y lograr sus propias metas.",
        "queremos_lograr": "",
        "trabajamos_con": "Pulsante, Avina, Luminate",
        "social_net_name_1": "",
        "social_net_url_1": "",
        "social_net_name_2": "",
        "social_net_url_2": "",
        "social_net_name_3": "",
        "social_net_url_3": "",
        "website": "https://drive.google.com/file/d/1-b5KUCPVs84xgQLDAX4t-F-HORIDsnJK/view?usp=sharing"
    },
    {
        "id": 3,
        "project_name": "Análisis: personas trabajadoras de limpia en la Ciudad de México",
        "is_assistance": "No",
        "description": "Investigación cuantitativa y cualitativa para exponer las condiciones de las personas trabajadoras de limpia en la Ciudad de México. A través de solicitudes de acceso a la información (FOIA) y su procesamiento, generamos evidencia estadística clave para la incidencia de WIEGO y organizaciones aliadas, buscando el reconocimiento de derechos laborales para este sector informal esencial.",
        "se_trata_de": "El análisis revela patrones comunes en sus necesidades, buenas prácticas para superar retos, una taxonomía de acciones financiables por la filantropía internacional y una gramática de acción de quienes están impulsando la democratización y el cambio sistémico en la región.",
        "nos_importa_por": "La limpieza cotidiana de la capital del país se sostiene sobre las personas voluntarias de limpia que, a pesar de su trabajo esencial, no son reconocidas como trabajadores formales. Esta exclusión les niega derechos laborales básicos (seguridad social, prestaciones, salario fijo), perpetuando la desigualdad y la precariedad en el empleo informal. La evidencia es el primer paso indispensable para demandar y lograr su reconocimiento legal y social.",
        "queremos_lograr": "",
        "trabajamos_con": "WIEGO, Lxs Rifadxs de la Basura.",
        "social_net_name_1": "",
        "social_net_url_1": "",
        "social_net_name_2": "",
        "social_net_url_2": "",
        "social_net_name_3": "",
        "social_net_url_3": "",
        "website": "Poner link al documento"
    }
]

# ---------------------------------------------------------------------------
# CONFIGURACIÓN DE LA API DE STORYBLOK
# Reemplaza con tus propios valores.
# ---------------------------------------------------------------------------
STORYBLOK_API_TOKEN = "bXoa9t0WX8IVRUXfStfViQtt-67086-ZofxPw-qXpsiXktXCwV9"
STORYBLOK_SPACE_ID = "286734931476944"
PARENT_FOLDER_ID = 86280985133650  # ID de la carpeta 'project'


# ---------------------------------------------------------------------------
# FUNCIONES AUXILIARES
# ---------------------------------------------------------------------------
def crear_slug(texto):
    """Convierte una cadena en un slug compatible con URL."""
    texto = unicodedata.normalize('NFKD', texto).encode('ascii', 'ignore').decode('utf-8')
    texto = texto.lower().strip().replace(' ', '-')
    return "".join(c for c in texto if c.isalnum() or c == '-')


def crear_componente_parrafo(titulo, texto, color_titulo):
    """Crea la estructura de un componente de párrafo de texto enriquecido."""
    if not texto:
        return None

    parrafos = texto.split('\\n')
    content = []
    for p in parrafos:
        if p.strip():
            content.append({
                "type": "paragraph",
                "attrs": { "textAlign": None },
                "content": [{ "text": p.strip(), "type": "text" }]
            })

    return {
        "text": {
            "type": "doc",
            "content": content
        },
        "title": titulo,
        "component": "Paragraph",
        "color_title": color_titulo
    }


# ---------------------------------------------------------------------------
# SCRIPT PRINCIPAL
# ---------------------------------------------------------------------------
headers = {
    "Authorization": STORYBLOK_API_TOKEN,
    "Content-Type": "application/json"
}

url = f"https://mapi.storyblok.com/v1/spaces/{STORYBLOK_SPACE_ID}/stories/"

for item in data_to_insert:
    project_name = item.get("project_name", "")
    slug = crear_slug(project_name)

    # --- Construir la sección de contenido ---
    content_paragraphs = []

    parrafos_info = [
        ("Se trata de", item.get("se_trata_de"), "secondary"),
        ("Nos importa por", item.get("nos_importa_por"), "primary"),
        ("Queremos lograr", item.get("queremos_lograr"), "accent"),
        ("Trabajamos con", item.get("trabajamos_con"), "")
    ]

    for titulo, texto, color in parrafos_info:
        componente = crear_componente_parrafo(titulo, texto, color)
        if componente:
            content_paragraphs.append(componente)

    # --- Construir la sección de redes sociales ---
    social_networks = []
    for i in range(1, 4):
        name_key = f"social_net_name_{i}"
        url_key = f"social_net_url_{i}"
        if item.get(name_key) and item.get(url_key):
            social_networks.append({
                "url": item.get(url_key),
                "logo": { },
                "name": "",
                "type": "",
                "component": "SocialNetwork",
                "social_network": item.get(name_key)
            })

    # --- Construir el payload final para la API ---
    payload = {
        "story": {
            "name": project_name,
            "slug": slug,
            "parent_id": PARENT_FOLDER_ID,
            "content": {
                "name": project_name,
                "agend": "",
                "images": [],
                "content": content_paragraphs,
                "website": item.get("website", ""),
                "component": "Project",
                "description": {
                    "type": "doc",
                    "content": [{
                        "type": "paragraph",
                        "attrs": { "textAlign": None },
                        "content": [{ "text": item.get("description", ""), "type": "text" }]
                    }]
                },
                "practica_id": f'{item.get("id"):03d}',
                "project_type": "own" if item.get("is_assistance") == "Sí" else "external",
                "social_networks": social_networks
            }
        },
        "publish": 1  # Publicar inmediatamente después de crear
    }

    # --- Enviar la solicitud a la API ---
    response = requests.post(url, headers=headers, data=json.dumps(payload))

    if response.status_code == 201:
        print(f"✅ Historia '{project_name}' creada exitosamente.")
    else:
        print(f"❌ Error al crear la historia '{project_name}':")
        print(f"   - Código de estado: {response.status_code}")
        print(f"   - Respuesta: {response.text}")