import { AxiosInstance } from 'axios';
import { IRequestData } from './interfaces';

export class InvalidAxiosMethodError extends Error {}

export default class QueueTask {
  private requestData: IRequestData;

  constructor({ url, method, data, config, onResolve, onReject }: IRequestData) {
    this.requestData = { url, method, data, config, onResolve, onReject };
  }

  private doRequestAndGetPromise(client: AxiosInstance) {
    switch (this.requestData.method) {
      case 'get':
        return client.get(this.requestData.url, this.requestData.config);
      case 'delete':
        return client.delete(this.requestData.url, this.requestData.config);
      case 'post':
        return client.post(this.requestData.url, this.requestData.data, this.requestData.config);
      case 'patch':
        return client.patch(this.requestData.url, this.requestData.data, this.requestData.config);
      case 'put':
        return client.put(this.requestData.url, this.requestData.data, this.requestData.config);
      default:
        throw new InvalidAxiosMethodError(
          `Invalid method found for this request: ${this.requestData.method}`
        );
    }
  }

  public makeRequest(client: AxiosInstance, onFinally: () => void): void {
    this.doRequestAndGetPromise(client)
      .then(this.requestData.onResolve)
      .catch(this.requestData.onReject)
      .finally(() => onFinally());
  }

  public get data(): IRequestData {
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
