import { AxiosResponse } from 'axios';
import { IAxiosConfig, IAxiosManager } from './interfaces';
import QueueRequest, { RequestInfo } from './queueRequest';

class AxiosManager implements IAxiosManager {
  private chunkSize: number;

  private tasksQueue: QueueRequest[];

  private requestQueue: QueueRequest[];

  constructor() {
    this.chunkSize = 30;
    this.requestQueue = [];
    this.tasksQueue = [];
  }

  private makeRequests() {
    this.requestQueue.map((request) =>
      request.makeRequest(() => {
        this.requestQueue = this.requestQueue.filter(
          (newRequests) => newRequests.data.id !== request.data.id
        );
        this.checkQueue();
      })
    );
  }

  private checkQueue() {
    const emptyRequestSlots = this.chunkSize - this.requestQueue.length;
    if (emptyRequestSlots > 0 && this.tasksQueue.length > 0) {
      this.requestQueue.concat(this.tasksQueue.slice(0, emptyRequestSlots));
      this.tasksQueue = this.tasksQueue.slice(0, emptyRequestSlots);
      this.makeRequests();
    }
  }

  private createTask({ url, data, config, method, onResolve, onReject }: RequestInfo) {
    this.tasksQueue.push(QueueRequest.create({ url, data, config, method, onResolve, onReject }));
    this.checkQueue();
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
