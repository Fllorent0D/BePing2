import {Component, OnInit} from '@angular/core';
import {combineLatest, Observable, ReplaySubject} from 'rxjs';
import {PLAYER_CATEGORY} from '../../../../core/models/user';
import {MemberEntry} from '../../../../core/api/models/member-entry';
import {UserMemberEntries} from '../../../../core/store/user/user.state';
import {TeamMatchesEntry} from '../../../../core/api/models/team-matches-entry';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {PlayerCategoryService} from '../../../../core/services/tabt/player-category.service';
import {map, share, shareReplay, switchMap, take} from 'rxjs/operators';
import {FavoritesState, ToggleMemberFromFavorites} from '../../../../core/store/favorites';
import {Select, Store} from '@ngxs/store';
import {MembersService} from '../../../../core/api/services/members.service';
import {DialogService} from '../../../../shared/services/dialog-service.service';
import {WeeklyNumericRanking} from '../../../../core/api/models/weekly-numeric-ranking';
import {SettingsState} from '../../../../core/store/settings';
import {TABT_DATABASES} from '../../../../core/interceptors/tabt-database-interceptor.service';
import {ActionSheetController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {TabsNavigationService} from '../../../../core/services/navigation/tabs-navigation.service';

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
    numericRankings$: Observable<WeeklyNumericRanking[]>;
    @Select(SettingsState.displayELO) displayELO$: Observable<boolean>;
    @Select(SettingsState.displayNumericRanking) displayNumericRanking$: Observable<boolean>;
    @Select(SettingsState.getCurrentDatabase) database$: Observable<TABT_DATABASES>;

    constructor(
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly playerCategoryService: PlayerCategoryService,
        private readonly membersService: MembersService,
        private readonly dialogService: DialogService,
        private readonly store: Store,
        private readonly actionSheetController: ActionSheetController,
        private readonly translate: TranslateService,
        private readonly tabNavigator: TabsNavigationService
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
        this.numericRankings$ = combineLatest([
            this.currentCategory$,
            this.currentMemberEntry$
        ]).pipe(
            switchMap(([category, memberEntry]) => this.membersService.findMemberNumericRankingsHistory({
                uniqueIndex: memberEntry.UniqueIndex,
                category
            }))
        );
    }

    async categoryClicked(category: PLAYER_CATEGORY) {
        this.currentCategory$.next(category);
        this.dialogService.showToast({
            message: `Profil ${category} chargé`,
            duration: 3000
        });
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

    openMenu() {
        this.currentMemberEntry$.pipe(
            take(1)
        ).subscribe(async (member) => {
            const actionSheet = await this.actionSheetController.create({
                buttons: [{
                    text: this.translate.instant('TEAM_STAT.INFO_ABOUT_CLUB', {club: member.Club}),
                    handler: () => {
                        this.tabNavigator.navigateTo(['clubs', member.Club]);
                    }
                }, {
                    text: this.translate.instant('COMMON.CANCEL'),
                    icon: 'close',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }]
            });
            await actionSheet.present();

            const {role} = await actionSheet.onDidDismiss();
            console.log('onDidDismiss resolved with role', role);
        });


    }
}
