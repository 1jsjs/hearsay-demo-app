import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { authenticate, redirectAfterLogin } from './src/auth.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3000);

const page = (name) => fs.readFileSync(path.join(here, 'public', name), 'utf8');

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => (data += c));
    req.on('end', () => resolve(Object.fromEntries(new URLSearchParams(data))));
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/login')) {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    return res.end(page('login.html').replace('{{next}}', url.searchParams.get('next') || '/dashboard'));
  }

  if (req.method === 'POST' && url.pathname === '/login') {
    const { username, password, next } = await readBody(req);
    const session = authenticate(username, password);
    if (!session) {
      res.writeHead(302, { location: '/login?error=1' });
      return res.end();
    }
    res.writeHead(302, {
      'set-cookie': `session=${session.token}; HttpOnly; Path=/`,
      location: redirectAfterLogin(session, next),
    });
    return res.end();
  }

  if (req.method === 'GET' && url.pathname === '/dashboard') {
    const loggedIn = /session=/.test(req.headers.cookie || '');
    if (!loggedIn) {
      res.writeHead(302, { location: '/login?next=/dashboard' });
      return res.end();
    }
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    return res.end(page('dashboard.html'));
  }

  res.writeHead(404, { 'content-type': 'text/plain' });
  res.end('not found');
});

server.listen(PORT, () => console.log(`hearsay-demo-app listening on http://localhost:${PORT}/login`));
