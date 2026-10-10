import sqlite3
import json
import os
from typing import List, Dict, Any, Optional

"""
Database module for Digital Risk Protection Platform.
Protected Brand: Digital Risk Protection Platform (with full baseline and findings matching enterprise specification).
Includes complete schema for brands, threat findings, APK audits, and risk telemetry.
"""

DB_FILE = os.path.join(os.path.dirname(__file__), "guardpulse.db")

def get_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

get_db_connection = get_connection

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # 1. Brands Baseline Profile Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS brands (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            brand_name TEXT UNIQUE NOT NULL,
            official_website TEXT NOT NULL,
            official_logo_url TEXT,
            official_developer TEXT,
            official_handles_json TEXT,
            official_apps_json TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # 2. Findings / Threats Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS findings (
            id TEXT PRIMARY KEY,
            brand_name TEXT NOT NULL,
            finding_type TEXT NOT NULL,
            title TEXT NOT NULL,
            candidate_name TEXT NOT NULL,
            category TEXT NOT NULL,
            asset TEXT NOT NULL,
            matched_official TEXT NOT NULL,
            risk_score INTEGER NOT NULL,
            risk_level TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Pending',
            confidence_score INTEGER DEFAULT 95,
            similarity_rate INTEGER DEFAULT 90,
            detection_source TEXT NOT NULL,
            threat_reason TEXT,
            note TEXT,
            whois_info TEXT,
            developer TEXT,
            package_name TEXT,
            market_distribution_json TEXT,
            factors_json TEXT,
            dns_records_json TEXT,
            logo_similarity INTEGER DEFAULT 0,
            is_official INTEGER DEFAULT 0,
            detected_date TEXT,
            updated_date TEXT,
            takedown_notice TEXT
        )
    """)

    # 3. APK Inspections History
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS apk_scans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            package_name TEXT NOT NULL,
            app_title TEXT NOT NULL,
            publisher TEXT NOT NULL,
            risk_score INTEGER NOT NULL,
            risk_level TEXT NOT NULL,
            threat_family TEXT,
            is_repackaged INTEGER DEFAULT 0,
            dangerous_permissions_json TEXT,
            reasons_json TEXT,
            takedown_notice TEXT,
            scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    seed_findings_data(conn)
    conn.close()

def seed_findings_data(conn: sqlite3.Connection):
    cursor = conn.cursor()

    # 1. Seed Digital Risk Protection Platform
    cursor.execute("SELECT COUNT(*) FROM brands WHERE brand_name = 'Digital Risk Protection Platform'")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
            INSERT INTO brands (brand_name, official_website, official_logo_url, official_developer, official_handles_json, official_apps_json)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            'Digital Risk Protection Platform',
            'www.digitalriskprotection.com',
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
            'Digital Risk Protection Platform',
            json.dumps(['@digitalriskprotection', '@drp_platform', 'company/digital-risk-protection']),
            json.dumps(['com.drp.platform.official', 'id.drp.platform.ios'])
        ))

    # 2. Seed Findings
    cursor.execute("SELECT COUNT(*) FROM findings WHERE brand_name = 'Digital Risk Protection Platform'")
    if cursor.fetchone()[0] == 0:
        findings_data = [
            (
                'FIND-DRP-01',
                'Digital Risk Protection Platform',
                'social',
                'Instagram',
                '@drp_support24',
                'Social Media › Fake Profile',
                '@drp_support24',
                '@digitalriskprotection',
                92,
                'High',
                'Pending',
                95,
                92,
                'Instagram Crawler',
                'Similar name + extra word / No official logo',
                'Bio solicits account recovery fees and claims to be 24/7 technical helpdesk.',
                None,
                None,
                None,
                None,
                json.dumps([
                    {'factor': 'Affix Hijacking (_support24)', 'score': 35},
                    {'factor': 'No Verified Badge / Unofficial Avatar', 'score': 30},
                    {'factor': 'Soliciting Customer Credentials', 'score': 27}
                ]),
                None,
                64,
                0,
                '2 hours ago',
                '2 hours ago',
                'FORMAL ABUSE TAKEDOWN: Instagram profile @drp_support24 fraudulently impersonates Digital Risk Protection Platform.'
            ),
            (
                'FIND-DRP-02',
                'Digital Risk Protection Platform',
                'app',
                'Google Play',
                'DRP Rewards Wallet',
                'App Store › Impersonator App',
                'com.fake.drp.rewards',
                'com.drp.platform.official',
                88,
                'High',
                'Pending',
                90,
                88,
                'Google Play Store Monitor',
                'Similar name + different developer (Global Trend Mobile)',
                'Extracts SMS messages and contacts disguised as user rewards wallet.',
                None,
                'Global Trend Mobile',
                'com.fake.drp.rewards',
                json.dumps({'Playstore': 72, 'Appstore': 0, 'ApkDl': 15, 'Apkgp': 8, 'Androidappsapk': 5, 'Total': 100}),
                json.dumps([
                    {'factor': 'Publisher Mismatch (Global Trend Mobile vs Digital Risk Protection Platform)', 'score': 40},
                    {'factor': 'Dangerous Permission (RECEIVE_SMS, READ_CONTACTS)', 'score': 28},
                    {'factor': 'Fake Rewards Scheme', 'score': 20}
                ]),
                None,
                82,
                0,
                '4 hours ago',
                '4 hours ago',
                'PLAYSTORE TAKEDOWN: com.fake.drp.rewards uses Digital Risk Protection Platform brand assets without authorization.'
            ),
            (
                'FIND-DRP-03',
                'Digital Risk Protection Platform',
                'social',
                'Twitter / X',
                '@drp_official_fake',
                'Social Media › Typo/Spacing',
                '@drp_official_fake',
                '@digitalriskprotection',
                75,
                'Medium',
                'In-progress',
                88,
                75,
                'Twitter/X Sentinel',
                'Spacing / Underscore variation (@drp_official_fake vs @digitalriskprotection)',
                'Monitors brand customer queries and tweets malicious phishing shortlinks.',
                None,
                None,
                None,
                None,
                json.dumps([
                    {'factor': 'Underscore variation impersonating verified handle', 'score': 32},
                    {'factor': 'Unverified handle soliciting direct messages', 'score': 25},
                    {'factor': 'Recent creation date (< 14 days)', 'score': 18}
                ]),
                None,
                78,
                0,
                '6 hours ago',
                '6 hours ago',
                'TWITTER TAKEDOWN: Handle @drp_official_fake impersonates official corporate entity.'
            ),
            (
                'FIND-DRP-04',
                'Digital Risk Protection Platform',
                'app',
                'Apple App Store',
                'Digital Risk Protection Pro',
                'App Store › Suspicious Clone',
                'id.drp.pro.fake',
                'id.drp.platform.ios',
                68,
                'Medium',
                'Pending',
                82,
                68,
                'Apple App Store Sentinel',
                'Brand name affix (Pro) under individual developer license',
                'Requests camera and location without enterprise MDM certificate.',
                None,
                'DevApex Studio',
                'id.drp.pro.fake',
                json.dumps({'Playstore': 0, 'Appstore': 85, 'ApkDl': 10, 'Apkgp': 5, 'Androidappsapk': 0, 'Total': 100}),
                json.dumps([
                    {'factor': 'Affix Pro with Developer DevApex Studio', 'score': 30},
                    {'factor': 'Missing corporate privacy agreement', 'score': 20},
                    {'factor': 'Identical app title prefix', 'score': 18}
                ]),
                None,
                71,
                0,
                '7 hours ago',
                '7 hours ago',
                'APPLE APP STORE REPORT: Unauthorized listing Digital Risk Protection Pro.'
            ),
            (
                'FIND-DRP-05',
                'Digital Risk Protection Platform',
                'social',
                'Facebook',
                'Digital Risk Protection Page',
                'Social Media › Fake Fan Page',
                'fb.com/digitalriskprotection.page',
                '@digitalriskprotection',
                42,
                'Low',
                'Pending',
                75,
                42,
                'Facebook Graph Monitor',
                'Unverified Facebook page with no business manager linkage',
                'Publishes duplicate press announcements without authorization.',
                None,
                None,
                None,
                None,
                json.dumps([
                    {'factor': 'Unverified Fan Page', 'score': 22},
                    {'factor': 'No official business verification', 'score': 20}
                ]),
                None,
                80,
                0,
                '8 hours ago',
                '8 hours ago',
                'META REPORT: fb.com/digitalriskprotection.page'
            ),
            (
                'FIND-DRP-06',
                'Digital Risk Protection Platform',
                'domain',
                'Website Domain',
                'drp-platform-login-claim.com',
                'Domain › Credential Harvester',
                'drp-platform-login-claim.com',
                'www.digitalriskprotection.com',
                94,
                'High',
                'Pending',
                98,
                94,
                'Typosquatting DNS Engine',
                'Homoglyph / Typosquatting domain targeting users',
                'Phishing site mimicking corporate single-sign-on portal.',
                'Registrar: Namecheap Inc. | Privacy Shield: Enabled | Created: 3 days ago',
                None,
                None,
                None,
                json.dumps([
                    {'factor': 'Typosquatting Affix (-login-claim.com)', 'score': 40},
                    {'factor': 'Newly registered domain (< 7 days old)', 'score': 32},
                    {'factor': 'Host on anonymous Russian bulletproof IP', 'score': 22}
                ]),
                json.dumps({'A': '185.220.101.5', 'NS': 'ns1.bulletproofdns.org'}),
                91,
                0,
                '1 hour ago',
                '1 hour ago',
                'DMCA NOTICE: Immediate DNS termination for drp-platform-login-claim.com'
            )
        ]

        cursor.executemany("""
            INSERT OR IGNORE INTO findings (
                id, brand_name, finding_type, title, candidate_name, category,
                asset, matched_official, risk_score, risk_level, status,
                confidence_score, similarity_rate, detection_source, threat_reason,
                note, whois_info, developer, package_name, market_distribution_json,
                factors_json, dns_records_json, logo_similarity, is_official,
                detected_date, updated_date, takedown_notice
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        """, findings_data)

    conn.commit()

def get_brands() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM brands ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()

    result = []
    for r in rows:
        result.append({
            "id": r["id"],
            "brand_name": r["brand_name"],
            "official_website": r["official_website"],
            "official_logo_url": r["official_logo_url"],
            "official_developer": r["official_developer"],
            "official_handles": json.loads(r["official_handles_json"]) if r["official_handles_json"] else [],
            "official_apps": json.loads(r["official_apps_json"]) if r["official_apps_json"] else [],
            "created_at": r["created_at"]
        })
    return result

def add_brand(brand: Dict[str, Any]) -> int:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO brands (brand_name, official_website, official_logo_url, official_developer, official_handles_json, official_apps_json)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        brand["brand_name"],
        brand.get("official_website", ""),
        brand.get("official_logo_url", ""),
        brand.get("official_developer", ""),
        json.dumps(brand.get("official_handles", [])),
        json.dumps(brand.get("official_apps", []))
    ))
    conn.commit()
    brand_id = cursor.lastrowid
    conn.close()
    return brand_id

def update_brand(brand_id: int, brand: Dict[str, Any]):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE brands SET
            brand_name = ?,
            official_website = ?,
            official_logo_url = ?,
            official_developer = ?,
            official_handles_json = ?,
            official_apps_json = ?
        WHERE id = ?
    """, (
        brand["brand_name"],
        brand.get("official_website", ""),
        brand.get("official_logo_url", ""),
        brand.get("official_developer", ""),
        json.dumps(brand.get("official_handles", [])),
        json.dumps(brand.get("official_apps", []))
    ))
    conn.commit()
    conn.close()

def get_findings(
    brand: Optional[str] = None,
    finding_type: Optional[str] = None,
    risk_level: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None
) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM findings WHERE 1=1"
    params = []

    if brand and brand != "all":
        query += " AND brand_name = ?"
        params.append(brand)

    if finding_type and finding_type != "all":
        query += " AND finding_type = ?"
        params.append(finding_type)

    if risk_level and risk_level != "all":
        query += " AND risk_level = ?"
        params.append(risk_level)

    if status and status != "all":
        query += " AND status = ?"
        params.append(status)

    if search:
        query += " AND (candidate_name LIKE ? OR title LIKE ? OR threat_reason LIKE ? OR asset LIKE ?)"
        s = f"%{search}%"
        params.extend([s, s, s, s])

    query += " ORDER BY risk_score DESC"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    result = []
    for r in rows:
        result.append({
            "id": r["id"],
            "brand_name": r["brand_name"],
            "finding_type": r["finding_type"],
            "title": r["title"],
            "candidate_name": r["candidate_name"],
            "category": r["category"],
            "asset": r["asset"],
            "matched_official": r["matched_official"],
            "risk_score": r["risk_score"],
            "risk_level": r["risk_level"],
            "status": r["status"],
            "confidence_score": r["confidence_score"],
            "similarity_rate": r["similarity_rate"],
            "detection_source": r["detection_source"],
            "threat_reason": r["threat_reason"],
            "note": r["note"],
            "whois_info": r["whois_info"],
            "developer": r["developer"],
            "package_name": r["package_name"],
            "market_distribution": json.loads(r["market_distribution_json"]) if r["market_distribution_json"] else None,
            "factors": json.loads(r["factors_json"]) if r["factors_json"] else [],
            "dns_records": json.loads(r["dns_records_json"]) if r["dns_records_json"] else None,
            "logo_similarity": r["logo_similarity"],
            "is_official": bool(r["is_official"]),
            "detected_date": r["detected_date"],
            "updated_date": r["updated_date"],
            "takedown_notice": r["takedown_notice"]
        })
    return result

def update_finding_status(finding_id: str, new_status: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE findings SET status = ?, updated_date = 'Just now' WHERE id = ?", (new_status, finding_id))
    conn.commit()
    conn.close()

def add_finding(f: Dict[str, Any]):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT OR REPLACE INTO findings (
            id, brand_name, finding_type, title, candidate_name, category,
            asset, matched_official, risk_score, risk_level, status,
            confidence_score, similarity_rate, detection_source, threat_reason,
            note, whois_info, developer, package_name, market_distribution_json,
            factors_json, dns_records_json, logo_similarity, is_official,
            detected_date, updated_date, takedown_notice
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        f["id"], f["brand_name"], f["finding_type"], f["title"], f["candidate_name"], f["category"],
        f["asset"], f.get("matched_official", ""), f["risk_score"], f["risk_level"], f.get("status", "Pending"),
        f.get("confidence_score", 90), f.get("similarity_rate", 85), f.get("detection_source", "Manual"),
        f.get("threat_reason", ""), f.get("note", ""), f.get("whois_info", None), f.get("developer", None),
        f.get("package_name", None), json.dumps(f.get("market_distribution")) if f.get("market_distribution") else None,
        json.dumps(f.get("factors", [])), json.dumps(f.get("dns_records")) if f.get("dns_records") else None,
        f.get("logo_similarity", 0), int(f.get("is_official", 0)), f.get("detected_date", "Just now"),
        f.get("updated_date", "Just now"), f.get("takedown_notice", "")
    ))
    conn.commit()
    conn.close()
