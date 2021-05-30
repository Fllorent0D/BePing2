import {Component, OnInit} from '@angular/core';
import {combineLatest, Observable, ReplaySubject} from 'rxjs';
import {PLAYER_CATEGORY} from '../../../../core/models/user';
import {MemberEntry} from '../../../../core/api/models/member-entry';
import {UserMemberEntries} from '../../../../core/store/user/user.state';
import {TeamMatchesEntry} from '../../../../core/api/models/team-matches-entry';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {PlayerCategoryService} from '../../../../core/services/tabt/player-category.service';
import {ToastController} from '@ionic/angular';
import {map, share, switchMap, take} from 'rxjs/operators';

@Component({
    selector: 'beping-other-players',
    templateUrl: './other-players.component.html',
    styleUrls: ['./other-players.component.scss']
})
export class OtherPlayersComponent implements OnInit {

    memberUniqueIndex$: Observable<number>;
    categoriesAvailable$: Observable<PLAYER_CATEGORY[]>;
    currentCategory$: ReplaySubject<PLAYER_CATEGORY> = new ReplaySubject<PLAYER_CATEGORY>(1);
    currentMemberEntry$: Observable<MemberEntry>;
    userMemberEntries$: Observable<UserMemberEntries>;
    latestMatches$: Observable<TeamMatchesEntry[]>;

    constructor(
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly playerCategoryService: PlayerCategoryService,
        private readonly toastrCtrl: ToastController
    ) {
    }

    ngOnInit() {
        this.memberUniqueIndex$ = this.activatedRoute.paramMap.pipe(
            map((params: ParamMap) => Number(params.get('id')))
        );
        this.userMemberEntries$ = this.memberUniqueIndex$.pipe(
            switchMap((memberIndex) => this.playerCategoryService.getMemberPlayerCategories(memberIndex)),
            share()
        );
        this.categoriesAvailable$ = this.userMemberEntries$.pipe(
            map((memberEntries: UserMemberEntries) => PlayerCategoryService.getPlayedCategories(memberEntries))
        );

        this.userMemberEntries$.pipe(
            take(1),
            map((memEntries: UserMemberEntries) => PlayerCategoryService.getMainCategory(memEntries))
        ).subscribe((category) => {
            this.currentCategory$.next(category);
        });

        this.currentMemberEntry$ = combineLatest([
            this.currentCategory$,
            this.userMemberEntries$
        ]).pipe(
            map(([category, userMemberEntries]) => userMemberEntries[category])
        );
    }

    async categoryClicked(category: PLAYER_CATEGORY) {
        this.currentCategory$.next(category);
        const toast = await this.toastrCtrl.create({
            message: `Profil ${category} chargé`,
            duration: 3000
        });
        toast.present();
    }
    getIcon(category: PLAYER_CATEGORY) {
        switch (category) {
            case PLAYER_CATEGORY.MEN:
            case PLAYER_CATEGORY.VETERANS:
            case PLAYER_CATEGORY.YOUTH:
                return 'male-outline';
            case PLAYER_CATEGORY.WOMEN:
            case PLAYER_CATEGORY.VETERANS_WOMEN:
                return 'female-outline';
        }
    }
}
