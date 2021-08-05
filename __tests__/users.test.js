import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';

describe('user auth routes', () => {
  beforeAll(() => {
    return setup(pool);
  });
  const user = {
    username: 'chase',
    password: 'password'
  };
  it('tests a signup route', async () => {
    const { body } = await request(app)
      .post('/api/auth/signup')
      .send(user);

    expect(body).toEqual({ username: 'chase', userId: '1' });
  });

  it('logs a user in who has already signed up', async () => {
    const { body } = await request(app)
      .post('/api/auth/login')
      .send(user);
    
    expect(body).toEqual({ username: 'chase', userId: '1' });

    const newReq = await request(app)
      .post('/api/auth/login')
      .send({ username: 'chase', password: 'p' });

    expect(newReq.text).toEqual('Invalid Username or Password');

  });
});
