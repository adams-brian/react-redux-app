export const saveCounters = (counters: number[]) =>
  fetch('http://localhost:4000/counters', {
    body: JSON.stringify({counters}),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    method: 'post',
  })

export const loadCounters = async (): Promise<number[]> => {
  const response = await fetch('http://localhost:4000/counters');
  const json = await response.json();
  return [...json.data];
}
