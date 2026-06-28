
let places = [];
const chiayiBounds = [
    [23.40, 120.35], // 西南角
    [23.56, 120.58]  // 東北角
];

const map = L.map("map", {
    maxBounds: chiayiBounds,
    maxBoundsViscosity: 1.0,
    minZoom: 12,
    maxZoom: 18
}).setView([23.4801, 120.4491], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
}).addTo(map);


L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

let markers = [];

function createGoogleMapsUrl(place) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " " + place.address)}`;
}

function createInstagramUrl(place) {
  return `https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(place.name)}`;
}

function createTikTokUrl(place) {
  return `https://www.tiktok.com/search?q=${encodeURIComponent(place.name)}`;
}

function showPlaceCard(place) {
  const card = document.getElementById("place-card");
  card.innerHTML = `
    <h2>${place.name}</h2>
    <p>⭐ ${place.rating || "暫無評分"} (${place.ratingCount || 0} 則評論)</p>
    <p>📍 ${place.address || "無地址"}</p>
    <p>${place.description || "Google Maps 抓到的嘉義推薦地點。"}</p>
    <a href="${place.googleMapUrl}" target="_blank">開啟 Google Maps</a>
  `;
}

function renderMarkers(category = "全部") {
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  const filteredPlaces = category === "全部"
  ? places
  : places.filter(place =>
      place.category === category || (place.tags && place.tags.includes(category))
    );

  filteredPlaces.forEach(place => {
    const marker = L.marker([place.lat, place.lng]).addTo(map);
   marker.bindPopup(`
  <b>${place.name}</b><br>
  ⭐ ${place.rating || "暫無評分"} (${place.ratingCount || 0} 則)<br>
  📍 ${place.address || "無地址"}<br>
  <a href="${place.googleMapUrl}" target="_blank">Google Maps 導航</a>
`);
    marker.on("click", () => showPlaceCard(place));
    markers.push(marker);
  });
}

document.querySelectorAll(".filters button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filters button")
      .forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");

    loadPlaces(button.dataset.category);
  });
});

function loadPlaces(category = "全部") {
  const q = category === "全部" ? "嘉義 美食" : `嘉義 ${category}`;

  fetch(`https://chiayi-map.vercel.app/api/places?q=${encodeURIComponent(q)}`)
    .then(res => res.json())
    .then(data => {
      places = data.places || [];
      places.sort((a, b) => {
  return (b.ratingCount || 0) - (a.ratingCount || 0);
});
      console.log("API 景點資料:", places);
      renderMarkers("全部");
    })
    .catch(error => {
      console.error("API 讀取失敗:", error);
    });
}
loadPlaces("全部");