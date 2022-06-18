# AxiosQueue.js

## Description

AxiosQueue.js is a wrapper of axios which enables you to enqueue axios requests and run them in a pipeline.

## Instalation

`npm install axios-queue-js` for npm users and `yarn add axios-queue-js` for yarn users.

## Usage

```typescript
import axios from 'axios-queue-js';

axios.get('https://endpoint.test.net').then((response) => {
  console.log('Hey look, I am getting a response using AxiosQueue.js :D');
});

axios.post('https://endpoint.test.net', {}).then((response) => {
  console.log('Hey look, I am posting something and getting a response using AxiosQueue.js :D');
});
```

## Customizing

If you want to customize the queue length, you can create your own AxiosQueue.js and use it as a client, just like below.

```typescript
import { AxiosQueueManager } from 'axios-queue-js';

const client = new AxiosQueueManager({ queueSize: 10 });

client.get('https://endpoint.test.net').then((response) => {
  console.log('Hey look, I am getting a response using AxiosQueue.js :D');
});
```

## Configuration

As showed previously, you can create and configure your own AxiosQueueManager instance, which can receives an object with the following configs.

| Key       | Optional | Default Value | Type          | Description                                               |
| --------- | -------- | ------------- | ------------- | --------------------------------------------------------- |
| queueSize | True     | 10            | Number        | Represents the queue's maximum size                       |
| client    | True     | axios.default | AxiosInstance | Can be set to use a custom axios instance in the requests |
