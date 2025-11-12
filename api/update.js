//export default async function handler(req, res) {
//  if (req.method !== "POST") {
    //return res.status(405).json({ message: "Method not allowed" });
  //}

  //try {
    //const data = req.body;
    //console.log("📥 Nhận dữ liệu từ Drive:", data);

    //res.status(200).json({
//      message: "✅ Dữ liệu đã được nhận thành công!",
  //    received: data.updates?.length || 0
    //});
  //} catch (error) {
    //console.error("❌ Lỗi:", error);
    //res.status(500).json({ message: "Lỗi xử lý dữ liệu", error: error.message });
//  }
//}
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const data = req.body;
    console.log("📥 Nhận dữ liệu từ Drive:", data);

    // 1️⃣ Kiểm tra dữ liệu đầu vào
    if (!data.file && !data.updates) {
      return res.status(400).json({ message: "Không có dữ liệu hợp lệ." });
    }

    // 2️⃣ Tạo nội dung mô tả để cập nhật GPT Blanca City
    const file = data.file || data.updates?.[0];
    const contentSummary = `
📘 Cập nhật dữ liệu mới cho Blanca City:
- Tên file: ${file.name}
- Loại: ${file.mimeType}
- Dung lượng: ${file.size || "Không rõ"}
- Ngày cập nhật: ${file.lastUpdated}
- Link Drive: ${file.link}

📄 Nội dung / Ghi chú:
${file.summary || file.content?.substring(0, 3000) || "Không có nội dung tóm tắt."}
`;

    // 3️⃣ Gửi yêu cầu cập nhật đến GPT Blanca City
    const updateResponse = await fetch("https://api.openai.com/v1/gizmos/update_behavior", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bea
