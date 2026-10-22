import { test } from 'node:test';
import assert from 'node:assert/strict';
import { authenticate, redirectAfterLogin } from '../src/auth.js';

test('authenticate accepts a demo account and rejects wrong passwords', () => {
  assert.ok(authenticate('demo', 'demo'));
  assert.equal(authenticate('demo', 'nope'), null);
  assert.equal(authenticate('', ''), null);
});

test('redirectAfterLogin never sends the user off-site', () => {
  const session = { username: 'demo', token: 't' };
  for (const bad of ['https://evil.example', '//evil.example', undefined]) {
    assert.ok(!redirectAfterLogin(session, bad).startsWith('http'));
  }
});
