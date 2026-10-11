# Digital Risk Protection Platform (DRP)

A cybersecurity monitoring and threat intelligence platform designed to detect, analyze, and remediate external brand risks across mobile app stores, social media platforms, and domain registrars.

---

## Overview

The platform monitors external digital surfaces for brand impersonation, fraudulent mobile applications, and typosquatting infrastructure. It includes continuous crawlers, an in-browser APK malware sandbox, Unicode/Cyrillic homoglyph detection heuristics, and automated takedown notice generators.

To eliminate false alerts on legitimate brand communications, the system enforces a strict **0% False Positive Baseline** that automatically excludes registered official assets.

---

## System Architecture

```
+---------------------------------------------------------------------------------+
|                           Monitored External Surfaces                           |
|  Google Play Store  |  APKPure Mirrors  |  Instagram  |  X / Twitter  |  DNS    |
+---------------------------------------------------------------------------------+
                                       |
                                       v
+---------------------------------------------------------------------------------+
|                         FastAPI Backend Engine (Python)                         |
|  - Live Repository Probes (Google Play & APKPure HTML crawlers)                 |
|  - Unicode Homoglyph & Jaro-Winkler Similarity Analyzers                        |
|  - Baseline Exclusion Engine (Whitelisted Official Assets)                      |
|  - SQLite (WAL Mode) Threat Repository & Scan History                           |
+---------------------------------------------------------------------------------+
                                       |
                                       v
+---------------------------------------------------------------------------------+
|                       Analyst Interface (React 19 & Vite)                       |
|  - Executive SOC Dashboard & Marquee Surveillance Feed                          |
|  - Interactive 3D Geospatial Threat Vector Globe (Three.js WebGL)               |
|  - Look-alike Permutation Generator & Orbital Visualizer                        |
|  - In-Browser APK Malware Detonation Sandbox (SHA-256 & Permission Scorer)      |
|  - Phishing Domain & Homoglyph URL Inspector                                    |
|  - Legal Takedown Generators (DMCA, Meta Abuse, Registrar Cease & Desist)       |
+---------------------------------------------------------------------------------+
```

---

## Platform Modules

### 1. Security Command Center
* **Executive Hero Card:** Visual identity card presenting verified brand metadata (official domain, authorized app packages, developer identity) with cursor-tracking 3D tilt.
* **3D Rotating Hologram Shield:** WebGL hardware-accelerated shield rendered with Three.js.
* **Live Telemetry Ticker:** Continuous marquee feed broadcasting detection velocity, response latency, and active attack indicators.
* **KPI Telemetry Cards:** Real-time metrics showing total threat volume, security events, system health percentage, and severity breakdowns.
* **On-Demand Scan Triggers:** Single-click execution of social media and app store crawler passes with immediate database synchronization.

### 2. 3D Global Threat Radar
* **Geospatial WebGL Globe:** Interactive 3D sphere supporting drag rotation, zoom, and node selection.
* **Attack Trajectory Arcs:** Quadratic Bezier curves visualizing attack origins from global botnets/servers directed at corporate headquarters.
* **Origin Telemetry:** Clickable threat nodes detailing source IP, geolocation, attack classification, and criticality score.

### 3. Brand Baseline & Allowlist Manager
* **Zero False Positive Guarantee:** Registers authorized corporate domains, social media handles, and app package IDs.
* **Bi-Directional Database Sync:** Updates written in the UI persist directly to SQLite via `PUT /api/brands/{id}` and immediately update all scanner exclusion baselines.

### 4. Consolidated Threat Repository & Triage Feed
* **Central Threat Feed:** Aggregated table of suspicious candidates across app stores, social media, and web registrars.
* **Dynamic Severity Filters:** Filter buttons displaying real-time item counts for **All**, **High / Critical**, **Medium**, and **Low** risks.
* **Fuzzy Search:** Instant multi-column filtering by candidate handle, domain name, package ID, or detection reason.
* **Forensic Evidence Dossier:** Modal view showing technical evidence, risk factors, WHOIS/DNS data, and related threats.

### 5. Look-alike Permutation Engine
* **Orbital Constellation:** Three.js visualization of the target brand core and orbiting permutation nodes.
* **Adversarial Variation Heuristics:**
  * **Character Swaps:** Cyrillic homoglyphs substituting ASCII letters (e.g. `а` for `a`, `е` for `e`, `о` for `o`).
  * **Deceptive Affixes:** Unauthorized suffix/prefix additions (`_support`, `_helpdesk`, `_official`, `_claim`).
  * **Spacing Modulations:** Delimiters injected between brand tokens (dots, hyphens, underscores).
* **Live Heuristic Tester:** Input field to test arbitrary strings against the baseline allowlist.

### 6. Social Media Monitor
* **URL Parsing:** Automatically extracts usernames from pasted Instagram, X (Twitter), Facebook, or Telegram profile links.
* **Impersonation Heuristics:** Identifies Unicode confusable glyphs, unverified brand claims, and follower count discrepancies.
* **Direct Enforcement Actions:** Direct launch button for the Meta Abuse Reporting Portal and one-click copy for formal DMCA notices.

### 7. App Store & Rogue APK Monitor
* **Live Package Crawler:** Probes Google Play and APKPure mirror repositories in real time for any submitted package identifier (e.g. `com.apkpure.aegon`).
* **Metadata Extraction:** Extracts live app titles, developer names, ratings, download counts, and store URLs.
* **Publisher Mismatch Detection:** Flags repackaged or spoofed apps published by unauthorized third-party developer accounts.

### 8. APK Malware Detonation Sandbox
* **In-Browser File Detonation:** Drag and drop `.apk` files directly into the browser.
* **Cryptographic Digest:** Computes SHA-256 hashes in real time using the browser Web Crypto API.
* **Permission Severity Scorer:** Parses binary bytecode strings to detect high-risk Android permissions:
  * `android.permission.BIND_ACCESSIBILITY_SERVICE` (Keystroke reading and screen hijacking)
  * `android.permission.SYSTEM_ALERT_WINDOW` (Phishing overlay screens)
  * `android.permission.RECEIVE_SMS` / `READ_SMS` (2FA verification interception)
  * `android.permission.REQUEST_INSTALL_PACKAGES` (Silent secondary payload droppers)

### 9. Phishing Domain Inspector
* **URL Tokenizer:** Analyzes hostname structure, punycode encoding (`xn--`), and suspicious subdomains.
* **Credential Phishing Triggers:** Detects harvesting endpoints (`/login`, `/verify`, `/account-claim`).
* **Threat Intelligence Blacklisting:** One-click button to log the domain into the central findings database and generate a registrar Cease & Desist complaint.

### 10. Incident Reports & Compliance
* **SLA & MTTA Metrics:** Displays Mean Time to Acknowledge (MTTA), Mean Time to Response (MTTR), and ISO 27001 / SOC2 tracking.
* **CSV Export:** Downloads complete candidate audit trails with forensic notes and takedown letters.
* **Print / PDF Dossier:** Formatted stylesheet for generating executive reports via browser print dialog.

### 11. System Configuration & Authentication
* **Identity Management:** Email/password authentication, Google OAuth sign-in, and guest session modes.
* **Firebase Credentials Panel:** UI for updating Firebase Web App credentials (`apiKey`, `authDomain`, `projectId`).

---

## Usage Guide

### 1. Auditing an Instagram Account
1. Open the **Social Media Monitor** tab from the sidebar.
2. Paste an Instagram profile link (e.g. `https://instagram.com/drp_support24`) or select a test scenario.
3. Click **Analyze Handle & Confusables**.
4. Review the risk score, homoglyph character analysis, and detection reasons.
5. Click **Copy Platform Abuse Notice** or open the **Meta Abuse Portal** link directly.

### 2. Auditing an App Store Package ID
1. Open the **App Store Monitor** tab.
2. Enter an Android package ID into the search bar (e.g. `com.apkpure.aegon`) and press **Enter** or click **Audit Package**.
3. The backend crawls Google Play and APKPure mirrors, retrieves live metadata, evaluates publisher signatures, and displays the forensic report.

### 3. Detonating an APK in the Sandbox
1. Open the **APK Malware Sandbox** tab.
2. Drag and drop any `.apk` file into the upload zone, or click a preset vector.
3. The engine computes the SHA-256 hash, extracts manifest strings, checks requested permissions against the threat database, and generates a takedown notice.

### 4. Inspecting a Phishing Domain
1. Open the **Phishing Inspector** tab.
2. Enter a suspicious URL (e.g. `http://digitаlriskprotection.com/secure-portal`) and click **Analyze URL**.
3. View the detected Cyrillic character substitutions, SSL status, and heuristic risk score.
4. Click **Add to Threat Blacklist** to store the finding in the central database.

### 5. Managing the Brand Allowlist
1. Navigate to **Brand Baseline & Assets**.
2. Click **Edit Domain** to update the official corporate website, or use the form to add official social handles and application package names.
3. Updates immediately persist to the SQLite database. Any future scans against these assets will be excluded automatically.

---

## Local Setup

### Prerequisites
* Node.js 18.0+
* Python 3.10+
* npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/marellasasikiran999-commits/Digital-Risk-Protection-Platform.git
cd Digital-Risk-Protection-Platform
```

### 2. Start the Backend Server
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
* API endpoint: [http://localhost:8000](http://localhost:8000)
* Interactive Swagger Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Start the Frontend Application
In a separate terminal:
```bash
cd kampus-guard-drp
npm install
npm run dev
```
* Web interface: [http://localhost:5173](http://localhost:5173)

### 4. Build for Production
```bash
cd kampus-guard-drp
npm run build
```

---

## REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | System health check and status |
| `GET` | `/api/brands` | List all registered brand baselines |
| `POST` | `/api/brands` | Register a new brand with official baseline handles and apps |
| `PUT` | `/api/brands/{id}` | Update verified baseline domain, social handles, or apps |
| `DELETE` | `/api/brands/{id}` | Remove a brand and all associated candidate findings |
| `POST` | `/api/scan/social` | Run automated multi-channel social media scan |
| `POST` | `/api/scan/appstore` | Run automated app store crawler pass |
| `POST` | `/api/audit/package` | Execute live Google Play & APKPure probe for package ID |
| `POST` | `/api/audit/social` | Score an individual handle against the brand baseline |
| `POST` | `/api/url/analyze` | URL typosquatting, homoglyph, and SSL analyzer |
| `GET` | `/api/findings` | Query findings with brand, type, and severity filters |
| `POST` | `/api/findings/create` | Manually insert a candidate into the findings repository |
| `PATCH` | `/api/findings/{id}` | Update status (`Legitimate`, `Takedown`, `In-progress`) |
| `GET` | `/api/dashboard/summary` | Retrieve security telemetry, MTTA, MTTR, and threat counts |
| `GET` | `/api/reports/export` | Download complete findings audit log as CSV |

---

## Tech Stack

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Three.js (WebGL), Lucide React
* **Backend:** FastAPI (Python), Uvicorn, SQLite (WAL mode)
* **Testing:** End-to-end integration test suite, Web Crypto API

---

## License

This project is licensed under the [MIT License](LICENSE).
