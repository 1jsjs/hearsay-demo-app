# hearsay-demo-app

A deliberately tiny login app (plain Node.js, no dependencies) that serves as the GitHub issue target
in the [Hearsay](https://github.com/1jsjs/hearsay) demo. Hearsay files issues here from things said
out loud, and the Hearsay Claude Code skill picks them up.

```bash
npm start            # http://localhost:3000/login
```

Demo accounts: `jinsu / hunter2`, `demo / demo`.

Structure:

- `server.js` — routes: `GET /login`, `POST /login`, `GET /dashboard`
- `src/auth.js` — the auth module: credential check and post-login redirect
- `public/` — the two pages

MIT licensed.
