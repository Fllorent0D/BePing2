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

import { RegisterTournament } from '../models/register-tournament';
import { TournamentEntry } from '../models/tournament-entry';
import { TournamentSerieEntry } from '../models/tournament-serie-entry';

@Injectable({
  providedIn: 'root',
})
export class TournamentsService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation findAllTournaments
   */
  static readonly FindAllTournamentsPath = '/v1/tournaments';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findAllTournaments()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAllTournaments$Response(params?: {

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
  }): Observable<StrictHttpResponse<Array<TournamentEntry>>> {

    const rb = new RequestBuilder(this.rootUrl, TournamentsService.FindAllTournamentsPath, 'get');
    if (params) {
      rb.header('X-Tabt-Account', params['X-Tabt-Account'], {});
      rb.header('X-Tabt-Password', params['X-Tabt-Password'], {});
      rb.header('X-Tabt-OnBehalfOf', params['X-Tabt-OnBehalfOf'], {});
      rb.header('X-Tabt-Database', params['X-Tabt-Database'], {});
      rb.header('X-Tabt-Season', params['X-Tabt-Season'], {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<TournamentEntry>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findAllTournaments$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAllTournaments(params?: {

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
  }): Observable<Array<TournamentEntry>> {

    return this.findAllTournaments$Response(params).pipe(
      map((r: StrictHttpResponse<Array<TournamentEntry>>) => r.body as Array<TournamentEntry>)
    );
  }

  /**
   * Path part for operation findTournamentById
   */
  static readonly FindTournamentByIdPath = '/v1/tournaments/{tournamentId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findTournamentById()` instead.
   *
   * This method doesn't expect any request body.
   */
  findTournamentById$Response(params: {

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
    withResults?: boolean;
    withRegistrations?: boolean;
    tournamentId: number;
  }): Observable<StrictHttpResponse<TournamentEntry>> {

    const rb = new RequestBuilder(this.rootUrl, TournamentsService.FindTournamentByIdPath, 'get');
    if (params) {
      rb.header('X-Tabt-Account', params['X-Tabt-Account'], {});
      rb.header('X-Tabt-Password', params['X-Tabt-Password'], {});
      rb.header('X-Tabt-OnBehalfOf', params['X-Tabt-OnBehalfOf'], {});
      rb.header('X-Tabt-Database', params['X-Tabt-Database'], {});
      rb.header('X-Tabt-Season', params['X-Tabt-Season'], {});
      rb.query('withResults', params.withResults, {});
      rb.query('withRegistrations', params.withRegistrations, {});
      rb.path('tournamentId', params.tournamentId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<TournamentEntry>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findTournamentById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findTournamentById(params: {

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
    withResults?: boolean;
    withRegistrations?: boolean;
    tournamentId: number;
  }): Observable<TournamentEntry> {

    return this.findTournamentById$Response(params).pipe(
      map((r: StrictHttpResponse<TournamentEntry>) => r.body as TournamentEntry)
    );
  }

  /**
   * Path part for operation findSeriesByTournament
   */
  static readonly FindSeriesByTournamentPath = '/v1/tournaments/{tournamentId}/series';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findSeriesByTournament()` instead.
   *
   * This method doesn't expect any request body.
   */
  findSeriesByTournament$Response(params: {

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
    tournamentId: number;
  }): Observable<StrictHttpResponse<Array<TournamentSerieEntry>>> {

    const rb = new RequestBuilder(this.rootUrl, TournamentsService.FindSeriesByTournamentPath, 'get');
    if (params) {
      rb.header('X-Tabt-Account', params['X-Tabt-Account'], {});
      rb.header('X-Tabt-Password', params['X-Tabt-Password'], {});
      rb.header('X-Tabt-OnBehalfOf', params['X-Tabt-OnBehalfOf'], {});
      rb.header('X-Tabt-Database', params['X-Tabt-Database'], {});
      rb.header('X-Tabt-Season', params['X-Tabt-Season'], {});
      rb.path('tournamentId', params.tournamentId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<TournamentSerieEntry>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findSeriesByTournament$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findSeriesByTournament(params: {

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
    tournamentId: number;
  }): Observable<Array<TournamentSerieEntry>> {

    return this.findSeriesByTournament$Response(params).pipe(
      map((r: StrictHttpResponse<Array<TournamentSerieEntry>>) => r.body as Array<TournamentSerieEntry>)
    );
  }

  /**
   * Path part for operation registerToSerie
   */
  static readonly RegisterToSeriePath = '/v1/tournaments/{tournamentId}/serie/{serieId}/register';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registerToSerie()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registerToSerie$Response(params: {

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
    tournamentId: number;
    serieId: number;
    body: RegisterTournament
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, TournamentsService.RegisterToSeriePath, 'post');
    if (params) {
      rb.header('X-Tabt-Account', params['X-Tabt-Account'], {});
      rb.header('X-Tabt-Password', params['X-Tabt-Password'], {});
      rb.header('X-Tabt-OnBehalfOf', params['X-Tabt-OnBehalfOf'], {});
      rb.header('X-Tabt-Database', params['X-Tabt-Database'], {});
      rb.header('X-Tabt-Season', params['X-Tabt-Season'], {});
      rb.path('tournamentId', params.tournamentId, {});
      rb.path('serieId', params.serieId, {});
      rb.body(params.body, 'application/json');
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
   * To access the full response (for headers, for example), `registerToSerie$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registerToSerie(params: {

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
    tournamentId: number;
    serieId: number;
    body: RegisterTournament
  }): Observable<void> {

    return this.registerToSerie$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
