import { AxiosResponse } from 'axios';
import { IAxiosConfig, IAxiosManager } from './interfaces';
import QueueRequest, { RequestInfo } from './queueRequest';

export interface AxiosManagerProps {
  chunkSize: number;
}

interface RequestQueueItem {
  taskInfo: QueueRequest;
  requested: boolean;
}

class AxiosManager implements IAxiosManager {
  private chunkSize: number;

  private tasksQueue: QueueRequest[];

  private requestQueue: RequestQueueItem[];

  constructor({ chunkSize }: AxiosManagerProps) {
    this.chunkSize = chunkSize;
    this.requestQueue = [];
    this.tasksQueue = [];
  }

  private makeRequests() {
    this.requestQueue = this.requestQueue.map((request) => {
      if (!request.requested) {
        request.taskInfo.makeRequest(() => {
          this.requestQueue = this.requestQueue.filter(
            (previousRequests) => previousRequests.taskInfo.data.id !== request.taskInfo.data.id
          );
          this.checkQueue();
        });
      }

      return { ...request, requested: true };
    });
  }

  private queueTasks(tasks: QueueRequest[]) {
    this.requestQueue = this.requestQueue.concat(
      tasks.map((task) => ({ taskInfo: task, requested: false }))
    );
  }

  private checkQueue() {
    const emptyRequestSlots = this.chunkSize - this.requestQueue.length;
    if (emptyRequestSlots > 0 && this.tasksQueue.length > 0) {
      const requests = this.tasksQueue.slice(0, emptyRequestSlots);
      this.queueTasks(requests);
      this.tasksQueue = this.tasksQueue.slice(requests.length);
      this.makeRequests();
    }
  }

  private createTask({ url, data, config, method, onResolve, onReject }: RequestInfo) {
    this.tasksQueue.push(QueueRequest.create({ url, data, config, method, onResolve, onReject }));
    this.checkQueue();
  }

  get(url: string, config?: IAxiosConfig): Promise<AxiosResponse<any>> {
    return new Promise<AxiosResponse<any>>((resolve, reject) => {
      this.createTask({ method: 'get', url, config, onResolve: resolve, onReject: reject });
    });
  }

  delete(url: string, config?: IAxiosConfig): Promise<AxiosResponse<any>> {
    return new Promise<AxiosResponse<any>>((resolve, reject) => {
      this.createTask({ method: 'delete', url, config, onResolve: resolve, onReject: reject });
    });
  }

  post(url: string, data?: any, config?: IAxiosConfig): Promise<AxiosResponse<any>> {
    return new Promise<AxiosResponse<any>>((resolve, reject) => {
      this.createTask({ method: 'post', data, url, config, onResolve: resolve, onReject: reject });
    });
  }

  patch(url: string, data?: any, config?: IAxiosConfig): Promise<AxiosResponse<any>> {
    return new Promise<AxiosResponse<any>>((resolve, reject) => {
      this.createTask({ method: 'patch', data, url, config, onResolve: resolve, onReject: reject });
    });
  }

  put(url: string, data?: any, config?: IAxiosConfig): Promise<AxiosResponse<any>> {
    return new Promise<AxiosResponse<any>>((resolve, reject) => {
      this.createTask({ method: 'put', data, url, config, onResolve: resolve, onReject: reject });
    });
  }
}

export default AxiosManager;
