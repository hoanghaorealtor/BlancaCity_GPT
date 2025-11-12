export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const data = req.body;
    console.log("📥 Nhận dữ liệu từ Drive:", data);
    if (data.images) {
  console.log("🖼️ Nhận danh sách ảnh:", data.images);

  const imageSummary = data.images.map(img => `![${img.name}](${img.url})`).join('\n');

  const updateResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Bạn là trợ lý Blanca City, hiển thị hình ảnh minh họa tương ứng khi mô tả dự án."
        },
        {
          role: "user",
          content: `Cập nhật danh sách hình ảnh mới:\n${imageSummary}`
        }
      ]
    })
  });

  const result = await updateResponse.json();
  return res.status(200).json({
    message: "✅ Danh sách hình ảnh đã được gửi thành công!",
    count: data.images.length,
    result
  });
}


    // Kiểm tra dữ liệu
    if (!data.file && !data.updates) {
      return res.status(400).json({ message: "Không có dữ liệu hợp lệ." });
    }

    const file = data.file || data.updates?.[0];
    const contentSummary = `
📘 Cập nhật dữ liệu mới cho Blanca City:
- Tên file: ${file.name}
- Loại: ${file.mimeType}
- Dung lượng: ${file.size || "Không rõ"}
- Ngày cập nhật: ${file.lastUpdated}
- Link Drive: ${file.link}

📄 Nội dung / Ghi chú:
${file.summary || file.content?.substring(0, 2000) || "Không có nội dung tóm tắt."}
`;

    // Gửi đến OpenAI Chat API để kiểm thử
    const updateResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Bạn là trợ lý Blanca City, chuyên ghi nhận và xử lý dữ liệu dự án."
          },
          {
            role: "user",
            content: contentSummary
          }
        ]
      })
    });

    const result = await updateResponse.json();
    console.log("✅ Phản hồi từ GPT:", result);

    return res.status(200).json({
      message: "✅ Dữ liệu đã được gửi đến GPT Blanca City thành công!",
      result
    });

  } catch (error) {
    console.error("❌ Lỗi:", error);
    return res.status(500).json({ message: "Lỗi xử lý dữ liệu", error: error.message });
  }
}
