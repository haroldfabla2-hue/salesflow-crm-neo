# SalesFlow CRM (Neo Enterprise Edition)

SalesFlow CRM is a highly specialized, Boutique Enterprise CRM architecture built for High-Ticket Sales teams, Call Centers, and Academies. It focuses on three core pillars: **Zero-Trust Security**, **Legal Compliance by Design**, and a **Fatigue-Free Neo-Enterprise UX**.

## 🚀 Key Differentiators

While traditional CRMs are generic data-entry tools, SalesFlow is engineered to solve specific high-value corporate problems out of the box:

- **Zero-Trust Architecture (PostgreSQL RLS):** 
  Data is protected at the database level. Using PostgreSQL's Row-Level Security (RLS) integrated with JWT tokens, the database mathematically prevents a sales agent from reading another agent's leads. If the application layer is compromised, the data remains sealed.
- **Immutable Audit Trail:**
  Every data read, update, or mutation is cryptographically logged in an append-only forensic ledger to track operator actions, IP addresses, and state deltas.
- **Native Legal Compliance (ARCO & Privacy):**
  Built for strict data protection laws (like Peru's Ley N° 29733). Includes a native QA (Quality Assurance) module to audit sales calls and verify if privacy clauses were read. Features a "One-Click ARCO" function to irreversibly anonymize and destroy user data upon request.
- **Neo Enterprise UX:**
  A "Progressive Disclosure" vanilla frontend that eliminates visual fatigue. Features include:
  - Custom Light / Dark Mode dynamic theming.
  - Command Palette (`Ctrl+K`) for lightning-fast power-user navigation.
  - Slide-out Drawers with Skeleton Loaders to mask database latency.

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL 16+ (pg_uuidv7 ready)
- **Security:** JWT (JSON Web Tokens), Bcrypt, AES-256-GCM Encryption
- **Frontend:** Vanilla JavaScript (ES6+), CSS Custom Properties, Feather Icons

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/salesflow-crm.git
   cd salesflow-crm
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   JWT_SECRET=your_super_secret_key_here
   PG_USER=your_postgres_user
   PG_HOST=localhost
   PG_DATABASE=salesflow_db
   PG_PASSWORD=your_postgres_password
   PG_PORT=5432
   AES_ENCRYPTION_KEY=32_byte_hex_string_here
   ```

4. **Database Migration**
   Run the SQL scripts provided in the `sql/` folder (coming soon) to initialize the PostgreSQL RLS schema.

5. **Start the Server**
   ```bash
   node server.js
   ```

## ⚖️ License
This project is open-sourced under the [MIT License](LICENSE).
