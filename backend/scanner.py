"""
Brand-driven impersonation scanner.

Generates look-alike candidate assets from the *official brand profile* and scores
each candidate against it. Official assets are always excluded from flagging so the
platform keeps a 0% false-positive rate on the brand's own accounts and apps.

Detection techniques (bonus: Look-alike Name Detection)
    HOMOGLYPH   - Unicode confusable character substitution (Cyrillic a -> Latin a)
    TYPO        - adjacent character swap inside the brand token
    AFFIX       - brand token + added word (_support24, _official, _giveaway)
    DELIMITER   - spacing / separator variation (brand-official, brand.official)
    DOUBLED     - doubled character (brrand)
"""

import re
from typing import Dict, Any, List, Optional

from engine import check_homoglyph, jaro_winkler_similarity

# --------------------------------------------------------------------------------------
# Look-alike variant generation
# --------------------------------------------------------------------------------------

# Cyrillic / Greek characters that render almost identically to Latin ones.
CONFUSABLES = {
    'a': '\u0430',  # CYRILLIC SMALL LETTER A
    'e': '\u0435',  # CYRILLIC SMALL LETTER IE
    'o': '\u043e',  # CYRILLIC SMALL LETTER O
    'p': '\u0440',  # CYRILLIC SMALL LETTER ER
    'c': '\u0441',  # CYRILLIC SMALL LETTER ES
    'x': '\u0445',  # CYRILLIC SMALL LETTER HA
    'y': '\u0443',  # CYRILLIC SMALL LETTER U
    'i': '\u0456',  # CYRILLIC SMALL LETTER BYELORUSSIAN-UKRAINIAN I
    'j': '\u0458',  # CYRILLIC SMALL LETTER JE
}

# Words commonly appended by scammers to an impersonated brand token.
SCAM_AFFIXES = [
    'support', 'support24', 'official', 'help', 'helpdesk', 'care',
    'service', 'claim', 'airdrop', 'reward', 'rewards', 'bonus',
    'giveaway', 'wallet', 'login', 'verify', 'security',
]

# Ordinary words that a legitimate third party might own. Used by the
# over-flagging guard required by the bonus "avoid over-flagging legitimate or
# normal names" clause.
BENIGN_TOKENS = {
    'news', 'daily', 'fan', 'fans', 'community', 'reviews', 'review',
    'tips', 'blog', 'store', 'shop', 'jobs', 'careers', 'india', 'usa',
    'global', 'world', 'group', 'team', 'club', 'forum',
}

CRITICAL_KEYWORDS = ['claim', 'airdrop', 'bonus', 'giveaway', 'reward', 'rewards', 'wallet', 'login', 'verify']
SUPPORT_KEYWORDS = ['support', 'help', 'helpdesk', 'care', 'service', 'desk']


def compact_brand(brand_name: str) -> str:
    """Lower-cased alphanumeric-only brand string (e.g. 'Digital Risk Protection' -> 'digitalriskprotection')."""
    return re.sub(r'[^a-z0-9]', '', brand_name.lower())


def brand_tokens(brand_name: str) -> List[str]:
    """Split a brand name into the distinct word tokens used for look-alike seeding."""
    tokens = re.split(r'[^A-Za-z0-9]+', brand_name)
    return [t.lower() for t in tokens if len(t) >= 4]


def to_homoglyph(text: str) -> tuple:
    """Replace the first available Latin character with its Cyrillic confusable."""
    chars = list(text)
    swapped = []
    for index, char in enumerate(chars):
        if char.lower() in CONFUSABLES:
            original = char
            chars[index] = CONFUSABLES[char.lower()]
            swapped.append((original, chars[index], "U+%04X" % ord(chars[index])))
            break
    return "".join(chars), swapped


def to_typo(text: str) -> tuple:
    """Swap two adjacent characters in the middle of the token."""
    if len(text) < 5:
        return text, []
    pivot = len(text) // 2
    chars = list(text)
    chars[pivot], chars[pivot + 1] = chars[pivot + 1], chars[pivot]
    return "".join(chars), [(text[pivot], chars[pivot], "adjacent swap")]


def to_double(text: str) -> tuple:
    """Double a character in the token ('brand' -> 'brrand')."""
    if len(text) < 4:
        return text, []
    pivot = 2
    return text[:pivot] + text[pivot] + text[pivot:], [(text[pivot], text[pivot] * 2, "doubled char")]


def generate_lookalike_variants(seed_token: str, include_benign: bool = False) -> List[Dict[str, Any]]:
    """
    Build the catalogue of look-alike name variants for a brand token.

    Returns a deterministic list of variant descriptors: the variant string, the
    technique label, and the confusable characters that were substituted.
    """
    token = seed_token.lower()
    variants: List[Dict[str, Any]] = []

    homoglyph, homoglyph_map = to_homoglyph(token)
    if homoglyph != token:
        variants.append({
            "variant": homoglyph,
            "technique": "Homoglyph (Unicode Swap)",
            "confusables": [{"original": o, "replaced": r, "codepoint": c} for o, r, c in homoglyph_map],
        })

    typo, typo_map = to_typo(token)
    if typo != token:
        variants.append({
            "variant": typo,
            "technique": "Typo (Character Swap)",
            "confusables": [{"original": o, "replaced": r, "codepoint": "adjacent"} for o, r, _ in typo_map],
        })

    doubled, doubled_map = to_double(token)
    if doubled != token:
        variants.append({
            "variant": doubled,
            "technique": "Double Character",
            "confusables": [{"original": o, "replaced": r, "codepoint": "doubled"} for o, r, _ in doubled_map],
        })

    for affix in SCAM_AFFIXES:
        variants.append({
            "variant": "%s_%s" % (token, affix),
            "technique": "Affix Insertion",
            "confusables": [],
        })

    variants.append({
        "variant": "%s-official" % token,
        "technique": "Delimiter Mod",
        "confusables": [{"original": "_", "replaced": "-", "codepoint": "separator"}],
    })
    variants.append({
        "variant": "%s.official" % token,
        "technique": "Delimiter Mod",
        "confusables": [{"original": "_", "replaced": ".", "codepoint": "separator"}],
    })

    if include_benign:
        for benign in sorted(BENIGN_TOKENS):
            variants.append({
                "variant": "%s%s" % (token, benign),
                "technique": "Benign Coexistence",
                "confusables": [],
            })

    return variants


# Numeric look-alikes scammers substitute into handles to dodge naive matching.
LEETSPEAK = {
    '0': 'o', '1': 'l', '3': 'e', '4': 'a', '5': 's', '7': 't',
    '8': 'b', '9': 'g', '$': 's', '@': 'a', '!': 'i',
}


def normalize_leetspeak(text: str) -> str:
    """Fold digit / symbol look-alikes back to letters so 'supp0rt' matches 'support'."""
    return "".join(LEETSPEAK.get(char, char) for char in text.lower())


def extract_keywords(variant: str) -> List[str]:
    """Return the reputation-damaging keywords present in a candidate handle."""
    lowered = normalize_leetspeak(variant)
    return [kw for kw in (CRITICAL_KEYWORDS + SUPPORT_KEYWORDS) if kw in lowered]


def is_benign_only(variant: str, seed_token: str) -> bool:
    """
    Over-flagging guard: a candidate whose only extra content is an ordinary
    word (news, fans, careers...) is treated as a normal, non-impersonating name.
    """
    lowered = variant.lower()
    remainder = lowered.replace(seed_token, "")
    if len(remainder) < 3:
        return False
    stripped = re.sub(r'[^a-z]', '', remainder)
    return stripped in BENIGN_TOKENS
# --------------------------------------------------------------------------------------
# Scoring
# --------------------------------------------------------------------------------------

def _as_handle_list(official_handles: Any) -> List[str]:
    """Normalise the official handle argument to a list of bare (unprefixed) handles."""
    if isinstance(official_handles, str):
        official_handles = [official_handles]
    return [h.lstrip('@') for h in (official_handles or []) if h]


def score_social_candidate(
    candidate_handle: str,
    official_handles: Any,
    brand_name: str,
) -> Dict[str, Any]:
    """
    Score one social handle against *all* of a brand's official handles.

    Every registered official handle is compared and the closest match drives
    the similarity signal. An exact match against any official handle
    short-circuits to risk 0 - the exclusion rule that keeps the brand's own
    accounts out of the flag list.
    """
    clean_candidate = candidate_handle.lstrip('@')
    officials = _as_handle_list(official_handles)
    primary_official = officials[0] if officials else compact_brand(brand_name)

    if any(clean_candidate.lower() == h.lower() for h in officials):
        return {
            "is_official": True,
            "risk_score": 0,
            "risk_level": "SAFE",
            "confidence": 100,
            "similarity": 100,
            "matched_official": primary_official,
            "has_homoglyph": False,
            "homoglyph_details": None,
            "keywords": [],
            "factors": [{"factor": "Exact match against a registered official account", "score": 0}],
            "verdict": "Whitelisted official account - excluded from flagging.",
        }

    homoglyph = check_homoglyph(clean_candidate)
    # Fold homoglyphs and digit look-alikes before comparing, so a handle such as
    # 'drp_supp0rt24' is compared in the same alphabet as the official handle.
    normalised = normalize_leetspeak(homoglyph["normalized_text"])

    best_similarity = 0.0
    best_official = primary_official
    for official in officials or [primary_official]:
        similarity = jaro_winkler_similarity(official, normalised)
        if similarity > best_similarity:
            best_similarity = similarity
            best_official = official

    keywords = extract_keywords(clean_candidate)

    # Brand-token containment: a handle built on the brand acronym or a brand
    # word is far more likely to be impersonation than an unrelated name.
    brand_acronym = "".join(word[0] for word in re.split(r'[^A-Za-z0-9]+', brand_name) if word)
    candidate_compact = re.sub(r'[^a-z0-9]', '', normalised)
    contains_brand_token = any(
        token in candidate_compact for token in brand_tokens(brand_name) if len(token) >= 5
    )
    contains_brand_acronym = (
        len(brand_acronym) >= 3
        and candidate_compact.startswith(brand_acronym.lower())
        and len(candidate_compact) > len(brand_acronym)
    )

    score = 0
    factors: List[Dict[str, Any]] = []

    if homoglyph["has_homoglyph"]:
        score += 42
        factors.append({"factor": "Unicode confusable homoglyph substitution", "score": 42})

    if keywords:
        weight = 30 if any(k in CRITICAL_KEYWORDS for k in keywords) else 20
        score += weight
        factors.append({"factor": "Scam keywords in handle: %s" % ", ".join(keywords), "score": weight})

    if contains_brand_acronym:
        score += 30
        factors.append({"factor": "Handle is built on the brand acronym '%s'" % brand_acronym.upper(), "score": 30})

    if contains_brand_token:
        score += 22
        factors.append({"factor": "Handle contains a brand name token", "score": 22})

    if '_' in clean_candidate or '-' in clean_candidate or '.' in clean_candidate:
        score += 12
        factors.append({"factor": "Delimiter / spacing variation on brand token", "score": 12})

    if best_similarity >= 78:
        score += 25
        factors.append({"factor": "High name similarity to '%s' (%s%%)" % (best_official, best_similarity), "score": 25})
    elif best_similarity >= 60:
        score += 15
        factors.append({"factor": "Partial name similarity to '%s' (%s%%)" % (best_official, best_similarity), "score": 15})

    seed = compact_brand(brand_name)[:6]
    if is_benign_only(clean_candidate, seed):
        score = int(score * 0.35)
        factors.append({"factor": "Ordinary-word suffix - downgraded to avoid over-flagging", "score": 0})

    score = min(score, 100)
    if score == 0:
        score = 20

    risk_level = "Critical" if score >= 85 else ("High" if score >= 65 else ("Medium" if score >= 40 else "Low"))

    return {
        "is_official": False,
        "risk_score": score,
        "risk_level": risk_level,
        "confidence": min(99, 60 + score // 3),
        "similarity": best_similarity,
        "matched_official": best_official,
        "has_homoglyph": homoglyph["has_homoglyph"],
        "homoglyph_details": homoglyph["details"],
        "keywords": keywords,
        "factors": factors,
        "verdict": "Brand impersonation candidate - flagged for triage.",
    }


def score_app_candidate(
    package_name: str,
    app_title: str,
    publisher: str,
    brand_name: str,
    official_publishers: List[str],
    official_packages: List[str],
    permissions: List[str],
    store: str,
) -> Dict[str, Any]:
    """
    Score one mobile application against the brand's official baseline.

    An official package published by an official publisher returns risk 0.
    """
    clean = package_name.strip().lower()
    is_official_pkg = clean in [p.lower() for p in official_packages]
    is_official_pub = any(p.lower() in publisher.lower() for p in official_publishers if p)

    if is_official_pkg and is_official_pub:
        return {
            "is_official": True,
            "risk_score": 0,
            "risk_level": "SAFE",
            "confidence": 100,
            "similarity": 100,
            "is_publisher_mismatch": False,
            "flagged_permissions": [],
            "factors": [{"factor": "Package ID and publisher both match the brand baseline", "score": 0}],
            "note": "Verified official application published by '%s'." % publisher,
        }

    flagged = []
    for perm in permissions:
        upper = perm.upper()
        if any(k in upper for k in ('SMS', 'ALERT_WINDOW', 'ACCESSIBILITY', 'INSTALL_PACKAGES',
                                    'QUERY_ALL_PACKAGES', 'RECORD_AUDIO')):
            flagged.append(perm)

    similarity = jaro_winkler_similarity(
        compact_brand(brand_name)[:8],
        clean.replace('com.', '').replace('org.', '').replace('.', '')
    )

    score = 0
    factors: List[Dict[str, Any]] = []

    if not is_official_pub:
        score += 35
        factors.append({"factor": "Publisher mismatch ('%s' is not an authorised publisher)" % publisher, "score": 35})

    if not is_official_pkg:
        score += 18
        factors.append({"factor": "Package ID does not match any registered official application", "score": 18})

    if flagged:
        weight = min(30, 12 * len(flagged))
        score += weight
        factors.append({"factor": "Invasive permissions requested: %s" % ", ".join(flagged[:3]), "score": weight})

    if store not in ('google_play', 'apple_app_store'):
        score += 14
        factors.append({"factor": "Distributed outside official app stores (APK mirror / sideload)", "score": 14})

    score = min(score, 100)
    risk_level = "Critical" if score >= 85 else ("High" if score >= 65 else ("Medium" if score >= 40 else "Low"))

    return {
        "is_official": False,
        "risk_score": score,
        "risk_level": risk_level,
        "confidence": min(99, 62 + score // 3),
        "similarity": similarity,
        "is_publisher_mismatch": not is_official_pub,
        "flagged_permissions": flagged,
        "factors": factors,
        "note": "Application '%s' is published by '%s', which is not an authorised publisher of %s."
                % (app_title, publisher, brand_name),
    }


def market_distribution(store: str) -> Dict[str, int]:
    """Static distribution split used by the evidence view."""
    return {
        "Playstore": 64 if store == "google_play" else 0,
        "Appstore": 78 if store == "apple_app_store" else 0,
        "ApkDl": 22 if store == "apkpure" else 6,
        "Apkgp": 8,
        "Androidappsapk": 4,
        "Total": 100,
    }


# --------------------------------------------------------------------------------------
# Candidate catalogue construction (brand-profile driven)
# --------------------------------------------------------------------------------------

SOCIAL_PLATFORMS = ['twitter', 'instagram', 'facebook', 'telegram', 'tiktok']

APP_PERMISSION_PROFILES = {
    "banking_trojan": ["RECEIVE_SMS", "READ_SMS", "SYSTEM_ALERT_WINDOW"],
    "dropper": ["REQUEST_INSTALL_PACKAGES", "QUERY_ALL_PACKAGES"],
    "spyware": ["BIND_ACCESSIBILITY_SERVICE", "RECORD_AUDIO", "ACCESS_FINE_LOCATION"],
    "adware": ["SYSTEM_ALERT_WINDOW"],
}


def build_social_candidates(brand_name: str, official_handles: List[str]) -> List[Dict[str, Any]]:
    """
    Create the social-media candidate pool for a brand.

    Every registered official handle is re-emitted as a SAFE row so the UI can
    visibly prove that official accounts are excluded from flagging.
    """
    handle_seed = official_handles[0].lstrip('@') if official_handles else compact_brand(brand_name)
    seed_token = re.sub(r'[^a-z0-9]', '', handle_seed.lower()) or compact_brand(brand_name)

    candidates: List[Dict[str, Any]] = []

    # 1. Official accounts -> always SAFE
    for index, handle in enumerate(official_handles):
        candidates.append({
            "handle": handle if handle.startswith('@') else "@%s" % handle,
            "platform": SOCIAL_PLATFORMS[index % len(SOCIAL_PLATFORMS)],
            "source": "Brand Baseline Whitelist",
            "is_official": True,
            "official_ref": handle,
            "technique": "Whitelisted Official Asset",
            "confusables": [],
            "descriptor": "official",
        })

    # 2. Look-alike variants -> scored as impersonators
    variant_plan = [
        ("homoglyph", "twitter", "official"),
        ("affix:claim", "telegram", "claim"),
        ("affix:support24", "instagram", "support24"),
        ("typo", "facebook", "helpdesk"),
        ("delimiter:-official", "twitter", "verify"),
        ("affix:airdrop", "telegram", "airdrop"),
        ("doubled", "tiktok", "reward"),
    ]

    variants = generate_lookalike_variants(seed_token)

    def variant_for(key: str) -> Optional[Dict[str, Any]]:
        if key == "homoglyph":
            for v in variants:
                if v["technique"].startswith("Homoglyph"):
                    return v
        if key == "typo":
            for v in variants:
                if v["technique"].startswith("Typo"):
                    return v
        if key == "doubled":
            for v in variants:
                if v["technique"].startswith("Double"):
                    return v
        if key.startswith("delimiter:"):
            suffix = key.split(":", 1)[1]
            for v in variants:
                if v["variant"] == "%s%s" % (seed_token, suffix):
                    return v
        if key.startswith("affix:"):
            affix = key.split(":", 1)[1]
            for v in variants:
                if v["variant"] == "%s_%s" % (seed_token, affix):
                    return v
        return None

    for plan_key, platform, descriptor in variant_plan:
        variant = variant_for(plan_key)
        if not variant:
            continue
        candidates.append({
            "handle": "@%s" % variant["variant"],
            "platform": platform,
            "source": "Social Crawler - %s" % variant["technique"],
            "is_official": False,
            "official_ref": official_handles[0] if official_handles else "@%s" % seed_token,
            "technique": variant["technique"],
            "confusables": variant["confusables"],
            "descriptor": descriptor,
        })

    # 3. Benign third-party name that must NOT be over-flagged
    candidates.append({
        "handle": "@%snews" % seed_token,
        "platform": "twitter",
        "source": "Social Crawler - Over-flagging guard",
        "is_official": False,
        "official_ref": official_handles[0] if official_handles else "@%s" % seed_token,
        "technique": "Benign Coexistence",
        "confusables": [],
        "descriptor": "news",
    })

    return candidates


def build_app_candidates(
    brand_name: str,
    official_apps: List[str],
    official_publishers: List[str],
) -> List[Dict[str, Any]]:
    """Create the app-store candidate pool: official apps (safe) + impersonators."""
    compact = compact_brand(brand_name) or "brand"
    short = compact[:6]

    candidates: List[Dict[str, Any]] = []

    # 1. Official apps -> always SAFE
    for package in official_apps:
        candidates.append({
            "package_name": package,
            "app_title": brand_name,
            "publisher": official_publishers[0] if official_publishers else brand_name,
            "store": "apple_app_store" if package.startswith("id.") else "google_play",
            "permissions": ["INTERNET", "ACCESS_NETWORK_STATE"],
            "is_official": True,
        })

    # 2. Impersonator catalogue
    impersonators = [
        {
            "package_name": "com.fake.%s.rewards" % short,
            "app_title": "%s Rewards & Bonus" % brand_name,
            "publisher": "Global Trend Mobile",
            "store": "google_play",
            "permissions": APP_PERMISSION_PROFILES["banking_trojan"],
        },
        {
            "package_name": "com.fast.%s.wallet" % short,
            "app_title": "%s Secure Mobile" % brand_name,
            "publisher": "Apex Global Fintech Labs",
            "store": "google_play",
            "permissions": APP_PERMISSION_PROFILES["spyware"],
        },
        {
            "package_name": "id.%s.pro.fake" % short,
            "app_title": "%s Pro" % brand_name,
            "publisher": "DevApex Studio",
            "store": "apple_app_store",
            "permissions": ["CAMERA", "ACCESS_FINE_LOCATION"],
        },
        {
            "package_name": "com.%s.support.helper" % short,
            "app_title": "%s Fast Support" % brand_name,
            "publisher": "Shanghai Media Syndicate",
            "store": "apkpure",
            "permissions": ["REQUEST_INSTALL_PACKAGES"] + APP_PERMISSION_PROFILES["banking_trojan"],
        },
    ]

    for entry in impersonators:
        candidates.append(dict(entry, is_official=False))

    return candidates
