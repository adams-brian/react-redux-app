import * as fetchMock from 'fetch-mock';

import { loadCounters, saveCounters } from './api';

const counters = [5,1,4,2,3];

describe('api', () => {

  afterEach(() => {
    fetchMock.restore();
  });

  it('loads counters', () => {
    fetchMock.postOnce(
      (url, opts: RequestInit) =>
        url === 'http://localhost:4000/graphql' &&
        opts.body === JSON.stringify({ query: '{ counters }'})
      , { data: { counters }});
    return loadCounters().then(data => {
      expect(data).toEqual(counters);
      expect(fetchMock.done()).toBe(true);
    });
  });

  it('saves counters', () => {
    fetchMock.postOnce(
      (url, opts: RequestInit) =>
        url === 'http://localhost:4000/graphql' &&
        opts.body === JSON.stringify({ query: `mutation { saveCounters( counters: ${JSON.stringify(counters)} ) }` })
      , { data: { saveCounters: counters }});
    return saveCounters(counters).then(data => {
      expect(data).toEqual(counters);
      expect(fetchMock.done()).toBe(true);
    });

  });
  
});
