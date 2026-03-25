export const analyzePhoto = async (imageContext) => {
  await new Promise(r => setTimeout(r, 2000));
  return {
    waterLevel: "~2.3 feet above road surface",
    passability: "BLOCKED ❌",
    vehicles: "3 (stranded)",
    damage: "Minor (no collapse)",
    threatLevel: "MODERATE-HIGH 🟠",
    confidence: "91%"
  };
};

export const analyzeVoiceReport = async (transcription) => {
  await new Promise(r => setTimeout(r, 1500));
  return {
    location: "Kukatpally",
    waterLevel: "Waist-deep (~3 feet)",
    urgency: "HIGH — Rescue requested",
    sentiment: "Distress detected"
  };
};

export const generateDashboardInsight = async (context) => {
  await new Promise(r => setTimeout(r, 1000));
  return "Musi River will breach danger level (7.5m) by approximately 18:30 IST based on current inflow rate of 4,200 cusecs. Residents in Nagole, Uppal, and Amberpet should evacuate now.";
};

export const getPrediction = async (params) => {
  await new Promise(r => setTimeout(r, 3000));
  return {
    probability: 84,
    timeToOnset: "3.5hrs",
    confidence: 94,
    impactScore: 7.2,
    narrative: `Based on current conditions in ${params.zone || 'Kukatpally'}, Hyderabad, the flood risk is CRITICAL. The combination of 87mm accumulated rainfall in the past 24 hours, rapidly rising Musi River levels at 6.8m (approaching the 7.5m danger threshold), and nearly saturated soils at ${params.soilSaturation || '94%'} capacity creates an extremely dangerous situation. The current river inflow rate of 4,200 cusecs suggests the danger threshold will be breached in approximately 3.5 hours. The poor urban drainage infrastructure in this zone (rated at only 30% capacity) will significantly worsen surface flooding. IMMEDIATE EVACUATION is strongly recommended for residents within 1km of the Musi River.`,
    timeline: [
      { t: "T+0h", desc: "Surface waterlogging begins" },
      { t: "T+1h", desc: "Roads start becoming impassable" },
      { t: "T+2h", desc: "Ground floor flooding likely" },
      { t: "T+3.5h", desc: "⚠️ PEAK — Major flood event" },
      { t: "T+5h", desc: "Flooding begins to stabilize" },
      { t: "T+8h", desc: "Gradual recession begins" }
    ],
    factors: [
      { text: "Extreme accumulated rainfall (87mm) — CRITICAL IMPACT", percent: 89, type: 'critical' },
      { text: "Rising river level (6.8m/7.5m threshold) — HIGH IMPACT", percent: 78, type: 'high' },
      { text: "Saturated soil (94%) — HIGH IMPACT", percent: 67, type: 'high' },
      { text: "Poor drainage infrastructure — HIGH IMPACT", percent: 65, type: 'high' },
      { text: "Urban heat island effect — MEDIUM IMPACT", percent: 45, type: 'medium' },
      { text: "Historical flood frequency — MEDIUM IMPACT", percent: 42, type: 'medium' },
      { text: "Upstream dam status — LOW IMPACT", percent: 22, type: 'low' }
    ]
  };
};

export const getRouteRecommendation = async (origin, dest) => {
  await new Promise(r => setTimeout(r, 1500));
  return "Given current flood conditions in Hyderabad, I strongly recommend Route B via Gachibowli. Route A through Miyapur and NH65 has 14 confirmed flood reports in the last 2 hours with water levels at 2.3 feet — impassable for standard vehicles. Route B, while 8 minutes longer, remains entirely clear and uses elevated roads through Gachibowli that have no historical flood risk. If you're in an emergency vehicle, Route C via ORR provides the fastest guaranteed clear path.";
};

export const getEvacuationPlan = async (location) => {
  await new Promise(r => setTimeout(r, 1000));
  return [
    "Leave immediately — do not wait for water to rise",
    "Use Route B (Gachibowli) — confirmed safe 8 min ago",
    "Nearest shelter: Kukatpally Stadium (0.8km, 1,108 spaces available)",
    "Take: Documents, medicines, phone, water, 3 days food",
    "Alert your neighbors — help elderly and disabled first"
  ];
};

export const chatResponse = async (msg) => {
  await new Promise(r => setTimeout(r, 1200));
  if(msg.toLowerCase().includes("safe to drive")) {
    return "Based on current flood data, I don't recommend your planned route. NH65 via Miyapur is flooded with 2.3ft of water as of 8 minutes ago. I recommend Route B via Gachibowli instead — it's 8 minutes longer but completely safe. Shall I show you the exact route on the map? 🗺️";
  }
  return "I am analyzing the real-time sensor network, satellite imagery, and community reports. FloodSynapse is tracking active threats. Please stay safe and follow evacuation protocols if you are in a high-risk zone.";
};
