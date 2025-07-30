const http = require("http");

// Test if backend server is running
const testBackend = () => {
  const options = {
    hostname: "localhost",
    port: 5000,
    path: "/health",
    method: "GET",
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Backend server is running on port 5000`);
    console.log(`Status: ${res.statusCode}`);

    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      try {
        const response = JSON.parse(data);
        console.log("Response:", response);
      } catch (e) {
        console.log("Raw response:", data);
      }
    });
  });

  req.on("error", (err) => {
    console.log(`❌ Backend server is NOT running on port 5000`);
    console.log("Error:", err.message);
    console.log("\n🔧 To fix this:");
    console.log("1. Make sure MongoDB is running");
    console.log("2. Create backend/.env file with proper configuration");
    console.log("3. Run: cd backend && npm run dev");
  });

  req.end();
};

testBackend();
