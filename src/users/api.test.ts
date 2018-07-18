import * as fetchMock from 'fetch-mock';

import { createUser, deleteUser, loadUsers, updateUser } from './api';

const users = [
  {
    firstname: 'abc',
    id: '123',
    lastname: 'def'
  },
  {
    firstname: 'ghi',
    id: '456',
    lastname: 'jkl'
  }
];

describe('api', () => {
  
  afterEach(() => {
    fetchMock.restore();
  });

  it('deletes users', () => {
    const id = '123';
    fetchMock.postOnce(
      (url, opts: RequestInit) =>
        url === 'http://localhost:4000/graphql' &&
        opts.body === JSON.stringify({ query:
          `mutation { deleteUser( id: "${id}" ) { id } }`
        })
      , { data: { deleteUser: { id } }});
    return deleteUser(id).then(data => {
      expect(data).toBe(id);
      expect(fetchMock.done()).toBe(true);
    });
  });

  it('loads users', () => {
    fetchMock.postOnce(
      (url, opts: RequestInit) =>
        url === 'http://localhost:4000/graphql' &&
        opts.body === JSON.stringify({ query:
          `{ users { id firstname lastname } }`
        })
      , { data: { users } });
    return loadUsers().then(returnedUsers => {
      expect(returnedUsers).toEqual(users);
      expect(fetchMock.done()).toBe(true);
    });
  });

  it('creates users', () => {
    const id = "new_id";
    fetchMock.postOnce(
      (url, opts: RequestInit) =>
        url === 'http://localhost:4000/graphql' &&
        opts.body === JSON.stringify({ query:
          `mutation { createUser( firstname: "${users[0].firstname}", lastname: "${users[0].lastname}" ) { id } }`
        })
      , { data: { createUser: { id } } });
    return createUser(users[0]).then(newid => {
      expect(newid).toBe(id);
      expect(fetchMock.done()).toBe(true);
    });
  });

  it('updates users', () => {
    fetchMock.postOnce(
      (url, opts: RequestInit) =>
        url === 'http://localhost:4000/graphql' &&
        opts.body === JSON.stringify({ query:
          `mutation { updateUser( id: "${users[0].id}" firstname: "${users[0].firstname}", lastname: "${users[0].lastname}" ) { id } }`
        })
      , { data: { updateUser: { id: users[0].id } } });
    return updateUser(users[0]).then(id => {
      expect(id).toBe(users[0].id);
      expect(fetchMock.done()).toBe(true);
    });

  });

});
