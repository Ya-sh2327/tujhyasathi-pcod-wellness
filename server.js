const express = require("express");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

const app = express();
app.use(express.json({ limit: "512kb" }));
app.use(cookieParser());
app.use(express.static(__dirname));

const sessions = new Map();
const DEFAULT_USER = {
  name: "Hemangini Patil",
  password: "Hemangini@2327"
};

function authRequired(req, res, next) {
  const token = req.cookies.auth_token;
  const session = token ? sessions.get(token) : null;
  if (!session) return res.status(401).json({ error: "कृपया पुन्हा login करा" });
  req.user = session;
  next();
}

app.post("/api/login", (req, res) => {
  const username = String(req.body.username || req.body.email || "").trim();
  const password = String(req.body.password || "");
  if (username !== DEFAULT_USER.name || password !== DEFAULT_USER.password) {
    return res.status(401).json({ error: "Username किंवा Password चुकीचे आहे" });
  }
  const token = crypto.randomBytes(24).toString("hex");
  sessions.set(token, { name: DEFAULT_USER.name });
  res.cookie("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000
  });
  res.json({ user: { name: DEFAULT_USER.name } });
});

app.post("/api/logout", (req, res) => {
  if (req.cookies.auth_token) sessions.delete(req.cookies.auth_token);
  res.clearCookie("auth_token");
  res.json({ ok: true });
});

app.get("/api/me", authRequired, (req, res) => {
  res.json({ user: req.user });
});

app.listen(Number(process.env.PORT || 4173), () => {
  console.log(`App running on port ${process.env.PORT || 4173}`);
});
