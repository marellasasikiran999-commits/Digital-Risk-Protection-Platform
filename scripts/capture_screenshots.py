import os
import time
from playwright.sync_api import sync_playwright

os.makedirs('docs/images', exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1600, 'height': 1000})
    page.goto('http://localhost:5173', wait_until='networkidle')
    time.sleep(3)
    
    # 1. Executive Dashboard
    page.screenshot(path='docs/images/01_executive_dashboard.png')
    print('Captured 01_executive_dashboard.png')
    
    # 2. 3D Threat Globe
    page.locator('button:has-text("3D Threat Globe")').click()
    time.sleep(2)
    page.screenshot(path='docs/images/02_3d_threat_globe.png')
    print('Captured 02_3d_threat_globe.png')
    
    # 3. Brand Baseline
    page.locator('button:has-text("Brand Baseline")').first.click()
    time.sleep(1)
    page.screenshot(path='docs/images/03_brand_baseline_manager.png')
    print('Captured 03_brand_baseline_manager.png')
    
    # 4. Threat Triage Feed
    page.locator('button:has-text("Threat Triage Feed")').first.click()
    time.sleep(1)
    page.screenshot(path='docs/images/04_threat_triage_feed.png')
    print('Captured 04_threat_triage_feed.png')

    # 5. Look-alike AI Engine
    page.locator('button:has-text("Look-alike AI Engine")').first.click()
    time.sleep(1)
    page.screenshot(path='docs/images/05_lookalike_ai_lab.png')
    print('Captured 05_lookalike_ai_lab.png')

    # 6. App Store Monitor
    page.locator('button:has-text("App Store Monitor")').first.click()
    time.sleep(1)
    page.screenshot(path='docs/images/06_appstore_monitoring.png')
    print('Captured 06_appstore_monitoring.png')

    # 7. Phishing Inspector
    page.locator('button:has-text("Phishing Inspector")').first.click()
    time.sleep(1)
    page.screenshot(path='docs/images/07_phishing_url_inspector.png')
    print('Captured 07_phishing_url_inspector.png')

    # 8. APK Malware Sandbox
    page.locator('button:has-text("APK Malware Sandbox")').first.click()
    time.sleep(1)
    page.screenshot(path='docs/images/08_apk_malware_sandbox.png')
    print('Captured 08_apk_malware_sandbox.png')

    # 9. Incident Reports
    page.locator('button:has-text("Incident Reports")').first.click()
    time.sleep(1)
    page.screenshot(path='docs/images/09_incident_reports_takedowns.png')
    print('Captured 09_incident_reports_takedowns.png')

    browser.close()
    print('All screenshots captured successfully!')
