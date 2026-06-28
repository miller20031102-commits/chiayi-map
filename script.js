
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
    <p><strong>分類：</strong>${place.category}</p>
    <p><strong>地址：</strong>${place.address}</p>
    <p>${place.description}</p>

    <div>
      ${place.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
    </div>

    <div class="links">
      <a href="${createGoogleMapsUrl(place)}" target="_blank">開啟 Google Maps</a>
      <a href="${createInstagramUrl(place)}" target="_blank">搜尋 Instagram</a>
      <a href="${createTikTokUrl(place)}" target="_blank">搜尋 TikTok</a>
    </div>
  `;
}

function renderMarkers(category = "全部") {
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  const filteredPlaces = category === "全部"
    ? places
    : places.filter(place => place.category === category || place.tags.includes(category));

  filteredPlaces.forEach(place => {
    const marker = L.marker([place.lat, place.lng]).addTo(map);
    marker.bindPopup(place.name);
    marker.on("click", () => showPlaceCard(place));
    markers.push(marker);
  });
}

document.querySelectorAll(".filters button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filters button").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    fetch("https://chiayi-map.vercel.app/api/places")
  .then(res => res.json())
  .then(data => {
    places = data.places || data;
    renderMarkers("全部");
  })
  .catch(error => {
    console.error("API 讀取失敗：", error);
  });
  });
});


 