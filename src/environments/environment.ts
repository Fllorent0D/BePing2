// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {firebaseConfig} from './firebase.config';

export const environment = {
    production: false,
    hmr: false,
    tabtUrl: 'https://api.beping.be',
    bepingUrl: 'https://beping.be',
    internalPages: {
        basePath: '/static/',
        registerRedirect: 'redirect-register.html'
    },
    bepingStatus: 'http://status.beping.be',
    tt_manager: 'https://tt-manager.be/',
    dataAfftUrl: 'http://localhost:4200',
    tabtLinks: {
        aftt: {
            domain: 'resultats.aftt.be',
            tournamentRegisterPath: '/tournoi/inscription',
            register: 'enregistrement'
        },
        vttl: {
            domain: 'competitie.vttl.be',
            tournamentRegisterPath: '/tornooi/inschrijving',
            register: 'registratie',
            resetPassword: 'https://auth.vttl.be/mail.pl'
        }
    },
    rotatioUrl: 'https://www.rotatio.be',
    firebaseConfig,
    productIds: {
        bepingPro: 'bepingproversion'
    },
    bepingContactEmail: 'contact@beping.be'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
