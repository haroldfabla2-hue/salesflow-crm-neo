# Silhouette Agency OS 🚀
> **Autonomous, Self-Healing Operations & Lead Triage Infrastructure for Digital Agencies.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker Support](https://img.shields.io/badge/Docker-Supported-blue.svg)](https://www.docker.com/)
[![Orchestration](https://img.shields.io/badge/Orchestration-n8n%20%7C%20LangGraph-orange.svg)](https://n8n.io/)

**Silhouette Agency OS** is an enterprise-grade agentic operating system designed to eradicate manual operational overhead in digital agencies. By combining a high-availability webhook pipeline, stateful LLM profiling, and self-healing workflow logic, it intercepts incoming leads in real-time, grades them semantically, alerts sales reps via WhatsApp, and synchronizes data with CRMs.

---

## 📺 Live Architectural Demo

Learn how the architecture handles high-volume operational workflows and handles API failures in under 3 minutes:
👉 **[Watch the Loom Architectural Video](https://albertofarah.com/silhouette-demo)**

---

## 🏗 System Architecture

The following diagram illustrates how data flows dynamically from inbound ad payloads down to data stores and alert channels:

```mermaid
flowchart TD
    Lead[Inbound Facebook Ads Payload] -->|HTTPS Webhook| Proxy[Nginx Reverse Proxy / SSL]
    Proxy -->|API Routing| Gateway[Node.js API Gateway]
    
    subgraph Agentic Orchestration Plane (n8n & LangGraph)
        Gateway -->|Trigger Event| Workflow[n8n Workflow Core]
        Workflow -->|1. Profiling Payload| LLM[OpenAI API / Claude API]
        LLM -->|Probabilistic JSON| Parser[Custom JS Parser Node]
        Parser -->|2. Validated Schema| DB_Check{Lookup Database}
        DB_Check -->|New Lead| Triage[LangGraph Lead Evaluator]
        Triage -->|3. Calculate Cosine Similarity| Vector[SQLite Vector Search]
    end

    subgraph Data & Action Plane
        Vector -->|Record Sync| DB[(PostgreSQL 16 RLS)]
        Vector -->|Enqueues Job| Redis[(Redis Queue)]
        Redis -->|4. Push Notification| WA[WhatsApp Business API]
        WA -->|Alert dispatched in <60s| Reps([Sales Representatives])
    end

    classDef tech fill:#f9f,stroke:#333,stroke-width:2px;
    class Workflow,Triage,DB,Redis tech;
```

---

## ⚡ Key Architectural Features

*   **Self-Healing State Nodes (LangGraph):** Rather than using linear automation scripts that break silently on API timeouts, Silhouette uses stateful, multi-actor workflow graphs that feature automated retries, error catchers, and human-in-the-loop fallback gates.
*   **Zero-Trust PostgreSQL RLS:** The database structure isolates company data at the PostgreSQL layer. Using Row-Level Security (RLS) integrated with JWT tokens, it mathematically prevents a sales agent from reading another client's leads.
*   **Strict Output Validation:** Leverages custom JavaScript and Python sandboxed nodes inside the automation engine to parse probabilistic LLM outputs into validated JSON structures before database write commits.
*   **Low-OpEx SQLite Vector Similarity:** Performs semantic search and lead-profile matching using TF-IDF and Cosine Similarity locally inside a SQLite instance, eliminating the need for expensive external vector databases.

---

## 🛠 Tech Stack

*   **Core Languages & Runtimes:** Python 3.11+, Node.js (ES6+), React.
*   **Orchestration & Agents:** self-hosted n8n, LangGraph, LangChain, OpenAI APIs.
*   **Data Store & Caching:** PostgreSQL 16+ (pg_uuidv7), SQLite 3, Redis 7 (Alpine).
*   **DevOps & Security:** Docker Compose, Nginx Proxy Manager, Let's Encrypt SSL, JWT, AES-256-CBC Encryption.

---

## 📦 Rapid Deployment (Docker Compose)

You can run a self-hosted instance of the Silhouette infrastructure alongside your other applications. Below is the configuration configured to avoid port conflicts with standard services (PostgreSQL mapped to `5437`, Redis to `6381`):

```yaml
version: "3.8"

services:
  app:
    image: haroldfabla2-hue/silhouette-llm:latest
    container_name: silhouette-llm-app
    restart: always
    ports:
      - "8090:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://silhouette_user:secure_pwd@db:5432/silhouette_db
      - REDIS_URL=redis://redis:6379/0
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - db
      - redis

  db:
    image: pgvector/pgvector:pg16
    container_name: silhouette-llm-db
    restart: always
    ports:
      - "5437:5432"
    environment:
      - POSTGRES_USER=silhouette_user
      - POSTGRES_PASSWORD=secure_pwd
      - POSTGRES_DB=silhouette_db
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: silhouette-llm-redis
    restart: always
    ports:
      - "6381:6379"
    volumes:
      - redisdata:/data

volumes:
  pgdata:
  redisdata:
```

### Steps to Initialize:

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/haroldfabla2-hue/silhouette-agency-os.git
    cd silhouette-agency-os
    ```
2.  **Configure Environment Variables:** Create a `.env` file containing your API credentials:
    ```env
    OPENAI_API_KEY=your_openai_api_key_here
    ```
3.  **Boot the Services:**
    ```bash
    docker compose up -d
    ```
    The application will be accessible locally at `http://localhost:8090`.

---

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.
