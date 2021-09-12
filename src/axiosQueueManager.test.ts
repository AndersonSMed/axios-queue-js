import axios from 'axios';
import AxiosQueueManager from './axiosQueueManager';

jest.mock('axios', () => ({
  get: jest.fn(),
  delete: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

it.each(['get', 'delete', 'post', 'put', 'patch'])(
  'Should handle all calls for method %s',
  async (methodName) => {
    const axiosQueueManager = new AxiosQueueManager({ chunkSize: 2 });
    const handler = jest.fn();

    mockedAxios[methodName].mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          handler();
          resolve('Testing request queue');
        }, 100);
      });
    });

    axiosQueueManager[methodName]('https://test.com');
    axiosQueueManager[methodName]('https://test.com');
    axiosQueueManager[methodName]('https://test.com');

    await new Promise((resolve) => {
      setTimeout(() => {
        expect(handler).toBeCalledTimes(2);
        resolve('Handler should be called two times');
      }, 200);
    });

    await new Promise((resolve) => {
      setTimeout(() => {
        expect(handler).toBeCalledTimes(3);
        resolve('Handler should be called three times');
      }, 100);
    });
  }
);

it('Should resolve promise successfully', async () => {
  const axiosQueueManager = new AxiosQueueManager({ chunkSize: 2 });

  mockedAxios.get.mockImplementation(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('Testing resolve handler');
      }, 100);
    });
  });

  await expect(axiosQueueManager.get('https://test.com')).resolves.toEqual(
    'Testing resolve handler'
  );
});

it('Should reject promise successfully', async () => {
  const axiosQueueManager = new AxiosQueueManager({ chunkSize: 2 });

  mockedAxios.get.mockImplementation(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Testing reject handling');
      }, 100);
    });
  });

  await expect(axiosQueueManager.get('https://test.com')).rejects.toEqual(
    'Testing reject handling'
  );
});
