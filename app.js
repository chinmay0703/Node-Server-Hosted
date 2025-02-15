import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());

app.get("/api/games", async (req, res) => {
    try {
        const response = await fetch("https://www.freetogame.com/api/games");
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching games" });
    }
});

app.get("/api/games/pc", async (req, res) => {
    try {
        const response = await fetch("https://www.freetogame.com/api/games?platform=pc");
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching games" });
    }
});
app.get("/api/games/browser", async (req, res) => {
    try {
        const response = await fetch("https://www.freetogame.com/api/games?platform=browser");
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching games" });
    }
});
app.get("/api/games/all", async (req, res) => {
    try {
        const response = await fetch("https://www.freetogame.com/api/games?platform=all");
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching games" });
    }
});
app.get("/api/games/category/:category", async (req, res) => {
    try {
        const category = req.params.category;
        const response = await fetch(`https://www.freetogame.com/api/games?category=${category}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: `Error fetching games in category: ${category}` });
    }
});


app.listen(5000, () => console.log("Proxy server running on port 5000"));
