import {Component, OnInit} from '@angular/core';
import {combineLatest, Observable, ReplaySubject} from 'rxjs';
import {PLAYER_CATEGORY} from '../../../../core/models/user';
import {MemberEntry} from '../../../../core/api/models/member-entry';
import {UserMemberEntries} from '../../../../core/store/user/user.state';
import {TeamMatchesEntry} from '../../../../core/api/models/team-matches-entry';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {PlayerCategoryService} from '../../../../core/services/tabt/player-category.service';
import {ToastController} from '@ionic/angular';
import {map, share, shareReplay, switchMap, take} from 'rxjs/operators';
import {FavoritesState, ToggleMemberFromFavorites} from '../../../../core/store/favorites';
import {Store} from '@ngxs/store';
import {WeeklyElo} from '../../../../core/api/models/weekly-elo';
import {MembersService} from '../../../../core/api/services/members.service';

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
    isFavorite$: Observable<boolean>;
    weeklyElo$: Observable<WeeklyElo[]>;

    constructor(
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly playerCategoryService: PlayerCategoryService,
        private readonly membersService: MembersService,
        private readonly toastrCtrl: ToastController,
        private readonly store: Store
    ) {
    }

    ngOnInit() {
        this.memberUniqueIndex$ = this.activatedRoute.paramMap.pipe(
            map((params: ParamMap) => Number(params.get('id')))
        );

        this.isFavorite$ = this.memberUniqueIndex$.pipe(
            switchMap((id) => this.store.select(FavoritesState.isPlayerInFavorite(id)))
        );

        this.userMemberEntries$ = this.memberUniqueIndex$.pipe(
            switchMap((memberIndex) => this.playerCategoryService.getMemberPlayerCategories(memberIndex)),
            share()
        );
        this.categoriesAvailable$ = this.userMemberEntries$.pipe(
            map((memberEntries: UserMemberEntries) => PlayerCategoryService.getPlayedCategories(memberEntries))
        );

        this.weeklyElo$ = this.memberUniqueIndex$.pipe(
            switchMap((uniqueIndex) => this.membersService.findMemberEloHistory({uniqueIndex}))
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
            map(([category, userMemberEntries]) => userMemberEntries[category]),
            shareReplay(1)
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

    toggleFavorite() {
        this.currentMemberEntry$.pipe(
            take(1),
            switchMap((member: MemberEntry) => this.store.dispatch(new ToggleMemberFromFavorites(member)))
        ).subscribe();
    }
}
