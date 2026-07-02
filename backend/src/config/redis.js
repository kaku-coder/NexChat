import Redis from "ioredis";

let redisClient = null;

export function getRedisClient() {
    if (!redisClient) {
        redisClient = new Redis({
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
            password: process.env.REDIS_PASSWORD,
            // No tls — this Redis instance does not use TLS on this port
        });

        redisClient.on("connect", () => console.log("✅ Redis connected"));
        redisClient.on("error", (err) => console.error("❌ Redis error:", err.message));
    }
    return redisClient;
}

export default getRedisClient;
