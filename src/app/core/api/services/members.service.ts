/* tslint:disable */
/* eslint-disable */
import {Injectable} from '@angular/core';
import {HttpClient, HttpContext, HttpResponse} from '@angular/common/http';
import {BaseService} from '../base-service';
import {ApiConfiguration} from '../api-configuration';
import {StrictHttpResponse} from '../strict-http-response';
import {RequestBuilder} from '../request-builder';
import {Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';

import {MemberEntry} from '../models/member-entry';
import {WeeklyNumericRanking} from '../models/weekly-numeric-ranking';
import {WeeklyNumericRankingV2} from '../models/weekly-numeric-ranking-v-2';
import {WeeklyNumericRankingV3} from '../models/weekly-numeric-ranking-v-3';

@Injectable({
  providedIn: 'root',
})
export class MembersService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation findAllMembers
   */
  static readonly FindAllMembersPath = '/v1/members';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findAllMembers()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAllMembers$Response(params?: {
    club?: string;
    playerCategory?: 'MEN' | 'WOMEN' | 'VETERANS' | 'VETERANS_WOMEN' | 'YOUTH' | 'MEN_POST_23' | 'WOMEN_POST_23' | 'YOUTH_POST_23';
    uniqueIndex?: number;
    nameSearch?: string;
    extendedInformation?: boolean;
    rankingPointsInformation?: boolean;
    withResults?: boolean;
    withOpponentRankingEvaluation?: boolean;

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
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Array<MemberEntry>>> {

    const rb = new RequestBuilder(this.rootUrl, MembersService.FindAllMembersPath, 'get');
    if (params) {
      rb.query('club', params.club, {});
      rb.query('playerCategory', params.playerCategory, {});
      rb.query('uniqueIndex', params.uniqueIndex, {});
      rb.query('nameSearch', params.nameSearch, {});
      rb.query('extendedInformation', params.extendedInformation, {});
      rb.query('rankingPointsInformation', params.rankingPointsInformation, {});
      rb.query('withResults', params.withResults, {});
      rb.query('withOpponentRankingEvaluation', params.withOpponentRankingEvaluation, {});
      rb.header('X-Tabt-Account', params['X-Tabt-Account'], {});
      rb.header('X-Tabt-Password', params['X-Tabt-Password'], {});
      rb.header('X-Tabt-OnBehalfOf', params['X-Tabt-OnBehalfOf'], {});
      rb.header('X-Tabt-Database', params['X-Tabt-Database'], {});
      rb.header('X-Tabt-Season', params['X-Tabt-Season'], {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<MemberEntry>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findAllMembers$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAllMembers(params?: {
    club?: string;
    playerCategory?: 'MEN' | 'WOMEN' | 'VETERANS' | 'VETERANS_WOMEN' | 'YOUTH' | 'MEN_POST_23' | 'WOMEN_POST_23' | 'YOUTH_POST_23';
    uniqueIndex?: number;
    nameSearch?: string;
    extendedInformation?: boolean;
    rankingPointsInformation?: boolean;
    withResults?: boolean;
    withOpponentRankingEvaluation?: boolean;

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
    context?: HttpContext
  }
): Observable<Array<MemberEntry>> {

    return this.findAllMembers$Response(params).pipe(
      map((r: StrictHttpResponse<Array<MemberEntry>>) => r.body as Array<MemberEntry>)
    );
  }

  /**
   * Path part for operation findAllMembersLookup
   */
  static readonly FindAllMembersLookupPath = '/v1/members/lookup';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findAllMembersLookup()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAllMembersLookup$Response(params: {
    query: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Array<MemberEntry>>> {

    const rb = new RequestBuilder(this.rootUrl, MembersService.FindAllMembersLookupPath, 'get');
    if (params) {
      rb.query('query', params.query, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<MemberEntry>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findAllMembersLookup$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAllMembersLookup(params: {
    query: string;
    context?: HttpContext
  }
): Observable<Array<MemberEntry>> {

    return this.findAllMembersLookup$Response(params).pipe(
      map((r: StrictHttpResponse<Array<MemberEntry>>) => r.body as Array<MemberEntry>)
    );
  }

  /**
   * Path part for operation findMemberCategories
   */
  static readonly FindMemberCategoriesPath = '/v1/members/categories';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findMemberCategories()` instead.
   *
   * This method doesn't expect any request body.
   */
  findMemberCategories$Response(params?: {
    uniqueIndex?: number;
    nameSearch?: string;
    shortNameSearch?: string;
    rankingCategory?: string;

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
    context?: HttpContext
  }
): Observable<StrictHttpResponse<MemberEntry>> {

    const rb = new RequestBuilder(this.rootUrl, MembersService.FindMemberCategoriesPath, 'get');
    if (params) {
      rb.query('uniqueIndex', params.uniqueIndex, {});
      rb.query('nameSearch', params.nameSearch, {});
      rb.query('shortNameSearch', params.shortNameSearch, {});
      rb.query('rankingCategory', params.rankingCategory, {});
      rb.header('X-Tabt-Account', params['X-Tabt-Account'], {});
      rb.header('X-Tabt-Password', params['X-Tabt-Password'], {});
      rb.header('X-Tabt-OnBehalfOf', params['X-Tabt-OnBehalfOf'], {});
      rb.header('X-Tabt-Database', params['X-Tabt-Database'], {});
      rb.header('X-Tabt-Season', params['X-Tabt-Season'], {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<MemberEntry>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findMemberCategories$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findMemberCategories(params?: {
    uniqueIndex?: number;
    nameSearch?: string;
    shortNameSearch?: string;
    rankingCategory?: string;

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
    context?: HttpContext
  }
): Observable<MemberEntry> {

    return this.findMemberCategories$Response(params).pipe(
      map((r: StrictHttpResponse<MemberEntry>) => r.body as MemberEntry)
    );
  }

  /**
   * Path part for operation findMemberById
   */
  static readonly FindMemberByIdPath = '/v1/members/{uniqueIndex}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findMemberById()` instead.
   *
   * This method doesn't expect any request body.
   */
  findMemberById$Response(params: {
    club?: string;
    playerCategory?: 'MEN' | 'WOMEN' | 'VETERANS' | 'VETERANS_WOMEN' | 'YOUTH' | 'MEN_POST_23' | 'WOMEN_POST_23' | 'YOUTH_POST_23';
    nameSearch?: string;
    extendedInformation?: boolean;
    rankingPointsInformation?: boolean;
    withResults?: boolean;
    withOpponentRankingEvaluation?: boolean;
    uniqueIndex: number;

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
    context?: HttpContext
  }
): Observable<StrictHttpResponse<MemberEntry>> {

    const rb = new RequestBuilder(this.rootUrl, MembersService.FindMemberByIdPath, 'get');
    if (params) {
      rb.query('club', params.club, {});
      rb.query('playerCategory', params.playerCategory, {});
      rb.query('nameSearch', params.nameSearch, {});
      rb.query('extendedInformation', params.extendedInformation, {});
      rb.query('rankingPointsInformation', params.rankingPointsInformation, {});
      rb.query('withResults', params.withResults, {});
      rb.query('withOpponentRankingEvaluation', params.withOpponentRankingEvaluation, {});
      rb.path('uniqueIndex', params.uniqueIndex, {});
      rb.header('X-Tabt-Account', params['X-Tabt-Account'], {});
      rb.header('X-Tabt-Password', params['X-Tabt-Password'], {});
      rb.header('X-Tabt-OnBehalfOf', params['X-Tabt-OnBehalfOf'], {});
      rb.header('X-Tabt-Database', params['X-Tabt-Database'], {});
      rb.header('X-Tabt-Season', params['X-Tabt-Season'], {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<MemberEntry>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findMemberById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findMemberById(params: {
    club?: string;
    playerCategory?: 'MEN' | 'WOMEN' | 'VETERANS' | 'VETERANS_WOMEN' | 'YOUTH' | 'MEN_POST_23' | 'WOMEN_POST_23' | 'YOUTH_POST_23';
    nameSearch?: string;
    extendedInformation?: boolean;
    rankingPointsInformation?: boolean;
    withResults?: boolean;
    withOpponentRankingEvaluation?: boolean;
    uniqueIndex: number;

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
    context?: HttpContext
  }
): Observable<MemberEntry> {

    return this.findMemberById$Response(params).pipe(
      map((r: StrictHttpResponse<MemberEntry>) => r.body as MemberEntry)
    );
  }

  /**
   * Path part for operation findMemberNumericRankingsHistory
   */
  static readonly FindMemberNumericRankingsHistoryPath = '/v1/members/{uniqueIndex}/numeric-rankings';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findMemberNumericRankingsHistory()` instead.
   *
   * This method doesn't expect any request body.
   *
   * @deprecated
   */
  findMemberNumericRankingsHistory$Response(params: {
    uniqueIndex: number;
    season?: number;
    category?: 'MEN' | 'WOMEN' | 'VETERANS' | 'VETERANS_WOMEN' | 'YOUTH';
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Array<WeeklyNumericRanking>>> {

    const rb = new RequestBuilder(this.rootUrl, MembersService.FindMemberNumericRankingsHistoryPath, 'get');
    if (params) {
      rb.path('uniqueIndex', params.uniqueIndex, {});
      rb.query('season', params.season, {});
      rb.query('category', params.category, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<WeeklyNumericRanking>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findMemberNumericRankingsHistory$Response()` instead.
   *
   * This method doesn't expect any request body.
   *
   * @deprecated
   */
  findMemberNumericRankingsHistory(params: {
    uniqueIndex: number;
    season?: number;
    category?: 'MEN' | 'WOMEN' | 'VETERANS' | 'VETERANS_WOMEN' | 'YOUTH';
    context?: HttpContext
  }
): Observable<Array<WeeklyNumericRanking>> {

    return this.findMemberNumericRankingsHistory$Response(params).pipe(
      map((r: StrictHttpResponse<Array<WeeklyNumericRanking>>) => r.body as Array<WeeklyNumericRanking>)
    );
  }

  /**
   * Path part for operation findMemberNumericRankingsHistoryV2
   */
  static readonly FindMemberNumericRankingsHistoryV2Path = '/v2/members/{uniqueIndex}/numeric-rankings';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findMemberNumericRankingsHistoryV2()` instead.
   *
   * This method doesn't expect any request body.
   */
  findMemberNumericRankingsHistoryV2$Response(params: {
    uniqueIndex: number;
    category?: 'MEN' | 'WOMEN' | 'VETERANS' | 'VETERANS_WOMEN' | 'YOUTH';
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Array<WeeklyNumericRankingV2>>> {

    const rb = new RequestBuilder(this.rootUrl, MembersService.FindMemberNumericRankingsHistoryV2Path, 'get');
    if (params) {
      rb.path('uniqueIndex', params.uniqueIndex, {});
      rb.query('category', params.category, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<WeeklyNumericRankingV2>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findMemberNumericRankingsHistoryV2$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findMemberNumericRankingsHistoryV2(params: {
    uniqueIndex: number;
    category?: 'MEN' | 'WOMEN' | 'VETERANS' | 'VETERANS_WOMEN' | 'YOUTH';
    context?: HttpContext
  }
): Observable<Array<WeeklyNumericRankingV2>> {

    return this.findMemberNumericRankingsHistoryV2$Response(params).pipe(
      map((r: StrictHttpResponse<Array<WeeklyNumericRankingV2>>) => r.body as Array<WeeklyNumericRankingV2>)
    );
  }

  /**
   * Path part for operation findMemberNumericRankingsHistoryV3
   */
  static readonly FindMemberNumericRankingsHistoryV3Path = '/v3/members/{uniqueIndex}/numeric-rankings';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findMemberNumericRankingsHistoryV3()` instead.
   *
   * This method doesn't expect any request body.
   */
  findMemberNumericRankingsHistoryV3$Response(params: {
    uniqueIndex: number;
    category?: 'MEN' | 'WOMEN' | 'VETERANS' | 'VETERANS_WOMEN' | 'YOUTH';
    context?: HttpContext
  }
): Observable<StrictHttpResponse<WeeklyNumericRankingV3>> {

    const rb = new RequestBuilder(this.rootUrl, MembersService.FindMemberNumericRankingsHistoryV3Path, 'get');
    if (params) {
      rb.path('uniqueIndex', params.uniqueIndex, {});
      rb.query('category', params.category, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<WeeklyNumericRankingV3>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findMemberNumericRankingsHistoryV3$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findMemberNumericRankingsHistoryV3(params: {
    uniqueIndex: number;
    category?: 'MEN' | 'WOMEN' | 'VETERANS' | 'VETERANS_WOMEN' | 'YOUTH';
    context?: HttpContext
  }
): Observable<WeeklyNumericRankingV3> {

    return this.findMemberNumericRankingsHistoryV3$Response(params).pipe(
      map((r: StrictHttpResponse<WeeklyNumericRankingV3>) => r.body as WeeklyNumericRankingV3)
    );
  }

}
