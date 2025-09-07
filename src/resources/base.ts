import { BaseClient } from "../base-client";
import { ApiResponse, LastResponse, ListOptions, ListResponse, RequestOptions } from "../types/magpie";

/**
 * Abstract base class for all API resource classes.
 * 
 * This class provides common functionality for interacting with Magpie API resources,
 * including CRUD operations, list operations, and response processing. All specific
 * resource classes (CustomersResource, ChargesResource, etc.) extend this base class.
 * 
 * @abstract
 * @internal This class is not intended for direct use by SDK consumers
 */
export abstract class BaseResource {
  /** The HTTP client instance used for API communication */
  protected client: BaseClient;
  
  /** The base API path for this resource (e.g., '/customers', '/charges') */
  protected basePath: string;
  
  /** Optional base URL override for resources that use different endpoints */
  protected baseUrl?: string;

  /**
   * Creates a new BaseResource instance.
   * 
   * @param client - The BaseClient instance for making HTTP requests
   * @param basePath - The API path for this resource
   * @param baseUrl - Optional base URL override for this resource
   */
  constructor(client: BaseClient, basePath: string, baseUrl?: string) {
    this.client = client;
    this.basePath = basePath;
    this.baseUrl = baseUrl;
  }

  /**
   * Constructs the full API path for a resource, optionally including an ID.
   * 
   * @param id - Optional resource ID to append to the base path
   * @returns Complete API path (e.g., '/customers' or '/customers/cus_123')
   * 
   * @protected
   */
  protected buildPath(id?: string): string {
    if (!id) {
      return this.basePath;
    }
    
    // Handle empty basePath (used for resources with custom base URLs)
    if (this.basePath === '') {
      return id;
    }
    
    return `${this.basePath}/${id}`;
  }

  /**
   * Attaches response metadata to the returned data object.
   * 
   * This method adds a `lastResponse` property to the response data containing
   * metadata about the HTTP response (status code, request ID, headers).
   * 
   * @template T - The type of the response data
   * @param data - The response data from the API
   * @param response - The complete API response containing metadata
   * @returns The data object with attached response metadata
   * 
   * @protected
   */
  protected attachLastResponse<T>(data: T, response: ApiResponse<T>): T & { lastResponse: LastResponse } {
    const result = data as T & { lastResponse: LastResponse };
    result.lastResponse = {
      statusCode: response.status,
      requestId: response.requestId,
      headers: response.headers,
    };
    return result;
  }

  /**
   * Performs a custom action on a resource using the specified HTTP method.
   * 
   * This is a generic method for making custom API calls that don't fit the
   * standard CRUD pattern (e.g., capturing a charge, verifying a payment).
   * 
   * @template T - Expected response data type
   * @param method - HTTP method to use
   * @param path - Complete API path for the request
   * @param data - Optional request payload
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the response data with metadata
   * 
   * @protected
   * 
   * @example
   * ```typescript
   * // Capture a charge
   * return this.customResourceAction<Charge>(
   *   'POST', 
   *   `${this.buildPath(id)}/capture`, 
   *   captureData
   * );
   * ```
   */
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

  /**
   * Creates a new resource via POST request to the base path.
   * 
   * @template T - The type of the created resource
   * @template U - The type of the creation parameters
   * @param data - The data for creating the resource
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the created resource with metadata
   * 
   * @protected
   */
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

  /**
   * Retrieves a specific resource by ID via GET request.
   * 
   * @template T - The type of the retrieved resource
   * @param id - The unique identifier of the resource to retrieve
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the retrieved resource with metadata
   * 
   * @protected
   */
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

  /**
   * Updates a specific resource by ID via PUT request.
   * 
   * @template T - The type of the updated resource
   * @template U - The type of the update parameters
   * @param id - The unique identifier of the resource to update
   * @param data - The data for updating the resource
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the updated resource with metadata
   * 
   * @protected
   */
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

  /**
   * Deletes a specific resource by ID via DELETE request.
   * 
   * @template T - The type of the deletion response
   * @param id - The unique identifier of the resource to delete
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the deletion response with metadata
   * 
   * @protected
   */
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

  /**
   * Lists resources with optional filtering and pagination.
   * 
   * @template T - The type of the resources in the list
   * @param params - Query parameters for filtering and pagination
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to a paginated list of resources with metadata
   * 
   * @protected
   * 
   * @example
   * ```typescript
   * const result = await this.listResources<Customer>(
   *   { limit: 10, offset: 20 }
   * );
   * console.log(result.data); // Array of customers
   * console.log(result.count); // Total count
   * ```
   */
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