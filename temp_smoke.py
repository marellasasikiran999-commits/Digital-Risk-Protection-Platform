"""Temporary end-to-end smoke test for the DRP backend. Deleted after use."""

import json
import urllib.error
import urllib.request

BASE = "http://127.0.0.1:8000"


def call(method, path, payload=None):
    data = json.dumps(payload).encode() if payload is not None else None
    request = urllib.request.Request(BASE + path, data=data, method=method)
    if data:
        request.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            body = response.read().decode()
            return response.status, json.loads(body) if body.strip().startswith(("{", "[")) else body
    except urllib.error.HTTPError as exc:
        return exc.code, exc.read().decode()


def show(label, status, body, limit=400):
    preview = json.dumps(body)[:limit] if not isinstance(body, str) else body[:limit]
    print("[{0}] {1} -> {2}".format(status, label, preview))
    print("-" * 80)


failures = []

# 1. Root
status, body = call("GET", "/")
show("GET /", status, body)
if status != 200:
    failures.append("GET /")

# 2. Brands
status, body = call("GET", "/api/brands")
show("GET /api/brands", status, body)
if status != 200 or not isinstance(body, list) or not body:
    failures.append("GET /api/brands")
brand_id = body[0]["id"] if isinstance(body, list) and body else None

# 3. Social scan - the route the frontend actually calls
status, body = call("POST", "/api/scan/social", {"brand": "Digital Risk Protection Platform"})
show("POST /api/scan/social", status, body)
if status != 200 or body.get("flagged_count", 0) < 1 or body.get("whitelisted_count", 0) < 1:
    failures.append("POST /api/scan/social")

# 4. Legacy social alias
status, body = call("POST", "/api/scans/social", {"brand_name": "Digital Risk Protection Platform"})
show("POST /api/scans/social (alias)", status, body)
if status != 200:
    failures.append("POST /api/scans/social")

# 5. App scan - the route the frontend actually calls
status, body = call("POST", "/api/scan/appstore", {"brand": "Digital Risk Protection Platform"})
show("POST /api/scan/appstore", status, body)
if status != 200 or body.get("flagged_count", 0) < 1:
    failures.append("POST /api/scan/appstore")

# 6. Legacy app alias
status, body = call("POST", "/api/scans/apps", {"brand": "Digital Risk Protection Platform"})
show("POST /api/scans/apps (alias)", status, body)
if status != 200:
    failures.append("POST /api/scans/apps")

# 7. Findings list
status, body = call("GET", "/api/findings?brand=Digital%20Risk%20Protection%20Platform")
count = len(body) if isinstance(body, list) else 0
show("GET /api/findings -> {0} rows".format(count), status, body[:2] if isinstance(body, list) else body, 500)
if status != 200 or count == 0:
    failures.append("GET /api/findings")

social_rows = [f for f in body if f["finding_type"] == "social"] if isinstance(body, list) else []
app_rows = [f for f in body if f["finding_type"] == "app"] if isinstance(body, list) else []
official_social = [f for f in social_rows if f["is_official"]]
official_app = [f for f in app_rows if f["is_official"]]

# 8. Assert the whitelist rule holds (official assets never flagged)
for row in official_social + official_app:
    if row["risk_score"] != 0:
        failures.append("whitelist: {0} scored {1}".format(row["id"], row["risk_score"]))
print("Whitelist check -> {0} official social rows, {1} official app rows, all risk 0: {2}".format(
    len(official_social), len(official_app),
    all(r["risk_score"] == 0 for r in official_social + official_app)))
print("-" * 80)

# 9. Homoglyph detection sanity
homo = [f for f in social_rows if "Homoglyph" in f["title"] or "homoglyph" in f["category"].lower()]
print("Homoglyph rows detected: {0}".format(len(homo)))
if not homo:
    failures.append("homoglyph detection")
print("-" * 80)

# 10. Single finding detail
if social_rows:
    status, body = call("GET", "/api/findings/" + social_rows[0]["id"])
    show("GET /api/findings/{id}", status, body, 300)
    if status != 200:
        failures.append("GET /api/findings/{id}")

# 11. Patch status
if social_rows:
    target = [f for f in social_rows if not f["is_official"]][0]["id"]
    status, body = call("PATCH", "/api/findings/" + target, {"status": "Takedown"})
    show("PATCH /api/findings/{id}", status, body)
    if status != 200:
        failures.append("PATCH /api/findings/{id}")

# 12. Dashboard summary
status, body = call("GET", "/api/dashboard/summary?brand=Digital%20Risk%20Protection%20Platform")
show("GET /api/dashboard/summary", status, body, 500)
if status != 200 or "whitelisted_assets" not in (body or {}):
    failures.append("GET /api/dashboard/summary")

# 13. Look-alike variants (bonus)
status, body = call("GET", "/api/lookalike/variants?brand=Digital%20Risk%20Protection%20Platform")
techniques = body.get("techniques") if isinstance(body, dict) else None
variant_count = len(body.get("variants", [])) if isinstance(body, dict) else 0
show("GET /api/lookalike/variants -> {0} variants".format(variant_count), status, techniques)
if status != 200 or variant_count < 5:
    failures.append("GET /api/lookalike/variants")

# 14. Social handle audit
status, body = call("POST", "/api/audit/social", {"handle": "@drp_supp0rt24", "brand_name": "Digital Risk Protection Platform"})
show("POST /api/audit/social", status, body, 400)
if status != 200:
    failures.append("POST /api/audit/social")

# 15. URL analyze
status, body = call("POST", "/api/url/analyze", {"url": "drp-platform-login-claim.com", "brand_name": "Digital Risk Protection Platform"})
show("POST /api/url/analyze", status, body, 400)
if status != 200:
    failures.append("POST /api/url/analyze")

# 16. Findings create
status, body = call("POST", "/api/findings/create", {
    "brand_name": "Digital Risk Protection Platform",
    "finding_type": "domain",
    "title": "Smoke test domain",
    "candidate_name": "smoke-test.example",
    "risk_score": 70,
    "risk_level": "High",
})
show("POST /api/findings/create", status, body)
if status != 200:
    failures.append("POST /api/findings/create")

# 17. Package audit (offline path - no network needed for a bogus package)
status, body = call("POST", "/api/audit/package", {"package_name": "com.example.notarealapp", "brand_name": "Digital Risk Protection Platform"})
show("POST /api/audit/package", status, body, 400)
if status != 200:
    failures.append("POST /api/audit/package")

# 18. CSV export
status, body = call("GET", "/api/reports/export?brand=Digital%20Risk%20Protection%20Platform")
is_csv = isinstance(body, str) and "Finding ID" in body
show("GET /api/reports/export -> csv={0}".format(is_csv), status, body[:160])
if status != 200 or not is_csv:
    failures.append("GET /api/reports/export")

# 19. Brand create + update round trip
status, body = call("POST", "/api/brands", {
    "brand_name": "Smoke Test Brand",
    "official_website": "smoketest.example",
    "official_logo_url": "",
    "official_developer": "Smoke Test Ltd",
    "official_handles": ["@smoketest"],
    "official_apps": ["com.smoketest.app"],
})
show("POST /api/brands", status, body)
if status == 200:
    status2, body2 = call("GET", "/api/brands")
    new_id = next((b["id"] for b in body2 if b["brand_name"] == "Smoke Test Brand"), None)
    if new_id:
        status3, body3 = call("PUT", "/api/brands/{0}".format(new_id), {
            "brand_name": "Smoke Test Brand",
            "official_website": "smoketest.example",
            "official_logo_url": "",
            "official_developer": "Smoke Test Ltd v2",
            "official_handles": ["@smoketest"],
            "official_apps": ["com.smoketest.app"],
        })
        show("PUT /api/brands/{id}", status3, body3)
        if status3 != 200:
            failures.append("PUT /api/brands/{id}")
        status4, body4 = call("DELETE", "/api/brands/{0}".format(new_id))
        show("DELETE /api/brands/{id}", status4, body4)
        if status4 != 200:
            failures.append("DELETE /api/brands/{id}")
else:
    failures.append("POST /api/brands")

print("=" * 80)
print("FAILURES: {0}".format(failures if failures else "NONE - all endpoints healthy"))
