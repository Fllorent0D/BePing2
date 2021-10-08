import {Injectable} from '@angular/core';
import {MemberEntry} from '../../api/models/member-entry';

@Injectable({
    providedIn: 'root'
})
export class ClubMembersListService {

    constructor() {
    }

    transformToClubMembersList(members: MemberEntry[]): MemberEntry[] {
        return members
            .filter((member) => member.Status === 'A' && member.RankingIndex !== 0)
            .map((member, index) => {
                member.Position = index + 1;
                return member;
            });
    }
}
