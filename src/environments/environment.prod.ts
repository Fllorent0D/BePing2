export const environment = {
  production: false,
  tabtUrl: 'http://192.168.0.108:3004',
  internalPages: {
    basePath: '/static/',
    registerRedirect: 'redirect-register.html'
  },
  tabtLinks: {
    aftt: {
      domain: 'resultats.aftt.be',
      tournamentRegisterPath: '/tournoi/inscription'
    },
    vttl: {
      domain: 'competitie.vttl.be',
      tournamentRegisterPath: '/tornooi/inschrijving'
    }
  },
  firebaseConfig: {
    apiKey: 'putakeyhere',
    authDomain: 'beping-196714.firebaseapp.com',
    databaseURL: 'https://beping-196714.firebaseio.com',
    projectId: 'beping-196714',
    storageBucket: 'beping-196714.appspot.com',
    messagingSenderId: '169133988850',
    appId: '1:169133988850:web:f83e033f93de42ceb6696b',
    measurementId: 'G-NLCDC9F2GF'
  }};
