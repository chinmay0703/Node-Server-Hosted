import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import googleTrends from "google-trends-api";
import axios from 'axios';
import * as cheerio from "cheerio";

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

const URL = 'https://www.ndtv.com/latest#pfrom=home-ndtv_mainnavigation';

async function scrapeNDTV() {
    try {
        // Fetch the HTML content
        const { data } = await axios.get(URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
            }
        });

        // Load HTML into Cheerio
        const $ = cheerio.load(data);
        const articles = [];

        // Loop through each news item `.NwsLstPg-a-li`
        $('.NwsLstPg-a-li').each((index, element) => {
            const title = $(element).find('h2.NwsLstPg_ttl a.NwsLstPg_ttl-lnk').text().trim();
            const link = $(element).find('h2.NwsLstPg_ttl a.NwsLstPg_ttl-lnk').attr('href');
            const image = $(element).find('.img-gr img').attr('src'); // Extracts the image URL
            const timestamp = $(element).find('.NwsLstPg_pst .NwsLstPg_pst_lnk').first().text().trim();
            const author =
                $(element).find('.NwsLstPg_pst_li a.NwsLstPg_pst_lnk').text().trim() ||
                $(element).find('.NwsLstPg_pst_li span.NwsLstPg_pst_txt').text().trim() ||
                "Unknown";

            const description = $(element).find('.NwsLstPg_txt.txt_tct.txt_tct-three').text().trim();

            if (title && link && image) {
                articles.push({ title, link, image, timestamp, author, description });
            }
        });

        return articles

    } catch (error) {
        console.error('Error scraping NDTV:', error.message);
    }
}

app.get("/news", async (req, res) => {
    const news = await scrapeNDTV();
    console.log(news, "News")
    res.json({ news: news });
});

app.get("/top-indian-trending-keywords", async (req, res) => {
    try {
        const results = await googleTrends.dailyTrends({ geo: "IN" });
        res.json(JSON.parse(results));
    } catch (error) {
        console.error("Error fetching trending keywords:", error);
        res.status(500).json({ error: "Error fetching Top Trending Keywords" });
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
