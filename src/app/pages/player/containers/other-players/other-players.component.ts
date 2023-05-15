import {Component, OnInit} from '@angular/core';
import {combineLatest, from, Observable, of, ReplaySubject} from 'rxjs';
import {PLAYER_CATEGORY} from '../../../../core/models/user';
import {MemberEntry} from '../../../../core/api/models/member-entry';
import {UserMemberEntries} from '../../../../core/store/user/user.state';
import {TeamMatchesEntry} from '../../../../core/api/models/team-matches-entry';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {PlayerCategoryService} from '../../../../core/services/tabt/player-category.service';
import {map, share, shareReplay, switchMap, take} from 'rxjs/operators';
import {FavoritesState, ToggleMemberFromFavorites} from '../../../../core/store/favorites';
import {Store} from '@ngxs/store';
import {MembersService} from '../../../../core/api/services/members.service';
import {DialogService} from '../../../../core/services/dialog-service.service';
import {SettingsState} from '../../../../core/store/settings';
import {TABT_DATABASES} from '../../../../core/interceptors/tabt-database-interceptor.service';
import {ActionSheetController, IonRouterOutlet} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {TabsNavigationService} from '../../../../core/services/navigation/tabs-navigation.service';
import {Location} from '@angular/common';
import {ModalBaseComponent} from '../../../modals/modal-base/modal-base.component';
import {
    IndividualMatchPointsEditorComponent
} from '../../../points-calculator/containers/individual-match-points-editor/individual-match-points-editor.component';
import {AnalyticsService} from '../../../../core/services/firebase/analytics.service';
import {Face2FaceService} from '../../../../core/services/face2face/face-2-face.service';
import {ShareService} from '../../../../core/services/share.service';
import {RemoteSettingsState} from '../../../../core/store/remote-settings';
import {WeeklyNumericRankingV3} from '../../../../core/api/models/weekly-numeric-ranking-v-3';
import {DataAfttService} from '../../../../core/services/data-aftt/data-aftt.service';

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
    numericRankings$: Observable<WeeklyNumericRankingV3>;
    displayELO$: Observable<boolean>;
    displayNumericRanking$: Observable<boolean>;
    database$: Observable<TABT_DATABASES>;

    constructor(
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly playerCategoryService: PlayerCategoryService,
        private readonly membersService: MembersService,
        private readonly dialogService: DialogService,
        private readonly store: Store,
        private readonly actionSheetController: ActionSheetController,
        private readonly translate: TranslateService,
        private readonly tabNavigator: TabsNavigationService,
        private readonly location: Location,
        private readonly ionRouterOutlet: IonRouterOutlet,
        private readonly analyticsService: AnalyticsService,
        private readonly face2FaceService: Face2FaceService,
        private readonly shareService: ShareService,
        private readonly afttDataService: DataAfttService
    ) {
    }

    ngOnInit() {
        this.displayELO$ = this.store.select(SettingsState.displayELO);
        this.displayNumericRanking$ = this.store.select(SettingsState.displayNumericRanking);
        this.database$ = this.store.select(SettingsState.getCurrentDatabase);

        const {preferredPlayerCategory} = this.location.getState() as { preferredPlayerCategory?: PLAYER_CATEGORY };

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
            map((memEntries: UserMemberEntries) => PlayerCategoryService.getMainCategory(memEntries, preferredPlayerCategory))
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
            switchMap(([category, memberEntry]) => {
                if ([PLAYER_CATEGORY.MEN, PLAYER_CATEGORY.WOMEN].includes(category)) {
                    return from(this.afttDataService.getAFTTDataPage(memberEntry.UniqueIndex, category as PLAYER_CATEGORY.MEN | PLAYER_CATEGORY.WOMEN));
                }
                return of(null);
            }),
            shareReplay(1)
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
            switchMap((member: MemberEntry) => this.store.dispatch(new ToggleMemberFromFavorites({
                uniqueIndex: member.UniqueIndex,
                uri: ['player', member.UniqueIndex.toString(10)],
                label: `${member.FirstName} ${member.LastName}`,
                note: member.Ranking
            })))
        ).subscribe();
    }

    openMenu() {
        combineLatest([
            this.currentMemberEntry$,
            this.currentCategory$
        ]).pipe(
            take(1)
        ).subscribe(async ([member, category]) => {
            const isProEnabled = this.store.selectSnapshot(RemoteSettingsState.bepingProEnabled);
            const buttons = [
                {
                    text: this.translate.instant('TEAM_STAT.INFO_ABOUT_CLUB', {club: member?.Club}),
                    handler: () => {
                        this.analyticsService.logEvent('open_club_info_from_member');
                        this.tabNavigator.navigateTo(['clubs', member?.Club]);
                    }
                },
                {
                    text: this.translate.instant('CALCULATOR.ADD_RESULT_TO_CALC'),
                    handler: async () => {
                        this.analyticsService.logEvent('calculator_add_result_from_member_page');

                        const modal = await this.dialogService.showModal({
                            component: ModalBaseComponent,
                            canDismiss: true,
                            presentingElement: this.ionRouterOutlet.nativeEl,
                            componentProps: {
                                rootPage: IndividualMatchPointsEditorComponent,
                                pageParams: {
                                    memberEntryPrefill: {...member, Category: category}
                                }
                            }
                        });
                        const result = await modal.onWillDismiss<{ added: boolean }>();
                        if (result?.data?.added) {
                            await this.dialogService.showToast({
                                message: this.translate.instant('CALCULATOR.RESULT_ADDED'),
                                duration: 3000,
                                buttons: [
                                    {
                                        text: this.translate.instant('CALCULATOR.OPEN_CALC'),
                                        handler: () => {
                                            this.tabNavigator.navigateTo(['points-calculator']);
                                        }
                                    }
                                ]
                            });
                        }

                    }
                },
                {
                    text: this.translate.instant('COMMON.CANCEL'),
                    icon: 'close',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ];
            if (isProEnabled) {
                buttons.splice(1, 0, {
                    text: this.translate.instant('HEAD_2_HEAD.TITLE'),
                    handler: () => {
                        this.goToFace2Face();
                    }
                });
            }
            const actionSheet = await this.actionSheetController.create({
                buttons
            });

            await actionSheet.present();

            const {role} = await actionSheet.onDidDismiss();
            console.log('onDidDismiss resolved with role', role);
        });


    }

    goToFace2Face() {
        this.memberUniqueIndex$.pipe(take(1)).subscribe((id) => {
            this.face2FaceService.checkIsProAndGoToFace2Face(id, this.ionRouterOutlet.nativeEl);
        });
    }

    share() {
        this.currentMemberEntry$.pipe(
            take(1),
            switchMap((member) =>
                this.shareService.shareUrl(
                    '/player/' + member.UniqueIndex,
                    member.FirstName + ' ' + member.LastName,
                    this.translate.instant('SHARE.SHARE_PLAYER_ON_BEPING', {player: member.FirstName + ' ' + member.LastName})
                ))
        ).subscribe();
    }
}
