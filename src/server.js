const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    });

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    });
});

process.on("SIGTERM", async () => {
    console.log("SIGTERM received. Shutting down gracefully...");
    await mongoose.connection.close();
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});