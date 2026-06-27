import os
import sys
import json
import csv
import re
import time
import urllib.parse
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, parse_qs

# Force standard output encoding to UTF-8
sys.stdout.reconfigure(encoding='utf-8')

# Reutilizar funciones del scanner
from seo_lead_scanner import check_ssl_and_headers, run_pagespeed_audit, calculate_financial_loss, calculate_speed_to_lead_loss

def search_leads_duckduckgo_lite(query, limit=15):
    """Realiza una búsqueda en DuckDuckGo Lite (POST) y extrae nombres de negocio y sitios web."""
    print(f"[SEARCH] Buscando leads en DuckDuckGo Lite para: '{query}'...")
    
    url = "https://lite.duckduckgo.com/lite/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    
    data = {"q": query}
    leads = []
    
    try:
        response = requests.post(url, headers=headers, data=data, timeout=12)
        if response.status_code != 200:
            print(f"[ERROR] DuckDuckGo Lite retornó status {response.status_code}")
            return []
            
        soup = BeautifulSoup(response.text, "html.parser")
        links = soup.find_all("a", class_=["result-link", "result__url"])
        
        seen_domains = set()
        
        for link in links:
            if len(leads) >= limit:
                break
                
            target_url = link.get("href", "")
            if not target_url or not target_url.startswith("http"):
                continue
                
            # Obtener dominio limpio
            parsed_target = urlparse(target_url)
            domain = parsed_target.netloc.lower()
            if domain.startswith("www."):
                domain = domain[4:]
                
            # Evitar directorios genéricos
            generic_domains = [
                "facebook.com", "instagram.com", "linkedin.com", "youtube.com", "twitter.com",
                "yelp.com", "paginasamarillas.com.pe", "paginasamarillas.com", "tripadvisor.com.pe",
                "tripadvisor.com", "booking.com", "tiktok.com", "pinterest.com", "enlinea.pe",
                "mapquest.com", "google.com", "waze.com", "here.com", "pinterest.cl"
            ]
            
            if domain in generic_domains or any(gd in domain for gd in generic_domains) or not domain:
                continue
                
            if domain in seen_domains:
                continue
                
            seen_domains.add(domain)
            
            # Nombre de negocio es el texto del link
            business_name = link.get_text().strip()
            # Limpiar títulos de páginas típicas como "Contacto - ..."
            business_name = re.sub(r"^(Contacto|Inicio|Home|Nosotros|Web|Página de inicio|Bienvenidos)\s*(-\s*|\|\s*)", "", business_name, flags=re.IGNORECASE)
            
            if len(business_name) > 60:
                business_name = business_name[:57] + "..."
                
            leads.append({
                "name": business_name,
                "url": target_url,
                "domain": domain
            })
            
        print(f"[SEARCH] Se encontraron {len(leads)} leads válidos para auditar.")
        return leads
        
    except Exception as e:
        print(f"[ERROR] Error al buscar leads en DuckDuckGo Lite: {e}")
        return []

def main():
    print("================================================================")
    print("        CODE UR LIFE - MÁQUINA DE GENERACIÓN DE LEADS B2B")
    print("================================================================")
    
    # Parámetros por defecto para la prospección
    query = "clinica dental lima"
    limit = 10
    traffic_est = 1500
    cr_est = 0.035
    aov_est = 2500  # S/. 2500 LTV en salud
    leads_in_est = 80
    delay_est = 3.0  # Demora de 3 horas promedio
    
    # Permitir argumentos rápidos
    if len(sys.argv) > 1:
        query = sys.argv[1]
    if len(sys.argv) > 2:
        try:
            limit = int(sys.argv[2])
        except ValueError:
            pass
            
    print(f"[SETUP] Buscando '{query}', límite: {limit} leads.")
    
    raw_leads = search_leads_duckduckgo_lite(query, limit=limit)
    if not raw_leads:
        print("[FATAL] No se encontraron leads para procesar. Abortando.")
        sys.exit(1)
        
    pipeline = []
    
    for i, lead in enumerate(raw_leads):
        print(f"\n--- [{i+1}/{len(raw_leads)}] Auditando: {lead['name']} ({lead['domain']}) ---")
        
        # 1. Auditoría local de headers y SSL
        has_ssl, title, meta_desc, stats = check_ssl_and_headers(lead['url'])
        
        # 2. Simulación de rendimiento basada en la complejidad real del sitio web
        script_count = stats.get("script_count", 6)
        css_count = stats.get("css_count", 3)
        size_bytes = stats.get("size_bytes", 25000)
        has_viewport = stats.get("has_viewport", True)
        has_h1 = stats.get("has_h1", True)

        lcp = 1.5 + (script_count * 0.12) + (css_count * 0.15) + min(2.5, size_bytes / 50000.0)
        tbt_ms = script_count * 45.0
        
        seo_score = 30
        if title != "No encontrado" and len(title) > 5:
            seo_score += 20
        if meta_desc != "No encontrado" and len(meta_desc) > 10:
            seo_score += 20
        if has_viewport:
            seo_score += 15
        if has_h1:
            seo_score += 15
            
        performance_score = max(12.0, min(98.0, 100.0 - (lcp * 10.0) - (tbt_ms / 25.0)))
        
        # 3. Cálculos Financieros
        loss_latencia, drop_pct = calculate_financial_loss(lcp, traffic_est, cr_est, aov_est)
        loss_speed, cr_actual = calculate_speed_to_lead_loss(leads_in_est, delay_est, 0.25, aov_est)
        
        # 4. Generar Pitch Comercial
        pitch = (
            f"Hola equipo de {lead['name']},\n\n"
            f"Analizamos el rendimiento móvil de {lead['domain']} y detectamos un sangrado operativo crítico:\n"
            f"- Su tiempo de carga móvil estimado es de {lcp:.2f} segundos, reduciendo sus conversiones en un {drop_pct * 100:.1f}%.\n"
            f"- Esto equivale a una pérdida estimada de S/. {loss_latencia:.2f} mensuales sobre el tráfico web que ya captan.\n"
            f"- Con un tiempo de respuesta promedio de 3 horas, el ausentismo o pérdida de leads les cuesta S/. {loss_speed:.2f} adicionales al mes.\n\n"
            f"Podemos optimizar su web en React/WordPress y desplegar un bot conversacional en WhatsApp con un tiempo de respuesta de 10 segundos para detener esta fuga.\n\n"
            f"Si desea que le envíe el diagrama de flujo técnico sin compromiso, responda a este mensaje."
        )
        
        lead_result = {
            "ID": i + 1,
            "Business Name": lead['name'],
            "Domain": lead['domain'],
            "Website URL": lead['url'],
            "SSL": "Válido" if has_ssl else "Falla",
            "Performance Score": round(performance_score),
            "SEO Score": round(seo_score),
            "LCP (s)": round(lcp, 2),
            "Pérdida Carga Lenta (PEN/mes)": round(loss_latencia, 2),
            "Pérdida Speed-to-Lead (PEN/mes)": round(loss_speed, 2),
            "Pérdida Total Estimada (PEN/mes)": round(loss_latencia + loss_speed, 2),
            "Pitch": pitch
        }
        
        pipeline.append(lead_result)
        
        # Pequeño delay de cortesía para evitar rate limit de peticiones
        time.sleep(1)
        
    # Guardar en CSV
    csv_file = "qualified_leads_pipeline.csv"
    keys = pipeline[0].keys()
    
    with open(csv_file, "w", newline="", encoding="utf-8") as f:
        dict_writer = csv.DictWriter(f, fieldnames=keys)
        dict_writer.writeheader()
        dict_writer.writerows(pipeline)
        
    print("\n================================================================")
    print(f"✅ PROCESO COMPLETADO. Pipeline de leads generado con éxito.")
    print(f"👉 Archivo CSV listo: {csv_file}")
    print("================================================================")

if __name__ == "__main__":
    main()
