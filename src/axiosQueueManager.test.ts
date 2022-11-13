import axios from 'axios';
import AxiosQueueManager from './axiosQueueManager';

jest.mock('axios', () => ({
  get: jest.fn(),
  delete: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  create: () => ({
    get: jest.fn(() => Promise.resolve()),
  }),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

async function waitFor(ms: number) {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve('');
    }, ms);
  });
}

it('Should handle all enqueued calls', async () => {
  const timeoutMilliseconds = 4;
  const axiosQueueManager = new AxiosQueueManager({ queueSize: 2 });
  const handler = jest.fn();

  mockedAxios.get.mockImplementation(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        handler();
        resolve('Testing request queue');
      }, timeoutMilliseconds);
    });
  });

  axiosQueueManager.get('');
  axiosQueueManager.get('');
  axiosQueueManager.get('');
  axiosQueueManager.get('');
  axiosQueueManager.get('');
  axiosQueueManager.get('');
  axiosQueueManager.get('');
  axiosQueueManager.get('');
  axiosQueueManager.get('');

  await waitFor(timeoutMilliseconds);
  expect(handler).toBeCalledTimes(2);

  await waitFor(timeoutMilliseconds);
  expect(handler).toBeCalledTimes(4);

  await waitFor(timeoutMilliseconds);
  expect(handler).toBeCalledTimes(6);

  await waitFor(timeoutMilliseconds);
  expect(handler).toBeCalledTimes(8);
});

it('Should resolve promise successfully', async () => {
  const axiosQueueManager = new AxiosQueueManager({ queueSize: 2 });

  mockedAxios.get.mockImplementation(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('Testing resolve handler');
      }, 0);
    });
  });

  await expect(axiosQueueManager.get('https://test.com')).resolves.toEqual(
    'Testing resolve handler'
  );
});

it('Should reject promise successfully', async () => {
  const axiosQueueManager = new AxiosQueueManager({ queueSize: 2 });

  mockedAxios.get.mockImplementation(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Testing reject handling');
      }, 0);
    });
  });

  await expect(axiosQueueManager.get('https://test.com')).rejects.toEqual(
    'Testing reject handling'
  );
});

it('Should work with custom client', () => {
  const client = mockedAxios.create();

  const axiosQueueManager = new AxiosQueueManager({ queueSize: 2, client });

  axiosQueueManager.get('https://test.com');

  expect(client.get).toBeCalled();
});
