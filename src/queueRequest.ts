import { AxiosResponse } from 'axios';
import { v4 as uuid } from 'uuid';
import { IHttpMethod, IAxiosConfig } from './interfaces';

export interface RequestInfo {
  onResolve: (value: AxiosResponse<any> | PromiseLike<AxiosResponse<any>>) => void;
  onReject: (reason?: any) => void;
  url?: string;
  method?: IHttpMethod;
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

  public get(): RequestInfo {
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
