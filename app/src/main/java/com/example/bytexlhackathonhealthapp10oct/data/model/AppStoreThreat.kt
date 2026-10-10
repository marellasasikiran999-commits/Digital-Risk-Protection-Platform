package com.example.bytexlhackathonhealthapp10oct.data.model

data class AppStoreThreat(
    val id: String,
    val store: String, // Google Play, App Store
    val appName: String,
    val appId: String,
    val publisherName: String,
    val rating: Float,
    val downloadsCount: String,
    val updatedDate: String,
    val descriptionSnippet: String,
    val riskLevel: String,
    val riskScore: Int,
    val nameSimilarityScore: Int,
    val logoSimilarityScore: Int,
    val isPublisherMismatch: Boolean,
    val suspiciousPermissions: List<String>,
    var status: String = "FLAGGED",
    val isOfficial: Boolean = false
)
