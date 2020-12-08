/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class HealthService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation checkHealth
   */
  static readonly CheckHealthPath = '/api/health';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `checkHealth()` instead.
   *
   * This method doesn't expect any request body.
   */
  checkHealth$Response(params?: {
  }): Observable<StrictHttpResponse<{ 'status'?: string, 'info'?: { [key: string]: { 'status'?: string, [key: string]: string } }, 'error'?: { [key: string]: { 'status'?: string, [key: string]: string } }, 'details'?: { [key: string]: { 'status'?: string, [key: string]: string } } }>> {

    const rb = new RequestBuilder(this.rootUrl, HealthService.CheckHealthPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{ 'status'?: string, 'info'?: { [key: string]: { 'status'?: string, [key: string]: string } }, 'error'?: { [key: string]: { 'status'?: string, [key: string]: string } }, 'details'?: { [key: string]: { 'status'?: string, [key: string]: string } } }>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `checkHealth$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  checkHealth(params?: {
  }): Observable<{ 'status'?: string, 'info'?: { [key: string]: { 'status'?: string, [key: string]: string } }, 'error'?: { [key: string]: { 'status'?: string, [key: string]: string } }, 'details'?: { [key: string]: { 'status'?: string, [key: string]: string } } }> {

    return this.checkHealth$Response(params).pipe(
      map((r: StrictHttpResponse<{ 'status'?: string, 'info'?: { [key: string]: { 'status'?: string, [key: string]: string } }, 'error'?: { [key: string]: { 'status'?: string, [key: string]: string } }, 'details'?: { [key: string]: { 'status'?: string, [key: string]: string } } }>) => r.body as { 'status'?: string, 'info'?: { [key: string]: { 'status'?: string, [key: string]: string } }, 'error'?: { [key: string]: { 'status'?: string, [key: string]: string } }, 'details'?: { [key: string]: { 'status'?: string, [key: string]: string } } })
    );
  }

}
