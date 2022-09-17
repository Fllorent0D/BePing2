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

import { SeasonEntry } from '../models/season-entry';

@Injectable({
  providedIn: 'root',
})
export class SeasonsService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation findAllSeason
   */
  static readonly FindAllSeasonPath = '/v1/seasons';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findAllSeason()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAllSeason$Response(params?: {
  }): Observable<StrictHttpResponse<Array<SeasonEntry>>> {

    const rb = new RequestBuilder(this.rootUrl, SeasonsService.FindAllSeasonPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<SeasonEntry>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findAllSeason$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAllSeason(params?: {
  }): Observable<Array<SeasonEntry>> {

    return this.findAllSeason$Response(params).pipe(
      map((r: StrictHttpResponse<Array<SeasonEntry>>) => r.body as Array<SeasonEntry>)
    );
  }

  /**
   * Path part for operation findCurrentSeason
   */
  static readonly FindCurrentSeasonPath = '/v1/seasons/current';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findCurrentSeason()` instead.
   *
   * This method doesn't expect any request body.
   */
  findCurrentSeason$Response(params?: {
  }): Observable<StrictHttpResponse<SeasonEntry>> {

    const rb = new RequestBuilder(this.rootUrl, SeasonsService.FindCurrentSeasonPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<SeasonEntry>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findCurrentSeason$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findCurrentSeason(params?: {
  }): Observable<SeasonEntry> {

    return this.findCurrentSeason$Response(params).pipe(
      map((r: StrictHttpResponse<SeasonEntry>) => r.body as SeasonEntry)
    );
  }

  /**
   * Path part for operation findSeasonById
   */
  static readonly FindSeasonByIdPath = '/v1/seasons/{seasonId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findSeasonById()` instead.
   *
   * This method doesn't expect any request body.
   */
  findSeasonById$Response(params: {
    seasonId: number;
  }): Observable<StrictHttpResponse<SeasonEntry>> {

    const rb = new RequestBuilder(this.rootUrl, SeasonsService.FindSeasonByIdPath, 'get');
    if (params) {
      rb.path('seasonId', params.seasonId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<SeasonEntry>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findSeasonById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findSeasonById(params: {
    seasonId: number;
  }): Observable<SeasonEntry> {

    return this.findSeasonById$Response(params).pipe(
      map((r: StrictHttpResponse<SeasonEntry>) => r.body as SeasonEntry)
    );
  }

}
