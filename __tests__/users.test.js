import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';

describe('user auth routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('tests a signup route', async () => {
    const user = {
      username: 'chase',
      password: 'password'
    };
    const { body } = await request(app)
      .post('/api/auth/signup')
      .send(user);

    expect(body).toEqual({ username: 'chase', userId: '1' });
  });
});
