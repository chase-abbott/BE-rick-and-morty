import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';

describe('demo routes', () => {
  let user = {
    username: 'chase',
    password: 'password'
  };

  let rick;

  beforeAll(() => {
    return setup(pool)
      .then(() => request(app).post('/api/auth/signup').send(user))
      .then(res => user = res.body);
  });

  it('tests the get route for all character resources', async () => {
    const { body } = await request(app)
      .get('/characters/all');

    expect(body.length).toBe(20);
  });

  it('adds a character as a favorite via POST', async () => {
    const character = {
      'id': 1,
      'name': 'Rick Sanchez',
      'status': 'Alive',
      'species': 'Human',
      'type': '',
      'gender': 'Male',
      'origin': {
        'name': 'Earth (C-137)',
        'url': 'https://rickandmortyapi.com/api/location/1'
      },
      'location': {
        'name': 'Earth (Replacement Dimension)',
        'url': 'https://rickandmortyapi.com/api/location/20'
      },
      'image': 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      'episode': [],
      'url': 'https://rickandmortyapi.com/api/character/1',
      'created': '2017-11-04T18:48:46.250Z'
    };

    const { body } = await request(app)
      .post('/characters/user')
      .send({ character, user });
    
    expect(body).toEqual({
      characterId: 1,
      userId: '1',
      name: 'Rick Sanchez',
      status: 'Alive',
      location: { name:'Earth (Replacement Dimension)', url:'https://rickandmortyapi.com/api/location/20' },        
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg'
    });

    rick = body;
  });

  it('gets all of a user\'s favorite characters', async () => {
    const { body } = await request(app)
      .get(`/characters/user/${user.userId}`);

    expect(body).toEqual(expect.arrayContaining([{
      characterId: 1,
      userId: '1',
      name: 'Rick Sanchez',
      status: 'Alive',
      location: { name:'Earth (Replacement Dimension)', url:'https://rickandmortyapi.com/api/location/20' },        
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg'
    }]));
  });

  it('updates aspects of the user\'s character', async () => {
   
  });

  it('deletes a user\'s favorite character', async () => {
    const { body } = await request(app)
      .delete(`/characters/user/${rick.characterId}/${user.userId}`);

    expect(body).toEqual(rick);

    const getReq = await request(app)
      .get(`/characters/user/${user.userId}`);

    expect(getReq.body).toEqual([]);
  });
});
