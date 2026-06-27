import requests
import json
import os
import xml.etree.ElementTree as ET
from datetime import datetime
import html

# Configuraciones de fuentes
REMOTIVE_API_URL = "https://remotive.com/api/remote-jobs"
WWR_PROGRAMMING_RSS = "https://weworkremotely.com/categories/remote-programming-jobs.rss"
WWR_DEVOPS_RSS = "https://weworkremotely.com/categories/remote-devops-sysadmin-jobs.rss"

# Palabras clave relevantes
KEYWORDS = ["automation", "n8n", "make", "zapier", "ai", "artificial intelligence", "langchain", "llm", "python", "react"]
OUTPUT_FILE = "TRABAJOS_ENCONTRADOS.md"
OUTPUT_JSON = "jobs_data.json"

# Cabeceras para evitar bloqueos
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def clean_html(raw_html):
    """Limpia etiquetas HTML para la descripción de texto plano."""
    import re
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, '', raw_html)
    return html.unescape(cleantext).strip()

def fetch_remotive():
    print("[Search] Buscando trabajos remotos en Remotive API...")
    try:
        response = requests.get(REMOTIVE_API_URL, headers=HEADERS, timeout=15)
        response.raise_for_status()
        data = response.json()
        jobs = []
        for job in data.get("jobs", []):
            jobs.append({
                "title": job.get("title", ""),
                "company_name": job.get("company_name", ""),
                "url": job.get("url", ""),
                "description": job.get("description", ""),
                "candidate_required_location": job.get("candidate_required_location", "Remote"),
                "job_type": job.get("job_type", "N/A"),
                "source": "Remotive",
                "pub_date": job.get("publication_date", "")
            })
        return jobs
    except Exception as e:
        print(f"[Error] Error al obtener de Remotive: {e}")
        return []

def fetch_wwr_rss(url, category_name):
    print(f"[Search] Buscando trabajos remotos en WeWorkRemotely RSS ({category_name})...")
    try:
        response = requests.get(url, headers=HEADERS, timeout=15)
        response.raise_for_status()
        
        # Parsear XML
        root = ET.fromstring(response.content)
        jobs = []
        for item in root.findall('.//item'):
            title_text = item.find('title').text or ""
            link = item.find('link').text or ""
            description = item.find('description').text or ""
            pub_date = item.find('pubDate').text or ""
            
            # WWR formatea el título como: "Company: Title"
            company = "WeWorkRemotely"
            title = title_text
            if ":" in title_text:
                parts = title_text.split(":", 1)
                company = parts[0].strip()
                title = parts[1].strip()
                
            jobs.append({
                "title": title,
                "company_name": company,
                "url": link,
                "description": description,
                "candidate_required_location": "Remote",
                "job_type": "Full Time / Contract",
                "source": f"WeWorkRemotely ({category_name})",
                "pub_date": pub_date
            })
        return jobs
    except Exception as e:
        print(f"[Error] Error al obtener de WeWorkRemotely ({category_name}): {e}")
        return []

def filter_jobs(jobs):
    print("[Filter] Filtrando vacantes por relevancia (AI, Automation, n8n, etc.)...")
    filtered = []
    seen_urls = set()
    
    for job in jobs:
        url = job.get("url", "")
        if url in seen_urls:
            continue
            
        description_text = clean_html(job.get("description", "")).lower()
        title_text = job.get("title", "").lower()
        text_to_search = title_text + " " + description_text
        
        # Buscar palabras clave
        matched_keywords = [kw for kw in KEYWORDS if kw in text_to_search]
        
        if matched_keywords:
            seen_urls.add(url)
            job['matched_keywords'] = matched_keywords
            # Guardamos la descripción limpia y la cruda
            job['description_clean'] = clean_html(job.get("description", ""))
            filtered.append(job)
            
    # Ordenar por nivel de coincidencia (número de palabras clave)
    filtered.sort(key=lambda x: len(x['matched_keywords']), reverse=True)
    return filtered

def generate_pitch(job):
    title = job.get('title', '')
    company = job.get('company_name', '')
    kws = job.get('matched_keywords', [])
    
    tech_stack = ", ".join(kws[:3])
    
    pitch = f"Hola equipo de {company},\n\n"
    pitch += f"Vi su vacante para '{title}' y me pareció una oportunidad excelente que encaja perfectamente con mi experiencia.\n\n"
    
    if "n8n" in kws or "make" in kws or "zapier" in kws or "automation" in kws:
        pitch += f"Soy AI Automation Engineer especializado en diseñar e implementar flujos de automatización robustos usando {tech_stack}. "
        pitch += "Tengo experiencia conectando CRMs (HubSpot, Pipedrive, ActiveCampaign), APIs de IA y automatizando tareas complejas de back-office para eliminar el trabajo manual y la fricción operativa.\n\n"
    elif "ai" in kws or "llm" in kws or "langchain" in kws:
        pitch += f"Soy especialista en Inteligencia Artificial Aplicada y desarrollo de agentes cognitivos utilizando {tech_stack}. "
        pitch += "He diseñado arquitecturas de agentes autónomos con memoria a largo plazo, sistemas de búsqueda semántica locales (TF-IDF y vectoriales) e integraciones avanzadas de LLMs.\n\n"
    else:
        pitch += f"Soy Full-Stack Developer con fuerte enfoque en automatización e integración de servicios usando {tech_stack}. "
        pitch += "Me especializo en construir código limpio, documentado y optimizado enfocado en maximizar los resultados comerciales.\n\n"
        
    pitch += "Recientemente desarrollé un 'Sistema Operativo para Agencias con IA' (Silhouette OS) que implementa un cerebro cognitivo en 4 capas de memoria (Working RAM, Medium en SQLite, Long con embeddings locales de vocabulario, y Deep en grafos relacionales), automatizando la respuesta y perfilado de prospectos comerciales vía WhatsApp en segundos.\n\n"
    
    pitch += "Me encantaría tener una breve videollamada de 10 minutos para mostrarles cómo puedo aportar valor inmediato a su equipo, reducir sus costos operativos o acelerar su roadmap técnico.\n\n"
    pitch += "Saludos cordiales,\nAlberto Farah"
    
    return pitch

def save_outputs(jobs):
    if not jobs:
        print("[Warning] No se encontraron trabajos relevantes hoy.")
        return

    # 1. Guardar JSON para el Dashboard
    json_data = []
    for i, job in enumerate(jobs):
        # Generar pitch personalizado para cada uno
        job['pitch'] = generate_pitch(job)
        json_data.append(job)
        
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump({
            "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "jobs": json_data
        }, f, indent=4, ensure_ascii=False)
    print(f"[Save] Guardado JSON de datos en: {OUTPUT_JSON}")
    
    # 2. Guardar Markdown de reporte
    content = f"# Reporte de Trabajos Automatizado (Job Hunter Agent)\n"
    content += f"*Generado el: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n\n"
    content += f"Aquí están las mejores **{len(jobs)}** vacantes remotas para tu perfil de **AI Automation Engineer / Builder**.\n\n"
    content += "---\n\n"
    
    for i, job in enumerate(jobs[:15]):  # Limitar a los 15 mejores en el archivo Markdown
        content += f"## {i+1}. {job['title']} en **{job['company_name']}**\n"
        content += f"- **Ubicación:** {job.get('candidate_required_location', 'Remote')}\n"
        content += f"- **Fuente:** {job.get('source', 'N/A')}\n"
        content += f"- **Match Keywords:** {', '.join(job['matched_keywords'])}\n"
        content += f"- **Enlace para aplicar:** [Aplicar aquí]({job['url']})\n\n"
        
        content += "### Mensaje sugerido para aplicar:\n"
        content += "> " + job['pitch'].replace("\n", "\n> ") + "\n\n"
        content += "---\n\n"
        
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"[Save] Guardado reporte Markdown en: {OUTPUT_FILE}")

if __name__ == "__main__":
    all_jobs = []
    
    # Obtener de Remotive API
    remotive_jobs = fetch_remotive()
    all_jobs.extend(remotive_jobs)
    
    # Obtener de WeWorkRemotely RSS (Programming)
    wwr_prog = fetch_wwr_rss(WWR_PROGRAMMING_RSS, "Programming")
    all_jobs.extend(wwr_prog)
    
    # Obtener de WeWorkRemotely RSS (DevOps)
    wwr_devops = fetch_wwr_rss(WWR_DEVOPS_RSS, "DevOps")
    all_jobs.extend(wwr_devops)
    
    print(f"[Info] Total vacantes recolectadas sin filtrar: {len(all_jobs)}")
    
    # Filtrar por relevancia
    best_jobs = filter_jobs(all_jobs)
    print(f"[Info] Total vacantes relevantes filtradas: {len(best_jobs)}")
    
    # Guardar resultados
    save_outputs(best_jobs)
