// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    tabtUrl: 'http://localhost:3004',
    internalPages: {
        register: 'redirect-register.html'
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
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
