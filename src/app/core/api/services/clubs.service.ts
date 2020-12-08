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

import { ClubEntry } from '../models/club-entry';
import { MemberEntry } from '../models/member-entry';
import { TeamEntry } from '../models/team-entry';

@Injectable({
  providedIn: 'root',
})
export class ClubsService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation findAllClubs
   */
  static readonly FindAllClubsPath = '/api/clubs';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findAllClubs()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAllClubs$Response(params?: {

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
    season?: number;
    clubCategory?: 'VLAAMS_BRABANT_BR' | 'BRUSSELS_BRABANT_WALLON' | 'ANTWERP' | 'OOST_VLANDEREN' | 'WEST_VLAANDEREN' | 'LIMBURG' | 'HAINAUT' | 'LUXEMBOURG' | 'LIEGE' | 'NAMUR' | 'VTTL' | 'AFTT' | 'FRBTT';
  }): Observable<StrictHttpResponse<Array<ClubEntry>>> {

    const rb = new RequestBuilder(this.rootUrl, ClubsService.FindAllClubsPath, 'get');
    if (params) {
      rb.header('X-Tabt-Account', params['X-Tabt-Account'], {});
      rb.header('X-Tabt-Password', params['X-Tabt-Password'], {});
      rb.header('X-Tabt-OnBehalfOf', params['X-Tabt-OnBehalfOf'], {});
      rb.header('X-Tabt-Database', params['X-Tabt-Database'], {});
      rb.query('season', params.season, {});
      rb.query('clubCategory', params.clubCategory, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<ClubEntry>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findAllClubs$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAllClubs(params?: {

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
    season?: number;
    clubCategory?: 'VLAAMS_BRABANT_BR' | 'BRUSSELS_BRABANT_WALLON' | 'ANTWERP' | 'OOST_VLANDEREN' | 'WEST_VLAANDEREN' | 'LIMBURG' | 'HAINAUT' | 'LUXEMBOURG' | 'LIEGE' | 'NAMUR' | 'VTTL' | 'AFTT' | 'FRBTT';
  }): Observable<Array<ClubEntry>> {

    return this.findAllClubs$Response(params).pipe(
      map((r: StrictHttpResponse<Array<ClubEntry>>) => r.body as Array<ClubEntry>)
    );
  }

  /**
   * Path part for operation findClubById
   */
  static readonly FindClubByIdPath = '/api/clubs/{clubIndex}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findClubById()` instead.
   *
   * This method doesn't expect any request body.
   */
  findClubById$Response(params: {

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
    clubIndex: string;
    season?: number;
  }): Observable<StrictHttpResponse<ClubEntry>> {

    const rb = new RequestBuilder(this.rootUrl, ClubsService.FindClubByIdPath, 'get');
    if (params) {
      rb.header('X-Tabt-Account', params['X-Tabt-Account'], {});
      rb.header('X-Tabt-Password', params['X-Tabt-Password'], {});
      rb.header('X-Tabt-OnBehalfOf', params['X-Tabt-OnBehalfOf'], {});
      rb.header('X-Tabt-Database', params['X-Tabt-Database'], {});
      rb.path('clubIndex', params.clubIndex, {});
      rb.query('season', params.season, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ClubEntry>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findClubById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findClubById(params: {

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
    clubIndex: string;
    season?: number;
  }): Observable<ClubEntry> {

    return this.findClubById$Response(params).pipe(
      map((r: StrictHttpResponse<ClubEntry>) => r.body as ClubEntry)
    );
  }

  /**
   * Path part for operation findClubMembers
   */
  static readonly FindClubMembersPath = '/api/clubs/{clubIndex}/members';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findClubMembers()` instead.
   *
   * This method doesn't expect any request body.
   */
  findClubMembers$Response(params: {

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
    season?: number;
    playerCategory?: 'MEN' | 'WOMEN' | 'VETERANS' | 'VETERANS_WOMEN' | 'YOUTH';
    uniqueIndex?: number;
    nameSearch?: string;
    extendedInformation?: boolean;
    rankingPointsInformation?: boolean;
    withResults?: boolean;
    withOpponentRankingEvaluation?: boolean;
    clubIndex: string;
  }): Observable<StrictHttpResponse<Array<MemberEntry>>> {

    const rb = new RequestBuilder(this.rootUrl, ClubsService.FindClubMembersPath, 'get');
    if (params) {
      rb.header('X-Tabt-Account', params['X-Tabt-Account'], {});
      rb.header('X-Tabt-Password', params['X-Tabt-Password'], {});
      rb.header('X-Tabt-OnBehalfOf', params['X-Tabt-OnBehalfOf'], {});
      rb.header('X-Tabt-Database', params['X-Tabt-Database'], {});
      rb.query('season', params.season, {});
      rb.query('playerCategory', params.playerCategory, {});
      rb.query('uniqueIndex', params.uniqueIndex, {});
      rb.query('nameSearch', params.nameSearch, {});
      rb.query('extendedInformation', params.extendedInformation, {});
      rb.query('rankingPointsInformation', params.rankingPointsInformation, {});
      rb.query('withResults', params.withResults, {});
      rb.query('withOpponentRankingEvaluation', params.withOpponentRankingEvaluation, {});
      rb.path('clubIndex', params.clubIndex, {});
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
   * To access the full response (for headers, for example), `findClubMembers$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findClubMembers(params: {

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
    season?: number;
    playerCategory?: 'MEN' | 'WOMEN' | 'VETERANS' | 'VETERANS_WOMEN' | 'YOUTH';
    uniqueIndex?: number;
    nameSearch?: string;
    extendedInformation?: boolean;
    rankingPointsInformation?: boolean;
    withResults?: boolean;
    withOpponentRankingEvaluation?: boolean;
    clubIndex: string;
  }): Observable<Array<MemberEntry>> {

    return this.findClubMembers$Response(params).pipe(
      map((r: StrictHttpResponse<Array<MemberEntry>>) => r.body as Array<MemberEntry>)
    );
  }

  /**
   * Path part for operation findClubTeams
   */
  static readonly FindClubTeamsPath = '/api/clubs/{clubIndex}/teams';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findClubTeams()` instead.
   *
   * This method doesn't expect any request body.
   */
  findClubTeams$Response(params: {

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
    season?: number;
    clubIndex: string;
  }): Observable<StrictHttpResponse<Array<TeamEntry>>> {

    const rb = new RequestBuilder(this.rootUrl, ClubsService.FindClubTeamsPath, 'get');
    if (params) {
      rb.header('X-Tabt-Account', params['X-Tabt-Account'], {});
      rb.header('X-Tabt-Password', params['X-Tabt-Password'], {});
      rb.header('X-Tabt-OnBehalfOf', params['X-Tabt-OnBehalfOf'], {});
      rb.header('X-Tabt-Database', params['X-Tabt-Database'], {});
      rb.query('season', params.season, {});
      rb.path('clubIndex', params.clubIndex, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<TeamEntry>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findClubTeams$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findClubTeams(params: {

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
    season?: number;
    clubIndex: string;
  }): Observable<Array<TeamEntry>> {

    return this.findClubTeams$Response(params).pipe(
      map((r: StrictHttpResponse<Array<TeamEntry>>) => r.body as Array<TeamEntry>)
    );
  }

}
