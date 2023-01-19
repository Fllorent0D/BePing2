/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpContext } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { DivisionEntry } from '../models/division-entry';
import { MemberResults } from '../models/member-results';
import { RankingEntry } from '../models/ranking-entry';
import { TeamMatchesEntry } from '../models/team-matches-entry';

@Injectable({
  providedIn: 'root',
})
export class DivisionsService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation findAllDivisions
   */
  static readonly FindAllDivisionsPath = '/v1/divisions';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findAllDivisions()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAllDivisions$Response(params?: {

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

    /**
     * Season name to query
     */
    'X-Tabt-Season'?: string;
    level?: 'NATIONAL' | 'HAINAUT' | 'VLAAMS_BRABANT_BR' | 'SUPER_DIVISION' | 'OOST_VLANDEREN' | 'ANTWERP' | 'WEST_VLAANDEREN' | 'LIMBURG' | 'BRUSSELS_BRABANT_WALLON' | 'NAMUR' | 'LIEGE' | 'LUXEMBOURG' | 'REGION_VTTL' | 'IWB';
    showDivisionName?: 'no' | 'yes' | 'short';
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Array<DivisionEntry>>> {

    const rb = new RequestBuilder(this.rootUrl, DivisionsService.FindAllDivisionsPath, 'get');
    if (params) {
      rb.header('X-Tabt-Account', params['X-Tabt-Account'], {});
      rb.header('X-Tabt-Password', params['X-Tabt-Password'], {});
      rb.header('X-Tabt-OnBehalfOf', params['X-Tabt-OnBehalfOf'], {});
      rb.header('X-Tabt-Database', params['X-Tabt-Database'], {});
      rb.header('X-Tabt-Season', params['X-Tabt-Season'], {});
      rb.query('level', params.level, {});
      rb.query('showDivisionName', params.showDivisionName, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<DivisionEntry>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findAllDivisions$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAllDivisions(params?: {

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

    /**
     * Season name to query
     */
    'X-Tabt-Season'?: string;
    level?: 'NATIONAL' | 'HAINAUT' | 'VLAAMS_BRABANT_BR' | 'SUPER_DIVISION' | 'OOST_VLANDEREN' | 'ANTWERP' | 'WEST_VLAANDEREN' | 'LIMBURG' | 'BRUSSELS_BRABANT_WALLON' | 'NAMUR' | 'LIEGE' | 'LUXEMBOURG' | 'REGION_VTTL' | 'IWB';
    showDivisionName?: 'no' | 'yes' | 'short';
    context?: HttpContext
  }
): Observable<Array<DivisionEntry>> {

    return this.findAllDivisions$Response(params).pipe(
      map((r: StrictHttpResponse<Array<DivisionEntry>>) => r.body as Array<DivisionEntry>)
    );
  }

  /**
   * Path part for operation findDivisionById
   */
  static readonly FindDivisionByIdPath = '/v1/divisions/{divisionId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findDivisionById()` instead.
   *
   * This method doesn't expect any request body.
   */
  findDivisionById$Response(params: {

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

    /**
     * Season name to query
     */
    'X-Tabt-Season'?: string;
    divisionId: number;
    level?: 'NATIONAL' | 'HAINAUT' | 'VLAAMS_BRABANT_BR' | 'SUPER_DIVISION' | 'OOST_VLANDEREN' | 'ANTWERP' | 'WEST_VLAANDEREN' | 'LIMBURG' | 'BRUSSELS_BRABANT_WALLON' | 'NAMUR' | 'LIEGE' | 'LUXEMBOURG' | 'REGION_VTTL' | 'IWB';
    showDivisionName?: 'no' | 'yes' | 'short';
    context?: HttpContext
  }
): Observable<StrictHttpResponse<DivisionEntry>> {

    const rb = new RequestBuilder(this.rootUrl, DivisionsService.FindDivisionByIdPath, 'get');
    if (params) {
      rb.header('X-Tabt-Account', params['X-Tabt-Account'], {});
      rb.header('X-Tabt-Password', params['X-Tabt-Password'], {});
      rb.header('X-Tabt-OnBehalfOf', params['X-Tabt-OnBehalfOf'], {});
      rb.header('X-Tabt-Database', params['X-Tabt-Database'], {});
      rb.header('X-Tabt-Season', params['X-Tabt-Season'], {});
      rb.path('divisionId', params.divisionId, {});
      rb.query('level', params.level, {});
      rb.query('showDivisionName', params.showDivisionName, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<DivisionEntry>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findDivisionById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findDivisionById(params: {

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

    /**
     * Season name to query
     */
    'X-Tabt-Season'?: string;
    divisionId: number;
    level?: 'NATIONAL' | 'HAINAUT' | 'VLAAMS_BRABANT_BR' | 'SUPER_DIVISION' | 'OOST_VLANDEREN' | 'ANTWERP' | 'WEST_VLAANDEREN' | 'LIMBURG' | 'BRUSSELS_BRABANT_WALLON' | 'NAMUR' | 'LIEGE' | 'LUXEMBOURG' | 'REGION_VTTL' | 'IWB';
    showDivisionName?: 'no' | 'yes' | 'short';
    context?: HttpContext
  }
): Observable<DivisionEntry> {

    return this.findDivisionById$Response(params).pipe(
      map((r: StrictHttpResponse<DivisionEntry>) => r.body as DivisionEntry)
    );
  }

  /**
   * Path part for operation findDivisionRanking
   */
  static readonly FindDivisionRankingPath = '/v1/divisions/{divisionId}/ranking';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findDivisionRanking()` instead.
   *
   * This method doesn't expect any request body.
   */
  findDivisionRanking$Response(params: {

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

    /**
     * Season name to query
     */
    'X-Tabt-Season'?: string;
    divisionId: number;
    weekName?: number;
    rankingSystem?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Array<RankingEntry>>> {

    const rb = new RequestBuilder(this.rootUrl, DivisionsService.FindDivisionRankingPath, 'get');
    if (params) {
      rb.header('X-Tabt-Account', params['X-Tabt-Account'], {});
      rb.header('X-Tabt-Password', params['X-Tabt-Password'], {});
      rb.header('X-Tabt-OnBehalfOf', params['X-Tabt-OnBehalfOf'], {});
      rb.header('X-Tabt-Database', params['X-Tabt-Database'], {});
      rb.header('X-Tabt-Season', params['X-Tabt-Season'], {});
      rb.path('divisionId', params.divisionId, {});
      rb.query('weekName', params.weekName, {});
      rb.query('rankingSystem', params.rankingSystem, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<RankingEntry>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findDivisionRanking$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findDivisionRanking(params: {

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

    /**
     * Season name to query
     */
    'X-Tabt-Season'?: string;
    divisionId: number;
    weekName?: number;
    rankingSystem?: number;
    context?: HttpContext
  }
): Observable<Array<RankingEntry>> {

    return this.findDivisionRanking$Response(params).pipe(
      map((r: StrictHttpResponse<Array<RankingEntry>>) => r.body as Array<RankingEntry>)
    );
  }

  /**
   * Path part for operation findDivisionMatches
   */
  static readonly FindDivisionMatchesPath = '/v1/divisions/{divisionId}/matches';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findDivisionMatches()` instead.
   *
   * This method doesn't expect any request body.
   */
  findDivisionMatches$Response(params: {

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

    /**
     * Season name to query
     */
    'X-Tabt-Season'?: string;
    divisionId: number;
    weekName?: number;

    /**
     * YYYY-MM-DD
     */
    yearDateFrom?: string;

    /**
     * YYYY-MM-DD
     */
    yearDateTo?: string;
    withDetails?: boolean;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Array<TeamMatchesEntry>>> {

    const rb = new RequestBuilder(this.rootUrl, DivisionsService.FindDivisionMatchesPath, 'get');
    if (params) {
      rb.header('X-Tabt-Account', params['X-Tabt-Account'], {});
      rb.header('X-Tabt-Password', params['X-Tabt-Password'], {});
      rb.header('X-Tabt-OnBehalfOf', params['X-Tabt-OnBehalfOf'], {});
      rb.header('X-Tabt-Database', params['X-Tabt-Database'], {});
      rb.header('X-Tabt-Season', params['X-Tabt-Season'], {});
      rb.path('divisionId', params.divisionId, {});
      rb.query('weekName', params.weekName, {});
      rb.query('yearDateFrom', params.yearDateFrom, {});
      rb.query('yearDateTo', params.yearDateTo, {});
      rb.query('withDetails', params.withDetails, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<TeamMatchesEntry>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findDivisionMatches$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findDivisionMatches(params: {

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

    /**
     * Season name to query
     */
    'X-Tabt-Season'?: string;
    divisionId: number;
    weekName?: number;

    /**
     * YYYY-MM-DD
     */
    yearDateFrom?: string;

    /**
     * YYYY-MM-DD
     */
    yearDateTo?: string;
    withDetails?: boolean;
    context?: HttpContext
  }
): Observable<Array<TeamMatchesEntry>> {

    return this.findDivisionMatches$Response(params).pipe(
      map((r: StrictHttpResponse<Array<TeamMatchesEntry>>) => r.body as Array<TeamMatchesEntry>)
    );
  }

  /**
   * Path part for operation findDivisionMembers
   */
  static readonly FindDivisionMembersPath = '/v1/divisions/{divisionId}/members/ranking';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findDivisionMembers()` instead.
   *
   * This method doesn't expect any request body.
   */
  findDivisionMembers$Response(params: {

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

    /**
     * Season name to query
     */
    'X-Tabt-Season'?: string;
    divisionId: number;
    season?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Array<MemberResults>>> {

    const rb = new RequestBuilder(this.rootUrl, DivisionsService.FindDivisionMembersPath, 'get');
    if (params) {
      rb.header('X-Tabt-Account', params['X-Tabt-Account'], {});
      rb.header('X-Tabt-Password', params['X-Tabt-Password'], {});
      rb.header('X-Tabt-OnBehalfOf', params['X-Tabt-OnBehalfOf'], {});
      rb.header('X-Tabt-Database', params['X-Tabt-Database'], {});
      rb.header('X-Tabt-Season', params['X-Tabt-Season'], {});
      rb.path('divisionId', params.divisionId, {});
      rb.query('season', params.season, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<MemberResults>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findDivisionMembers$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findDivisionMembers(params: {

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

    /**
     * Season name to query
     */
    'X-Tabt-Season'?: string;
    divisionId: number;
    season?: number;
    context?: HttpContext
  }
): Observable<Array<MemberResults>> {

    return this.findDivisionMembers$Response(params).pipe(
      map((r: StrictHttpResponse<Array<MemberResults>>) => r.body as Array<MemberResults>)
    );
  }

}
