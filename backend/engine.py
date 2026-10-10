"""
Core Detection Engine in Python.
Provides Unicode Homoglyph detection, Jaro-Winkler similarity, and dynamic threat simulation.
"""

import unicodedata
import re
from typing import Dict, Any, List, Tuple, Optional

HOMOGLYPH_MAP = {
    'а': 'a', 'е': 'e', 'о': 'o', 'р': 'p', 'с': 'c', 'х': 'x', 'у': 'y', 'і': 'i', 'ј': 'j',
    'А': 'A', 'В': 'B', 'Е': 'E', 'К': 'K', 'М': 'M', 'Н': 'N', 'О': 'O', 'Р': 'P', 'С': 'C'
}

def check_homoglyph(text: str) -> Dict[str, Any]:
    has_homoglyph = False
    details = []
    normalized_chars = []

    for char in text:
        if char in HOMOGLYPH_MAP:
            has_homoglyph = True
            normalized_chars.append(HOMOGLYPH_MAP[char])
            details.append(f"'{char}' (Unicode U+{ord(char):04X}) -> '{HOMOGLYPH_MAP[char]}'")
        else:
            normalized_chars.append(char)

    return {
        "has_homoglyph": has_homoglyph,
        "details": ", ".join(details) if details else "No homoglyphs detected (Clean Latin string)",
        "normalized_text": "".join(normalized_chars)
    }

def jaro_winkler_similarity(s1: str, s2: str) -> float:
    s1 = s1.lower()
    s2 = s2.lower()
    if s1 == s2:
        return 1.0

    len1, len2 = len(s1), len(s2)
    if len1 == 0 or len2 == 0:
        return 0.0

    max_dist = max(len1, len2) // 2 - 1
    if max_dist < 0:
        max_dist = 0

    s1_matches = [False] * len1
    s2_matches = [False] * len2
    matches = 0

    for i in range(len1):
        start = max(0, i - max_dist)
        end = min(i + max_dist + 1, len2)
        for j in range(start, end):
            if s2_matches[j] or s1[i] != s2[j]:
                continue
            s1_matches[i] = True
            s2_matches[j] = True
            matches += 1
            break

    if matches == 0:
        return 0.0

    t = 0
    k = 0
    for i in range(len1):
        if not s1_matches[i]:
            continue
        while not s2_matches[k]:
            k += 1
        if s1[i] != s2[k]:
            t += 1
        k += 1

    transpositions = t / 2.0
    jaro = (matches / len1 + matches / len2 + (matches - transpositions) / matches) / 3.0

    prefix = 0
    for i in range(min(4, min(len1, len2))):
        if s1[i] == s2[i]:
            prefix += 1
        else:
            break

    return round((jaro + prefix * 0.1 * (1.0 - jaro)) * 100, 1)

def generate_threats_for_brand(brand_name: str, official_handles: List[str], official_apps: List[str]) -> Dict[str, Any]:
    clean_name = re.sub(r'[^a-zA-Z0-9]', '', brand_name)
    clean_lower = clean_name.lower()
    
    # 1. Social threats
    social_threats = [
        {
            "id": f"st-{clean_lower}-1",
            "brand_name": brand_name,
            "platform": "twitter",
            "handle": f"@{clean_name.replace('a', 'а')}_Giveaway",
            "account_name": f"{brand_name} Official Promo",
            "bio": f"Official {brand_name} community reward. DM support to claim your bonus voucher.",
            "follower_count": 18400,
            "avatar_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100",
            "risk_score": 96,
            "risk_level": "CRITICAL",
            "similarity_score": 94,
            "logo_similarity_score": 92,
            "has_homoglyph": True,
            "homoglyph_details": "Cyrillic 'а' (U+0430) spoofing Latin 'a'",
            "is_official": False,
            "status": "ACTIVE"
        },
        {
            "id": f"st-{clean_lower}-2",
            "brand_name": brand_name,
            "platform": "telegram",
            "handle": f"@{clean_name}_SupportDesk",
            "account_name": f"{brand_name} 24/7 Helpdesk",
            "bio": f"Fast customer verification for {brand_name}. Send seed phrase or credentials to unlock account.",
            "follower_count": 5200,
            "avatar_url": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100",
            "risk_score": 92,
            "risk_level": "CRITICAL",
            "similarity_score": 91,
            "logo_similarity_score": 85,
            "has_homoglyph": False,
            "homoglyph_details": None,
            "is_official": False,
            "status": "ACTIVE"
        },
        {
            "id": f"st-{clean_lower}-3",
            "brand_name": brand_name,
            "platform": "linkedin",
            "handle": f"company/{clean_lower}-careers-global",
            "account_name": f"{brand_name} Global Recruiting",
            "bio": f"Remote job openings at {brand_name}. Pay registration fee to receive employment kit.",
            "follower_count": 1420,
            "avatar_url": "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100",
            "risk_score": 78,
            "risk_level": "HIGH",
            "similarity_score": 83,
            "logo_similarity_score": 88,
            "has_homoglyph": False,
            "homoglyph_details": None,
            "is_official": False,
            "status": "ACTIVE"
        }
    ]

    # Add official handle as SAFE (0% False Positive test)
    if official_handles:
        first_handle = official_handles[0]
        social_threats.append({
            "id": f"st-{clean_lower}-safe",
            "brand_name": brand_name,
            "platform": "twitter",
            "handle": first_handle,
            "account_name": f"{brand_name} Official",
            "bio": f"Verified official channel for {brand_name}.",
            "follower_count": 450000,
            "avatar_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100",
            "risk_score": 0,
            "risk_level": "SAFE",
            "similarity_score": 100,
            "logo_similarity_score": 100,
            "has_homoglyph": False,
            "homoglyph_details": None,
            "is_official": True,
            "status": "SAFE"
        })

    # 2. App store threats
    app_store_threats = [
        {
            "id": f"app-{clean_lower}-1",
            "brand_name": brand_name,
            "store": "google_play",
            "app_id": f"com.fast.{clean_lower}.wallet",
            "app_name": f"{brand_name} Secure Mobile",
            "publisher_name": "Apex Global Fintech Labs",
            "icon_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100",
            "downloads": "50,000+",
            "rating": 2.1,
            "risk_score": 94,
            "risk_level": "CRITICAL",
            "icon_clone_score": 96,
            "is_publisher_mismatch": True,
            "is_official": False,
            "status": "ACTIVE"
        },
        {
            "id": f"app-{clean_lower}-2",
            "brand_name": brand_name,
            "store": "apple_app_store",
            "app_id": f"id9823471-{clean_lower}",
            "app_name": f"{brand_name} Rewards & Bonus",
            "publisher_name": "Digital Trend Marketing Ltd",
            "icon_url": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100",
            "downloads": "10,000+",
            "rating": 3.2,
            "risk_score": 85,
            "risk_level": "HIGH",
            "icon_clone_score": 89,
            "is_publisher_mismatch": True,
            "is_official": False,
            "status": "ACTIVE"
        }
    ]

    return {
        "social_threats": social_threats,
        "app_store_threats": app_store_threats
    }

def analyze_url(url: str, target_brand: str = "Digital Risk Protection Platform", official_website: str = "www.digitalriskprotection.com") -> Dict[str, Any]:
    from urllib.parse import urlparse
    parsed = urlparse(url.strip())
    hostname = (parsed.hostname or "").lower()
    path = parsed.path.lower()
    scheme = parsed.scheme.lower() or "http"

    # 1. Clean official check (0% FP)
    official_clean = official_website.replace("https://", "").replace("http://", "").replace("www.", "").split("/")[0].lower()
    host_clean = hostname.replace("www.", "")
    if host_clean == official_clean:
        return {
            "url": url,
            "hostname": hostname,
            "target_brand": target_brand,
            "is_official": True,
            "has_homoglyph": False,
            "ssl_valid": scheme == "https",
            "risk_score": 0,
            "risk_level": "SAFE",
            "threat_classification": "Official Corporate Website (Whitelisted)",
            "detected_keywords": [],
            "remediation_status": "No action needed. Whitelisted asset."
        }

    # 2. Homoglyph check on domain
    homo_res = check_homoglyph(hostname)
    has_homoglyph = homo_res["has_homoglyph"]

    # 3. Phishing triggers
    phishing_keywords = ["login", "signin", "verify", "airdrop", "claim", "bonus", "wallet", "seed", "support", "gift", "free", "portal", "oauth", "auth", "security", "update"]
    detected_kw = [kw for kw in phishing_keywords if kw in hostname or kw in path]

    # 4. Dangerous TLDs
    risky_tlds = [".xyz", ".top", ".online", ".site", ".click", ".buzz", ".club", ".biz", ".icu", ".cam", ".shop"]
    is_risky_tld = any(hostname.endswith(tld) for tld in risky_tlds)

    # 5. String similarity to brand
    clean_brand = re.sub(r'[^a-zA-Z0-9]', '', target_brand).lower()
    sim = jaro_winkler_similarity(clean_brand, homo_res["normalized_text"])

    # 6. Scoring calculation
    score = 0
    factors = []

    if has_homoglyph:
        score += 45
        factors.append(f"Unicode Confusable / Homoglyph ({homo_res['details']})")
    if detected_kw:
        score += 30
        factors.append(f"Phishing keywords detected: {', '.join(detected_kw)}")
    if is_risky_tld:
        score += 15
        factors.append("High-abuse registrar TLD (.shop / .online)")
    if scheme == "http":
        score += 10
        factors.append("Unencrypted connection (HTTP / No SSL certificate)")
    if sim > 70:
        score += 25
        factors.append(f"Brand name typosquatting similarity ({sim}%)")

    score = min(score, 100)
    if score == 0:
        score = 25

    risk_level = "Critical" if score >= 85 else ("High" if score >= 65 else ("Medium" if score >= 40 else "Low"))

    classification = "Phishing Credential Harvester" if "login" in detected_kw else (
        "Fake Bonus & Rewards Scam" if ("wallet" in detected_kw or "airdrop" in detected_kw or "claim" in detected_kw or "bonus" in detected_kw) else (
            "Homoglyph Domain Impersonation" if has_homoglyph else "Brand Typosquatting Site"
        )
    )

    takedown_notice = (
        f"FORMAL ABUSE & DMCA COMPLAINT\n"
        f"Target Domain: {hostname} ({url})\n"
        f"Infringed Brand: {target_brand}\n"
        f"Threat Classification: {classification}\n"
        f"Risk Criticality Score: {score}/100\n"
        f"Request: Immediate suspension of DNS resolution and hosting termination under Registrar Abuse Policies."
    )

    return {
        "url": url,
        "hostname": hostname,
        "target_brand": target_brand,
        "is_official": False,
        "has_homoglyph": has_homoglyph,
        "homoglyph_details": homo_res["details"],
        "ssl_valid": scheme == "https",
        "risk_score": score,
        "risk_level": risk_level,
        "threat_classification": classification,
        "detected_keywords": detected_kw,
        "factors": factors,
        "similarity_to_brand": sim,
        "takedown_notice": takedown_notice
    }

def analyze_apk(
    package_name: str,
    app_title: str,
    declared_permissions: List[str],
    publisher: str,
    target_brand: str = "Digital Risk Protection Platform",
    official_publishers: Optional[List[str]] = None,
    official_packages: Optional[List[str]] = None
) -> Dict[str, Any]:
    official_publishers = official_publishers or ["Digital Risk Protection Platform", "DRP Security Corp"]
    official_packages = official_packages or ["com.drp.platform.official", "id.drp.platform.ios"]

    # 1. Clean Whitelist Exclusion (0% FP)
    if package_name in official_packages and any(p.lower() in publisher.lower() for p in official_publishers):
        return {
            "package_name": package_name,
            "app_title": app_title,
            "publisher": publisher,
            "is_official": True,
            "risk_score": 0,
            "risk_level": "Low",
            "malware_family": "None (Verified Official App)",
            "flagged_permissions": [],
            "is_publisher_mismatch": False,
            "verdict": "Whitelisted Official Asset. Verified Publisher Signature."
        }

    # 2. Dangerous Android Permissions Audit
    DANGEROUS_PERMS = {
        "android.permission.RECEIVE_SMS": "Intercepts incoming SMS / OTP codes",
        "android.permission.READ_SMS": "Reads private SMS messages and 2FA tokens",
        "android.permission.SYSTEM_ALERT_WINDOW": "Injects fake phishing overlays on top of legitimate banking apps",
        "android.permission.BIND_ACCESSIBILITY_SERVICE": "Abuses Android Accessibility to log keystrokes and control device",
        "android.permission.REQUEST_INSTALL_PACKAGES": "Silently downloads and installs secondary payloads / droppers",
        "android.permission.RECORD_AUDIO": "Stealthily captures microphone audio",
        "android.permission.ACCESS_FINE_LOCATION": "Continuously tracks physical device coordinates",
        "android.permission.READ_CONTACTS": "Harvests contact lists for SMS spam spread"
    }

    flagged_perms = []
    for p in declared_permissions:
        clean_p = p.strip()
        matched = False
        for dang, desc in DANGEROUS_PERMS.items():
            if dang.endswith(clean_p) or clean_p in dang:
                flagged_perms.append({"permission": dang, "risk": desc})
                matched = True
                break
        if not matched and any(k in clean_p.upper() for k in ["SMS", "ALERT", "ACCESSIBILITY", "INSTALL", "OVERLAY"]):
            flagged_perms.append({"permission": clean_p, "risk": "High-privilege capability"})

    # 3. Publisher Mismatch
    is_mismatch = not any(p.lower() in publisher.lower() for p in official_publishers)

    # 4. Scoring & Malware Family
    score = 0
    if is_mismatch:
        score += 35
    score += len(flagged_perms) * 18

    perm_names = [f["permission"] for f in flagged_perms]
    has_sms = any("SMS" in p for p in perm_names)
    has_overlay = any("ALERT_WINDOW" in p or "OVERLAY" in p for p in perm_names)
    has_access = any("ACCESSIBILITY" in p for p in perm_names)
    has_dropper = any("INSTALL_PACKAGES" in p for p in perm_names)

    if has_sms and (has_overlay or has_access):
        malware_family = "Trojan-Banker.AndroidOS.Stealer"
        score = max(score, 95)
    elif has_dropper:
        malware_family = "Trojan-Dropper.AndroidOS.FakeInstaller"
        score = max(score, 88)
    elif has_access:
        malware_family = "Spyware.AndroidOS.KeyLogger"
        score = max(score, 90)
    elif is_mismatch and len(flagged_perms) >= 2:
        malware_family = "Adware.Riskware.Impersonator"
        score = max(score, 75)
    else:
        malware_family = "Suspicious.UnverifiedPublisher"
        score = max(score, 50)

    score = min(score, 100)
    risk_level = "Critical" if score >= 85 else ("High" if score >= 65 else "Medium")

    market_dist = {
        'Playstore': random.randint(0, 15) if is_mismatch else 25,
        'Appstore': 0,
        'ApkDl': random.randint(5, 20),
        'Apkgp': random.randint(2, 10),
        'Androidappsapk': random.randint(1, 8),
        'Total': 35
    }

    takedown_notice = (
        f"FORMAL GOOGLE PLAY PROTECT & ABUSE TAKEDOWN\n"
        f"Infringing Package: {package_name}\n"
        f"App Title: {app_title}\n"
        f"Unauthorized Publisher: {publisher}\n"
        f"Target Brand: {target_brand}\n"
        f"Classified Malware Family: {malware_family}\n"
        f"Critical Permissions: {', '.join([f['permission'].split('.')[-1] for f in flagged_perms])}\n"
        f"Request: Immediate removal from repository and device blacklisting via Play Protect."
    )

    return {
        "package_name": package_name,
        "app_title": app_title,
        "publisher": publisher,
        "target_brand": target_brand,
        "is_official": False,
        "is_publisher_mismatch": is_mismatch,
        "risk_score": score,
        "risk_level": risk_level,
        "malware_family": malware_family,
        "flagged_permissions": flagged_perms,
        "market_distribution": market_dist,
        "takedown_notice": takedown_notice
    }

def analyze_social(
    handle: str,
    platform: str,
    target_brand: str = "Digital Risk Protection Platform",
    official_handles: Optional[List[str]] = None
) -> Dict[str, Any]:
    official_handles = official_handles or ["@digitalriskprotection", "@drp_platform"]
    clean_handle = handle.strip()
    if not clean_handle.startswith("@") and platform.lower() in ["twitter", "x", "instagram"]:
        clean_handle = f"@{clean_handle}"

    # 1. Whitelist Check (0% FP)
    if any(h.lower() == clean_handle.lower() for h in official_handles):
        return {
            "handle": clean_handle,
            "platform": platform,
            "target_brand": target_brand,
            "is_official": True,
            "risk_score": 0,
            "risk_level": "Low",
            "verdict": "Whitelisted Official Account (0% False Positive)",
            "similarity_score": 100,
            "has_homoglyph": False,
            "reasons": []
        }

    # 2. Homoglyph check
    homo = check_homoglyph(clean_handle)
    has_homo = homo["has_homoglyph"]

    # 3. Phishing keywords in handle
    keywords = ["support", "help", "claim", "airdrop", "reward", "rewards", "care", "service", "24", "desk", "official"]
    detected_kw = [k for k in keywords if k in clean_handle.lower()]

    # 4. Jaro-Winkler Similarity
    primary_official = official_handles[0].replace("@", "")
    compare_target = homo["normalized_text"].replace("@", "")
    sim = jaro_winkler_similarity(primary_official, compare_target)

    score = 0
    reasons = []

    if has_homo:
        score += 45
        reasons.append(f"Unicode Confusable Homoglyph: {homo['details']}")
    if detected_kw:
        score += 30
        reasons.append(f"Affix keywords: {', '.join(detected_kw)}")
    if "_" in clean_handle or "-" in clean_handle:
        score += 15
        reasons.append("Spacing/delimiter variation")
    if sim > 75:
        score += 25
        reasons.append(f"High similarity to official handle ({sim}%)")

    score = min(score, 100)
    if score == 0:
        score = 30

    risk_level = "High" if score >= 75 else ("Medium" if score >= 50 else "Low")

    takedown_notice = (
        f"FORMAL SOCIAL MEDIA ABUSE COMPLAINT\n"
        f"Platform: {platform}\n"
        f"Impersonator Handle: {clean_handle}\n"
        f"Target Brand: {target_brand}\n"
        f"Evidence: {', '.join(reasons)}\n"
        f"Risk Score: {score}/100\n"
        f"Request: Immediate account suspension for brand impersonation and user deception."
    )

    return {
        "handle": clean_handle,
        "platform": platform,
        "target_brand": target_brand,
        "is_official": False,
        "risk_score": score,
        "risk_level": risk_level,
        "has_homoglyph": has_homo,
        "homoglyph_details": homo["details"],
        "similarity_score": sim,
        "detected_keywords": detected_kw,
        "reasons": reasons,
        "takedown_notice": takedown_notice
    }


