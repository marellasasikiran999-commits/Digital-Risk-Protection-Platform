package com.example.bytexlhackathonhealthapp10oct.data.engine

import com.example.bytexlhackathonhealthapp10oct.data.model.*
import java.util.Locale

object DetectionEngine {

    private val HOMOGLYPH_MAP = mapOf(
        'а' to 'a', 'е' to 'e', 'о' to 'o', 'р' to 'p', 'с' to 'c', 'х' to 'x', 'у' to 'y', 'і' to 'i', 'ј' to 'j',
        'А' to 'A', 'В' to 'B', 'Е' to 'E', 'К' to 'K', 'М' to 'M', 'Н' to 'N', 'О' to 'O', 'Р' to 'P', 'С' to 'C'
    )

    val PRESET_BRANDS = mapOf(
        "Digital Risk Protection Platform" to OfficialBrandAsset(
            brandName = "Digital Risk Protection Platform",
            alternateNames = listOf("Digital Risk Protection", "DRP Platform", "DRP Enterprise"),
            officialLogoUrl = "https://digitalriskprotection.com/logo.png",
            officialWebsite = "https://www.digitalriskprotection.com",
            officialHandles = listOf(
                OfficialHandle("Twitter", "@digitalriskprotection", "https://x.com/digitalriskprotection"),
                OfficialHandle("LinkedIn", "company/digital-risk-protection", "https://linkedin.com/company/digital-risk-protection"),
                OfficialHandle("Instagram", "@drp_platform", "https://instagram.com/drp_platform")
            ),
            officialApps = listOf(
                OfficialApp("Google Play", "com.drp.platform.official", "Digital Risk Protection Platform", "Digital Risk Protection Platform")
            ),
            officialPublishers = listOf("Digital Risk Protection Platform", "DRP Security Corp")
        ),
        "Tesla" to OfficialBrandAsset(
            brandName = "Tesla",
            alternateNames = listOf("Tesla Motors", "Tesla Energy"),
            officialLogoUrl = "https://tesla.com/logo.png",
            officialWebsite = "https://tesla.com",
            officialHandles = listOf(
                OfficialHandle("Twitter", "@Tesla", "https://x.com/Tesla"),
                OfficialHandle("Instagram", "@teslamotors", "https://instagram.com/teslamotors")
            ),
            officialApps = listOf(
                OfficialApp("Google Play", "com.teslamotors.tesla", "Tesla Official", "Tesla, Inc.")
            ),
            officialPublishers = listOf("Tesla, Inc.", "Tesla Motors")
        ),
        "PayPal" to OfficialBrandAsset(
            brandName = "PayPal",
            alternateNames = listOf("PayPal Inc", "PayPal Money"),
            officialLogoUrl = "https://paypal.com/logo.png",
            officialWebsite = "https://paypal.com",
            officialHandles = listOf(
                OfficialHandle("Twitter", "@PayPal", "https://x.com/PayPal")
            ),
            officialApps = listOf(
                OfficialApp("Google Play", "com.paypal.android.p2pmobile", "PayPal", "PayPal Mobile")
            ),
            officialPublishers = listOf("PayPal Mobile", "PayPal, Inc.")
        )
    )

    fun createCustomBrand(name: String): OfficialBrandAsset {
        val clean = name.trim()
        val cleanId = clean.lowercase(Locale.ROOT).replace(Regex("[^a-z0-9]"), "")
        return OfficialBrandAsset(
            brandName = clean,
            alternateNames = listOf(clean, "$clean Corp"),
            officialLogoUrl = "https://$cleanId.com/logo.png",
            officialWebsite = "https://$cleanId.com",
            officialHandles = listOf(
                OfficialHandle("Twitter", "@$cleanId", "https://x.com/$cleanId"),
                OfficialHandle("LinkedIn", "company/$cleanId", "https://linkedin.com/company/$cleanId")
            ),
            officialApps = listOf(
                OfficialApp("Google Play", "com.$cleanId.app", "$clean App", "$clean Inc.")
            ),
            officialPublishers = listOf("$clean Inc.", "$clean Corp")
        )
    }

    fun checkHomoglyph(text: String): Pair<Boolean, String> {
        var hasHomoglyph = false
        val details = StringBuilder()
        for (ch in text) {
            if (HOMOGLYPH_MAP.containsKey(ch)) {
                hasHomoglyph = true
                details.append("'$ch' (Unicode) -> '${HOMOGLYPH_MAP[ch]}', ")
            }
        }
        return Pair(hasHomoglyph, if (hasHomoglyph) details.toString().dropLast(2) else "Clean")
    }

    fun generateThreatsForBrand(brandAsset: OfficialBrandAsset): Pair<List<SocialThreat>, List<AppStoreThreat>> {
        val name = brandAsset.brandName
        val clean = name.replace(Regex("[^a-zA-Z0-9]"), "")

        val social = listOf(
            SocialThreat(
                id = "st-1",
                platform = "Twitter",
                handle = "@${clean.replace("a", "а")}_Giveaway", // Cyrillic homoglyph
                accountName = "$name Official Airdrop",
                bio = "Official $name promotion & token giveaway! Contact 24/7 support to claim reward.",
                followerCount = 18400,
                postCount = 42,
                createdDate = "2026-09-20",
                detectionDate = "2026-10-10",
                riskLevel = "CRITICAL",
                riskScore = 97,
                nameSimilarityScore = 96,
                logoSimilarityScore = 98,
                hasHomoglyph = true,
                homoglyphDetails = "'а' (Cyrillic U+0430) swapped for 'a'",
                phishingKeywordsFound = listOf("airdrop", "giveaway", "claim", "free", "support"),
                status = "FLAGGED",
                isOfficial = false
            ),
            SocialThreat(
                id = "st-2",
                platform = "Twitter",
                handle = "@${clean}_Helpdesk",
                accountName = "$name Customer Support",
                bio = "Official 24/7 Helpdesk for $name users. DM for verification & refund help.",
                followerCount = 3200,
                postCount = 112,
                createdDate = "2026-10-01",
                detectionDate = "2026-10-10",
                riskLevel = "HIGH",
                riskScore = 88,
                nameSimilarityScore = 92,
                logoSimilarityScore = 84,
                hasHomoglyph = false,
                phishingKeywordsFound = listOf("helpdesk", "support", "verification"),
                status = "FLAGGED",
                isOfficial = false
            ),
            SocialThreat(
                id = "st-3",
                platform = "Telegram",
                handle = "@${clean}_VIP_Official",
                accountName = "$name Global Community",
                bio = "Official Telegram hub for $name investors. Deposit ETH to participate in private round.",
                followerCount = 12500,
                postCount = 380,
                createdDate = "2026-09-12",
                detectionDate = "2026-10-10",
                riskLevel = "CRITICAL",
                riskScore = 95,
                nameSimilarityScore = 95,
                logoSimilarityScore = 96,
                hasHomoglyph = false,
                phishingKeywordsFound = listOf("official", "deposit", "vip"),
                status = "FLAGGED",
                isOfficial = false
            ),
            SocialThreat(
                id = "st-official-1",
                platform = brandAsset.officialHandles.firstOrNull()?.platform ?: "Twitter",
                handle = brandAsset.officialHandles.firstOrNull()?.handle ?: "@${clean.lowercase()}",
                accountName = name,
                bio = "Official verified channel for $name. Access official portal at ${brandAsset.officialWebsite}",
                followerCount = 85000,
                postCount = 1240,
                createdDate = "2023-01-10",
                detectionDate = "2026-10-10",
                riskLevel = "SAFE",
                riskScore = 0,
                nameSimilarityScore = 100,
                logoSimilarityScore = 100,
                hasHomoglyph = false,
                phishingKeywordsFound = emptyList(),
                status = "WHITELISTED",
                isOfficial = true
            )
        )

        val appStore = listOf(
            AppStoreThreat(
                id = "app-1",
                store = "Google Play",
                appName = "$name Mobile Portal",
                appId = "com.${clean.lowercase()}.mobile.scam",
                publisherName = "Global App Studio LLC", // Mismatch
                rating = 2.3f,
                downloadsCount = "10,000+",
                updatedDate = "2026-10-02",
                descriptionSnippet = "Connect your account to access the $name portal directly on Android.",
                riskLevel = "CRITICAL",
                riskScore = 96,
                nameSimilarityScore = 94,
                logoSimilarityScore = 97,
                isPublisherMismatch = true,
                suspiciousPermissions = listOf("READ_SMS", "SYSTEM_ALERT_WINDOW"),
                status = "FLAGGED",
                isOfficial = false
            ),
            AppStoreThreat(
                id = "app-official-1",
                store = brandAsset.officialApps.firstOrNull()?.store ?: "Google Play",
                appName = brandAsset.officialApps.firstOrNull()?.appName ?: "$name Official App",
                appId = brandAsset.officialApps.firstOrNull()?.appId ?: "com.${clean.lowercase()}.app",
                publisherName = brandAsset.officialPublishers.firstOrNull() ?: "$name Inc.",
                rating = 4.8f,
                downloadsCount = "100,000+",
                updatedDate = "2026-10-01",
                descriptionSnippet = "Official mobile app for $name.",
                riskLevel = "SAFE",
                riskScore = 0,
                nameSimilarityScore = 100,
                logoSimilarityScore = 100,
                isPublisherMismatch = false,
                suspiciousPermissions = emptyList(),
                status = "WHITELISTED",
                isOfficial = true
            )
        )

        return Pair(social, appStore)
    }
}
