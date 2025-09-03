import { BaseClient } from "../base-client";
import { ApiResponse, LastResponse, ListOptions, ListResponse, RequestOptions } from "../types/magpie";

export abstract class BaseResource {
  protected client: BaseClient;
  protected basePath: string;
  protected baseUrl?: string; // Optional override for specific resources

  constructor(client: BaseClient, basePath: string, baseUrl?: string) {
    this.client = client;
    this.basePath = basePath;
    this.baseUrl = baseUrl;
  }

  protected buildPath(id?: string): string {
    return id ? `${this.basePath}/${id}` : this.basePath;
  }

  protected attachLastResponse<T>(data: T, response: ApiResponse<T>): T & { lastResponse: LastResponse } {
    const result = data as T & { lastResponse: LastResponse };
    result.lastResponse = {
      statusCode: response.status,
      requestId: response.requestId,
      headers: response.headers,
    };
    return result;
  }

  protected async customResourceAction<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    path: string,
    data?: unknown,
    options: RequestOptions = {},
  ): Promise<T & { lastResponse: LastResponse }> {
    const requestOptions = this.baseUrl ? {
      ...options,
      axiosConfig: { ...options.axiosConfig, baseURL: this.baseUrl }
    } : options;
    
    const response = await this.client.request<T>(method, path, data, requestOptions);
    return this.attachLastResponse(response.data, response);
  }

  protected async createResource<T, U>(
    data: U,
    options: RequestOptions = {},
  ): Promise<T & { lastResponse: LastResponse }> {
    const requestOptions = this.baseUrl ? {
      ...options,
      axiosConfig: { ...options.axiosConfig, baseURL: this.baseUrl }
    } : options;
    
    const response = await this.client.post<T>(this.basePath, data, requestOptions);
    return this.attachLastResponse(response.data, response);
  }

  protected async retrieveResource<T>(
    id: string,
    options: RequestOptions = {},
  ): Promise<T & { lastResponse: LastResponse }> {
    const requestOptions = this.baseUrl ? {
      ...options,
      axiosConfig: { ...options.axiosConfig, baseURL: this.baseUrl }
    } : options;
    
    const response = await this.client.get<T>(this.buildPath(id), undefined, requestOptions);
    return this.attachLastResponse(response.data, response);
  }

  protected async updateResource<T, U>(
    id: string,
    data: U,
    options: RequestOptions = {},
  ): Promise<T & { lastResponse: LastResponse }> {
    const requestOptions = this.baseUrl ? {
      ...options,
      axiosConfig: { ...options.axiosConfig, baseURL: this.baseUrl }
    } : options;
    
    const response = await this.client.put<T>(this.buildPath(id), data, requestOptions);
    return this.attachLastResponse(response.data, response);
  }

  protected async deleteResource<T>(
    id: string,
    options: RequestOptions = {},
  ): Promise<T & { lastResponse: LastResponse }> {
    const requestOptions = this.baseUrl ? {
      ...options,
      axiosConfig: { ...options.axiosConfig, baseURL: this.baseUrl }
    } : options;
    
    const response = await this.client.delete<T>(this.buildPath(id), undefined, requestOptions);
    return this.attachLastResponse(response.data, response);
  }

  protected async listResources<T>(
    params: ListOptions = {},
    options: RequestOptions = {},
  ): Promise<ListResponse<T> & { lastResponse: LastResponse }> {
    const requestOptions = this.baseUrl ? {
      ...options,
      axiosConfig: { ...options.axiosConfig, baseURL: this.baseUrl }
    } : options;
    
    const response = await this.client.get<ListResponse<T>>(this.basePath, params, requestOptions);
    return this.attachLastResponse(response.data, response);
  }
}