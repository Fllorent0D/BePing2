import {Injectable} from '@angular/core';
import {PLAYER_CATEGORY} from '../../models/user';
import {CapacitorHttp, HttpResponse} from '@capacitor/core';
import {DataTokenService} from './data-token.service';
import {parseTableForHistory} from './data-scraper.utils';
import {CrashlyticsService} from '../crashlytics.service';
import {Store} from '@ngxs/store';
import {RemoteSettingsState, ScrapperConfig} from '../../store/remote-settings';
import {WeeklyNumericRankingV3} from '../../api/models/weekly-numeric-ranking-v-3';
import {WeeklyNumericPointsV3} from '../../api/models/weekly-numeric-points-v-3';
import {environment} from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DataAfttService {

    constructor(
        private readonly dataAfttToken: DataTokenService,
        private readonly crashlytics: CrashlyticsService,
        private readonly store: Store
    ) {
    }

    async getAFTTDataPage(uniquePlayerId: number, category: PLAYER_CATEGORY.MEN | PLAYER_CATEGORY.WOMEN): Promise<WeeklyNumericRankingV3> {
        const url = `${environment.dataAfftUrl}/cltnum-${category === PLAYER_CATEGORY.WOMEN ? 'dames' : 'messieurs'}/fiche.php`;
        const userAgent = (await CapacitorHttp.get({url: 'https://api.beping.be/v1/user-agent/random'})).data.value;
        try {
            const scrapperConfig: ScrapperConfig = this.store.selectSnapshot(RemoteSettingsState.scrappeConfig);
            let response: HttpResponse;
            if(scrapperConfig.goViaClubPage) {
                const token = await this.dataAfttToken.getToken(userAgent);
                //const userAgent = UserAgentsService.random;
                response = await CapacitorHttp.post({
                    url,
                    data: `${token}=${uniquePlayerId}`,
                    responseType: 'text',
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'User-Agent': userAgent,
                    }
                });
            } else {
                response = await CapacitorHttp.post({
                    url,
                    data: `licence=${uniquePlayerId}`,
                    responseType: 'text',
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'User-Agent': userAgent,
                    }
                });
            }

            const parser = new DOMParser();
            const document = parser.parseFromString(response.data, 'text/html');
            const canvas = this.parseCanvasForPoints(document, scrapperConfig.canvas[category]);
            const table = this.findHistoryTable(document, scrapperConfig.history[category]);
            const actualRanking = this.findActualRanking(document, scrapperConfig.actualRanking[category]);
            const historyTable = parseTableForHistory(table);
            return {
                perDateHistory: historyTable,
                points: canvas,
                actualPoints: actualRanking
            };

        } catch (e) {
            await this.crashlytics.recordException('Failed to get AFTT data page', e);
            throw new Error('Failed to get AFTT data');
        }

    }

    private parseCanvasForPoints(domPage: Document, regexToUse: string): WeeklyNumericPointsV3[] {
        const canvasElement: HTMLCanvasElement = domPage.querySelector(regexToUse) as HTMLCanvasElement;
        // #match_list > table > tbody > tr:nth-child(2)
        if (canvasElement) {
            const dates = JSON.parse(canvasElement.getAttribute('data-mdb-labels').replace(/'/g, '"'));
            const bels = JSON.parse(canvasElement.getAttribute('data-mdb-dataset-data').replace(/'/g, '"')).map(Number);
            return dates.map((date, i) => ({
                weekName: date,
                points: bels[i],
            }));

        }
        return [];
    }

    private findHistoryTable(domPage: Document, regexToUse: string): HTMLTableElement {
        return domPage.querySelector(regexToUse) as HTMLTableElement;
    }


    private findActualRanking(document: Document, actualRankingElement: string): number {
        // body > div.content > div.row > div:nth-child(1) > div:nth-child(1) > div.col.bg-success > h3
        const actualRankingElementFound: Element = document.querySelector(actualRankingElement);
        return Number(actualRankingElementFound.textContent?.replace('pts', ''));
    }
}
