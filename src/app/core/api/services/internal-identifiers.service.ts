/* tslint:disable */
/* eslint-disable */
import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {BaseService} from '../base-service';
import {ApiConfiguration} from '../api-configuration';
import {StrictHttpResponse} from '../strict-http-response';
import {RequestBuilder} from '../request-builder';
import {Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';

import {InternalIdentifiersDto} from '../models/internal-identifiers-dto';
import {RedirectLinkDto} from '../models/redirect-link-dto';

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
   * Path part for operation getInternalIds
   */
  static readonly GetInternalIdsPath = '/v1/internal-identifiers';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getInternalIds()` instead.
   *
   * This method doesn't expect any request body.
   */
  getInternalIds$Response(params: {
    clubUniqueIndex: string;
    database: string;
    playerUniqueIndex: number;
  }): Observable<StrictHttpResponse<InternalIdentifiersDto>> {

    const rb = new RequestBuilder(this.rootUrl, InternalIdentifiersService.GetInternalIdsPath, 'get');
    if (params) {
      rb.query('clubUniqueIndex', params.clubUniqueIndex, {});
      rb.query('database', params.database, {});
      rb.query('playerUniqueIndex', params.playerUniqueIndex, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<InternalIdentifiersDto>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getInternalIds$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getInternalIds(params: {
    clubUniqueIndex: string;
    database: string;
    playerUniqueIndex: number;
  }): Observable<InternalIdentifiersDto> {

    return this.getInternalIds$Response(params).pipe(
      map((r: StrictHttpResponse<InternalIdentifiersDto>) => r.body as InternalIdentifiersDto)
    );
  }

  /**
   * Path part for operation getRegisterLink
   */
  static readonly GetRegisterLinkPath = '/v1/internal-identifiers/link';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getRegisterLink()` instead.
   *
   * This method doesn't expect any request body.
   */
  getRegisterLink$Response(params: {
    clubUniqueIndex: string;
    database: string;
    playerUniqueIndex: number;
  }): Observable<StrictHttpResponse<RedirectLinkDto>> {

    const rb = new RequestBuilder(this.rootUrl, InternalIdentifiersService.GetRegisterLinkPath, 'get');
    if (params) {
      rb.query('clubUniqueIndex', params.clubUniqueIndex, {});
      rb.query('database', params.database, {});
      rb.query('playerUniqueIndex', params.playerUniqueIndex, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<RedirectLinkDto>;
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
    database: string;
    playerUniqueIndex: number;
  }): Observable<RedirectLinkDto> {

    return this.getRegisterLink$Response(params).pipe(
      map((r: StrictHttpResponse<RedirectLinkDto>) => r.body as RedirectLinkDto)
    );
  }

}
