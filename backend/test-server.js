const express = require("express");
const app = express();
const PORT = 3001;

app.get("/", (req, res) => {
  res.json({
    message: "Test server is working!",
    timestamp: new Date().toISOString(),
  });
});

app.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Test endpoint working",
    port: PORT,
  });
});

app.listen(PORT, () => {
  console.log(`🧪 Test server running on port ${PORT}`);
  console.log(`🔗 Test URL: http://localhost:${PORT}`);
});
