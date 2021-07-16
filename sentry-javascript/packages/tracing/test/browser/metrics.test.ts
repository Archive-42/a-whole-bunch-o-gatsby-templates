import { Span, Transaction } from '../../src';
import { _startChild, addResourceSpans, ResourceEntry } from '../../src/browser/metrics';

describe('_startChild()', () => {
  it('creates a span with given properties', () => {
    const transaction = new Transaction({ name: 'test' });
    const span = _startChild(transaction, {
      description: 'evaluation',
      op: 'script',
    });

    expect(span).toBeInstanceOf(Span);
    expect(span.description).toBe('evaluation');
    expect(span.op).toBe('script');
  });

  it('adjusts the start timestamp if child span starts before transaction', () => {
    const transaction = new Transaction({ name: 'test', startTimestamp: 123 });
    const span = _startChild(transaction, {
      description: 'script.js',
      op: 'resource',
      startTimestamp: 100,
    });

    expect(transaction.startTimestamp).toEqual(span.startTimestamp);
    expect(transaction.startTimestamp).toEqual(100);
  });

  it('does not adjust start timestamp if child span starts after transaction', () => {
    const transaction = new Transaction({ name: 'test', startTimestamp: 123 });
    const span = _startChild(transaction, {
      description: 'script.js',
      op: 'resource',
      startTimestamp: 150,
    });

    expect(transaction.startTimestamp).not.toEqual(span.startTimestamp);
    expect(transaction.startTimestamp).toEqual(123);
  });
});

describe('addResourceSpans', () => {
  const transaction = new Transaction({ name: 'hello' });
  beforeEach(() => {
    transaction.startChild = jest.fn();
  });

  // We already track xhr, we don't need to use
  it('does not create spans for xmlhttprequest', () => {
    const entry: ResourceEntry = {
      initiatorType: 'xmlhttprequest',
      transferSize: 256,
      encodedBodySize: 256,
      decodedBodySize: 256,
    };
    addResourceSpans(transaction, entry, '/assets/to/me', 123, 456, 100);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(transaction.startChild).toHaveBeenCalledTimes(0);
  });

  it('does not create spans for fetch', () => {
    const entry: ResourceEntry = {
      initiatorType: 'fetch',
      transferSize: 256,
      encodedBodySize: 256,
      decodedBodySize: 256,
    };
    addResourceSpans(transaction, entry, '/assets/to/me', 123, 456, 100);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(transaction.startChild).toHaveBeenCalledTimes(0);
  });

  it('creates spans for resource spans', () => {
    const entry: ResourceEntry = {
      initiatorType: 'css',
      transferSize: 256,
      encodedBodySize: 456,
      decodedBodySize: 593,
    };

    const timeOrigin = 100;
    const startTime = 23;
    const duration = 356;

    const endTimestamp = addResourceSpans(transaction, entry, '/assets/to/css', startTime, duration, timeOrigin);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(transaction.startChild).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(transaction.startChild).toHaveBeenLastCalledWith({
      data: {
        ['Decoded Body Size']: entry.decodedBodySize,
        ['Encoded Body Size']: entry.encodedBodySize,
        ['Transfer Size']: entry.transferSize,
      },
      description: '/assets/to/css',
      endTimestamp: timeOrigin + startTime + duration,
      op: 'resource.css',
      startTimestamp: timeOrigin + startTime,
    });

    expect(endTimestamp).toBe(timeOrigin + startTime + duration);
  });

  it('creates a variety of resource spans', () => {
    const table = [
      {
        initiatorType: undefined,
        op: 'resource',
      },
      {
        initiatorType: '',
        op: 'resource',
      },
      {
        initiatorType: 'css',
        op: 'resource.css',
      },
      {
        initiatorType: 'image',
        op: 'resource.image',
      },
      {
        initiatorType: 'script',
        op: 'resource.script',
      },
    ];

    for (const { initiatorType, op } of table) {
      const entry: ResourceEntry = {
        initiatorType,
      };
      addResourceSpans(transaction, entry, '/assets/to/me', 123, 234, 465);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(transaction.startChild).toHaveBeenLastCalledWith(
        expect.objectContaining({
          op,
        }),
      );
    }
  });

  it('allows for enter size of 0', () => {
    const entry: ResourceEntry = {
      initiatorType: 'css',
      transferSize: 0,
      encodedBodySize: 0,
      decodedBodySize: 0,
    };

    addResourceSpans(transaction, entry, '/assets/to/css', 100, 23, 345);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(transaction.startChild).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(transaction.startChild).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: {
          ['Decoded Body Size']: entry.decodedBodySize,
          ['Encoded Body Size']: entry.encodedBodySize,
          ['Transfer Size']: entry.transferSize,
        },
      }),
    );
  });
});
