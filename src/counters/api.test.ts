import * as fetchMock from 'fetch-mock';

import { loadCounters, saveCounters } from './api';

const counters = [5,1,4,2,3];

describe('api', () => {

  afterEach(() => {
    fetchMock.restore();
  });

  it('loads counters', () => {
    fetchMock.getOnce('http://localhost:4000/counters', { data: counters });
    return loadCounters().then(data => {
      expect(data).toEqual(counters);
      expect(fetchMock.done()).toBe(true);
    });
  });

  it('saves counters', () => {
    fetchMock.postOnce(
      (url, opts: RequestInit) =>
        url === 'http://localhost:4000/counters' &&
        opts.body === JSON.stringify({counters})
      , 200);
    saveCounters(counters);
    expect(fetchMock.done()).toBe(true);
  });
  
});
