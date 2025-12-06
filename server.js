// server.js
const express = require("express");
const path = require("path");
const fs = require("fs").promises;
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const UPLOADS_DIR = path.join(__dirname, "public", "uploads");
const ARTICLES_FILE = path.join(DATA_DIR, "articles.json");

// Ensure folders and files exist
async function init() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    try {
      await fs.access(ARTICLES_FILE);
    } catch {
      await fs.writeFile(ARTICLES_FILE, JSON.stringify([]));
    }
  } catch (err) {
    console.error("Init error:", err);
  }
}
init();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: (req, file, cb) => {
    if(file.fieldname === "thumbnail" && !file.mimetype.startsWith("image/")) {
      return cb(new Error("Thumbnail harus berupa gambar"));
    }
    cb(null, true);
  }
});

// --- API: list articles ---
app.get("/api/articles", async (req, res) => {
  try {
    const raw = await fs.readFile(ARTICLES_FILE, "utf-8");
    const articles = JSON.parse(raw || "[]");
    articles.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- API: get single article ---
app.get("/api/articles/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const raw = await fs.readFile(ARTICLES_FILE, "utf-8");
    const articles = JSON.parse(raw || "[]");
    const article = articles.find(a => a.id === id);
    if(!article) return res.status(404).json({ error: "Article not found" });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- API: create article with upload ---
app.post("/api/articles", upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "attachments", maxCount: 10 }
]), async (req, res) => {
  try {
    const title = (req.body.title || "").trim();
    const content = (req.body.content || "").trim();
    if(!title || !content) return res.status(400).json({ ok:false, error:"Title & content required" });

    const id = uuidv4();
    const thumbnailUrl = req.files?.thumbnail?.[0] ? `/uploads/${req.files.thumbnail[0].filename}` : null;

    const attachments = (req.files?.attachments || []).map(f => ({
      filename: f.originalname,
      url: `/uploads/${f.filename}`,
      size: f.size
    }));

    const article = { id, title, content, thumbnail: thumbnailUrl, attachments, createdAt: new Date().toISOString() };

    const raw = await fs.readFile(ARTICLES_FILE, "utf-8");
    const articles = JSON.parse(raw || "[]");
    articles.push(article);
    await fs.writeFile(ARTICLES_FILE, JSON.stringify(articles, null, 2));

    res.json({ ok:true, article });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ ok:false, error: err.message });
  }
});

// --- API: delete article ---
app.delete("/api/articles/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const raw = await fs.readFile(ARTICLES_FILE, "utf-8");
    let articles = JSON.parse(raw || "[]");
    const idx = articles.findIndex(a => a.id === id);
    if(idx === -1) return res.status(404).json({ error:"Not found" });

    const art = articles[idx];
    if(art.thumbnail) {
      const p = path.join(__dirname, "public", art.thumbnail);
      fs.unlink(p).catch(()=>{});
    }
    if(art.attachments?.length) {
      art.attachments.forEach(att => fs.unlink(path.join(__dirname, "public", att.url)).catch(()=>{}));
    }

    articles.splice(idx,1);
    await fs.writeFile(ARTICLES_FILE, JSON.stringify(articles, null, 2));
    res.json({ ok:true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- SOCKET.IO ---
io.on("connection", socket => {
  console.log("User connected");
  socket.on("chatMessage", msg => socket.broadcast.emit("chatMessage", msg));
  socket.on("typing", () => socket.broadcast.emit("typing"));
  socket.on("disconnect", () => console.log("User disconnected"));
});

// Start server
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
