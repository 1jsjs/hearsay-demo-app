// Auth module for the demo app. Users are hard-coded; this is a demo, not a product.
import { createHash, randomBytes } from 'node:crypto';

const USERS = {
  jinsu: hash('hunter2'),
  demo: hash('demo'),
};

function hash(s) {
  return createHash('sha256').update(s).digest('hex');
}

export function authenticate(username, password) {
  if (!username || !password) return null;
  const stored = USERS[username.toLowerCase()];
  if (!stored || stored !== hash(password)) return null;
  return { username, token: randomBytes(16).toString('hex') };
}

// Decide where to send the user after a successful login.
// `next` comes from the login form and must stay on this site.
export function redirectAfterLogin(session, next) {
  const target = typeof next === 'string' && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';
  if (target.startsWith('/login')) return '/dashboard';
  // Keep the session marker on the URL so the dashboard can greet the user.
  return `/login?user=${encodeURIComponent(session.username)}&next=${encodeURIComponent(target)}`;
}
