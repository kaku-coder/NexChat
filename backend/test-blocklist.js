import http from "http";

const PORT = 3000;
const HOST = "localhost";

function request(options, body = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = "";
            res.on("data", (chunk) => data += chunk);
            res.on("end", () => {
                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    body: (() => { try { return JSON.parse(data); } catch { return data; } })()
                });
            });
        });
        req.on("error", reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function run() {
    const email = `test_${Date.now()}@example.com`;
    const password = "password123";
    const userName = `user_${Date.now()}`;

    // 1. Register
    console.log("\n📌 1. Registering user...");
    const reg = await request({ host: HOST, port: PORT, path: "/api/auth/register", method: "POST", headers: { "Content-Type": "application/json" } }, { userName, email, password });
    console.log("Status:", reg.status, "| Token:", reg.body.token ? "✅ Received" : "❌ Missing");
    if (reg.status !== 201) throw new Error("Registration failed: " + JSON.stringify(reg.body));

    const token = reg.body.token;

    // 2. Access protected route (should work)
    console.log("\n📌 2. GET /getMe with valid token (should 200)...");
    const me1 = await request({ host: HOST, port: PORT, path: "/api/auth/getMe", method: "GET", headers: { "Authorization": `Bearer ${token}` } });
    console.log("Status:", me1.status, me1.status === 200 ? "✅ PASS" : "❌ FAIL", "| Body:", JSON.stringify(me1.body));

    // 3. Logout (blocklist token)
    console.log("\n📌 3. POST /logout to blocklist token...");
    const logout = await request({ host: HOST, port: PORT, path: "/api/auth/logout", method: "POST", headers: { "Authorization": `Bearer ${token}` } });
    console.log("Status:", logout.status, logout.status === 200 ? "✅ PASS" : "❌ FAIL", "| Body:", logout.body);

    // 4. Access protected route again (should be blocked)
    console.log("\n📌 4. GET /getMe with SAME token after logout (should 401)...");
    const me2 = await request({ host: HOST, port: PORT, path: "/api/auth/getMe", method: "GET", headers: { "Authorization": `Bearer ${token}` } });
    console.log("Status:", me2.status, me2.status === 401 ? "✅ PASS — Token is blocked!" : "❌ FAIL — Token still works!", "| Body:", me2.body);

    console.log("\n🏁 Test complete!\n");
    process.exit(0);
}

run().catch((err) => {
    console.error("❌ Test failed:", err.message);
    process.exit(1);
});
