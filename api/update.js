export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const data = req.body;
    console.log("📥 Nhận dữ liệu từ Drive:", data);

    res.status(200).json({
      message: "✅ Dữ liệu đã được nhận thành công!",
      received: data.updates?.length || 0
    });
  } catch (error) {
    console.error("❌ Lỗi:", error);
    res.status(500).json({ message: "Lỗi xử lý dữ liệu", error: error.message });
  }
}
