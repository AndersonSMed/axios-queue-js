import axios from 'axios';
import AxiosManager from './axiosManager';

jest.mock('axios', () => ({
  get: jest.fn(),
}));
jest.useFakeTimers();

const mockedAxios = axios as jest.Mocked<typeof axios>;

const getManager = () => new AxiosManager({ chunkSize: 2 });

it('Should call queued chuncks', () => {
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
});
