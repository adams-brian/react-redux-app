import { IUser } from './store';

export const deleteUser = (id: string) =>
  fetch('http://localhost:4000/users/' + id, {
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    method: 'delete'
  })

export const loadUsers = async () => {
  const response = await fetch('http://localhost:4000/users');
  const json = await response.json();
  return [...json.data];
}

export const createUser = (user: IUser) =>
  fetch('http://localhost:4000/users', {
    body: JSON.stringify(user),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    method: 'put'
  })

export const updateUser = (user: IUser) =>
  fetch('http://localhost:4000/users/' + user._id, {
    body: JSON.stringify(user),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    method: 'post'
  })
