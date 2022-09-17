import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Share, ShareResult} from '@capacitor/share';
import {AnalyticsService} from './firebase/analytics.service';

@Injectable({
    providedIn: 'root'
})
export class ShareService {

    constructor(
        private readonly analytics: AnalyticsService
    ) {
    }

    async shareUrl(path: string, text?: string, title?: string, dialogTitle?: string): Promise<ShareResult> {
        this.analytics.logEvent('share_url', {path});
        const shareableUrl = new URL(environment.bepingUrl);
        shareableUrl.pathname = path;
        return await Share.share({
            text,
            dialogTitle,
            title,
            url: shareableUrl.href
        });
    }
}
