import {Injectable} from '@angular/core';
import {CapacitorHttp} from '@capacitor/core';
import {environment} from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DataTokenService {

    constructor() {
    }

    async getToken(ua: string): Promise<string> {
        //const userAgent = UserAgentsService.random;
        const htmlPage = await CapacitorHttp.get({
            url: `${environment.dataAfftUrl}/cltnum-messieurs/club.php`,
            responseType: 'text',
            headers: {
                'User-Agent': ua,
            }
        });

        const regex = new RegExp('[0-9A-F]{100}', 'gmi');
        const tokens = regex.exec(htmlPage.data);
        return tokens[0];
    }
}
