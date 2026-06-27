import os
import sys
import json
import re
import time
import math
from datetime import datetime
import urllib.parse
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, parse_qs

# Force standard output encoding to UTF-8
sys.stdout.reconfigure(encoding='utf-8')

# Dynamic path import for DriveAgent
sys.path.append(r"C:\Users\USER\Documents\antigravity\hopeful-noether")
from drive_agent import DriveAgent

# CUL CRM Spreadsheet ID
SPREADSHEET_ID = "1XGfE6N7A00L0P3NPaqrXhbcWLOuB4B-Dx-9BQTacTck"

# Reutilizar funciones del scanner local
from seo_lead_scanner import check_ssl_and_headers, calculate_financial_loss, calculate_speed_to_lead_loss

DUCKDUCKGO_LITE_URL = "https://lite.duckduckgo.com/lite/"

def load_leads_from_file(filepath):
    """Carga leads guardados localmente en un archivo JSON."""
    print(f"[SCRAPER] Cargando leads desde: {filepath}...")
    if not os.path.exists(filepath):
        print(f"[ERROR] No se encontró el archivo {filepath}")
        return []
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def main():
    print("================================================================")
    print("      DEPLIEGUE DE PIPELINE DE LEADS DE ALTO MARGEN A DRIVE")
    print("================================================================")
    
    # 1. Cargar leads desde archivo JSON
    json_path = r"D:\Proyectos personales\Mi perfil laboral\scraped_leads.json"
    leads = load_leads_from_file(json_path)
    if not leads:
        print("[ERROR] No se encontraron leads para procesar. Abortando.")
        sys.exit(1)
        
    # 2. Inicializar DriveAgent en perfil personal
    print("[DRIVE] Inicializando DriveAgent con perfil 'personal'...")
    agent = DriveAgent(profile='personal')
    
    # 3. Leer los leads existentes en el CRM (solo fila 2, para mantener el lead preexistente LEA-0001)
    print("[CRM] Leyendo registros existentes en CRM_LEADS (solo fila 2)...")
    existing_rows = agent.read_sheet(SPREADSHEET_ID, "CRM_LEADS!A2:C2") or []
    
    existing_companies = set()
    last_id_num = 1
    
    for row in existing_rows:
        if len(row) >= 3:
            existing_companies.add(row[2].strip().lower())
        if len(row) >= 1:
            id_str = row[0].strip()
            # Extraer número de LEA-XXXX
            match = re.search(r"LEA-(\d+)", id_str)
            if match:
                last_id_num = max(last_id_num, int(match.group(1)))
                
    print(f"[CRM] Último ID base detectado: LEA-{last_id_num:04d}.")
    
    # 4. Auditar localmente y construir las filas del Sheet
    new_rows = []
    
    for lead in leads:
        company_name = lead["name"]
        domain = lead["domain"]
        url = lead["url"]
        
        # Evitar duplicar el lead preexistente
        if company_name.lower() in existing_companies or domain in existing_companies:
            print(f"[SKIP] {company_name} ya existe en el CRM.")
            continue
            
        source_niche = lead.get("source", "").lower()
        
        # Parámetros financieros específicos por nicho para realismo comercial
        if "dental" in source_niche:
            traffic_est = 600
            cr_est = 0.04
            aov_est = 1500
            leads_in_est = 30
            delay_est = 3.5
            niche_name = "Dental"
        elif "estetica" in source_niche or "estética" in source_niche:
            traffic_est = 1000
            cr_est = 0.03
            aov_est = 3500
            leads_in_est = 50
            delay_est = 2.5
            niche_name = "Estética"
        elif "inmobiliaria" in source_niche or "inmobiliario" in source_niche:
            traffic_est = 1800
            cr_est = 0.015
            aov_est = 8000
            leads_in_est = 40
            delay_est = 5.0
            niche_name = "Inmobiliaria"
        else:
            traffic_est = 1500
            cr_est = 0.035
            aov_est = 3000
            leads_in_est = 80
            delay_est = 4.0
            niche_name = "General"
            
        print(f"[AUDIT] Analizando {company_name} ({domain}) - Nicho: {niche_name}...")
        has_ssl, title, meta_desc, stats = check_ssl_and_headers(url)
        
        # Estimaciones heurísticas
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
            
        performance_score = max(10.0, min(99.0, 100.0 - (lcp * 10.0) - (tbt_ms / 25.0)))
        
        # Cálculos Financieros
        loss_latencia, drop_pct = calculate_financial_loss(lcp, traffic_est, cr_est, aov_est)
        loss_speed, cr_actual = calculate_speed_to_lead_loss(leads_in_est, delay_est, 0.25, aov_est)
        total_loss = loss_latencia + loss_speed
        
        # Calificación Dinámica de Presupuesto y Lead (Efecto Ancla)
        # Basado en la pérdida total mensual (total_loss) y la industria
        if total_loss > 75000:
            calificacion = "A"
            presupuesto = min(15000.0, max(8500.0, round(total_loss * 0.10, -2)))
            plan_sugerido = "Plan A.1: Enjambres Multi-Agente & Memoria de IA (LangGraph B2B + CRM)"
        elif total_loss > 25000:
            calificacion = "B"
            presupuesto = min(7200.0, max(4500.0, round(total_loss * 0.12, -2)))
            plan_sugerido = "Plan B.1: Orquestación de Agencias y Calificación de Leads (Silhouette OS Core + WhatsApp)"
        else:
            calificacion = "C"
            presupuesto = min(3800.0, max(2500.0, round(max(1000.0, total_loss) * 0.15, -2)))
            plan_sugerido = "Plan C.2: Presencia Web y Tienda/Academia (WordPress Stack Optimizado)"
            
        last_id_num += 1
        lead_id = f"LEA-{last_id_num:04d}"
        
        # Formato de notas detalladas inspirado en Brandistry
        notas = (
            f"DIAGNÓSTICO OPERATIVO ({niche_name.upper()}):\n"
            f"- Carga Móvil (LCP): {lcp:.2f}s | TBT: {tbt_ms:.0f}ms\n"
            f"- SSL: {'HTTPS Válido' if has_ssl else '🔴 HTTP No seguro'}\n"
            f"- SEO: {seo_score:.0f}/100 | Rendimiento: {performance_score:.0f}/100\n"
            f"- Tráfico mensual est.: {traffic_est} | Ticket/LTV: S/. {aov_est}\n"
            f"- Pérdida Latencia Web: S/. {loss_latencia:.2f} PEN/mes\n"
            f"- Pérdida Speed-to-Lead ({delay_est}h demora): S/. {loss_speed:.2f} PEN/mes\n"
            f"- Fuga Total: S/. {total_loss:.2f} PEN/mes en riesgo.\n"
            f"- Plan Recomendado: {plan_sugerido}."
        )
        
        row_data = [
            lead_id,                                # ID_LEAD
            datetime.now().strftime("%d/%m/%Y"),     # FECHA_INGRESO
            company_name,                           # EMPRESA/LEAD
            domain,                                 # CONTACTO
            url,                                    # WHATSAPP/EMAIL
            f"DDG Scraper ({lead['source']})",      # FUENTE
            "Silhouette Triage",                    # ETAPA
            presupuesto,                            # PRESUPUESTO_PEN
            round(performance_score),               # SCORE_IA
            calificacion,                           # CALIFICACION
            "Alberto",                              # RESPONSABLE
            "Enviar video Loom de auditoría",        # PROXIMA_ACCION
            datetime.now().strftime("%d/%m/%Y"),     # FECHA_PROXIMA_ACCION
            notas                                   # NOTAS/OBJECIONES
        ]
        
        new_rows.append(row_data)
        time.sleep(0.5)
        
    # 5. Escribir/Anexar filas a Google Drive
    if new_rows:
        # Limpiar filas previas para evitar residuos de corridas anteriores
        print("[CRM] Limpiando rango CRM_LEADS!A3:N100 para repoblación...")
        clear_values = [[""] * 14] * 98
        agent.update_sheet(SPREADSHEET_ID, "CRM_LEADS!A3:N100", clear_values)
        
        print(f"\n[CRM] Insertando {len(new_rows)} nuevos leads calificados con presupuestos dinámicos en Google Sheets...")
        agent.update_sheet(SPREADSHEET_ID, "CRM_LEADS!A3", new_rows)
        print("[CRM] [OK] Leads registrados exitosamente en la pestaña 'CRM_LEADS'.")
    else:
        print("[CRM] No hay nuevos leads para insertar.")

    print("\n================================================================")
    print("✅ PROCESO COMPLETADO Y PIPELINE DE DRIVE ACTUALIZADO")
    print("================================================================")

if __name__ == "__main__":
    main()
