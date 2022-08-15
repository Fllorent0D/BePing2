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

import { Head2HeadData } from '../models/head-2-head-data';

@Injectable({
  providedIn: 'root',
})
export class Head2HeadService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation findHead2HeadMatches
   */
  static readonly FindHead2HeadMatchesPath = '/v1/head2head/{playerUniqueIndex}/{opponentUniqueIndex}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findHead2HeadMatches()` instead.
   *
   * This method doesn't expect any request body.
   */
  findHead2HeadMatches$Response(params: {
    playerUniqueIndex: number;
    opponentUniqueIndex: number;
  }): Observable<StrictHttpResponse<Head2HeadData>> {

    const rb = new RequestBuilder(this.rootUrl, Head2HeadService.FindHead2HeadMatchesPath, 'get');
    if (params) {
      rb.path('playerUniqueIndex', params.playerUniqueIndex, {});
      rb.path('opponentUniqueIndex', params.opponentUniqueIndex, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Head2HeadData>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findHead2HeadMatches$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findHead2HeadMatches(params: {
    playerUniqueIndex: number;
    opponentUniqueIndex: number;
  }): Observable<Head2HeadData> {

    return this.findHead2HeadMatches$Response(params).pipe(
      map((r: StrictHttpResponse<Head2HeadData>) => r.body as Head2HeadData)
    );
  }

}
