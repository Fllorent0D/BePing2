import {Injectable} from '@angular/core';
import {StartNavigation} from '@proteansoftware/capacitor-start-navigation';
import {OSMAddress} from '../models/osm/osm-search.model';
import {GeocoderService} from './geocoding/geocoding.service';
import {VenueEntry} from '../api/models/venue-entry';
import {AnalyticsService} from './firebase/analytics.service';

@Injectable({
    providedIn: 'root'
})
export class StartNavigationService {

    constructor(
        private readonly geocoderService: GeocoderService,
        private readonly analyticsService: AnalyticsService
    ) {
    }

    startNavigation(lat: number | string, long: number | string, name: string): Promise<void> {
        this.analyticsService.logEvent('navigate_to_address', {latitude: lat, longitude: long, name});
        return StartNavigation.launchMapsApp({
            latitude: Number(lat),
            longitude: Number(long),
            name
        });
    }

    navigateToOSMAddress(address: OSMAddress): Promise<void> {
        return this.startNavigation(address.lat, address.lon, address.display_name);
    }

    async navigateToVenue(venue: VenueEntry): Promise<void> {
        const town = venue.Town.substring(5).replace(/ *\([^)]*\) */g, '');
        const postalCodal = venue.Town.substring(0, 4);
        const street = venue.Street.replace(/ *\([^)]*\) */g, '');
        const osmAddress = await this.geocoderService.search(street, town, postalCodal).toPromise();
        return this.navigateToOSMAddress(osmAddress);
    }


}
