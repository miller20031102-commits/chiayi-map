export default async function handler(req, res) {
  return res.status(200).json({
    message: "API 正常運作",
    city: "嘉義",
    time: new Date().toISOString()
  });
}