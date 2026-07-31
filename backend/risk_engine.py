from typing_extensions import TypedDict


class SystemDescription(TypedDict, total=False):
    sector: str
    personal_data_used: list
    uses_biometric_or_emotion_data: bool
    affected_group: str
    decision_level: str
    jurisdiction: str
    deployment_status: str
    org_size: str


HIGH_RISK_SECTORS = {
    "employment": "EU AI Act, Annex III, Point 4(a)",
    "credit_scoring": "EU AI Act, Annex III, Point 5(b)",
    "education": "EU AI Act, Annex III, Point 3",
}


def classify_eu(system: SystemDescription) -> dict:
    sector = system.get("sector", "other")
    biometric = system.get("uses_biometric_or_emotion_data", False)
    affected_group = system.get("affected_group", "assists_human_only")
    decision_level = system.get("decision_level", "human_assisted")

    if biometric and sector in ("employment", "education"):
        return {
            "risk_tier": "Unacceptable",
            "matched_clause": "EU AI Act, Article 5",
            "reason": "Emotion/biometric recognition in workplace or education settings is banned under Article 5.",
            "checklist": [
                "This use case cannot legally be deployed in the EU as described",
                "Remove the emotion/biometric analysis component to proceed",
            ],
        }

    if sector in HIGH_RISK_SECTORS:
        checklist = [
            "Conformity assessment before deployment",
            "Maintain technical documentation",
            "Ensure meaningful human oversight",
            "Log system decisions for auditability",
        ]
        if decision_level == "fully_automated":
            checklist.append("⚠ Add human review before final decisions (Article 14)")
        if affected_group == "public":
            checklist.append("Fundamental Rights Impact Assessment required (public-facing use)")
        return {
            "risk_tier": "High",
            "matched_clause": HIGH_RISK_SECTORS[sector],
            "reason": f"'{sector}' is explicitly listed as high-risk under Annex III.",
            "checklist": checklist,
        }

    return {
        "risk_tier": "Limited",
        "matched_clause": "EU AI Act, Article 50",
        "reason": "Not listed as high-risk under Annex III. Standard transparency obligations apply.",
        "checklist": ["Disclose to users that they are interacting with an AI system"],
    }


def classify_india(system: SystemDescription) -> dict:
    personal_data = system.get("personal_data_used", [])
    sensitive = "health" in personal_data or "biometric" in personal_data
    checklist = [
        "Obtain valid consent before processing personal data",
        "Clearly state the purpose of data collection",
        "Allow data principals to withdraw consent",
    ]
    if sensitive:
        checklist += [
            "Implement additional technical safeguards for sensitive data",
            "Conduct a data protection impact review",
        ]
    return {
        "risk_tier": None,
        "matched_clause": "DPDP Act, 2023 (a2023-22)",
        "reason": "India's DPDP Act has no AI-specific risk tier; obligations depend on the personal data processed.",
        "checklist": checklist,
    }


def run_simulation(system: SystemDescription) -> dict:
    jurisdiction = system.get("jurisdiction", "eu")
    results = {}
    if jurisdiction in ("eu", "both"):
        results["eu"] = classify_eu(system)
    if jurisdiction in ("india", "both"):
        results["india"] = classify_india(system)
    return results
