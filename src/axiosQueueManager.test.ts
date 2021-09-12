import axios from 'axios';
import AxiosQueueManager from './axiosQueueManager';

jest.mock('axios', () => ({
  get: jest.fn(),
}));
jest.useFakeTimers();

const mockedAxios = axios as jest.Mocked<typeof axios>;

const getManager = () => new AxiosQueueManager({ chunkSize: 2 });

it('Should call all chuncks', async () => {
  const handler = jest.fn();
  mockedAxios.get.mockImplementation(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        handler();
        resolve('Testing request');
      }, 500);
    });
  });

  const manager = getManager();

  manager.get('https://test.com');
  manager.get('https://test.com');
  manager.get('https://test.com');

  jest.runOnlyPendingTimers();

  expect(handler).toBeCalledTimes(2);

  jest.useRealTimers();

  await new Promise((resolve) => {
    setTimeout(() => resolve('Test can follow along'), 1000);
  });

  jest.useFakeTimers();
  jest.runOnlyPendingTimers();

  expect(handler).toBeCalledTimes(3);
});
