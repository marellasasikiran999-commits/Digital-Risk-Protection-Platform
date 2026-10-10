import sqlite3
import json
import os
from typing import List, Dict, Any, Optional

"""
Database module for BrandShield AI (Digital Risk Protection Platform).
Protected Brand: BrandShield (with full baseline and findings matching user's exact specification).
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

    # 1. Seed BrandShield (Matches BrandShield AI user screenshot)
    cursor.execute("SELECT COUNT(*) FROM brands WHERE brand_name = 'BrandShield'")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
            INSERT INTO brands (brand_name, official_website, official_logo_url, official_developer, official_handles_json, official_apps_json)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            'BrandShield',
            'www.brandshield.ai',
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
            'BrandShield Security Corp',
            json.dumps(['@brandshield', '@brandshield_hq', 'company/brandshield']),
            json.dumps(['com.brandshield.official', 'id.brandshield.ios'])
        ))

    # 2. Seed Findings (Matching the 5 rows in the user's BrandShield AI screenshot)
    cursor.execute("SELECT COUNT(*) FROM findings WHERE brand_name = 'BrandShield'")
    if cursor.fetchone()[0] == 0:
        findings_data = [
            (
                'FIND-BS-01',
                'BrandShield',
                'social',
                'Instagram',
                '@brandshield_support24',
                'Social Media › Fake Profile',
                '@brandshield_support24',
                '@brandshield',
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
                'FORMAL ABUSE TAKEDOWN: Instagram profile @brandshield_support24 fraudulently impersonates BrandShield.'
            ),
            (
                'FIND-BS-02',
                'BrandShield',
                'app',
                'Google Play',
                'BrandShield Rewards',
                'App Store › Impersonator App',
                'com.fake.brandshield.rewards',
                'com.brandshield.official',
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
                'com.fake.brandshield.rewards',
                json.dumps({'Playstore': 72, 'Appstore': 0, 'ApkDl': 15, 'Apkgp': 8, 'Androidappsapk': 5, 'Total': 100}),
                json.dumps([
                    {'factor': 'Publisher Mismatch (Global Trend Mobile vs BrandShield Security Corp)', 'score': 40},
                    {'factor': 'Dangerous Permission (RECEIVE_SMS, READ_CONTACTS)', 'score': 28},
                    {'factor': 'Fake Rewards Scheme', 'score': 20}
                ]),
                None,
                82,
                0,
                '4 hours ago',
                '4 hours ago',
                'PLAYSTORE TAKEDOWN: com.fake.brandshield.rewards uses BrandShield brand assets without authorization.'
            ),
            (
                'FIND-BS-03',
                'BrandShield',
                'social',
                'Twitter / X',
                '@brand_shield',
                'Social Media › Typo/Spacing',
                '@brand_shield',
                '@brandshield',
                75,
                'Medium',
                'In-progress',
                88,
                75,
                'Twitter/X Sentinel',
                'Spacing / Underscore variation (@brand_shield vs @brandshield)',
                'Monitors brand customer queries and tweets malicious phishing shortlinks.',
                None,
                None,
                None,
                None,
                json.dumps([
                    {'factor': 'Underscore variation (@brand_shield vs @brandshield)', 'score': 32},
                    {'factor': 'Unverified handle soliciting direct messages', 'score': 25},
                    {'factor': 'Recent creation date (< 14 days)', 'score': 18}
                ]),
                None,
                78,
                0,
                '6 hours ago',
                '6 hours ago',
                'TWITTER TAKEDOWN: Handle @brand_shield impersonates official corporate entity.'
            ),
            (
                'FIND-BS-04',
                'BrandShield',
                'app',
                'Apple App Store',
                'BrandShield Pro',
                'App Store › Suspicious Clone',
                'id.brandshield.pro.fake',
                'id.brandshield.ios',
                68,
                'Medium',
                'Pending',
                82,
                68,
                'Apple App Store Sentinel',
                'Brand name affix (BrandShield Pro) under individual developer license',
                'Requests camera and location without enterprise MDM certificate.',
                None,
                'DevApex Studio',
                'id.brandshield.pro.fake',
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
                'APPLE APP STORE REPORT: Unauthorized listing BrandShield Pro.'
            ),
            (
                'FIND-BS-05',
                'BrandShield',
                'social',
                'Facebook',
                'BrandShield Official',
                'Social Media › Fake Fan Page',
                'fb.com/brandshieldofficial.page',
                '@brandshield',
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
                'META REPORT: fb.com/brandshieldofficial.page'
            ),
            (
                'FIND-BS-06',
                'BrandShield',
                'domain',
                'Website Domain',
                'brandshield-login-claim.com',
                'Domain › Credential Harvester',
                'brandshield-login-claim.com',
                'www.brandshield.ai',
                94,
                'High',
                'Pending',
                98,
                94,
                'Typosquatting DNS Engine',
                'Homoglyph / Typosquatting domain targeting BrandShield users',
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
                'DMCA NOTICE: Immediate DNS termination for brandshield-login-claim.com'
            )
        ]

        cursor.executemany("""
            INSERT INTO findings (
                id, brand_name, finding_type, title, candidate_name, category, asset, matched_official,
                risk_score, risk_level, status, confidence_score, similarity_rate, detection_source,
                threat_reason, note, whois_info, developer, package_name, market_distribution_json,
                factors_json, dns_records_json, logo_similarity, is_official, detected_date,
                updated_date, takedown_notice
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, findings_data)

    conn.commit()

def get_all_brands() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM brands ORDER BY id ASC")
    rows = cursor.fetchall()
    brands = []
    for r in rows:
        brands.append({
            "id": r["id"],
            "brand_name": r["brand_name"],
            "official_website": r["official_website"],
            "official_logo_url": r["official_logo_url"],
            "official_developer": r["official_developer"],
            "official_handles": json.loads(r["official_handles_json"] or "[]"),
            "official_apps": json.loads(r["official_apps_json"] or "[]")
        })
    conn.close()
    return brands

def get_findings(brand_name: Optional[str] = None, finding_type: Optional[str] = None) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    query = "SELECT * FROM findings WHERE 1=1"
    params = []
    if brand_name:
        query += " AND brand_name = ?"
        params.append(brand_name)
    if finding_type:
        query += " AND finding_type = ?"
        params.append(finding_type)
    query += " ORDER BY risk_score DESC"
    cursor.execute(query, params)
    rows = cursor.fetchall()
    results = []
    for r in rows:
        results.append({
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
            "market_distribution": json.loads(r["market_distribution_json"] or "{}"),
            "factors": json.loads(r["factors_json"] or "[]"),
            "dns_records": json.loads(r["dns_records_json"] or "{}"),
            "logo_similarity": r["logo_similarity"],
            "is_official": bool(r["is_official"]),
            "detected_date": r["detected_date"],
            "updated_date": r["updated_date"],
            "takedown_notice": r["takedown_notice"]
        })
    conn.close()
    return results

def update_finding_status(finding_id: str, new_status: str) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE findings SET status = ? WHERE id = ?", (new_status, finding_id))
    conn.commit()
    updated = cursor.rowcount > 0
    conn.close()
    return updated

def add_brand(brand_data: Dict[str, Any]) -> int:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO brands (brand_name, official_website, official_logo_url, official_developer, official_handles_json, official_apps_json)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        brand_data["brand_name"],
        brand_data["official_website"],
        brand_data.get("official_logo_url", ""),
        brand_data.get("official_developer", ""),
        json.dumps(brand_data.get("official_handles", [])),
        json.dumps(brand_data.get("official_apps", []))
    ))
    conn.commit()
    new_id = cursor.lastrowid or 0
    conn.close()
    return new_id
