import express from "express";
import crypto from "crypto";

const router = express.Router();

let users = Object.create(null);

router.get("/newUser", (req, res) => {
  let username = req.query.username || "";
  const password = req.query.password || "";
  username = username.replace(/[^a-zA-Z0-9]/g, "");
  if (!username || !password || users[username]) {
    return res.sendStatus(400);
  }
  const salt = crypto.randomBytes(128).toString("base64");
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, "sha512");
  users[username] = { salt, hash };
  // for (let i = 0; i < 1e9; i++) {}
  res.sendStatus(200);
});

router.get("/auth", (req, res) => {
  let username = req.query.username || "";
  const password = req.query.password || "";
  username = username.replace(/[^a-zA-Z0-9]/g, "");
  if (!username || !password || !users[username]) {
    return res.sendStatus(400);
  }
  // for (let i = 0; i < 1e9; i++) {}
  crypto.pbkdf2(
    password,
    users[username].salt,
    10000,
    512,
    "sha512",
    (err, hash) => {
      if (users[username].hash.toString() === hash.toString()) {
        res.sendStatus(200);
      } else {
        res.sendStatus(401);
      }
    }
  );
});

// To test Sync func when profiling:

// app.get('/auth', (req, res) => {
//   let username = req.query.username || '';
//   const password = req.query.password || '';
//   username = username.replace(/[^a-zA-Z0-9]/g, '');
//   if (!username || !password || !users[username]) {
//     return res.sendStatus(400);
//   }
//   console.info('req.query :', req.query)
//   const { salt, hash } = users[username];
//   console.info('users:', users)
//   const encryptHash = crypto.pbkdf2Sync(password, salt, 500000, 512, 'sha512');
//   console.info('encryptHash: ', encryptHash)

//   for (let i = 0; i < 1e9; i++) {}
//   if (crypto.timingSafeEqual(hash, encryptHash)) {
//     res.sendStatus(200);
//   } else {
//     res.sendStatus(401);
//   }
// });

export default router;