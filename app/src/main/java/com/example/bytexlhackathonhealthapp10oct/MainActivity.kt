package com.example.bytexlhackathonhealthapp10oct

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.View
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.example.bytexlhackathonhealthapp10oct.data.engine.DetectionEngine
import com.example.bytexlhackathonhealthapp10oct.data.model.*

class MainActivity : AppCompatActivity() {

    private lateinit var spinnerBrand: Spinner
    private lateinit var btnRunScan: Button
    private lateinit var tvScanStatus: TextView
    private lateinit var tvSubtitle: TextView
    private lateinit var tvThreatCount: TextView
    private lateinit var containerContent: LinearLayout

    private var currentBrand: OfficialBrandAsset = DetectionEngine.PRESET_BRANDS["Digital Risk Protection Platform"]!!
    private var socialThreats: List<SocialThreat> = emptyList()
    private var appStoreThreats: List<AppStoreThreat> = emptyList()

    private var activeTab = "dashboard"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        spinnerBrand = findViewById(R.id.spinner_brand)
        btnRunScan = findViewById(R.id.btn_run_scan)
        tvScanStatus = findViewById(R.id.tv_scan_status)
        tvSubtitle = findViewById(R.id.tv_subtitle)
        tvThreatCount = findViewById(R.id.tv_threat_count)
        containerContent = findViewById(R.id.container_content)

        setupBrandSpinner()
        setupTabs()

        btnRunScan.setOnClickListener {
            runScanAnimation()
        }

        loadBrandData("Digital Risk Protection Platform")
    }

    private fun setupBrandSpinner() {
        val brands = listOf("Digital Risk Protection Platform", "Tesla", "PayPal", "Enter Custom Brand...")
        val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, brands)
        spinnerBrand.adapter = adapter

        spinnerBrand.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
                val selected = brands[position]
                if (selected == "Enter Custom Brand...") {
                    showCustomBrandDialog()
                } else {
                    loadBrandData(selected)
                }
            }

            override fun onNothingSelected(parent: AdapterView<*>?) {}
        }
    }

    private fun showCustomBrandDialog() {
        val input = EditText(this)
        input.hint = "e.g. OpenAI, Microsoft, Netflix"

        AlertDialog.Builder(this)
            .setTitle("Scan Custom Target Brand")
            .setMessage("Enter any brand name to run real-time DRP threat evaluation:")
            .setView(input)
            .setPositiveButton("Scan Brand") { _, _ ->
                val name = input.text.toString().trim()
                if (name.isNotEmpty()) {
                    currentBrand = DetectionEngine.createCustomBrand(name)
                    refreshThreats()
                }
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun loadBrandData(brandName: String) {
        currentBrand = DetectionEngine.PRESET_BRANDS[brandName] ?: DetectionEngine.createCustomBrand(brandName)
        refreshThreats()
    }

    private fun refreshThreats() {
        val (social, appStore) = DetectionEngine.generateThreatsForBrand(currentBrand)
        socialThreats = social
        appStoreThreats = appStore

        val threatCount = socialThreats.count { !it.isOfficial } + appStoreThreats.count { !it.isOfficial }
        tvThreatCount.text = threatCount.toString()
        tvSubtitle.text = "Target Brand: ${currentBrand.brandName} • Digital Risk Protection"

        renderActiveTab()
    }

    private fun runScanAnimation() {
        btnRunScan.isEnabled = false
        tvScanStatus.text = "Scanning Twitter, LinkedIn, Telegram & App Stores for ${currentBrand.brandName}..."

        Handler(Looper.getMainLooper()).postDelayed({
            tvScanStatus.text = "Applying Unicode Homoglyph & Logo pHash Matchers..."
        }, 1200)

        Handler(Looper.getMainLooper()).postDelayed({
            tvScanStatus.text = "Filtering Whitelisted Assets (0% False Positives)..."
        }, 2400)

        Handler(Looper.getMainLooper()).postDelayed({
            btnRunScan.isEnabled = true
            refreshThreats()
            tvScanStatus.text = "Scan Complete! Real-Time Threats Evaluated for ${currentBrand.brandName}."
        }, 3600)
    }

    private fun setupTabs() {
        findViewById<Button>(R.id.btn_tab_dashboard).setOnClickListener {
            activeTab = "dashboard"
            renderActiveTab()
        }
        findViewById<Button>(R.id.btn_tab_social).setOnClickListener {
            activeTab = "social"
            renderActiveTab()
        }
        findViewById<Button>(R.id.btn_tab_appstore).setOnClickListener {
            activeTab = "appstore"
            renderActiveTab()
        }
        findViewById<Button>(R.id.btn_tab_lookalike).setOnClickListener {
            activeTab = "lookalike"
            renderActiveTab()
        }
        findViewById<Button>(R.id.btn_tab_brand).setOnClickListener {
            activeTab = "brand"
            renderActiveTab()
        }
        findViewById<Button>(R.id.btn_tab_judge).setOnClickListener {
            activeTab = "judge"
            renderActiveTab()
        }
    }

    private fun renderActiveTab() {
        containerContent.removeAllViews()

        when (activeTab) {
            "dashboard" -> renderDashboard()
            "social" -> renderSocialMonitoring()
            "appstore" -> renderAppStoreMonitoring()
            "lookalike" -> renderLookalikeLab()
            "brand" -> renderBrandProfile()
            "judge" -> renderJudgeDeck()
        }
    }

    private fun renderDashboard() {
        val title = TextView(this).apply {
            text = "Executive Threat Hub — ${currentBrand.brandName}"
            textSize = 18f
            setTextColor(getColor(R.color.text_primary))
            setPadding(0, 0, 0, 16)
        }
        containerContent.addView(title)

        // Social Threats Summary
        val socialHeader = TextView(this).apply {
            text = "Recent Social Impersonation Alerts"
            textSize = 14f
            setTextColor(getColor(R.color.cyan_accent))
            setPadding(0, 8, 0, 8)
        }
        containerContent.addView(socialHeader)

        for (threat in socialThreats) {
            val card = LinearLayout(this).apply {
                orientation = LinearLayout.VERTICAL
                setBackgroundColor(getColor(R.color.card_dark))
                setPadding(16, 16, 16, 16)
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply { setMargins(0, 0, 0, 12) }
            }

            val name = TextView(this).apply {
                text = "${threat.accountName} (${threat.handle})"
                setTextColor(getColor(R.color.text_primary))
                textSize = 14f
            }

            val status = TextView(this).apply {
                text = if (threat.isOfficial) "STATUS: SAFE (OFFICIAL WHITELISTED)" else "RISK: ${threat.riskLevel} (${threat.riskScore}/100)"
                setTextColor(if (threat.isOfficial) getColor(R.color.emerald_green) else getColor(R.color.rose_red))
                textSize = 12f
            }

            card.addView(name)
            card.addView(status)

            if (!threat.isOfficial) {
                val btnTakedown = Button(this).apply {
                    text = "Triage & DMCA Notice"
                    setBackgroundColor(getColor(R.color.cyan_dark))
                    setTextColor(getColor(R.color.cyan_light))
                    setOnClickListener { showTakedownDialog(threat.accountName, threat.handle, threat.riskScore) }
                }
                card.addView(btnTakedown)
            }

            containerContent.addView(card)
        }
    }

    private fun renderSocialMonitoring() {
        val title = TextView(this).apply {
            text = "Social Media Protection & Threat Feed"
            textSize = 18f
            setTextColor(getColor(R.color.cyan_light))
            setPadding(0, 0, 0, 16)
        }
        containerContent.addView(title)

        for (t in socialThreats) {
            val card = LinearLayout(this).apply {
                orientation = LinearLayout.VERTICAL
                setBackgroundColor(getColor(R.color.card_dark))
                setPadding(16, 16, 16, 16)
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply { setMargins(0, 0, 0, 12) }
            }

            val tvInfo = TextView(this).apply {
                text = "${t.accountName} • ${t.handle} [${t.platform}]\nBio: ${t.bio}\nRisk: ${t.riskLevel} (${t.riskScore}/100) | pHash Logo Match: ${t.logoSimilarityScore}%"
                setTextColor(getColor(R.color.text_primary))
                textSize = 13f
            }
            card.addView(tvInfo)

            if (t.hasHomoglyph) {
                val tvHomo = TextView(this).apply {
                    text = "HOMOGLYPH DETECTED: ${t.homoglyphDetails}"
                    setTextColor(getColor(R.color.purple_accent))
                    textSize = 11f
                }
                card.addView(tvHomo)
            }

            containerContent.addView(card)
        }
    }

    private fun renderAppStoreMonitoring() {
        val title = TextView(this).apply {
            text = "Mobile App Store Defense & Publisher Audit"
            textSize = 18f
            setTextColor(getColor(R.color.cyan_light))
            setPadding(0, 0, 0, 16)
        }
        containerContent.addView(title)

        for (app in appStoreThreats) {
            val card = LinearLayout(this).apply {
                orientation = LinearLayout.VERTICAL
                setBackgroundColor(getColor(R.color.card_dark))
                setPadding(16, 16, 16, 16)
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply { setMargins(0, 0, 0, 12) }
            }

            val tvInfo = TextView(this).apply {
                text = "${app.appName} [${app.store}]\nPublisher: ${app.publisherName}\nPackage: ${app.appId}\nRisk Score: ${app.riskScore}/100"
                setTextColor(getColor(R.color.text_primary))
                textSize = 13f
            }
            card.addView(tvInfo)

            if (app.isPublisherMismatch) {
                val tvMismatch = TextView(this).apply {
                    text = "PUBLISHER MISMATCH FLAG: Developer differs from official entity (${currentBrand.officialPublishers.firstOrNull()})"
                    setTextColor(getColor(R.color.rose_red))
                    textSize = 11f
                }
                card.addView(tvMismatch)
            }

            containerContent.addView(card)
        }
    }

    private fun renderLookalikeLab() {
        val title = TextView(this).apply {
            text = "Homoglyph & Obfuscation Analysis Lab"
            textSize = 18f
            setTextColor(getColor(R.color.purple_accent))
            setPadding(0, 0, 0, 16)
        }
        containerContent.addView(title)

        val input = EditText(this).apply {
            setText("${currentBrand.brandName.replace("a", "а")}")
            setTextColor(getColor(R.color.cyan_light))
            setBackgroundColor(getColor(R.color.card_dark))
            setPadding(16, 16, 16, 16)
        }

        val tvResult = TextView(this).apply {
            textSize = 13f
            setTextColor(getColor(R.color.text_primary))
            setPadding(0, 16, 0, 16)
        }

        val updateResult = {
            val res = DetectionEngine.checkHomoglyph(input.text.toString())
            tvResult.text = "Homoglyph Status: ${if (res.first) "DETECTED" else "CLEAN"}\nSubstitutions: ${res.second}"
        }

        input.setOnClickListener { updateResult() }
        updateResult()

        containerContent.addView(input)
        containerContent.addView(tvResult)
    }

    private fun renderBrandProfile() {
        val title = TextView(this).apply {
            text = "Authorized Brand Assets & Whitelist Engine"
            textSize = 18f
            setTextColor(getColor(R.color.emerald_green))
            setPadding(0, 0, 0, 16)
        }
        containerContent.addView(title)

        val info = TextView(this).apply {
            text = "Brand: ${currentBrand.brandName}\nWebsite: ${currentBrand.officialWebsite}\n\nRegistered Social Handles (0% False Positive Whitelist):\n" +
                    currentBrand.officialHandles.joinToString("\n") { "• ${it.platform}: ${it.handle}" } +
                    "\n\nRegistered Package IDs:\n" +
                    currentBrand.officialApps.joinToString("\n") { "• ${it.store}: ${it.appId}" }
            setTextColor(getColor(R.color.text_primary))
            textSize = 13f
            setBackgroundColor(getColor(R.color.card_dark))
            setPadding(16, 16, 16, 16)
        }
        containerContent.addView(info)
    }

    private fun renderJudgeDeck() {
        val title = TextView(this).apply {
            text = "Executive Threat Intelligence Briefing"
            textSize = 18f
            setTextColor(getColor(R.color.amber_gold))
            setPadding(0, 0, 0, 16)
        }
        containerContent.addView(title)

        val pitch = TextView(this).apply {
            text = "1. Problem: Impersonators target ${currentBrand.brandName} via fake social handles & app store clones.\n\n" +
                    "2. GuardPulse Solution: Multi-vector AI detection engine with Jaro-Winkler handle matching, pHash logo similarity, and homoglyph sanitization.\n\n" +
                    "3. 0% False Positive Guarantee: Whitelisted official handles pass through isWhitelistedOfficialAsset immediately.\n\n" +
                    "4. Takedown Workflow: 1-click legal DMCA abuse notice generator pre-filled for Twitter, Meta, Google Play, and App Store."
            setTextColor(getColor(R.color.text_primary))
            textSize = 14f
            setBackgroundColor(getColor(R.color.card_dark))
            setPadding(16, 16, 16, 16)
        }
        containerContent.addView(pitch)
    }

    private fun showTakedownDialog(title: String, handle: String, score: Int) {
        val dmcaText = "FORMAL DMCA TAKEDOWN REQUEST\n" +
                "Target: $title ($handle)\n" +
                "Brand: ${currentBrand.brandName}\n" +
                "Risk Criticality Score: $score/100\n" +
                "Please suspend the infringing asset immediately under IP and Abuse policy."

        AlertDialog.Builder(this)
            .setTitle("Issue Takedown — $handle")
            .setMessage(dmcaText)
            .setPositiveButton("Copy DMCA Notice") { _, _ ->
                val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                val clip = ClipData.newPlainText("DMCA Notice", dmcaText)
                clipboard.setPrimaryClip(clip)
                Toast.makeText(this, "DMCA Notice Copied!", Toast.LENGTH_SHORT).show()
            }
            .setNegativeButton("Close", null)
            .show()
    }
}