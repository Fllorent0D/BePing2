import {Component, OnInit, Optional} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Select, Store} from '@ngxs/store';
import {Login} from '../../../core/store/user/aftt.actions';
import {finalize, take} from 'rxjs/operators';
import {IonNav, ModalController} from '@ionic/angular';
import {KeyboardService} from '../../../core/services/keyboard/keyboard.service';
import {InAppBrowserService} from '../../../core/services/browser/in-app-browser.service';
import {LANG} from '../../../core/models/langs';
import {SettingsState} from '../../../core/store/settings';
import {Observable} from 'rxjs';
import {UserState, UserStateModel} from '../../../core/store/user/user.state';
import {InternalIdentifiersService} from '../../../core/api/services/internal-identifiers.service';
import {AnalyticsService} from '../../../core/services/firebase/analytics.service';
import {DialogService} from '../../../core/services/dialog-service.service';

interface AfttLoginFormGroup {
    username: FormControl<string>;
    password: FormControl<string>;
}

@Component({
    selector: 'beping-aftt-login',
    templateUrl: './aftt-login-page.component.html',
    styleUrls: ['./aftt-login-page.component.scss']
})
export class AfttLoginPage implements OnInit {

    loginForm: FormGroup<AfttLoginFormGroup>;
    loading = false;

    @Select(SettingsState.getCurrentLang) lang$: Observable<LANG>;
    @Select(UserState) userState$: Observable<UserStateModel>;

    constructor(
        private readonly store: Store,
        private readonly dialogService: DialogService,
        @Optional() public readonly ionNav: IonNav,
        @Optional() public readonly modalCtrl: ModalController,
        private readonly keyboardService: KeyboardService,
        private readonly internalIdService: InternalIdentifiersService,
        private readonly browser: InAppBrowserService,
        private readonly analyticsService: AnalyticsService
    ) {
    }

    async ngOnInit() {
        this.loginForm = new FormGroup<AfttLoginFormGroup>({
            username: new FormControl<string>('', [Validators.required]),
            password: new FormControl<string>('', [Validators.required])
        });
    }

    login() {
        this.keyboardService.hideKeyboard();
        const action = new Login(this.loginForm.controls.username.value, this.loginForm.controls.password.value);
        this.loading = true;
        this.store.dispatch(action).pipe(
            take(1),
            finalize(() => this.loading = false)
        ).subscribe({
            next: () => {
                if (this.modalCtrl) {
                    this.modalCtrl.dismiss({logged: true});
                } else {
                    this.dialogService.showToast({
                        message: 'Connecté avec l\'AFTT',
                        position: 'bottom',
                        color: 'success',
                        duration: 2000
                    });
                    this.ionNav.pop();
                }
            },
            error: () => {
                this.dialogService.showToast({
                    message: 'Login invalide',
                    position: 'bottom',
                    color: 'danger',
                    duration: 2000
                });
            }
        });
    }

    forgot() {
        this.browser.openForgotPwd();
    }

    closeModal() {
        this.modalCtrl.dismiss({logged: false});
    }

    register() {
        this.analyticsService.logEvent('register');
        const user: UserStateModel = this.store.selectSnapshot(UserState);

        if (user.memberUniqueIndex) {
            this.browser.openRegister(user.memberUniqueIndex, user.club.UniqueIndex);
        } else {
            this.browser.openRegister();
        }
    }
}
