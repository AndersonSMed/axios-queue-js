import axios from 'axios';
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

  public makeRequest(onFinally: () => void): void {
    switch (this.requestData.method) {
      case 'get':
        axios
          .get(this.requestData.url, this.requestData.config)
          .then(this.requestData.onResolve)
          .catch(this.requestData.onReject)
          .finally(() => onFinally());
        return;
      case 'delete':
        axios
          .delete(this.requestData.url, this.requestData.config)
          .then(this.requestData.onResolve)
          .catch(this.requestData.onReject)
          .finally(() => onFinally());
        return;
      case 'post':
        axios
          .post(this.requestData.url, this.requestData.data, this.requestData.config)
          .then(this.requestData.onResolve)
          .catch(this.requestData.onReject)
          .finally(() => onFinally());
        return;
      case 'patch':
        axios
          .patch(this.requestData.url, this.requestData.data, this.requestData.config)
          .then(this.requestData.onResolve)
          .catch(this.requestData.onReject)
          .finally(() => onFinally());
        return;
      case 'put':
        axios
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
