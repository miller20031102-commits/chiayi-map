
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
    🔥 熱門分數：${Math.round((place.ratingCount || 0) * 0.7 + (place.rating || 0) * 100 * 0.3)}<br>
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

function loadPlaces(category = "全部") {
  const q = category === "全部" ? "嘉義 美食" : `嘉義 ${category}`;

  fetch(`https://chiayi-map.vercel.app/api/places?q=${encodeURIComponent(q)}`)
    .then(res => res.json())
    .then(data => {
      places = data.places || [];
      places.sort((a, b) => {
    const scoreA =
        (a.ratingCount || 0) * 0.7 +
        (a.rating || 0) * 100 * 0.3;

    const scoreB =
        (b.ratingCount || 0) * 0.7 +
        (b.rating || 0) * 100 * 0.3;

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
document.getElementById("analyzeThreadBtn")
.addEventListener("click", () => {

    const text = document.getElementById("threadText").value.trim();
    if (
    text.includes("threads.net") ||
    text.includes("threads.com")
) {
    alert("目前網址無法直接解析，請先打開 Threads，複製文章文字後貼上來。");
    return;
}

    if (!text) {
        alert("請先貼上 Threads 文章");
        return;
    }

    const q = `嘉義 ${text}`;

    fetch(`https://chiayi-map.vercel.app/api/places?q=${encodeURIComponent(q)}`)
        .then(res => res.json())
        .then(data => {

            places = data.places || [];

            if (places.length === 0) {
                alert("沒有找到符合的店家");
                return;
            }

            renderMarkers("全部");

            map.setView(
                [places[0].lat, places[0].lng],
                15
            );

            showPlaceCard(places[0]);
        })
        .catch(error => {
            console.error(error);
            alert("分析失敗");
        });
});
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