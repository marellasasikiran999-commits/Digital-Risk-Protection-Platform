package com.example.bytexlhackathonhealthapp10oct.data.model

data class OfficialHandle(
    val platform: String,
    val handle: String,
    val url: String,
    val verified: Boolean = true
)

data class OfficialApp(
    val store: String,
    val appId: String,
    val appName: String,
    val publisherName: String
)

data class OfficialBrandAsset(
    val brandName: String,
    val alternateNames: List<String>,
    val officialLogoUrl: String,
    val officialWebsite: String,
    val officialHandles: List<OfficialHandle>,
    val officialApps: List<OfficialApp>,
    val officialPublishers: List<String>
)
