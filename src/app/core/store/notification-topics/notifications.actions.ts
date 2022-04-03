import {ClubEntry} from '../../api/models/club-entry';
import {TeamEntry} from '../../api/models/team-entry';
import {DivisionEntry} from '../../api/models/division-entry';
import {MemberEntry} from '../../api/models/member-entry';
import {PermissionState} from '@capacitor/core';
import {TeamMatchesEntry} from '../../api/models/team-matches-entry';

export class SubscribeToClub {
    static type = '[Notifications] Subscribing to club';

    constructor(public clubEntry: ClubEntry) {
    }
}

export class SubscribeToTeam {
    static type = '[Notifications] Subscribing to team';

    constructor(public teamEntry: TeamEntry) {
    }
}

export class SubscribeToDivision {
    static type = '[Notifications] Subscribing to division';

    constructor(public divisionEntry: DivisionEntry) {
    }
}

export class SubscribeToMatch {
    static type = '[Notifications] Subscribing to match';

    constructor(public teamMatchesEntry: TeamMatchesEntry) {
    }
}

export class SubscribeToMember {
    static type = '[Notifications] Subscribing to Member';

    constructor(public memberEntry: MemberEntry) {
    }
}

export class SubscribeToTopic {
    static type = '[Notifications] Subscribing to topic';

    constructor(public topic: string) {
    }
}
export class UnsubscribeToTopic {
    static type = '[Notifications] Unsubscribing to topic';

    constructor(public topic: string) {
    }
}

export class SubscriptionToTopicSuccessful {
    static type = '[Notifications] successfully subscribe to topic';

    constructor(
        public topic: string,
        public message: string,
    ) {
    }
}

export class UnsubscriptionToTopicSuccessful {
    static type = '[Notifications] successfully unsubscribe to topic';

    constructor(
        public topic: string,
        public message: string,
    ) {
    }
}

export class PermissionStateChanged {
    static type = '[Notifications] permission state changed';

    constructor(public state: PermissionState) {
    }
}
