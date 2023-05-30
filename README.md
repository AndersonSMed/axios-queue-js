## Why use axios-queue-js?

`axios-queue-js` is a lightweight wrapper of `axios` that enables you to make requests using a queue. In simple words, it improves significantly the performance of your requests, once no request is made unless there's an open slot for it. This lib works for both web and node environments and can be easily placed in codebases that already use `axios` to handle requests, even if they are using a custom client.

## Performance of axios with axios-queue-js

> All the following results were colleted by doing requests to a localhost server and all the scripts used the default configs for axios-queue-js.

The following chart represents the performance of a node script trying to do 1k sequential requests using nothing but `axios`.

After almost 2min of execution, `axios` triggered an error that terminated the script, that was able to do and finish only 209 requests.

![axios chart](/benchmark-results/axios.png "axios chart")

Now you can see the results of the same test after using `axios` along with `axios-queue-js` in the script.

It's worth mentioning that all the 1k requests were successfully made in only 6 seconds. That is about **5x more requests being made in only 5% of the time**.

![axios-queue-js results](/benchmark-results/axios-queue-js.png "axios-queue-js results")

For the next chart we repreated the previous testing, but this time with **100k requests**.

As you can see below, `axios-queue-js` was able to make `axios` handle about **478x more requests in only 3x more time than axios did alone**.

![axios-queue-js results](/benchmark-results/axios-queue-js-100k.png "axios-queue-js results after 100k requests")

## Usage

You can install `axios-queue-js` by running a `npm install axios-queue-js` or `yarn add axios-queue-js` in your project. After that you can use it as follows.

```typescript
// By using module imports
import axios from 'axios-queue-js';

axios.get('https://endpoint.test.net').then((response) => {
  console.log('Hey look, I am getting a response using axios-queue-js :D');
});

axios.post('https://endpoint.test.net', {}).then((response) => {
  console.log('Hey look, I am posting something and getting a response using axios-queue-js :D');
});
```

```typescript
// By using commonjs
const { default: axios } = require('axios-queue-js');

axios.get('https://endpoint.test.net').then((response) => {
  console.log('Hey look, I am getting a response using axios-queue-js :D');
});

axios.post('https://endpoint.test.net', {}).then((response) => {
  console.log('Hey look, I am posting something and getting a response using axios-queue-js :D');
});
```

## Customizing

If you want to customize the queue length or even use an external axios client to handle the requests, you can create your own `AxiosQueueManager` instance and use it as you will. Eg.:

```typescript
// By using module imports
import axios from 'axios';
import { AxiosQueueManager } from 'axios-queue-js';

const axiosQueueClient = new AxiosQueueManager({ queueSize: 10, client: axios.create() });

axiosQueueClient.get('https://endpoint.test.net').then((response) => {
  console.log('Hey look, I am getting a response using axios-queue-js :D');
});
```

```typescript
// By using commonjs
const axios = require('axios')
const { AxiosQueueManager } = require('axios-queue-js');

const axiosQueueClient = new AxiosQueueManager({ queueSize: 10, client: axios.create() });

axiosQueueClient.get('https://endpoint.test.net').then((response) => {
  console.log('Hey look, I am getting a response using axios-queue-js :D');
});
```

Following is a table with all the possible properties that you can set when creating your own `AxiosQueueManager` instance.

| Key       | Optional | Default Value | Type          | Description                                                                   |
| --------- | -------- | ------------- | ------------- | ----------------------------------------------------------------------------- |
| queueSize | True     | 10            | Number        | Represents the queue's maximum size                                           |
| client    | True     | axios.default | AxiosInstance | Custom axios instance that will be used under the hood to handle the requests |
