import { AxiosInstance } from 'axios';
import { v4 as uuid } from 'uuid';
import { IRequestData } from './interfaces';

interface KeyedRequestData extends IRequestData {
  id: string;
}

export default class QueueTask {
  private requestData: KeyedRequestData;

  constructor({ url, method, data, config, onResolve, onReject }: IRequestData) {
    this.requestData = { id: uuid(), url, method, data, config, onResolve, onReject };
  }

  public makeRequest(client: AxiosInstance, onFinally: () => void): void {
    switch (this.requestData.method) {
      case 'get':
        client
          .get(this.requestData.url, this.requestData.config)
          .then(this.requestData.onResolve)
          .catch(this.requestData.onReject)
          .finally(() => onFinally());
        return;
      case 'delete':
        client
          .delete(this.requestData.url, this.requestData.config)
          .then(this.requestData.onResolve)
          .catch(this.requestData.onReject)
          .finally(() => onFinally());
        return;
      case 'post':
        client
          .post(this.requestData.url, this.requestData.data, this.requestData.config)
          .then(this.requestData.onResolve)
          .catch(this.requestData.onReject)
          .finally(() => onFinally());
        return;
      case 'patch':
        client
          .patch(this.requestData.url, this.requestData.data, this.requestData.config)
          .then(this.requestData.onResolve)
          .catch(this.requestData.onReject)
          .finally(() => onFinally());
        return;
      case 'put':
        client
          .put(this.requestData.url, this.requestData.data, this.requestData.config)
          .then(this.requestData.onResolve)
          .catch(this.requestData.onReject)
          .finally(() => onFinally());
        return;
      default:
        throw new Error(`Invalid method found for this request: ${this.requestData.method}`);
    }
  }

  public get data(): KeyedRequestData {
    return this.requestData;
  }

  public static create({
    url,
    method,
    data,
    config,
    onResolve,
    onReject,
  }: IRequestData): QueueTask {
    return new QueueTask({ url, method, data, config, onResolve, onReject });
  }
}
