# Digital Risk Protection Platform (DRP)

<div align="center">

![Platform Status](https://img.shields.io/badge/System_Status-Online_%26_Secured-06b6d4?style=for-the-badge&logo=shield)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-WebGL_3D-black?style=for-the-badge&logo=threedotjs&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)

**Autonomous External Threat Intelligence, Social Impersonation Defense, Rogue APK Sandbox & Phishing Homoglyph Resolver**

[Live Application](#-getting-started) • [Feature Directory](#-platform-modules--core-features) • [Analyst Workflow](#-step-by-step-analyst-usage-guide) • [API Reference](#-api-specification)

</div>

---

## 🛡️ Executive Summary

Modern cyber adversaries exploit external brand perimeters by launching attacks outside traditional enterprise firewalls:
* **Mobile Repackaging:** Uploading trojan banker APKs to third-party mirrors mimicking corporate mobile apps.
* **Social Media Impersonation:** Deploying look-alike handles on Instagram, X, Facebook, and Telegram using Cyrillic homoglyphs and customer support affixes.
* **Credential Harvesting:** Registering deceptive typosquatted domains with valid SSL certificates to harvest customer login credentials.

**Digital Risk Protection Platform (DRP)** is a security operations center (SOC) suite engineered to continuously detect, triage, detonate, and neutralize external digital risks across mobile app stores, social networks, and domain registrars. 

Equipped with an **Exclusion Baseline Engine**, the platform guarantees **0% False Positives** on verified brand assets while generating automated legal takedown notices (DMCA, Meta Abuse, Registrar Cease & Desist) for malicious candidates.

---

## 🏛️ System Architecture

```mermaid
graph TD
    subgraph External Monitored Attack Surface
        GP[Google Play Store]
        AP[APKPure & Third-Party Mirrors]
        IG[Instagram & Meta Graph]
        TW[X / Twitter Streaming]
        REG[Global Domain Registrars & DNS]
    end

    subgraph DRP Backend Engine - FastAPI & Python 3.10+
        CR[Live Web Crawlers & Probes]
        HS[Homoglyph Heuristic Scorer]
        EX[0% False-Positive Baseline Filter]
        DB[(SQLite WAL Database)]
    end

    subgraph DRP Analyst Interface - React 19, TypeScript, Three.js
        DASH[Executive Security Command Center]
        GLOBE[3D Threat Vector Globe - WebGL]
        LAB[Look-alike AI Permutation Lab]
        SANDBOX[Mobile APK Malware Detonation Sandbox]
        INSPECT[Phishing & DNS Domain Inspector]
        DOSSIER[Cryptographic Forensic Evidence Dossier]
    end

    GP --> CR
    AP --> CR
    IG --> CR
    TW --> CR
    REG --> CR
    CR --> HS
    HS --> EX
    EX --> DB
    DB --> DASH
    DB --> GLOBE
    DB --> LAB
    DB --> SANDBOX
    DB --> INSPECT
    DB --> DOSSIER
```

---

## 🚀 Platform Modules & Core Features

### 1. Executive Security Command Center (`Dashboard`)
* **Interactive 3D Mouse Tilt (`TiltCard3D`):** Cursor-tracking 3D card presenting verified brand metadata (Domain, Authorized App Package, Developer Entity).
* **3D Rotating Hologram Shield (`HologramShield3D`):** Hardware-accelerated WebGL beacon rendering active cryptographic perimeter protection.
* **Real-Time Telemetry Ticker:** Infinite marquee displaying live platform metrics, response latency, homoglyph detection accuracy, and active intercept volume.
* **Dynamic Threat Telemetry:** 5 KPI cards with live SVG wave graphs tracking total detections, security events, health status, and external threat candidates.
* **Autonomous Scan Triggers:** 1-click **"Run Full Scan"** querying social platforms and app repositories simultaneously with instant database synchronization.

### 2. 3D Global Cyber Threat Matrix (`CyberThreatGlobe3D`)
* **Interactive WebGL Matrix:** Interactive 3D globe supporting drag-to-rotate, pinch/wheel zoom, and node selection.
* **Great Circle Bezier Trajectories:** Real-time 3D quadratic attack arcs traveling from malicious botnets/servers across the globe directly to corporate headquarters.
* **Geospatial Forensics:** Clickable threat points disclosing target country, city, server IP, attack vector, and criticality scores.

### 3. Corporate Perimeter & Allowlist Baseline (`BrandProfileManager`)
* **Strict 0% False Positive Guarantee:** Cryptographically registers official corporate assets (websites, handles, app package IDs, developer publisher names).
* **Two-Way Database Sync:** Adding or removing handles or updating the official domain writes directly to the SQLite database via `PUT /api/brands/{id}` and updates all threat scorers across the platform.

### 4. Consolidated Threat Repository & Triage Feed (`LatestFindingsSection`)
* **Unified Audit Stream:** Centralized repository aggregating mobile packages, social accounts, and phishing registrars with cryptographic match scoring.
* **Dynamic Triage Filters:** Real-time filter tabs calculating live counts across **All**, **Critical / High**, **Medium**, and **Low** severities.
* **Fast Search:** Instant multi-column fuzzy search filtering candidates by handle, domain, package name, or technical reason.

### 5. Look-alike Permutation AI Engine & Exclusion Filter (`LookAlikeDetectionLab`)
* **Three.js Orbital Constellation:** 3D particle constellation rendering the central brand nucleus and orbiting adversarial permutation vectors.
* **Autonomous Generator:** Synthesizes attack vectors across:
  * **Character Swaps:** Cyrillic homoglyphs substituting ASCII characters (`а` for `a`, `е` for `e`, `о` for `o`).
  * **Deceptive Affixes:** Suffix and prefix hijacking (`_support`, `_helpdesk`, `_official`, `_claims`).
  * **Spacing Modulations:** Delimiter injections using dots, hyphens, and whitespace manipulation.
* **Custom Threat Tester:** Type any arbitrary handle or domain to evaluate against the baseline. Official brand assets are certified safe (`0% False Positive`), while malicious typosquats receive technical factor breakdowns.

### 6. Social Surface Surveillance & Impersonation Sentinel (`SocialAccountTester`)
* **Live Address Bar Parsing:** Auto-parses pasted URLs from Instagram, X (Twitter), Facebook, or Telegram (e.g., `https://instagram.com/drp_support24` $\rightarrow$ `@drp_support24`).
* **Heuristic Analysis:** Uncovers Unicode Cyrillic confusable characters, deceptive support keywords, and verified status anomalies.
* **Direct Enforcement Integration:** 1-click direct link to the **Meta Abuse Reporting Portal** and 1-click copy for formal DMCA Platform Abuse Takedown notices.

### 7. App Store & Rogue APK Monitor (`AppStoreMonitoring`)
* **Live Repository Crawler:** Enter any Android package identifier (e.g. `com.apkpure.aegon`, `com.whatsapp`, `com.fake.drp.rewards`) and hit Enter or click **"Audit Package"**.
* **Live Google Play & APKPure Probes:** Backend reaches out to Google Play and APKPure mirror repositories in real time to inspect title, rating, download count, and official developer signatures.
* **Publisher Mismatch Detection:** Automatically flags unauthorized third-party developers uploading cracked or spoofed applications.

### 8. Mobile APK Behavioral Detonation Sandbox (`MaliciousApkSandbox`)
* **In-Browser Binary Detonation:** Drag and drop any `.apk` file directly into the sandbox.
* **Web Crypto SHA-256 Digest:** Computes cryptographic SHA-256 digests in real time.
* **Bytecode & Manifest Inspection:** Scans DEX strings and AndroidManifest permissions to score high-risk Android privileges:
  * `android.permission.BIND_ACCESSIBILITY_SERVICE` (Keystroke logging & screen hijacking)
  * `android.permission.SYSTEM_ALERT_WINDOW` (Invisible phishing overlay screens)
  * `android.permission.RECEIVE_SMS` / `READ_SMS` (2FA OTP theft)
  * `android.permission.REQUEST_INSTALL_PACKAGES` (Silent secondary payload dropper)

### 9. Phishing Domain & Cyrillic Homoglyph Inspector (`FakeUrlTester`)
* **Deep URL Tokenizer:** Detects look-alike hostnames, punycode spoofing (`xn--`), and malicious redirect structures.
* **TLS & Registrar Verification:** Evaluates SSL certificate validity, domain age, and credential harvesting trigger paths (`/login`, `/verify-account`, `/claim`).
* **1-Click Threat Intelligence Blacklisting:** Adds audited phishing domains directly to the consolidated findings database and generates formal Registrar Cease & Desist complaints.

### 10. Executive Threat & Incident Audit Reports (`IncidentReportsView`)
* **Compliance Telemetry:** Tracks Mean Time to Acknowledge (MTTA), Mean Time to Response (MTTR), SLA compliance, and ISO 27001 / SOC2 certificate tracking.
* **Export CSV Audit Log:** 1-click CSV download containing all evaluated candidates, confidence rates, forensic notes, and takedown notices.
* **Print / Save PDF:** Optimized print stylesheet generating executive dossiers ready for board presentations or legal filings.

### 11. System Configuration & Authentication (`FirebaseAuthModal`)
* **Enterprise Identity Management:** Firebase email/password authentication, Google OAuth sign-in, user registration, and persistent local session recovery.
* **Firebase Credentials Configuration:** Configure real Firebase Web App project keys (`apiKey`, `authDomain`, `projectId`) directly in the UI.

---

## 📖 Step-by-Step Analyst Usage Guide

### Scenario 1: Auditing an Instagram Impersonator
1. Open the **Social Media Monitor** tab from the left sidebar.
2. Paste an Instagram profile link (e.g. `https://instagram.com/drp_support24`) or select a preset scenario.
3. Click **"Analyze Handle & Confusables"**.
4. Review the calculated threat severity score, Cyrillic homoglyph detection, and evaluation factors.
5. Click **"Copy Platform Abuse Notice"** to copy a legal notice, or click **"Meta Abuse Portal"** to report the infringing account directly.

### Scenario 2: Detonating a Suspicious Mobile APK
1. Open the **APK Malware Sandbox** tab.
2. Drag and drop any `.apk` binary file into the drop zone, or select a preset vector (e.g. *Trojan-Banker Clone*).
3. Watch the 4-stage analysis engine calculate the SHA-256 cryptographic digest, unpack manifest permissions, and evaluate behavioral vectors.
4. Review the verdict and flagged permissions table (`BIND_ACCESSIBILITY_SERVICE`, `RECEIVE_SMS`).
5. Copy the formal Mobile Store Takedown Request.

### Scenario 3: Investigating a Rogue Package on Google Play / APKPure
1. Open the **App Store Monitor** tab.
2. Enter a package ID into the search bar (e.g. `com.apkpure.aegon`) and press **Enter** or click **"Audit Package"**.
3. The platform executes a live probe against Google Play and APKPure mirrors, inspects ratings and developer names, flags developer mismatches, and logs the result into your central repository.

### Scenario 4: Investigating a Phishing Domain
1. Open the **Phishing Inspector** tab.
2. Input a suspicious URL (e.g. `http://digitаlriskprotection.com/secure-portal`) or select an attack preset.
3. Click **"Analyze URL"**.
4. The system flags the Cyrillic character substitution, missing TLS encryption, and deceptive path keywords.
5. Click **"Add to Threat Blacklist"** to permanently log the candidate into the repository, then copy the formal **Registrar Cease & Desist Letter**.

### Scenario 5: Managing the Whitelist Baseline (0% False Positives)
1. Navigate to **Brand Baseline & Assets**.
2. Click **"Edit Domain"** to update the primary corporate website, or use the form to register new verified handles (`@brand_official`) or app IDs.
3. Changes immediately sync to the backend SQLite database. All future scans against these assets will be excluded with a **0% False Positive Guarantee**.

---

## 🛠️ Local Installation & Development

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **Python**: v3.10.0 or higher
* **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone https://github.com/marellasasikiran999-commits/Digital-Risk-Protection-Platform.git
cd Digital-Risk-Protection-Platform
```

### 2. Start the Backend API Server
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI Uvicorn server (port 8000)
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
* Backend API will be live at: `http://127.0.0.1:8000`
* Interactive Swagger Docs: `http://127.0.0.1:8000/docs`

### 3. Start the Frontend Application
Open a second terminal window:
```bash
# Navigate to the frontend directory
cd kampus-guard-drp

# Install dependencies
npm install

# Start Vite development server (port 5173)
npm run dev -- --host 127.0.0.1 --port 5173
```
* Frontend Dashboard will be live at: `http://127.0.0.1:5173`

### 4. Running the Production Build
To verify type safety and produce the minified production bundle:
```bash
cd kampus-guard-drp
npm run build
```
*(Build executes `tsc -b && vite build` with 0 errors).*

---

## 📡 API Specification

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Root system health check & baseline status |
| `GET` | `/api/brands` | Fetch all registered corporate brand profiles |
| `POST` | `/api/brands` | Register a new brand with official baseline handles & apps |
| `PUT` | `/api/brands/{id}` | Update verified baseline domain, social handles, or apps |
| `DELETE`| `/api/brands/{id}` | Remove a brand and all associated candidate findings |
| `POST` | `/api/scan/social` | Run automated multi-channel social impersonation crawler |
| `POST` | `/api/scan/appstore` | Run automated app store & rogue APK scanner |
| `POST` | `/api/audit/package` | Execute live Google Play & APKPure probe for package ID |
| `POST` | `/api/audit/social` | Score an individual handle against brand baseline |
| `POST` | `/api/url/analyze` | Deep typosquatting, homoglyph, and SSL URL analyzer |
| `GET` | `/api/findings` | Query consolidated threats with brand, type, and severity filters |
| `POST` | `/api/findings/create` | Manually log an external candidate into the threat DB |
| `PATCH`| `/api/findings/{id}` | Update status (`Legitimate`, `Takedown`, `In-progress`) |
| `GET` | `/api/dashboard/summary` | Real-time security telemetry, MTTA, MTTR, and severity counts |
| `GET` | `/api/reports/export` | Download full forensic audit logs as CSV |

---

## 🔒 Security & False Positive Guarantee

In digital risk protection, false alerts waste SOC analyst resources and risk shutting down legitimate partner campaigns.

This platform enforces a strict **Whitelisting Architecture**:
1. During crawler ingestion, candidate strings are normalized (`@`, `.`, `_`, and `-` delimiters stripped).
2. The normalized identity is evaluated against the registered **Brand Baseline Allowlist**.
3. Exact matches are instantly categorized as `Legitimate (Safe)` with a Risk Score of `0/100` and bypassed from threat queues.
4. Non-matching candidates undergo multi-factor heuristic scoring (Levenshtein distance, Unicode confusable code points, keyword affixes, and publisher signature mismatches).

---

## 👥 Authors & License

* **Project:** Digital Risk Protection Platform (DRP)
* **License:** [MIT License](LICENSE)
* **Repository:** [Digital-Risk-Protection-Platform](https://github.com/marellasasikiran999-commits/Digital-Risk-Protection-Platform)
