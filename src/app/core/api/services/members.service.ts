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

import { MemberEntry } from '../models/member-entry';

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
  static readonly FindAllMembersPath = '/api/members';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findAllMembers()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAllMembers$Response(params?: {

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
    club?: string;
    playerCategory?: 'MEN' | 'WOMEN' | 'VETERANS' | 'VETERANS_WOMEN' | 'YOUTH';
    uniqueIndex?: number;
    nameSearch?: string;
    extendedInformation?: boolean;
    rankingPointsInformation?: boolean;
    withResults?: boolean;
    withOpponentRankingEvaluation?: boolean;
  }): Observable<StrictHttpResponse<Array<MemberEntry>>> {

    const rb = new RequestBuilder(this.rootUrl, MembersService.FindAllMembersPath, 'get');
    if (params) {
      rb.header('X-Tabt-Account', params['X-Tabt-Account'], {});
      rb.header('X-Tabt-Password', params['X-Tabt-Password'], {});
      rb.header('X-Tabt-OnBehalfOf', params['X-Tabt-OnBehalfOf'], {});
      rb.header('X-Tabt-Database', params['X-Tabt-Database'], {});
      rb.header('X-Tabt-Season', params['X-Tabt-Season'], {});
      rb.query('club', params.club, {});
      rb.query('playerCategory', params.playerCategory, {});
      rb.query('uniqueIndex', params.uniqueIndex, {});
      rb.query('nameSearch', params.nameSearch, {});
      rb.query('extendedInformation', params.extendedInformation, {});
      rb.query('rankingPointsInformation', params.rankingPointsInformation, {});
      rb.query('withResults', params.withResults, {});
      rb.query('withOpponentRankingEvaluation', params.withOpponentRankingEvaluation, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
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
    club?: string;
    playerCategory?: 'MEN' | 'WOMEN' | 'VETERANS' | 'VETERANS_WOMEN' | 'YOUTH';
    uniqueIndex?: number;
    nameSearch?: string;
    extendedInformation?: boolean;
    rankingPointsInformation?: boolean;
    withResults?: boolean;
    withOpponentRankingEvaluation?: boolean;
  }): Observable<Array<MemberEntry>> {

    return this.findAllMembers$Response(params).pipe(
      map((r: StrictHttpResponse<Array<MemberEntry>>) => r.body as Array<MemberEntry>)
    );
  }

  /**
   * Path part for operation findMemberById
   */
  static readonly FindMemberByIdPath = '/api/members/{uniqueIndex}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findMemberById()` instead.
   *
   * This method doesn't expect any request body.
   */
  findMemberById$Response(params: {

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
    club?: string;
    playerCategory?: 'MEN' | 'WOMEN' | 'VETERANS' | 'VETERANS_WOMEN' | 'YOUTH';
    nameSearch?: string;
    extendedInformation?: boolean;
    rankingPointsInformation?: boolean;
    withResults?: boolean;
    withOpponentRankingEvaluation?: boolean;
    uniqueIndex: number;
  }): Observable<StrictHttpResponse<MemberEntry>> {

    const rb = new RequestBuilder(this.rootUrl, MembersService.FindMemberByIdPath, 'get');
    if (params) {
      rb.header('X-Tabt-Account', params['X-Tabt-Account'], {});
      rb.header('X-Tabt-Password', params['X-Tabt-Password'], {});
      rb.header('X-Tabt-OnBehalfOf', params['X-Tabt-OnBehalfOf'], {});
      rb.header('X-Tabt-Database', params['X-Tabt-Database'], {});
      rb.header('X-Tabt-Season', params['X-Tabt-Season'], {});
      rb.query('club', params.club, {});
      rb.query('playerCategory', params.playerCategory, {});
      rb.query('nameSearch', params.nameSearch, {});
      rb.query('extendedInformation', params.extendedInformation, {});
      rb.query('rankingPointsInformation', params.rankingPointsInformation, {});
      rb.query('withResults', params.withResults, {});
      rb.query('withOpponentRankingEvaluation', params.withOpponentRankingEvaluation, {});
      rb.path('uniqueIndex', params.uniqueIndex, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
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
    club?: string;
    playerCategory?: 'MEN' | 'WOMEN' | 'VETERANS' | 'VETERANS_WOMEN' | 'YOUTH';
    nameSearch?: string;
    extendedInformation?: boolean;
    rankingPointsInformation?: boolean;
    withResults?: boolean;
    withOpponentRankingEvaluation?: boolean;
    uniqueIndex: number;
  }): Observable<MemberEntry> {

    return this.findMemberById$Response(params).pipe(
      map((r: StrictHttpResponse<MemberEntry>) => r.body as MemberEntry)
    );
  }

}
