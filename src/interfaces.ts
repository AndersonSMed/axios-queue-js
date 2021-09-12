import { AxiosRequestConfig, AxiosResponse } from 'axios';

export type IAxiosConfig = AxiosRequestConfig | undefined;

export type IHttpMethod = 'get' | 'post' | 'patch' | 'put' | 'delete';

export interface IRequestData {
  onResolve: (value: AxiosResponse<any> | PromiseLike<AxiosResponse<any>>) => void;
  onReject: (reason?: any) => void;
  url: string;
  method: IHttpMethod;
  data?: any;
  config?: IAxiosConfig;
}

export interface IAxiosQueueManager {
  get: (url: string, config?: IAxiosConfig) => Promise<AxiosResponse<any>>;
  delete: (url: string, config?: IAxiosConfig) => Promise<AxiosResponse<any>>;
  post: (url: string, data?: any, config?: IAxiosConfig) => Promise<AxiosResponse<any>>;
  patch: (url: string, data?: any, config?: IAxiosConfig) => Promise<AxiosResponse<any>>;
  put: (url: string, data?: any, config?: IAxiosConfig) => Promise<AxiosResponse<any>>;
}
