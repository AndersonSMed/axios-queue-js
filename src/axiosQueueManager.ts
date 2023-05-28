import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { IAxiosConfig, IAxiosQueueManager, IRequestData } from './interfaces';
import QueueTask from './queueTask';

export interface IAxiosQueueManagerProps {
  client?: AxiosInstance;
  queueSize?: number;
}

class AxiosQueueManager implements IAxiosQueueManager {
  private client: AxiosInstance;

  private maxQueueSize: number;

  private currentQueueSize: number;

  private enqueuedTasks: QueueTask[];

  constructor({ queueSize, client }: IAxiosQueueManagerProps = {}) {
    this.client = client || axios;
    this.maxQueueSize = queueSize || 10;
    this.currentQueueSize = 0;
    this.enqueuedTasks = [];
  }

  private makeRequests(tasks: QueueTask[]) {
    this.currentQueueSize += tasks.length;
    tasks.forEach((task) => {
      task.makeRequest(this.client, () => {
        this.currentQueueSize -= 1;
        this.checkAndRunTasks();
      });
    });
  }

  private checkAndRunTasks() {
    const emptyTaskSlots = this.maxQueueSize - this.currentQueueSize;
    if (emptyTaskSlots > 0 && this.enqueuedTasks.length > 0) {
      this.makeRequests(this.enqueuedTasks.splice(0, emptyTaskSlots));
    }
  }

  private createTask({ url, data, config, method, onResolve, onReject }: IRequestData) {
    this.enqueuedTasks.push(QueueTask.create({ url, data, config, method, onResolve, onReject }));
    this.checkAndRunTasks();
  }

  get<T = any, R = AxiosResponse<T>>(url: string, config?: IAxiosConfig): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      this.createTask({ method: 'get', url, config, onResolve: resolve, onReject: reject });
    });
  }

  delete<T = any, R = AxiosResponse<T>>(url: string, config?: IAxiosConfig): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      this.createTask({ method: 'delete', url, config, onResolve: resolve, onReject: reject });
    });
  }

  post<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: IAxiosConfig): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      this.createTask({ method: 'post', data, url, config, onResolve: resolve, onReject: reject });
    });
  }

  patch<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: IAxiosConfig): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      this.createTask({ method: 'patch', data, url, config, onResolve: resolve, onReject: reject });
    });
  }

  put<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: IAxiosConfig): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      this.createTask({ method: 'put', data, url, config, onResolve: resolve, onReject: reject });
    });
  }
}

export default AxiosQueueManager;
