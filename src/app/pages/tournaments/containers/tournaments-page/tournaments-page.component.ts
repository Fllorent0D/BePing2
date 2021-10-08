import {Component, OnInit} from '@angular/core';
import {TournamentsService} from '../../../../core/api/services/tournaments.service';
import {TournamentEntry} from '../../../../core/api/models/tournament-entry';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {IonRouterOutlet, ModalController, PopoverController} from '@ionic/angular';
import {TournamentFiltersComponent} from '../../components/tournament-filters/tournament-filters.component';
import {map} from 'rxjs/operators';
import {TabsNavigationService} from '../../../../core/services/navigation/tabs-navigation.service';

interface TournamentByMonth {
    month: number;
    year: number;
    tournaments: TournamentEntry[];
}

export interface TournamentsFilter {
    levelsToDisplay: number[];
    showPastTournaments: boolean;
}


@Component({
    selector: 'beping-tournaments-page',
    templateUrl: './tournaments-page.component.html',
    styleUrls: ['./tournaments-page.component.scss']
})
export class TournamentsPageComponent implements OnInit {
    tournaments$: Observable<TournamentByMonth[]>;
    tournamentsFiltered$: Observable<TournamentByMonth[]>;
    // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    private defaultFilter: TournamentsFilter = {
        levelsToDisplay: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        showPastTournaments: false
    };
    tournamentsFilter$: BehaviorSubject<TournamentsFilter> = new BehaviorSubject<TournamentsFilter>(this.defaultFilter);

    constructor(
        private readonly tournamentService: TournamentsService,
        private readonly popoverController: PopoverController,
        private readonly modalCtrl: ModalController,
        private readonly tabNavigator: TabsNavigationService,
        private readonly ionRouterOutlet: IonRouterOutlet
    ) {
    }

    ngOnInit() {
        this.tournaments$ = this.tournamentService.findAllTournaments().pipe(
            map((tournaments: TournamentEntry[]) => {
                return tournaments.reduce<TournamentByMonth[]>((acc: TournamentByMonth[], tournament: TournamentEntry) => {
                    const date = new Date(tournament.DateFrom);
                    const month = date.getMonth();
                    const year = date.getFullYear();
                    const existingAcc = acc.find((tMonth: TournamentByMonth) => tMonth.month === month && tMonth.year === year);

                    if (existingAcc) {
                        return acc.map((tournamentsByMonth: TournamentByMonth) => {
                            if (tournamentsByMonth.month === month && tournamentsByMonth.year === year) {
                                return {
                                    ...tournamentsByMonth,
                                    tournaments: [...tournamentsByMonth.tournaments, tournament]
                                };
                            }
                            return tournamentsByMonth;
                        });
                    } else {
                        return [...acc, {month, year, tournaments: [tournament]}];
                    }
                }, []);
            }),
            map((tournamentsByMonth: TournamentByMonth[]) => tournamentsByMonth.sort((a, b) => {
                const dateA = new Date(a.year, a.month, 0);
                const dateb = new Date(b.year, b.month, 0);
                return dateA.getTime() - dateb.getTime();
            })),
            map((tournamentsByMonth: TournamentByMonth[]) => {
                return tournamentsByMonth.map((byMonth) => {
                        return {
                            ...byMonth,
                            tournaments: byMonth.tournaments.sort((a, b) => {
                                const dateA = new Date(a.DateFrom);
                                const dateB = new Date(b.DateFrom);
                                return dateA.getTime() - dateB.getTime();
                            })
                        };
                    }
                );
            })
        );

        this.tournamentsFiltered$ = combineLatest([
            this.tournaments$,
            this.tournamentsFilter$
        ]).pipe(
            map(([tournaments, filters]) => {
                return tournaments.map((byMonth) => {
                    return {
                        ...byMonth,
                        tournaments: byMonth.tournaments.filter((tournament: TournamentEntry) => {
                            const inLevelToDisplay = filters.levelsToDisplay.includes(tournament.Level);
                            const inPast = this.isPast(tournament);
                            return inLevelToDisplay && ((filters.showPastTournaments && inPast) || !inPast);
                        })
                    };
                });
            }),
            map((tournaments: TournamentByMonth[]) => tournaments.filter((tMonth) => tMonth.tournaments.length))
        );

    }

    async showFilters() {
        const modal = await this.modalCtrl.create({
            component: TournamentFiltersComponent,
            swipeToClose: true,
            presentingElement: this.ionRouterOutlet.nativeEl,
            componentProps: {
                filter: this.tournamentsFilter$.getValue()
            }
        });
        await modal.present();

        const {data} = await modal.onWillDismiss<TournamentsFilter>();
        if (data) {
            this.tournamentsFilter$.next(data);
        }
    }

    isPast(tournament: TournamentEntry): boolean {
        return new Date(tournament.DateTo ?? tournament.DateFrom).getTime() < Date.now();
    }

    navigateToTournamentDetail(tournament: TournamentEntry) {
        this.tabNavigator.navigateTo(['tournaments', tournament.UniqueIndex.toString()]);

    }
}
