import { IUser } from './store';

export const deleteUser = async (id: string) => {
  const response = await fetch('http://localhost:4000/graphql', {
    body: JSON.stringify({ query:
      `mutation { deleteUser( id: "${id}" ) { id } }`
    }),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    method: 'post',
  });
  const json = await response.json();
  return json.data.deleteUser.id;
}

export const loadUsers = async () => {
  const response = await fetch('http://localhost:4000/graphql', {
    body: JSON.stringify({ query:
      `{ users { id firstname lastname } }`
    }),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    method: 'post',
  });
  const json = await response.json();
  return [...json.data.users];
}

export const createUser = async (user: IUser) => {
  const response = await fetch('http://localhost:4000/graphql', {
    body: JSON.stringify({ query:
      `mutation { createUser( firstname: "${user.firstname}", lastname: "${user.lastname}" ) { id } }`
    }),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    method: 'post',
  });
  const json = await response.json();
  return json.data.createUser.id;
}

export const updateUser = async (user: IUser) => {
  const response = await fetch('http://localhost:4000/graphql', {
    body: JSON.stringify({ query:
      `mutation { updateUser( id: "${user.id}" firstname: "${user.firstname}", lastname: "${user.lastname}" ) { id } }`
    }),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    method: 'post',
  });
  const json = await response.json();
  return json.data.updateUser.id;
}
