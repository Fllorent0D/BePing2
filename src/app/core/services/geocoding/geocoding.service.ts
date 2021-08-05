import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {OSMAddress} from '../../models/osm/osm-search.model';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class GeocoderService {

    constructor(
        private readonly httpClient: HttpClient
    ) {
    }


    search(street: string, town: string, postalCode: string): Observable<OSMAddress> {
        const url = `https://nominatim.openstreetmap.org/search`;

        return this.httpClient.get<OSMAddress[]>(url, {
            params: {
                street,
                town,
                postalcode: postalCode,
                format: 'json',
                limit: 1,
                addressdetails: 1,
                country: 'be'
            },
            headers: {
                'User-Agent': 'BePing'
            }
        }).pipe(
            map((osmAddresses: OSMAddress[]) => {
                if (osmAddresses.length > 0) {
                    return osmAddresses[0];
                }
                throw new Error('Impossible to find coordinates');
            })
        );
    }

}
