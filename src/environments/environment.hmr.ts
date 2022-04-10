import {firebaseConfig} from './firebase.config';

export const environment = {
    production: false,
    hmr: true,
    tabtUrl: 'http://192.168.0.108:3004',
    internalPages: {
        basePath: '/static/',
        registerRedirect: 'redirect-register.html'
    },
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
    firebaseConfig
};
