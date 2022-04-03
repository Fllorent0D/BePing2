import {Injectable} from '@angular/core';
import {TeamMatchesEntry} from '../../api/models/team-matches-entry';
import {CalendarEventOptions, CapacitorCalendar} from 'capacitor-calendar';
import {DialogService} from '../dialog-service.service';
import {TranslateService} from '@ngx-translate/core';
import {AnalyticsService} from '../firebase/analytics.service';
import {IsProService} from '../is-pro.service';
import {TournamentEntry} from '../../api/models/tournament-entry';

export interface AddToCalendarOpts {
    dialogHeaderTranslationKey: string;
    dialogMessageTranslationKey: string;
}


@Injectable({
    providedIn: 'root'
})
export class CalendarService {

    constructor(
        private readonly dialogService: DialogService,
        private readonly translate: TranslateService,
        private readonly analyticsService: AnalyticsService,
        private readonly isProService: IsProService
    ) {
    }

    async addEvent(opts: CalendarEventOptions) {
        try {
            const {events}: { events: any[] } = await CapacitorCalendar.findEvent({title: opts.title, location: opts.location});
            if (events.length === 1) {
                await CapacitorCalendar.updateEvent({...opts, id: events[0].id});
            } else {
                throw new Error('Event has not been found');
            }
        } catch (e) {
            if (e.message === 'Event has not been found') {
                await CapacitorCalendar.createEvent(opts);
                return;
            }
            await this.dialogService.showToast({
                message: this.translate.instant('CALENDAR.OOPS'),
                color: 'danger',
                duration: 3000
            });
            throw e;
        }
    }

    async checkPremiumAndAddTeamMatchEntries(teamMatchEntries: TeamMatchesEntry[], opts?: AddToCalendarOpts): Promise<void> {
        const isPro = await this.isProService.isPro$().toPromise();
        if (isPro) {
            await this.addTeamMatchEntries(teamMatchEntries, opts);
        }
    }

    async checkPremiumAndAddTournament(tournaments: TournamentEntry[], opts?: AddToCalendarOpts): Promise<void> {
        const isPro = await this.isProService.isPro$().toPromise();
        if (isPro) {
            await this.addTournaments(tournaments, opts);
        }
    }

    async addTeamMatchEntries(teamMatchEntries: TeamMatchesEntry[], opts?: AddToCalendarOpts): Promise<void> {
        if (teamMatchEntries.length > 1) {
            const shouldContinue = await this.askConfirmation(opts);
            if (!shouldContinue) {
                return;
            }
        }

        for (const match of teamMatchEntries) {
            try {
                this.analyticsService.logEvent('add_match_to_calendar', {
                    matchId: match.MatchId
                });
                await this.addEvent(this.getOptsForTeamMatchEntry(match));
            } catch (e) {
                console.log('Add to calendar failed', e);
            }
        }
        await this.dialogService.showToast({
            message: this.translate.instant(teamMatchEntries.length > 1 ? 'CALENDAR.MATCHES_ADDED' : 'CALENDAR.MATCH_ADDED'),
            color: 'dark',
            duration: 3000
        });
    }

    async addTournaments(tournaments: TournamentEntry[], opts?: AddToCalendarOpts): Promise<void> {
        if (tournaments.length > 1) {
            const shouldContinue = await this.askConfirmation(opts);
            if (!shouldContinue) {
                return;
            }
        }

        for (const tournament of tournaments) {
            try {
                this.analyticsService.logEvent('add_tournament_to_calendar', {
                    matchId: tournament.UniqueIndex
                });
                await this.addEvent(this.getOptsForTournaments(tournament));
            } catch (e) {
                console.log('Add to calendar failed', e);
            }
        }
        await this.dialogService.showToast({
            message: this.translate.instant(tournaments.length > 1 ? 'CALENDAR.MATCHES_ADDED' : 'CALENDAR.MATCH_ADDED'),
            color: 'dark',
            duration: 3000
        });
    }

    private getOptsForTeamMatchEntry(teamMatch: TeamMatchesEntry): CalendarEventOptions {
        const startDate = new Date(teamMatch.Date);
        const [hour, mins, secs] = teamMatch.Time.split(':').map(Number);
        startDate.setHours(hour, mins, secs);
        const endDate = new Date(startDate);
        endDate.setHours(startDate.getHours() + 3);
        return {
            id: `match-${teamMatch.MatchId}`,
            title: `${teamMatch.HomeTeam} - ${teamMatch.AwayTeam}`,
            location: `${teamMatch.VenueEntry.Street} ${teamMatch.VenueEntry.Town}`,
            notes: this.translate.instant('CALENDAR.EVENT_DESCRIPTION', {
                venue: teamMatch.VenueEntry.Name,
                remark: teamMatch.VenueEntry.Comment,
            }),
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
            allDay: false
        };
    }

    private getOptsForTournaments(tournament: TournamentEntry): CalendarEventOptions {
        const startDate = new Date(tournament.DateFrom);
        return {
            id: `tournament-${tournament.UniqueIndex}`,
            title: tournament.Name,
            location: `${tournament.Venue.Street} ${tournament.Venue.Town}`,
            notes: this.translate.instant('CALENDAR.EVENT_DESCRIPTION', {
                venue: tournament.Venue.Name,
                remark: tournament.Venue.Comment ?? '',
            }),
            startDate: startDate.getTime(),
            endDate: tournament.DateTo ? (new Date(tournament.DateTo)).getTime() : startDate.getTime(),
            allDay: true
        };
    }

    private async askConfirmation(opts?: AddToCalendarOpts): Promise<boolean> {
        let accepted = false;
        const alert = await this.dialogService.showAlert({
            header: this.translate.instant(opts.dialogHeaderTranslationKey),
            message: this.translate.instant(opts.dialogMessageTranslationKey),
            buttons: [{
                text: this.translate.instant('COMMON.CANCEL'),
                role: 'cancel'
            }, {
                text: this.translate.instant('COMMON.ADD'),
                handler: () => {
                    accepted = true;
                }
            }]
        });
        await alert.onWillDismiss();
        return accepted;
    }
}
