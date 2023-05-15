// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as UserAgent from 'user-agents';

export class UserAgentsService {
    static get random() {
        // using chrome by default
        const userAgent = new UserAgent({deviceCategory: 'mobile'});
        return userAgent.random().data.userAgent;
    }
}
