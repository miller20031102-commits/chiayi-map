<<<<<<< HEAD
 const places = [
  {
    name: "檜意森活村",
    category: "景點",
    lat: 23.4864,
    lng: 120.4542,
    address: "嘉義市東區林森東路1號",
    tags: ["拍照", "約會", "文青"],
    description: "日式木造建築群，很適合拍照、散步、約會。",
  },
  {
    name: "文化路夜市",
    category: "晚上",
    lat: 23.4778,
    lng: 120.4495,
    address: "嘉義市東區文化路",
    tags: ["美食", "宵夜", "晚上"],
    description: "嘉義最熱鬧的夜市之一，適合晚上吃東西和散步。",
  },
  {
    name: "蘭潭月影潭心",
    category: "約會",
    lat: 23.4671,
    lng: 120.4846,
    address: "嘉義市東區小雅路",
    tags: ["夜景", "約會", "散步"],
    description: "嘉義很適合晚上散步、看夜景的地方。",
  },
  {
    name: "森林之歌",
    category: "景點",
    lat: 23.4867,
    lng: 120.4489,
    address: "嘉義市東區文化路",
    tags: ["拍照", "地標", "散步"],
    description: "嘉義市區地標景點，適合拍照打卡。",
  },
  {
    name: "嘉義公園",
    category: "景點",
    lat: 23.4814,
    lng: 120.4678,
    address: "嘉義市東區啟明路264號",
    tags: ["散步", "自然", "白天"],
    description: "嘉義市區的大型公園，適合散步、放鬆。",
  },
  {
    name: "北門驛",
    category: "景點",
    lat: 23.4877,
    lng: 120.4545,
    address: "嘉義市東區共和路428號",
    tags: ["拍照", "鐵道", "文青"],
    description: "阿里山森林鐵路的重要景點，適合拍照。",
  },
  {
    name: "民主火雞肉飯",
    category: "美食",
    lat: 23.4787,
    lng: 120.4496,
    address: "嘉義市東區民族路149號",
    tags: ["火雞肉飯", "嘉義美食"],
    description: "嘉義代表性美食之一，很適合放進第一版推薦。",
  },
  {
    name: "林聰明沙鍋魚頭",
    category: "美食",
    lat: 23.4775,
    lng: 120.4491,
    address: "嘉義市東區中正路361號",
    tags: ["砂鍋魚頭", "排隊美食"],
    description: "嘉義知名老店，適合美食分類和觀光客搜尋。",
  }
];

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

    renderMarkers(button.dataset.category);
  });
});

=======
 const places = [
  {
    name: "檜意森活村",
    category: "景點",
    lat: 23.4864,
    lng: 120.4542,
    address: "嘉義市東區林森東路1號",
    tags: ["拍照", "約會", "文青"],
    description: "日式木造建築群，很適合拍照、散步、約會。",
  },
  {
    name: "文化路夜市",
    category: "晚上",
    lat: 23.4778,
    lng: 120.4495,
    address: "嘉義市東區文化路",
    tags: ["美食", "宵夜", "晚上"],
    description: "嘉義最熱鬧的夜市之一，適合晚上吃東西和散步。",
  },
  {
    name: "蘭潭月影潭心",
    category: "約會",
    lat: 23.4671,
    lng: 120.4846,
    address: "嘉義市東區小雅路",
    tags: ["夜景", "約會", "散步"],
    description: "嘉義很適合晚上散步、看夜景的地方。",
  },
  {
    name: "森林之歌",
    category: "景點",
    lat: 23.4867,
    lng: 120.4489,
    address: "嘉義市東區文化路",
    tags: ["拍照", "地標", "散步"],
    description: "嘉義市區地標景點，適合拍照打卡。",
  },
  {
    name: "嘉義公園",
    category: "景點",
    lat: 23.4814,
    lng: 120.4678,
    address: "嘉義市東區啟明路264號",
    tags: ["散步", "自然", "白天"],
    description: "嘉義市區的大型公園，適合散步、放鬆。",
  },
  {
    name: "北門驛",
    category: "景點",
    lat: 23.4877,
    lng: 120.4545,
    address: "嘉義市東區共和路428號",
    tags: ["拍照", "鐵道", "文青"],
    description: "阿里山森林鐵路的重要景點，適合拍照。",
  },
  {
    name: "民主火雞肉飯",
    category: "美食",
    lat: 23.4787,
    lng: 120.4496,
    address: "嘉義市東區民族路149號",
    tags: ["火雞肉飯", "嘉義美食"],
    description: "嘉義代表性美食之一，很適合放進第一版推薦。",
  },
  {
    name: "林聰明沙鍋魚頭",
    category: "美食",
    lat: 23.4775,
    lng: 120.4491,
    address: "嘉義市東區中正路361號",
    tags: ["砂鍋魚頭", "排隊美食"],
    description: "嘉義知名老店，適合美食分類和觀光客搜尋。",
  }
];

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

    renderMarkers(button.dataset.category);
  });
});

>>>>>>> badf1e81d54901028346d2b6b7bb1db20b317ed3
renderMarkers();