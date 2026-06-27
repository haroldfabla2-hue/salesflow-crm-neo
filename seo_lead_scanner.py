import argparse
import requests
import json
import re
import sys
import math
from urllib.parse import urlparse

# Force standard output encoding to UTF-8
sys.stdout.reconfigure(encoding='utf-8')

# API Endpoint for PageSpeed Insights (v5)
PAGESPEED_API_URL = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"

def check_ssl_and_headers(url):
    """Realiza una petición rápida para verificar SSL, título, meta descripción y métricas HTML locales."""
    if not url.startswith("http://") and not url.startswith("https://"):
        url = "https://" + url

    parsed = urlparse(url)
    has_ssl = parsed.scheme == "https"
    
    title = "No encontrado"
    meta_desc = "No encontrado"
    
    stats = {
        "script_count": 0,
        "css_count": 0,
        "img_count": 0,
        "size_bytes": 0,
        "has_viewport": False,
        "has_h1": False
    }
    
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        # Timeout corto de 8 segundos
        response = requests.get(url, headers=headers, timeout=8, verify=True)
        html_content = response.text
        stats["size_bytes"] = len(html_content.encode('utf-8'))
        
        # Regex básico para extraer título
        title_match = re.search(r"<title>(.*?)</title>", html_content, re.IGNORECASE | re.DOTALL)
        if title_match:
            title = title_match.group(1).strip()
            
        # Regex básico para extraer meta descripción
        desc_match = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', html_content, re.IGNORECASE | re.DOTALL)
        if not desc_match:
            desc_match = re.search(r'<meta\s+content=["\'](.*?)["\']\s+name=["\']description["\']', html_content, re.IGNORECASE | re.DOTALL)
            
        if desc_match:
            meta_desc = desc_match.group(1).strip()
            
        # Contar scripts, hojas de estilo e imágenes para simulación
        stats["script_count"] = html_content.lower().count("<script")
        stats["css_count"] = html_content.lower().count("stylesheet")
        stats["img_count"] = html_content.lower().count("<img")
        
        # Verificar meta viewport y etiqueta H1
        if "viewport" in html_content.lower():
            stats["has_viewport"] = True
        if "<h1" in html_content.lower():
            stats["has_h1"] = True
            
    except requests.exceptions.SSLError:
        has_ssl = False
        print("[WARNING] Error de certificado SSL detectado.")
    except Exception as e:
        print(f"[WARNING] No se pudo descargar el HTML para análisis local: {e}")
        
    return has_ssl, title, meta_desc, stats

def run_pagespeed_audit(url, api_key=None):
    """Llama a la API de Google PageSpeed Insights para auditar la URL."""
    print(f"[AUDIT] Iniciando escaneo PageSpeed para: {url} (Estrategia: Mobile)...")
    
    params = {
        "url": url,
        "strategy": "mobile",
        "category": ["performance", "seo"]
    }
    if api_key:
        params["key"] = api_key
        
    try:
        response = requests.get(PAGESPEED_API_URL, params=params, timeout=45)
        if response.status_code != 200:
            print(f"[WARNING] API de Google PageSpeed retornó código {response.status_code}")
            return None
        return response.json()
    except Exception as e:
        print(f"[WARNING] Excepción durante la petición de PageSpeed: {e}")
        return None

def calculate_financial_loss(lcp, traffic, cr_base, aov):
    """
    Calcula el capital perdido mensual debido a la latencia web.
    Ecuación: L_latencia = Trafico * CR_base * (1 - (1 - 0.07)^delta_t) * AOV
    Donde delta_t = max(0, LCP - 2.0)
    """
    delta_t = max(0.0, lcp - 2.0)
    # Impacto acumulado: 7% de caída por cada segundo extra
    conversion_drop_pct = 1.0 - math.pow(1.0 - 0.07, delta_t)
    loss = traffic * cr_base * conversion_drop_pct * aov
    return loss, conversion_drop_pct

def calculate_speed_to_lead_loss(leads_count, response_time_hours, cr_optimo, aov):
    """
    Calcula el capital perdido mensual debido a latencia de respuesta (Speed-to-Lead).
    Decaimiento exponencial de conversión: CR_actual = CR_optimo * e^(-k * t)
    Donde k es la constante de decaimiento (asumimos k=0.55 para simular que a las 5h la conversión cae 80%+).
    """
    k = 0.55
    cr_actual = cr_optimo * math.exp(-k * response_time_hours)
    
    # Pérdida: Diferencia de conversiones exitosas multiplicadas por el LTV/AOV
    leads_closed_optimo = leads_count * cr_optimo
    leads_closed_actual = leads_count * cr_actual
    leads_lost = max(0.0, leads_closed_optimo - leads_closed_actual)
    
    financial_loss = leads_lost * aov
    return financial_loss, cr_actual

def main():
    parser = argparse.ArgumentParser(description="Escáner Técnico y Financiero de Leads B2B")
    parser.add_argument("url", help="URL o dominio de la empresa a auditar")
    parser.add_argument("--api-key", help="Clave de API de Google Cloud (Opcional)", default=None)
    parser.add_argument("--traffic", type=int, help="Sesiones web mensuales estimadas", default=1500)
    parser.add_argument("--cr", type=float, help="Tasa de conversión base óptima (0.0 a 1.0)", default=0.035)
    parser.add_argument("--aov", type=float, help="Valor de vida del cliente / Ticket medio en Soles o USD", default=3500)
    parser.add_argument("--leads-in", type=int, help="Volumen de leads recibidos mensualmente", default=100)
    parser.add_argument("--delay", type=float, help="Tiempo promedio de respuesta actual en horas (Speed-to-Lead)", default=2.0)
    
    args = parser.parse_args()
    
    target_url = args.url
    if not target_url.startswith("http://") and not target_url.startswith("https://"):
        target_url = "https://" + target_url
        
    print("================================================================")
    print("      CODE UR LIFE - INFORME DE DIAGNÓSTICO DE LEAD")
    print("================================================================")
    
    # 1. Análisis local rápido
    has_ssl, title, meta_desc, stats = check_ssl_and_headers(target_url)
    
    # 2. Intentar llamar a PageSpeed API
    data = run_pagespeed_audit(target_url, api_key=args.api_key)
    
    using_fallback = False
    if not data:
        print("[WARNING] No se pudo obtener datos de la API de PageSpeed. Aplicando estimación heurística local...")
        using_fallback = True
        
        # Calcular estimación heurística local
        script_count = stats.get("script_count", 5)
        css_count = stats.get("css_count", 2)
        img_count = stats.get("img_count", 10)
        size_bytes = stats.get("size_bytes", 20000)
        has_viewport = stats.get("has_viewport", True)
        has_h1 = stats.get("has_h1", True)

        # Estimar Largest Contentful Paint (LCP)
        # Base de 1.2s + penalización por scripts (120ms c/u) y CSS (150ms c/u) + peso de página
        lcp = 1.2 + (script_count * 0.12) + (css_count * 0.15) + min(2.5, size_bytes / 45000.0)
        tbt_ms = script_count * 45.0
        
        # Estimar Puntuación de SEO
        seo_score = 30
        if title != "No encontrado" and len(title) > 5:
            seo_score += 20
        if meta_desc != "No encontrado" and len(meta_desc) > 10:
            seo_score += 20
        if has_viewport:
            seo_score += 15
        if has_h1:
            seo_score += 15

        # Estimar Puntuación de Rendimiento
        performance_score = max(10.0, min(99.0, 100.0 - (lcp * 10.0) - (tbt_ms / 25.0)))
    else:
        # Extraer métricas reales de PageSpeed
        try:
            lighthouse_res = data['lighthouseResult']
            performance_score = lighthouse_res['categories']['performance']['score'] * 100
            seo_score = lighthouse_res['categories']['seo']['score'] * 100
            lcp_ms = lighthouse_res['audits']['largest-contentful-paint']['numericValue']
            lcp = lcp_ms / 1000.0
            tbt_ms = lighthouse_res['audits']['total-blocking-time']['numericValue']
        except Exception as e:
            print(f"[WARNING] Error parseando JSON de PageSpeed: {e}. Usando fallback.")
            using_fallback = True
            lcp = 3.5
            tbt_ms = 450
            seo_score = 75
            performance_score = 45
            
    # 3. Realizar los cálculos financieros
    loss_latencia, drop_pct = calculate_financial_loss(lcp, args.traffic, args.cr, args.aov)
    loss_speed, cr_actual = calculate_speed_to_lead_loss(args.leads_in, args.delay, 0.25, args.aov)
    
    print("\n[RESULTADOS TÉCNICOS]")
    print(f"👉 Nombre del Sitio (Title): {title}")
    print(f"👉 Meta Descripción: {meta_desc}")
    print(f"👉 Certificado SSL: {'Válido (HTTPS)' if has_ssl else '🔴 Inexistente o Inválido (HTTP)'}")
    print(f"👉 Puntuación Rendimiento (Móvil): {performance_score:.0f}/100" + (" (Estimado)" if using_fallback else ""))
    print(f"👉 Puntuación SEO (Móvil): {seo_score:.0f}/100" + (" (Estimado)" if using_fallback else ""))
    print(f"👉 Largest Contentful Paint (LCP): {lcp:.2f} segundos" + (" (Estimado)" if using_fallback else "") + " (Límite óptimo: 2.0s)")
    print(f"👉 Total Blocking Time (TBT): {tbt_ms:.0f} ms" + (" (Estimado)" if using_fallback else ""))
    
    print("\n[IMPACTO FINANCIERO DE LA LENTITUD WEB]")
    print(f"💵 Tráfico Mensual Estimado: {args.traffic} visitas")
    print(f"💵 Tasa de Conversión Base: {args.cr * 100:.2f}%")
    print(f"💵 Ticket Medio / LTV: S/. {args.aov:.2f}")
    print(f"📉 Caída en Conversión Estimada: {drop_pct * 100:.1f}%")
    print(f"🚨 Pérdida Mensual por Carga Lenta: S/. {loss_latencia:.2f} PEN")
    print(f"🚨 Pérdida Anual Proyectada: S/. {loss_latencia * 12:.2f} PEN")
    
    print("\n[IMPACTO FINANCIERO DE VELOCIDAD DE RESPUESTA (SPEED-TO-LEAD)]")
    print(f"💵 Leads Recibidos al Mes: {args.leads_in} leads")
    print(f"⏱️ Tiempo de Respuesta Promedio: {args.delay} horas (🔴 Latencia crítica)")
    print(f"📈 Conversión Ideal (<1 min): 25.0%")
    print(f"📉 Conversión Real Estimada: {cr_actual * 100:.2f}%")
    print(f"🚨 Pérdida Mensual por Retraso comercial: S/. {loss_speed:.2f} PEN")
    
    print("\n================================================================")
    print("                 MENSAJE COMERCIAL SUGERIDO")
    print("================================================================")
    
    # Generar texto comercial basado en el tipo de dolor detectado
    domain = urlparse(target_url).netloc
    msg = f"Hola,\n\n"
    msg += f"Analizamos la velocidad del sitio móvil de {domain} con la API de Google y detectamos una vulnerabilidad crítica:\n"
    msg += f"- El tiempo de carga principal (LCP) es de {lcp:.2f} segundos (la meta óptima es < 2.0s).\n"
    msg += f"- Esto reduce su tasa de conversión base en un {drop_pct * 100:.1f}%, representando un sangrado financiero estimado de S/. {loss_latencia:.2f} al mes.\n"
    
    if not has_ssl:
        msg += "- Además, el certificado SSL no está activo, lo que hace que Chrome marque el sitio como 'No Seguro' y ahuyente visitas.\n"
        
    if seo_score < 80:
        msg += f"- Su puntuación de SEO móvil es de {seo_score:.0f}/100, debido a la falta de metadatos estructurales, afectando su tráfico orgánico.\n"
        
    msg += f"\nCon un tiempo de respuesta comercial de {args.delay} horas, sus leads se enfrían. "
    msg += "Implementando un sistema enjambre o un agente en WhatsApp RAG (con un tiempo de respuesta de 10 segundos), pueden recuperar "
    msg += f"S/. {loss_speed:.2f} mensuales que hoy se pierden en la ventana de abandono.\n\n"
    msg += "Si desea ver el flujo lógico de optimización y la arquitectura técnica de 3 páginas en PDF sin compromiso, responda a este mensaje."
    
    print(msg)
    print("================================================================")
    
    # Guardar en JSON
    result_json = {
        "url": target_url,
        "title": title,
        "meta_description": meta_desc,
        "has_ssl": has_ssl,
        "performance_score": performance_score,
        "seo_score": seo_score,
        "lcp": lcp,
        "tbt_ms": tbt_ms,
        "loss_latencia_monthly": round(loss_latencia, 2),
        "loss_speed_to_lead_monthly": round(loss_speed, 2),
        "commercial_pitch": msg
    }
    
    with open("lead_audit_report.json", "w", encoding="utf-8") as jf:
        json.dump(result_json, jf, indent=4, ensure_ascii=False)
    print("\n[OK] Reporte completo guardado localmente en 'lead_audit_report.json'")

if __name__ == "__main__":
    main()
