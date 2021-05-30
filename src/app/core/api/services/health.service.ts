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

import { TestOutput } from '../models/test-output';

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

  /**
   * Path part for operation testRequest
   */
  static readonly TestRequestPath = '/api/health/test';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `testRequest()` instead.
   *
   * This method doesn't expect any request body.
   */
  testRequest$Response(params?: {

    /**
     * Account to do a request
     */
    'X-Tabt-Account'?: string;

    /**
     * Password of the account
     */
    'X-Tabt-Password'?: string;

    /**
     * On Behalf of
     */
    'X-Tabt-OnBehalfOf'?: string;

    /**
     * Database to query
     */
    'X-Tabt-Database'?: 'aftt' | 'vttl';
  }): Observable<StrictHttpResponse<TestOutput>> {

    const rb = new RequestBuilder(this.rootUrl, HealthService.TestRequestPath, 'get');
    if (params) {
      rb.header('X-Tabt-Account', params['X-Tabt-Account'], {});
      rb.header('X-Tabt-Password', params['X-Tabt-Password'], {});
      rb.header('X-Tabt-OnBehalfOf', params['X-Tabt-OnBehalfOf'], {});
      rb.header('X-Tabt-Database', params['X-Tabt-Database'], {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<TestOutput>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `testRequest$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  testRequest(params?: {

    /**
     * Account to do a request
     */
    'X-Tabt-Account'?: string;

    /**
     * Password of the account
     */
    'X-Tabt-Password'?: string;

    /**
     * On Behalf of
     */
    'X-Tabt-OnBehalfOf'?: string;

    /**
     * Database to query
     */
    'X-Tabt-Database'?: 'aftt' | 'vttl';
  }): Observable<TestOutput> {

    return this.testRequest$Response(params).pipe(
      map((r: StrictHttpResponse<TestOutput>) => r.body as TestOutput)
    );
  }

  /**
   * Path part for operation testRequest_1
   */
  static readonly TestRequest_1Path = '/api/health/context';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `testRequest_1()` instead.
   *
   * This method doesn't expect any request body.
   */
  testRequest_1$Response(params?: {

    /**
     * Account to do a request
     */
    'X-Tabt-Account'?: string;

    /**
     * Password of the account
     */
    'X-Tabt-Password'?: string;

    /**
     * On Behalf of
     */
    'X-Tabt-OnBehalfOf'?: string;

    /**
     * Database to query
     */
    'X-Tabt-Database'?: 'aftt' | 'vttl';
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, HealthService.TestRequest_1Path, 'get');
    if (params) {
      rb.header('X-Tabt-Account', params['X-Tabt-Account'], {});
      rb.header('X-Tabt-Password', params['X-Tabt-Password'], {});
      rb.header('X-Tabt-OnBehalfOf', params['X-Tabt-OnBehalfOf'], {});
      rb.header('X-Tabt-Database', params['X-Tabt-Database'], {});
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `testRequest_1$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  testRequest_1(params?: {

    /**
     * Account to do a request
     */
    'X-Tabt-Account'?: string;

    /**
     * Password of the account
     */
    'X-Tabt-Password'?: string;

    /**
     * On Behalf of
     */
    'X-Tabt-OnBehalfOf'?: string;

    /**
     * Database to query
     */
    'X-Tabt-Database'?: 'aftt' | 'vttl';
  }): Observable<void> {

    return this.testRequest_1$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
