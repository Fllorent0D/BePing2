import {Injectable} from '@angular/core';
import {TeamMatchesEntry} from '../../api/models/team-matches-entry';
import {CalendarEventOptions, CapacitorCalendar} from 'capacitor-calendar';
import {DialogService} from '../dialog-service.service';
import {TranslateService} from '@ngx-translate/core';
import {AnalyticsService} from '../firebase/analytics.service';
import {IsProService} from '../is-pro.service';

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

    addEvent(opts: CalendarEventOptions) {
        this.analyticsService.logEvent('add_to_calendar', {
            matchId: opts.id
        });
        return CapacitorCalendar.createEvent(opts);
    }

    async checkPremiumAndAddTeamMatchEntries(teamMatchEntries: TeamMatchesEntry[], opts?: AddToCalendarOpts): Promise<void> {
        const isPro = await this.isProService.isPro$({}).toPromise();
        if (isPro) {
            await this.addTeamMatchEntries(teamMatchEntries, opts);
        }
    }

    async addTeamMatchEntries(teamMatchEntries: TeamMatchesEntry[], opts?: AddToCalendarOpts): Promise<void> {
        if (teamMatchEntries.length > 0) {
            const shouldContinue = await this.askConfirmation(opts);
            if (!shouldContinue) {
                return;
            }
        }

        for (const match of teamMatchEntries) {
            try {
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

    private getOptsForTeamMatchEntry(teamMatch: TeamMatchesEntry) {
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
            endDate: endDate.getTime()
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
