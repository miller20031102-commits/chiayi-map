
const SUPABASE_URL = "https://riyxizvetthvsnvqugil.supabase.co";
const SUPABASE_KEY = "sb_publishable_wsuik9OSKrZUWGfT6HlzsQ_7dtsSa7r";
const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
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
  ${place.photoUrl ? `
<img
  src="${place.photoUrl}"
  style="width:100%;border-radius:12px;margin-bottom:10px;"
>
` : ""}
    <h2>${place.name}</h2>
    <p>⭐ ${place.rating || "暫無評分"} (${place.ratingCount || 0} 則評論)</p>
    🔥 熱門分數：
    ${Math.round(
    (place.rating || 0) * 800 +
    Math.min(place.ratingCount || 0, 1000) * 0.2 +
    (place.voteCount || 0) * 100
)}
    <p>📍 ${place.address || "無地址"}</p>
    <p>${place.description || "Google Maps 抓到的嘉義推薦地點。"}</p>
    <a href="${place.googleMapUrl}" target="_blank">開啟 Google Maps</a>
    <br><br>

<button onclick="votePlace('${place.category}','${place.name}')">
👍 投票給這間店
</button>

<p id="vote-count-${place.name}">
載入票數中...
</p>
  `;
  getVoteCount(place.category, place.name).then(count => {
    const voteText = document.getElementById(`vote-count-${place.name}`);
    if (voteText) {
        voteText.innerText = `👍 目前票數：${count}`;
    }
});
}
function updateRankingList(rankedPlaces) {
    const list = document.getElementById("rankingList");
    if (!list) return;

    list.innerHTML = "";

    rankedPlaces.slice(0, 5).forEach((place, index) => {
        const li = document.createElement("li");

        const medal =
            index === 0 ? "🥇" :
            index === 1 ? "🥈" :
            index === 2 ? "🥉" :
            `${index + 1}.`;

        li.innerHTML = `
            <button class="ranking-item">
                <span>${medal} ${place.name}</span>
                <small>👍 ${place.voteCount || 0}</small>
            </button>
        `;

        li.querySelector("button").addEventListener("click", () => {
            map.setView([place.lat, place.lng], 16);
            showPlaceCard(place);
        });

        list.appendChild(li);
    });
}
function renderMarkers(category = "全部") {
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  const filteredPlaces = category === "全部"
  ? places
  : places.filter(place =>
      place.category === category || (place.tags && place.tags.includes(category))
    );
filteredPlaces.sort((a, b) => {
    const scoreA =
        (a.rating || 0) * 800 +
        Math.min(a.ratingCount || 0, 1000) * 0.2 +
        (a.voteCount || 0) * 100;

    const scoreB =
        (b.rating || 0) * 800 +
        Math.min(b.ratingCount || 0, 1000) * 0.2 +
        (b.voteCount || 0) * 100;

    return scoreB - scoreA;
});
 updateRankingList(filteredPlaces);
filteredPlaces.forEach((place, index) => {
    let iconUrl =
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png";

if (index === 0) {
    iconUrl =
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png";
}
else if (index === 1) {
    iconUrl =
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png";
}
else if (index === 2) {
    iconUrl =
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png";
}

const customIcon = new L.Icon({
    iconUrl: iconUrl,
    shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",

    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const marker = L.marker(
    [place.lat, place.lng],
    { icon: customIcon }
).addTo(map);
   marker.bindPopup(`
${place.photoUrl ? `
<img
  src="${place.photoUrl}"
  style="
    width:180px;
    height:120px;
    object-fit:cover;
    border-radius:10px;
    margin-bottom:8px;
  "
>
` : ""}

<b>${place.name}</b><br>

⭐ ${place.rating || "暫無評分"}
<p>🔥 熱門分數：${Math.round((place.ratingCount || 0) * 0.7 + (place.rating || 0) * 100 * 0.3)}</p>
(${place.ratingCount || 0}則)<br>

📍 ${place.address || "無地址"}<br>

<a href="${place.googleMapUrl}" target="_blank">
Google Maps 導航
</a>
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

async function loadPlaces(category = "全部") {
  const q = category === "全部" ? "嘉義 美食" : `嘉義 ${category}`;

  fetch(`https://chiayi-map.vercel.app/api/places?q=${encodeURIComponent(q)}`)
    .then(res => res.json())
    .then(async data => {
      places = data.places || [];
      for (const place of places) {
    place.voteCount = await getVoteCount(
        place.category,
        place.name
    );
}
      places.sort((a, b) => {
    const scoreA =
    (a.rating || 0) * 800 +
    Math.min(a.ratingCount || 0, 1000) * 0.2 +
    (a.voteCount || 0) * 100;

const scoreB =
    (b.rating || 0) * 800 +
    Math.min(b.ratingCount || 0, 1000) * 0.2 +
    (b.voteCount || 0) * 100;

    return scoreB - scoreA;
});
      console.log("API 景點資料:", places);
      renderMarkers("全部");
    })
    .catch(error => {
      console.error("API 讀取失敗:", error);
    });
}
loadPlaces("全部");
document.getElementById("exactSearchBtn")
.addEventListener("click", () => {
    const keyword = document.getElementById("exactSearchInput").value.trim();

    if (!keyword) {
        alert("請輸入店名");
        return;
    }

    const q = `嘉義 ${keyword}`;

    fetch(`https://chiayi-map.vercel.app/api/places?q=${encodeURIComponent(q)}`)
        .then(res => res.json())
        .then(data => {
            let resultPlaces = data.places || [];

            resultPlaces = resultPlaces.filter(place =>
                place.name.includes(keyword) ||
                keyword.includes(place.name)
            );

            if (resultPlaces.length === 0) {
                alert("找不到這間店，請換個關鍵字");
                return;
            }

            places = resultPlaces;

            renderMarkers("全部");

            map.setView([places[0].lat, places[0].lng], 16);
            showPlaceCard(places[0]);
        })
        .catch(error => {
            console.error(error);
            alert("搜尋失敗");
        });
});
async function getVoteCount(category, placeName) {
    const { count } = await supabase
        .from("votes")
        .select("*", { count: "exact", head: true })
        .eq("category", category)
        .eq("place_name", placeName);

    return count || 0;
}
async function votePlace(category, placeName) {

    const userId =
        localStorage.getItem("user_id") ||
        crypto.randomUUID();

    localStorage.setItem("user_id", userId);

    const { data: myVotes } = await db
        .from("votes")
        .select("*")
        .eq("user_id", userId)
        .eq("category", category);

    if (myVotes.length >= 2) {
        alert("每個分類最多只能投 2 間店");
        return;
    }

    await db
        .from("votes")
        .insert({
            category,
            place_name: placeName,
            user_id: userId
        });

    alert("投票成功！");
}
async function getVoteCount(category, placeName) {
    const { count, error } = await db
        .from("votes")
        .select("*", { count: "exact", head: true })
        .eq("category", category)
        .eq("place_name", placeName);

    if (error) {
        console.error(error);
        return 0;
    }

    return count || 0;
}
document.getElementById("rankingToggle")
.addEventListener("click", () => {
    const box = document.getElementById("rankingBox");
    const btn = document.getElementById("rankingToggle");

    box.classList.toggle("collapsed");

    if (box.classList.contains("collapsed")) {
        btn.innerText = "🔥 TOP 5 ▼";
    } else {
        btn.innerText = "🔥 TOP 5 ▲";
    }
});