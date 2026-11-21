require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(express.static(__dirname));

const sessions = new Map();
const fallbackPath = path.join(__dirname, "data", "users.json");
let db = null;

fs.mkdirSync(path.dirname(fallbackPath), { recursive: true });
if (!fs.existsSync(fallbackPath)) fs.writeFileSync(fallbackPath, JSON.stringify({ users: [], entries: {} }, null, 2));

async function connectDatabase() {
  if (!process.env.MYSQL_HOST) return;
  try {
    const mysql = require("mysql2/promise");
    db = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    });
    await db.execute(`CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(190) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    await db.execute(`CREATE TABLE IF NOT EXISTS daily_entries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      entry_date DATE NOT NULL,
      water DECIMAL(4,2) DEFAULT 0,
      breakfast TEXT,
      exercise INT DEFAULT 0,
      lunch TEXT,
      dinner TEXT,
      walk DECIMAL(4,1) DEFAULT 0,
      submitted TINYINT(1) DEFAULT 0,
      submitted_at DATETIME NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY unique_user_date (user_id, entry_date),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);
    const [entryColumns] = await db.execute("SHOW COLUMNS FROM daily_entries");
    const entryColumnNames = entryColumns.map(column => column.Field);
    if (!entryColumnNames.includes("submitted")) await db.execute("ALTER TABLE daily_entries ADD COLUMN submitted TINYINT(1) DEFAULT 0");
    if (!entryColumnNames.includes("submitted_at")) await db.execute("ALTER TABLE daily_entries ADD COLUMN submitted_at DATETIME NULL");
    console.log("MySQL connected");
  } catch (error) {
    db = null;
    console.log("MySQL unavailable - using secure local fallback");
  }
}

function readFallback() {
  return JSON.parse(fs.readFileSync(fallbackPath, "utf8"));
}
function writeFallback(data) {
  fs.writeFileSync(fallbackPath, JSON.stringify(data, null, 2));
}

async function findUserByEmail(email) {
  if (db) {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
    return rows[0] || null;
  }
  const data = readFallback();
  return data.users.find(user => user.email === email.toLowerCase()) || null;
}

function authRequired(req, res, next) {
  const token = req.cookies.auth_token;
  const session = token ? sessions.get(token) : null;
  if (!session) return res.status(401).json({ error: "कृपया पुन्हा login करा" });
  req.user = session;
  next();
}

app.post("/api/register", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (name.length < 2) return res.status(400).json({ error: "नाव किमान 2 अक्षरे असावे" });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "योग्य email लिहा" });
    if (password.length < 8) return res.status(400).json({ error: "Password किमान 8 अक्षरे असावे" });
    if (!/[A-Za-z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      return res.status(400).json({ error: "Password मध्ये letter, number आणि symbol (@#$!) असावा" });
    }
    if (await findUserByEmail(email)) return res.status(409).json({ error: "हे account आधीच अस्तित्वात आहे" });
    const passwordHash = await bcrypt.hash(password, 10);
    let userId;
    if (db) {
      const [result] = await db.execute("INSERT INTO users (name,email,password_hash) VALUES (?,?,?)", [name, email, passwordHash]);
      userId = result.insertId;
    } else {
      const data = readFallback();
      userId = data.users.length ? Math.max(...data.users.map(u => u.id)) + 1 : 1;
      data.users.push({ id: userId, name, email, password_hash: passwordHash });
      writeFallback(data);
    }
    const token = crypto.randomBytes(32).toString("hex");
    sessions.set(token, { id: userId, name, email });
    res.cookie("auth_token", token, { httpOnly: true, sameSite: "lax", maxAge: 30 * 24 * 60 * 60 * 1000 });
    res.json({ user: { id: userId, name, email } });
  } catch (error) {
    res.status(500).json({ error: "Account तयार करता आले नाही" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const user = await findUserByEmail(email);
    if (!user || !await bcrypt.compare(password, user.password_hash)) {
      return res.status(401).json({ error: "Email किंवा password चुकीचे आहे" });
    }
    const token = crypto.randomBytes(32).toString("hex");
    sessions.set(token, { id: user.id, name: user.name, email: user.email });
    res.cookie("auth_token", token, { httpOnly: true, sameSite: "lax", maxAge: 30 * 24 * 60 * 60 * 1000 });
    res.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: "Login करता आले नाही" });
  }
});

app.post("/api/logout", (req, res) => {
  if (req.cookies.auth_token) sessions.delete(req.cookies.auth_token);
  res.clearCookie("auth_token");
  res.json({ ok: true });
});

app.get("/api/me", authRequired, (req, res) => res.json({ user: req.user }));

app.get("/api/tracker/:date", authRequired, async (req, res) => {
  try {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(req.params.date)) return res.status(400).json({ error: "अवैध तारीख" });
    if (db) {
      const [rows] = await db.execute("SELECT * FROM daily_entries WHERE user_id=? AND entry_date=? LIMIT 1", [req.user.id, req.params.date]);
      return res.json({ entry: rows[0] || null });
    }
    const data = readFallback();
    res.json({ entry: data.entries[req.user.id]?.[req.params.date] || null });
  } catch (error) {
    res.status(500).json({ error: "नोंद मिळाली नाही" });
  }
});

app.put("/api/tracker/:date", authRequired, async (req, res) => {
  try {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(req.params.date)) return res.status(400).json({ error: "अवैध तारीख" });
    const entry = {
      water: Math.max(0, Number(req.body.water || 0)),
      breakfast: String(req.body.breakfast || "").slice(0, 500),
      exercise: Math.max(0, Number(req.body.exercise || 0)),
      lunch: String(req.body.lunch || "").slice(0, 500),
      dinner: String(req.body.dinner || "").slice(0, 500),
      walk: Math.max(0, Number(req.body.walk || 0)),
      submitted: Boolean(req.body.submitted),
      submitted_at: req.body.submitted ? new Date().toISOString() : null
    };
    if (db) {
      await db.execute(`INSERT INTO daily_entries (user_id,entry_date,water,breakfast,exercise,lunch,dinner,walk,submitted,submitted_at)
        VALUES (?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE water=VALUES(water),breakfast=VALUES(breakfast),exercise=VALUES(exercise),
        lunch=VALUES(lunch),dinner=VALUES(dinner),walk=VALUES(walk),submitted=VALUES(submitted),
        submitted_at=CASE WHEN VALUES(submitted)=1 THEN NOW() ELSE NULL END`,
        [req.user.id, req.params.date, entry.water, entry.breakfast, entry.exercise, entry.lunch, entry.dinner, entry.walk, entry.submitted ? 1 : 0, entry.submitted ? new Date() : null]);
    } else {
      const data = readFallback();
      data.entries[req.user.id] ||= {};
      data.entries[req.user.id][req.params.date] = entry;
      writeFallback(data);
    }
    res.json({ entry });
  } catch (error) {
    res.status(500).json({ error: "नोंद जतन करता आली नाही" });
  }
});

app.get("/api/export", authRequired, async (req, res) => {
  let rows = [];
  if (db) {
    const [dbRows] = await db.execute("SELECT entry_date,water,breakfast,exercise,lunch,dinner,walk,submitted,submitted_at FROM daily_entries WHERE user_id=? ORDER BY entry_date", [req.user.id]);
    rows = dbRows;
  } else {
    const data = readFallback();
    rows = Object.entries(data.entries[req.user.id] || {}).sort(([a], [b]) => a.localeCompare(b)).map(([entry_date, entry]) => ({ entry_date, ...entry }));
  }
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Daily Tracker");
  sheet.columns = [
    { header: "तारीख", key: "entry_date", width: 14 },
    { header: "पाणी (लीटर)", key: "water", width: 16 },
    { header: "नाश्ता", key: "breakfast", width: 25 },
    { header: "व्यायाम (मिनिटे)", key: "exercise", width: 18 },
    { header: "लंच", key: "lunch", width: 25 },
    { header: "डिनर", key: "dinner", width: 25 },
    { header: "चालणे (Steps)", key: "walk", width: 16 },
    { header: "Submit स्थिती", key: "submitted", width: 16 },
    { header: "Submit वेळ", key: "submitted_at", width: 20 }
  ];
  sheet.addRows(rows.map(row => ({
    ...row,
    submitted: row.submitted ? "Submit झाले" : "अपूर्ण",
    submitted_at: row.submitted_at ? new Date(row.submitted_at).toLocaleString("mr-IN") : ""
  })));
  sheet.getRow(1).font = { bold: true };
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", 'attachment; filename="daily-tracker.xlsx"');
  await workbook.xlsx.write(res);
  res.end();
});

connectDatabase().then(() => {
  const port = Number(process.env.PORT || 4173);
  app.listen(port, () => console.log(`App running at http://localhost:${port}`));
});
