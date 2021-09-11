import { AxiosResponse } from 'axios';
import { IAxiosConfig, IAxiosManager } from './interfaces';
import QueueRequest, { RequestInfo } from './queueRequest';

class AxiosManager implements IAxiosManager {
  taskQueue: QueueRequest[];

  constructor() {
    this.taskQueue = [];
  }

  private createTask({ url, data, config, method, onResolve, onReject }: RequestInfo) {
    this.taskQueue.push(QueueRequest.create({ url, data, config, method, onResolve, onReject }));
  }

  get(url: string, config?: IAxiosConfig) {
    return new Promise<AxiosResponse<any>>((resolve, reject) => {
      this.createTask({ method: 'get', url, config, onResolve: resolve, onReject: reject });
    });
  }

  delete(url: string, config?: IAxiosConfig) {
    return new Promise<AxiosResponse<any>>((resolve, reject) => {
      this.createTask({ method: 'delete', url, config, onResolve: resolve, onReject: reject });
    });
  }

  post(url: string, data?: any, config?: IAxiosConfig) {
    return new Promise<AxiosResponse<any>>((resolve, reject) => {
      this.createTask({ method: 'post', data, url, config, onResolve: resolve, onReject: reject });
    });
  }

  patch(url: string, data?: any, config?: IAxiosConfig) {
    return new Promise<AxiosResponse<any>>((resolve, reject) => {
      this.createTask({ method: 'patch', data, url, config, onResolve: resolve, onReject: reject });
    });
  }

  put(url: string, data?: any, config?: IAxiosConfig) {
    return new Promise<AxiosResponse<any>>((resolve, reject) => {
      this.createTask({ method: 'put', data, url, config, onResolve: resolve, onReject: reject });
    });
  }
}

export default new AxiosManager();
