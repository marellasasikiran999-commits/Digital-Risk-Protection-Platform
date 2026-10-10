package com.example.bytexlhackathonhealthapp10oct.data.model

data class SocialThreat(
    val id: String,
    val platform: String,
    val handle: String,
    val accountName: String,
    val bio: String,
    val followerCount: Int,
    val postCount: Int,
    val createdDate: String,
    val detectionDate: String,
    val riskLevel: String, // CRITICAL, HIGH, MEDIUM, LOW, SAFE
    val riskScore: Int,
    val nameSimilarityScore: Int,
    val logoSimilarityScore: Int,
    val hasHomoglyph: Boolean,
    val homoglyphDetails: String = "",
    val phishingKeywordsFound: List<String>,
    var status: String = "FLAGGED", // FLAGGED, TAKEDOWN_REQUESTED, WHITELISTED
    val isOfficial: Boolean = false
)
