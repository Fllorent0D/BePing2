import {Component, OnInit} from '@angular/core';
import {TournamentEntry} from '../../../../core/api/models/tournament-entry';
import {Observable} from 'rxjs';
import {TournamentsService} from '../../../../core/api/services/tournaments.service';
import {ActivatedRoute, Params} from '@angular/router';
import {filter, map, share, switchMap, tap} from 'rxjs/operators';
import {latLng, Map, MapOptions, Marker, tileLayer} from 'leaflet';
import {VenueEntry} from '../../../../core/api/models/venue-entry';
import {GeocoderService} from '../../../../core/services/geocoding/geocoding.service';
import {OSMAddress} from '../../../../core/models/osm/osm-search.model';
import {Level} from '../../../../core/models/level';
import {ModalBaseComponent} from '../../../modals/modal-base/modal-base.component';
import {SettingsPage} from '../../../settings/containers/settings-page/settings.page';
import {IonRouterOutlet, ModalController} from '@ionic/angular';
import {TournamentRegistrationModalComponent} from '../tournament-registration-modal/tournament-registration-modal.component';

@Component({
    selector: 'beping-tournament-detail-page',
    templateUrl: './tournament-detail-page.component.html',
    styleUrls: ['./tournament-detail-page.component.scss']
})
export class TournamentDetailPageComponent implements OnInit {

    tournament$: Observable<TournamentEntry>;
    options: MapOptions = {
        layers: [
            tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: '...'})
        ],
        zoomControl: false,
        zoom: 7,
        center: latLng(50.5010789, 4.4764595)
    };
    map: Map;
    Level = Level;

    constructor(
        private readonly tournamentService: TournamentsService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly geocoderService: GeocoderService,
        private readonly modalCtrl: ModalController,
        private readonly ionRouter: IonRouterOutlet,

    ) {
    }

    ngOnInit(): void {
        this.tournament$ = this.activatedRoute.params.pipe(
            map((params: Params) => params.id),
            switchMap((id: string) => this.tournamentService.findTournamentById({
                withResults: true,
                withRegistrations: true,
                tournamentId: Number(id)
            })),
            share()
        );
        this.tournament$.pipe(
            filter((tournament) => !!tournament.Venue),
            map((t) => t.Venue),
            switchMap((venue: VenueEntry) => {
                const town = venue.Town.substring(5).replace(/ *\([^)]*\) */g, '');
                const postalCodal = venue.Town.substring(0, 4);
                const street = venue.Street.replace(/ *\([^)]*\) */g, '');
                return this.geocoderService.search(street, town, postalCodal);
            }),
            tap((osmAddress: OSMAddress) => {
                this.map.setView([Number(osmAddress.lat), Number(osmAddress.lon)], 13, {animate: true, duration: 5});
                const marker = new Marker([Number(osmAddress.lat), Number(osmAddress.lon)]);
                this.map.addLayer(marker);
            })
        ).subscribe();
    }

    onMapReady(map: Map) {
        this.map = map;
        setTimeout(() => {
            map.invalidateSize();
        }, 0);
    }

    registrationClosed(tournament: TournamentEntry): boolean {
        return new Date(tournament.RegistrationDate).getTime() < Date.now();
    }

    isPast(tournament: TournamentEntry): boolean {
        return new Date(tournament.DateTo ?? tournament.DateFrom).getTime() < Date.now();
    }

    async register(tournament: TournamentEntry) {
        const modal = await this.modalCtrl.create({
            component: TournamentRegistrationModalComponent,
            swipeToClose: true,
            componentProps: {
                tournament
            },
            presentingElement: this.ionRouter.nativeEl
        });
        await modal.present();
    }

}
