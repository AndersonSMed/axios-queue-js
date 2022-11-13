/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from 'axios';
import QueueTask, { InvalidAxiosMethodError } from './queueTask';

jest.mock('axios');

it('Should create QueueTask instance using buildInstanceer', () => {
  const onResolve = jest.fn();
  const onReject = jest.fn();

  const task = QueueTask.buildInstance({
    url: 'https://test.com',
    data: { key: 'value' },
    config: { headers: {} },
    method: 'get',
    onResolve,
    onReject,
  });

  expect(task).toBeInstanceOf(QueueTask);
  expect(task.data).toEqual({
    id: expect.any(String),
    url: 'https://test.com',
    method: 'get',
    data: { key: 'value' },
    config: { headers: {} },
    onResolve,
    onReject,
  });
});

it.each(['get', 'delete'])('Should make request for method %s', async (method) => {
  const axiosMethod = method as 'get' | 'delete';
  axios[axiosMethod] = jest.fn().mockResolvedValue({});

  const task = new QueueTask({
    url: 'https://test.com',
    method: axiosMethod,
    config: { headers: {} },
    onResolve: jest.fn(),
    onReject: jest.fn(),
  });

  task.makeRequest(axios, jest.fn());

  expect(axios[axiosMethod]).toHaveBeenCalledWith('https://test.com', { headers: {} });
});

it.each(['post', 'put'])('Should make request for method %s with data', async (method) => {
  const axiosMethod = method as 'post' | 'put';
  axios[axiosMethod] = jest.fn().mockResolvedValue({});

  const task = new QueueTask({
    url: 'https://test.com',
    method: axiosMethod,
    data: { key: 'value' },
    config: { headers: {} },
    onResolve: jest.fn(),
    onReject: jest.fn(),
  });

  task.makeRequest(axios, jest.fn());

  expect(axios[axiosMethod]).toHaveBeenCalledWith(
    'https://test.com',
    { key: 'value' },
    { headers: {} }
  );
});

it('Should throw an exception when calling makeRequest with invalid method', () => {
  const task = new QueueTask({
    url: 'https://test.com',
    // @ts-ignore
    method: 'invalidmethod',
    onResolve: jest.fn(),
    onReject: jest.fn(),
  });

  try {
    task.makeRequest(axios, jest.fn());
  } catch (error) {
    expect(error).toBeInstanceOf(InvalidAxiosMethodError);
    expect(String(error)).toBe('Error: Invalid method found for this request: invalidmethod');
  }
});
