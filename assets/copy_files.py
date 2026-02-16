import os
import requests

# 1. Lista de URLs de las imágenes
urls = [
    "https://www.practica.lat/wp-content/uploads/2025/04/WhatsApp-Image-2024-10-09-at-16.37.08-e1744666255239-300x238.jpeg",
    "https://www.practica.lat/wp-content/uploads/2025/04/lucia-e1744660676409-295x300.jpg",
    "https://www.practica.lat/wp-content/uploads/2025/04/Moi-300x225.jpg",
    "https://www.practica.lat/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-24-at-17.52.34-300x300.jpeg",
    "https://www.practica.lat/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-21-at-18.31.39-1-300x208.jpeg",
    "https://www.practica.lat/wp-content/uploads/2025/02/aurelienguilabert-e1740184180785-261x300.jpg",
    "https://www.practica.lat/wp-content/uploads/2025/02/20250221_170616_00002-300x225.png",
    "https://www.practica.lat/wp-content/uploads/2025/02/rick_coneval2-270x300.jpg",
    "https://www.practica.lat/wp-content/uploads/2025/02/Retratos_08-scaled-e1740160460140-300x275.jpg",
    "https://www.practica.lat/wp-content/uploads/2025/02/dd9299c8-60fb-499a-95c8-8c99b1413527-1-300x290.jpg",
    "https://www.practica.lat/wp-content/uploads/2024/04/Plantilla-Proyectos-P000-2-300x188.png",
    "https://www.practica.lat/wp-content/uploads/2023/07/Plantilla-Proyectos-P000-1-300x188.png",
    "https://www.practica.lat/wp-content/uploads/2024/04/WhatsApp-Image-2024-01-31-at-18.02.39-1-225x300.jpeg",
    "https://www.practica.lat/wp-content/uploads/2024/03/WhatsApp-Image-2023-11-23-at-14.44.13-1-300x296.jpeg",
    "https://www.practica.lat/wp-content/uploads/2023/11/Foto-Luis-F.-Fernandez-300x200.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/11/Captura-de-Pantalla-2023-11-23-a-las-15.22.29-300x277.png",
    "https://www.practica.lat/wp-content/uploads/2023/11/Captura-de-Pantalla-2023-11-23-a-las-15.06.03-300x285.png",
    "https://www.practica.lat/wp-content/uploads/2023/11/Captura-de-Pantalla-2023-11-23-a-las-15.06.30-300x300.png",
    "https://www.practica.lat/wp-content/uploads/2023/11/Captura-de-Pantalla-2023-11-23-a-las-15.07.45-300x291.png",
    "https://www.practica.lat/wp-content/uploads/2023/11/IMG_6259-copia-300x296.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/11/IMG_5030-copia-169x300.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/11/Sin-titulo-2-300x225.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/11/IMG_6259-300x296.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/11/IMG_5030-169x300.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/11/IMG_7079-300x225.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/11/IMG_6259.heic",
    "https://www.practica.lat/wp-content/uploads/2023/11/IMG_7079.heic",
    "https://www.practica.lat/wp-content/uploads/2023/11/IMG_5030.heic",
    "https://www.practica.lat/wp-content/uploads/2023/09/Josefa-Gomez-Morin-300x278.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/09/Constituyentes-300x124.png",
    "https://www.practica.lat/wp-content/uploads/2023/09/DSC00625-copia-1-300x200.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/09/DSC00625-copia-scaled.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/09/DSC00625-1.jpeg",
    "https://www.practica.lat/wp-content/uploads/2023/09/Ana-Paula-Rios-Camarena-e1694547774160-269x300.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/09/DSC00625.jpeg",
    "https://www.practica.lat/wp-content/uploads/2023/09/p007-300x188.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/09/p006-300x188.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/07/WhatsApp-Image-2023-07-22-at-06.00.58-225x300.jpeg",
    "https://www.practica.lat/wp-content/uploads/2023/07/WIEGO_Resource-Document-35_Spanish-pdf-212x300.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/07/Convocatoria-Constituyentes-el-proceso-pdf-232x300.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/07/constituyentes-libro-2023-pdf-232x300.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/07/image-150x150.png",
    "https://www.practica.lat/wp-content/uploads/2023/07/Logo-IETD-300x300.jpeg",
    "https://www.practica.lat/wp-content/uploads/2023/07/P005-Economia-solidaria-y-organizacion-comunitaria-para-recicladores-de-guanajuato-300x188.jpeg",
    "https://www.practica.lat/wp-content/uploads/2023/07/P004-Articulacion-para-la-defensa-de-la-democracia-300x188.jpeg",
    "https://www.practica.lat/wp-content/uploads/2023/07/P003-Lxs-Rifadxs-de-la-Basura-300x188.jpeg",
    "https://www.practica.lat/wp-content/uploads/2023/07/P0002-Evaluacion-de-Movimientos-Sociales-300x188.jpeg",
    "https://www.practica.lat/wp-content/uploads/2023/07/P0001-Constituyentes-300x188.jpeg",
    "https://www.practica.lat/wp-content/uploads/2023/07/Portada-Reporte-Praxtica-x-Pulsante-300x250.jpeg",
    "https://www.practica.lat/wp-content/uploads/2023/07/WhatsApp-Image-2023-07-07-at-15.21.19.jpeg",
    "https://www.practica.lat/wp-content/uploads/2023/07/Reporte-Movimientos-sociales-Practica-x-Pulsante-pdf-212x300.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/03/cruz-300x300.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/03/Renata-Vadillo-300x242.png",
    "https://www.practica.lat/wp-content/uploads/2023/03/Logos-Practica-alianzas-eskuela-300x101.png",
    "https://www.practica.lat/wp-content/uploads/2023/03/Mariana-Pensado-300x300.jpeg",
    "https://www.practica.lat/wp-content/uploads/2023/03/Ximena-Leon-1-a-1-e1678318735487-300x300.jpeg",
    "https://www.practica.lat/wp-content/uploads/2023/03/Ximena-Leon-Patino-e1678317483458-300x300.jpeg",
    "https://www.practica.lat/wp-content/uploads/2023/02/Practica-home-trabajemosjuntas-300x211.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/02/Logos-Practica-Borde-300x101.png",
    "https://www.practica.lat/wp-content/uploads/2023/02/2015_La_toma_de_decisiones_en_el_proceso_legislativo_Version_publicada-pdf-230x300.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/02/Logos-Practica-AlianzaFSFR-300x101.png",
    "https://www.practica.lat/wp-content/uploads/2023/02/Logos-Practica-Red-300x101.png",
    "https://www.practica.lat/wp-content/uploads/2023/02/EseErre-300x101.png",
    "https://www.practica.lat/wp-content/uploads/2023/02/EseErre-300x300.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/01/Alex-Dey-300x300.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/01/01-LuisF-Fernandez-300x300.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/01/01-Guillermo-Schoning-300x300.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/01/001-Andrea-Horcasitas-300x300.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/01/cropped-Practica-proceso04-300x300.png",
    "https://www.practica.lat/wp-content/uploads/2023/02/Practica-inicio-nuestrotrabajo02.png",
    "https://www.practica.lat/wp-content/uploads/2023/02/Practica-inicio-nuestrotrabajo.png",
    "https://www.practica.lat/wp-content/uploads/2023/02/icono-verde.png",
    "https://www.practica.lat/wp-content/uploads/2023/02/Icono-amarillo.png",
    "https://www.practica.lat/wp-content/uploads/2023/02/ComoTrabajamos1.2.png",
    "https://www.practica.lat/wp-content/uploads/2023/02/ComoTrabajamos1.1.png",
    "https://www.practica.lat/wp-content/uploads/2023/01/Practica-Laboratorio-300x170.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/01/Practica-MPCMX-300x170.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/01/Practica-Tallerformacion-300x170.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/01/Practica-Ciudadano-300x170.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/01/Practica-RifadosBasura-300x169.png",
    "https://www.practica.lat/wp-content/uploads/2023/01/Practica-ConsensoSocial-300x169.png",
    "https://www.practica.lat/wp-content/uploads/2023/01/Practica-apoyomovilidad-300x169.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/01/SIMO-Negro-300x70.png",
    "https://www.practica.lat/wp-content/uploads/2023/01/accionar_negro-300x70.png",
    "https://www.practica.lat/wp-content/uploads/2023/01/Democracia-negro-300x70.png",
    "https://www.practica.lat/wp-content/uploads/2023/01/Logo-WIEGO-negro-300x70.png",
    "https://www.practica.lat/wp-content/uploads/2023/01/Pulsante-negroo-300x70.png",
    "https://www.practica.lat/wp-content/uploads/2023/01/Avina-negro-300x70.png",
    "https://www.practica.lat/wp-content/uploads/2023/01/RedInnovacion-300x70.png",
    "https://www.practica.lat/wp-content/uploads/2023/01/simo-300x70.png",
    "https://www.practica.lat/wp-content/uploads/2023/01/DemocraciaenRed-300x70.png",
    "https://www.practica.lat/wp-content/uploads/2023/01/Wiego-300x70.png",
    "https://www.practica.lat/wp-content/uploads/2023/01/4.Avinafund-300x70.png",
    "https://www.practica.lat/wp-content/uploads/2023/01/3.-Pulsante-300x70.png",
    "https://www.practica.lat/wp-content/uploads/2023/01/2.OSF_-300x70.png",
    "https://www.practica.lat/wp-content/uploads/2023/01/Practica-home-incidencia-300x169.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/01/Practica-home-orgcomunitaria-300x169.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/01/Practica-home-diseno-300x169.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/01/Practica-menu.png",
    "https://www.practica.lat/wp-content/uploads/2023/01/practica-heaaderglobal-01-300x117.png",
    "https://www.practica.lat/wp-content/uploads/2023/01/Practica-header.png",
    "https://www.practica.lat/wp-content/uploads/2023/01/Practica-proceso06.png",
    "https://www.practica.lat/wp-content/uploads/2023/01/Practica-proceso05.png",
    "https://www.practica.lat/wp-content/uploads/2023/01/Practica-proceso04.png",
    "https://www.practica.lat/wp-content/uploads/2023/01/Practica-proceso03.png",
    "https://www.practica.lat/wp-content/uploads/2023/01/Practica-proceso02-1.png",
    "https://www.practica.lat/wp-content/uploads/2023/01/Practica-proceso01.png",
    "https://www.practica.lat/wp-content/uploads/2023/01/Practica_back-300x129.jpg",
    "https://www.practica.lat/wp-content/uploads/2023/01/Quienesomos-practica-128x300.png",
    "https://www.practica.lat/wp-content/uploads/2022/12/Logo-Blanco-300x91.png",
    "https://www.practica.lat/wp-content/uploads/2022/12/Practica-home02-121x300.png",
    "https://www.practica.lat/wp-content/uploads/2022/12/Practica-home01-121x300.png",
    "https://www.practica.lat/wp-content/uploads/2022/12/Logo_negro-300x91.png",
]

# 2. Nombre de la carpeta donde se guardarán
folder_name = "D:\\g_drive_H\\ayudas respaldos\\practicalat"

# Crear la carpeta si no existe
if not os.path.exists(folder_name):
    os.makedirs(folder_name)
    print(f"Carpeta '{folder_name}' creada.")

# 3. Proceso de descarga
for url in urls:
    try:
        # Extraer el nombre del archivo de la URL
        file_name = url.split("/")[-1]
        path = os.path.join(folder_name, file_name)

        # Realizar la petición de descarga
        response = requests.get(url, stream=True)

        # Verificar que la descarga sea exitosa (status 200)
        if response.status_code == 200:
            with open(path, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            print(f"✅ Descargado: {file_name}")
        else:
            print(f"❌ Error al descargar {file_name}: Status {response.status_code}")

    except Exception as e:
        print(f"⚠️ Error procesando la URL {url}: {e}")

print("\nProceso finalizado.")