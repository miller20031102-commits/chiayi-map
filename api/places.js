export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
res.setHeader("Access-Control-Allow-Headers", "Content-Type");

if (req.method === "OPTIONS") {
  return res.status(200).end();
}
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "缺少 GOOGLE_PLACES_API_KEY"
    });
  }

 const queries = req.query.q
  ? [req.query.q]
  : [
      "嘉義 美食",
      "嘉義 咖啡廳",
      "嘉義 景點",
      "嘉義 夜景",
      "嘉義 約會",
      "嘉義 甜點",
      "嘉義 火雞肉飯"
    ];

const allPlaces = [];

 const queries = [
  "嘉義 美食",
  "嘉義 咖啡廳",
  "嘉義 景點",
  "嘉義 夜景",
  "嘉義 約會"
];


for (const query of queries) {

  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.googleMapsUri"
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: "zh-TW",
        regionCode: "TW",
        locationBias: {
          rectangle: {
            low: { latitude: 23.40, longitude: 120.35 },
            high: { latitude: 23.56, longitude: 120.58 }
          }
        }
      })
    }
  );

  const data = await response.json();
  if (!response.ok) continue;

  const places = (data.places || []).map(place => ({
    name: place.displayName?.text || "未命名地點",

    category:
      query.includes("美食") ? "美食" :
      query.includes("咖啡") ? "咖啡廳" :
      query.includes("夜景") ? "晚上" :
      query.includes("約會") ? "約會" :
      "景點",

    lat: place.location?.latitude,
    lng: place.location?.longitude,
    address: place.formattedAddress || "",
    rating: place.rating || null,
    ratingCount: place.userRatingCount || 0,
    googleMapUrl: place.googleMapsUri || "",
    tags: ["AI抓取", "嘉義"],
    description: `${place.displayName?.text || "這個地點"} 是 AI 從 Google Maps 抓到的嘉義推薦地點。`
  }))
  .filter(place => place.lat && place.lng);

  allPlaces.push(...places);
}

return res.status(200).json({
  count: allPlaces.length,
  places: allPlaces
});

}