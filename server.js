// server.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const UPLOADS_DIR = path.join(__dirname, "public", "uploads");
const ARTICLES_FILE = path.join(DATA_DIR, "articles.json");

// Ensure folders exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);
if (!fs.existsSync(ARTICLES_FILE)) fs.writeFileSync(ARTICLES_FILE, JSON.stringify([]));

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Multer setup (store files in public/uploads)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    // keep original extension, but use unique name
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random()*1e6)}${ext}`;
    cb(null, name);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // max 50MB per file (ubah sesuai kebutuhan)
});

// --- API: list all articles ---
app.get("/api/articles", (req, res) => {
  const raw = fs.readFileSync(ARTICLES_FILE);
  const articles = JSON.parse(raw || "[]");
  // Return sorted by createdAt desc
  articles.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(articles);
});

// --- API: get single article by id ---
app.get("/api/articles/:id", (req, res) => {
  const id = req.params.id;
  const raw = fs.readFileSync(ARTICLES_FILE);
  const articles = JSON.parse(raw || "[]");
  const article = articles.find(a => a.id === id);
  if (!article) return res.status(404).json({ error: "Article not found" });
  res.json(article);
});

// --- API: upload (thumbnail + attachments) and create article ---
// fields: thumbnail (single), attachments (multiple), title, content
app.post("/api/articles", upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "attachments", maxCount: 10 }
]), (req, res) => {
  try {
    const title = req.body.title || "Untitled";
    const content = req.body.content || "";
    const id = uuidv4();

    // thumbnail
    let thumbnailUrl = null;
    if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
      thumbnailUrl = `/uploads/${req.files.thumbnail[0].filename}`;
    }

    // attachments
    const attachments = [];
    if (req.files && req.files.attachments) {
      for (const f of req.files.attachments) {
        attachments.push({
          filename: f.originalname,
          url: `/uploads/${f.filename}`,
          size: f.size
        });
      }
    }

    // article object
    const article = {
      id,
      title,
      content,
      thumbnail: thumbnailUrl,
      attachments,
      createdAt: new Date().toISOString()
    };

    // save to articles.json
    const raw = fs.readFileSync(ARTICLES_FILE);
    const articles = JSON.parse(raw || "[]");
    articles.push(article);
    fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2));

    return res.json({ ok: true, article });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// --- OPTIONAL: delete article (not exposed in UI) ---
app.delete("/api/articles/:id", (req, res) => {
  const id = req.params.id;
  const raw = fs.readFileSync(ARTICLES_FILE);
  let articles = JSON.parse(raw || "[]");
  const idx = articles.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });

  // remove files referenced (thumbnail + attachments)
  const art = articles[idx];
  if (art.thumbnail) {
    const p = path.join(__dirname, "public", art.thumbnail);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
  if (art.attachments && art.attachments.length) {
    for (const att of art.attachments) {
      const p = path.join(__dirname, "public", att.url);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
  }

  articles.splice(idx, 1);
  fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2));
  res.json({ ok: true });
});

// --- SOCKET.IO (keep chat if needed) ---
io.on("connection", (socket) => {
  console.log("User connected");
  socket.on("chatMessage", (msg) => socket.broadcast.emit("chatMessage", msg));
  socket.on("typing", () => socket.broadcast.emit("typing"));
  socket.on("disconnect", () => console.log("User disconnected"));
});

// Start server
http.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
