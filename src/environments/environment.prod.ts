import {firebaseConfig} from './firebase.config';

export const environment = {
    production: true,
    hmr: false,
    tabtUrl: 'https://tabt-rest.floca.be',
    internalPages: {
        basePath: '/static/',
        registerRedirect: 'redirect-register.html'
    },
    bepingStatus: 'http://status.beping.be',
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
    }
};
