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

import {MatchSystemEntry} from '../models/match-system-entry';
import {TeamMatchesEntry} from '../models/team-matches-entry';

@Injectable({
  providedIn: 'root',
})
export class MatchesService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation findAllMatches
   */
  static readonly FindAllMatchesPath = '/v1/matches';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findAllMatches()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAllMatches$Response(params?: {

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
    divisionId?: number;
    club?: string;
    team?: string;
    divisionCategory?: 'MEN' | 'WOMEN' | 'VETERANS' | 'VETERANS_WOMEN' | 'YOUTH' | 'MEN_POST_23' | 'WOMEN_POST_23' | 'YOUTH_POST_23';
    weekName?: number;
    level?: 'NATIONAL' | 'HAINAUT' | 'VLAAMS_BRABANT_BR' | 'SUPER_DIVISION' | 'OOST_VLANDEREN' | 'ANTWERP' | 'WEST_VLAANDEREN' | 'LIMBURG' | 'BRUSSELS_BRABANT_WALLON' | 'NAMUR' | 'LIEGE' | 'LUXEMBOURG' | 'REGION_VTTL' | 'IWB';
    showDivisionName?: string;

    /**
     * YYYY-MM-DD
     */
    yearDateFrom?: string;

    /**
     * YYYY-MM-DD
     */
    yearDateTo?: string;
    withDetails?: boolean;
    matchId?: string;
    matchUniqueId?: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Array<TeamMatchesEntry>>> {

    const rb = new RequestBuilder(this.rootUrl, MatchesService.FindAllMatchesPath, 'get');
    if (params) {
      rb.header('X-Tabt-Account', params['X-Tabt-Account'], {});
      rb.header('X-Tabt-Password', params['X-Tabt-Password'], {});
      rb.header('X-Tabt-OnBehalfOf', params['X-Tabt-OnBehalfOf'], {});
      rb.header('X-Tabt-Database', params['X-Tabt-Database'], {});
      rb.header('X-Tabt-Season', params['X-Tabt-Season'], {});
      rb.query('divisionId', params.divisionId, {});
      rb.query('club', params.club, {});
      rb.query('team', params.team, {});
      rb.query('divisionCategory', params.divisionCategory, {});
      rb.query('weekName', params.weekName, {});
      rb.query('level', params.level, {});
      rb.query('showDivisionName', params.showDivisionName, {});
      rb.query('yearDateFrom', params.yearDateFrom, {});
      rb.query('yearDateTo', params.yearDateTo, {});
      rb.query('withDetails', params.withDetails, {});
      rb.query('matchId', params.matchId, {});
      rb.query('matchUniqueId', params.matchUniqueId, {});
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
   * To access the full response (for headers, for example), `findAllMatches$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAllMatches(params?: {

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
    divisionId?: number;
    club?: string;
    team?: string;
    divisionCategory?: 'MEN' | 'WOMEN' | 'VETERANS' | 'VETERANS_WOMEN' | 'YOUTH' | 'MEN_POST_23' | 'WOMEN_POST_23' | 'YOUTH_POST_23';
    weekName?: number;
    level?: 'NATIONAL' | 'HAINAUT' | 'VLAAMS_BRABANT_BR' | 'SUPER_DIVISION' | 'OOST_VLANDEREN' | 'ANTWERP' | 'WEST_VLAANDEREN' | 'LIMBURG' | 'BRUSSELS_BRABANT_WALLON' | 'NAMUR' | 'LIEGE' | 'LUXEMBOURG' | 'REGION_VTTL' | 'IWB';
    showDivisionName?: string;

    /**
     * YYYY-MM-DD
     */
    yearDateFrom?: string;

    /**
     * YYYY-MM-DD
     */
    yearDateTo?: string;
    withDetails?: boolean;
    matchId?: string;
    matchUniqueId?: string;
    context?: HttpContext
  }
): Observable<Array<TeamMatchesEntry>> {

    return this.findAllMatches$Response(params).pipe(
      map((r: StrictHttpResponse<Array<TeamMatchesEntry>>) => r.body as Array<TeamMatchesEntry>)
    );
  }

  /**
   * Path part for operation findAllMatchSystems
   */
  static readonly FindAllMatchSystemsPath = '/v1/matches/systems';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findAllMatchSystems()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAllMatchSystems$Response(params?: {

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
): Observable<StrictHttpResponse<Array<MatchSystemEntry>>> {

    const rb = new RequestBuilder(this.rootUrl, MatchesService.FindAllMatchSystemsPath, 'get');
    if (params) {
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
        return r as StrictHttpResponse<Array<MatchSystemEntry>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findAllMatchSystems$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAllMatchSystems(params?: {

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
): Observable<Array<MatchSystemEntry>> {

    return this.findAllMatchSystems$Response(params).pipe(
      map((r: StrictHttpResponse<Array<MatchSystemEntry>>) => r.body as Array<MatchSystemEntry>)
    );
  }

  /**
   * Path part for operation findMatchSystemById
   */
  static readonly FindMatchSystemByIdPath = '/v1/matches/systems/{matchSystemId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findMatchSystemById()` instead.
   *
   * This method doesn't expect any request body.
   */
  findMatchSystemById$Response(params: {

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
    matchSystemId: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<MatchSystemEntry>> {

    const rb = new RequestBuilder(this.rootUrl, MatchesService.FindMatchSystemByIdPath, 'get');
    if (params) {
      rb.header('X-Tabt-Account', params['X-Tabt-Account'], {});
      rb.header('X-Tabt-Password', params['X-Tabt-Password'], {});
      rb.header('X-Tabt-OnBehalfOf', params['X-Tabt-OnBehalfOf'], {});
      rb.header('X-Tabt-Database', params['X-Tabt-Database'], {});
      rb.header('X-Tabt-Season', params['X-Tabt-Season'], {});
      rb.path('matchSystemId', params.matchSystemId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<MatchSystemEntry>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findMatchSystemById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findMatchSystemById(params: {

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
    matchSystemId: number;
    context?: HttpContext
  }
): Observable<MatchSystemEntry> {

    return this.findMatchSystemById$Response(params).pipe(
      map((r: StrictHttpResponse<MatchSystemEntry>) => r.body as MatchSystemEntry)
    );
  }

  /**
   * Path part for operation findMatchById
   */
  static readonly FindMatchByIdPath = '/v1/matches/{matchUniqueId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findMatchById()` instead.
   *
   * This method doesn't expect any request body.
   */
  findMatchById$Response(params: {

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
    divisionId?: number;
    club?: string;
    team?: string;
    divisionCategory?: 'MEN' | 'WOMEN' | 'VETERANS' | 'VETERANS_WOMEN' | 'YOUTH' | 'MEN_POST_23' | 'WOMEN_POST_23' | 'YOUTH_POST_23';
    weekName?: number;
    level?: 'NATIONAL' | 'HAINAUT' | 'VLAAMS_BRABANT_BR' | 'SUPER_DIVISION' | 'OOST_VLANDEREN' | 'ANTWERP' | 'WEST_VLAANDEREN' | 'LIMBURG' | 'BRUSSELS_BRABANT_WALLON' | 'NAMUR' | 'LIEGE' | 'LUXEMBOURG' | 'REGION_VTTL' | 'IWB';
    showDivisionName?: string;

    /**
     * YYYY-MM-DD
     */
    yearDateFrom?: string;

    /**
     * YYYY-MM-DD
     */
    yearDateTo?: string;
    withDetails?: boolean;
    matchId?: string;
    matchUniqueId: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<TeamMatchesEntry>> {

    const rb = new RequestBuilder(this.rootUrl, MatchesService.FindMatchByIdPath, 'get');
    if (params) {
      rb.header('X-Tabt-Account', params['X-Tabt-Account'], {});
      rb.header('X-Tabt-Password', params['X-Tabt-Password'], {});
      rb.header('X-Tabt-OnBehalfOf', params['X-Tabt-OnBehalfOf'], {});
      rb.header('X-Tabt-Database', params['X-Tabt-Database'], {});
      rb.header('X-Tabt-Season', params['X-Tabt-Season'], {});
      rb.query('divisionId', params.divisionId, {});
      rb.query('club', params.club, {});
      rb.query('team', params.team, {});
      rb.query('divisionCategory', params.divisionCategory, {});
      rb.query('weekName', params.weekName, {});
      rb.query('level', params.level, {});
      rb.query('showDivisionName', params.showDivisionName, {});
      rb.query('yearDateFrom', params.yearDateFrom, {});
      rb.query('yearDateTo', params.yearDateTo, {});
      rb.query('withDetails', params.withDetails, {});
      rb.query('matchId', params.matchId, {});
      rb.path('matchUniqueId', params.matchUniqueId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<TeamMatchesEntry>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findMatchById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findMatchById(params: {

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
    divisionId?: number;
    club?: string;
    team?: string;
    divisionCategory?: 'MEN' | 'WOMEN' | 'VETERANS' | 'VETERANS_WOMEN' | 'YOUTH' | 'MEN_POST_23' | 'WOMEN_POST_23' | 'YOUTH_POST_23';
    weekName?: number;
    level?: 'NATIONAL' | 'HAINAUT' | 'VLAAMS_BRABANT_BR' | 'SUPER_DIVISION' | 'OOST_VLANDEREN' | 'ANTWERP' | 'WEST_VLAANDEREN' | 'LIMBURG' | 'BRUSSELS_BRABANT_WALLON' | 'NAMUR' | 'LIEGE' | 'LUXEMBOURG' | 'REGION_VTTL' | 'IWB';
    showDivisionName?: string;

    /**
     * YYYY-MM-DD
     */
    yearDateFrom?: string;

    /**
     * YYYY-MM-DD
     */
    yearDateTo?: string;
    withDetails?: boolean;
    matchId?: string;
    matchUniqueId: number;
    context?: HttpContext
  }
): Observable<TeamMatchesEntry> {

    return this.findMatchById$Response(params).pipe(
      map((r: StrictHttpResponse<TeamMatchesEntry>) => r.body as TeamMatchesEntry)
    );
  }

}
