export const loadCounters = async (): Promise<number[]> => {
  const response = await fetch('http://localhost:4000/graphql', {
    body: JSON.stringify({ query: '{ counters }' }),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    method: 'post',
  });
  const json = await response.json();
  return [...json.data.counters];
}

export const saveCounters = async (counters: number[]) => {
  const response = await fetch('http://localhost:4000/graphql', {
    body: JSON.stringify({ query: `mutation { saveCounters( counters: ${JSON.stringify(counters)} ) }` }),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    method: 'post',
  });
  const json = await response.json();
  return [...json.data.saveCounters];
}
