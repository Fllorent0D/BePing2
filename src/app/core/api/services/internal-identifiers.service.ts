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

import { InternalIdentifiers } from '../models/internal-identifiers';

@Injectable({
  providedIn: 'root',
})
export class InternalIdentifiersService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getRegisterLink
   */
  static readonly GetRegisterLinkPath = '/api/internal-identifiers';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getRegisterLink()` instead.
   *
   * This method doesn't expect any request body.
   */
  getRegisterLink$Response(params: {
    clubUniqueIndex: string;
    playerUniqueIndex: number;
  }): Observable<StrictHttpResponse<InternalIdentifiers>> {

    const rb = new RequestBuilder(this.rootUrl, InternalIdentifiersService.GetRegisterLinkPath, 'get');
    if (params) {
      rb.query('clubUniqueIndex', params.clubUniqueIndex, {});
      rb.query('playerUniqueIndex', params.playerUniqueIndex, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<InternalIdentifiers>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getRegisterLink$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getRegisterLink(params: {
    clubUniqueIndex: string;
    playerUniqueIndex: number;
  }): Observable<InternalIdentifiers> {

    return this.getRegisterLink$Response(params).pipe(
      map((r: StrictHttpResponse<InternalIdentifiers>) => r.body as InternalIdentifiers)
    );
  }

  /**
   * Path part for operation internalIdentifiersControllerRegister
   */
  static readonly InternalIdentifiersControllerRegisterPath = '/api/internal-identifiers/register';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `internalIdentifiersControllerRegister()` instead.
   *
   * This method doesn't expect any request body.
   */
  internalIdentifiersControllerRegister$Response(params?: {
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, InternalIdentifiersService.InternalIdentifiersControllerRegisterPath, 'get');
    if (params) {
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
   * To access the full response (for headers, for example), `internalIdentifiersControllerRegister$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  internalIdentifiersControllerRegister(params?: {
  }): Observable<void> {

    return this.internalIdentifiersControllerRegister$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
