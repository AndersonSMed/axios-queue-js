import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { v4 as uuid } from 'uuid';
import { IAxiosConfig, IAxiosQueueManager, IRequestData } from './interfaces';
import QueueTask from './queueTask';

export interface IAxiosQueueManagerProps {
  client?: AxiosInstance;
  queueSize?: number;
}

interface IQueuedRequest {
  task: QueueTask;
  wasRequested: boolean;
}

class AxiosQueueManager implements IAxiosQueueManager {
  private client: AxiosInstance;

  private queueSize: number;

  private tasksQueue: QueueTask[];

  private requestsQueue: IQueuedRequest[];

  constructor({ queueSize, client }: IAxiosQueueManagerProps = {}) {
    this.client = client || axios;
    this.queueSize = queueSize || 10;
    this.requestsQueue = [];
    this.tasksQueue = [];
  }

  private makeRequests() {
    this.requestsQueue = this.requestsQueue.map((request) => {
      if (!request.wasRequested) {
        request.task.makeRequest(this.client, () => {
          this.requestsQueue = this.requestsQueue.filter(
            (previousRequests) => previousRequests.task.data.id !== request.task.data.id
          );
          this.checkQueue();
        });
      }

      return { ...request, wasRequested: true };
    });
  }

  private enqueueTasksToRequest(tasks: QueueTask[]) {
    this.requestsQueue = this.requestsQueue.concat(
      tasks.map((task) => ({ task, wasRequested: false }))
    );
  }

  private checkQueue() {
    const emptyTaskSlots = this.queueSize - this.requestsQueue.length;
    if (emptyTaskSlots > 0 && this.tasksQueue.length > 0) {
      const tasks = this.tasksQueue.slice(0, emptyTaskSlots);
      this.enqueueTasksToRequest(tasks);
      this.tasksQueue = this.tasksQueue.slice(tasks.length);
      this.makeRequests();
    }
  }

  private createTask({ url, data, config, method, onResolve, onReject }: IRequestData) {
    this.tasksQueue.push(
      QueueTask.buildInstance({ url, data, config, method, onResolve, onReject })
    );
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

export default AxiosQueueManager;
