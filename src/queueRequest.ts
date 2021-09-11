import axios, { AxiosResponse } from 'axios';
import { v4 as uuid } from 'uuid';
import { IHttpMethod, IAxiosConfig } from './interfaces';

export interface RequestInfo {
  onResolve: (value: AxiosResponse<any> | PromiseLike<AxiosResponse<any>>) => void;
  onReject: (reason?: any) => void;
  url: string;
  method: IHttpMethod;
  data?: any;
  config?: IAxiosConfig;
}

interface KeyedRequestInfo extends RequestInfo {
  id: string;
}

export default class QueueRequest {
  private requestData: KeyedRequestInfo;

  constructor({ url, method, data, config, onResolve, onReject }: RequestInfo) {
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

  public get data(): KeyedRequestInfo {
    return this.requestData;
  }

  public static create({
    url,
    method,
    data,
    config,
    onResolve,
    onReject,
  }: RequestInfo): QueueRequest {
    return new QueueRequest({ url, method, data, config, onResolve, onReject });
  }
}
