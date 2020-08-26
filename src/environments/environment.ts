// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	apiURL: '/api/v1/',
	apiMoviesDB: 'https://api.themoviedb.org/3',
	keyMoviesDB: '', // Agregar API
	imagesMoviesDB: 'https://image.tmdb.org/t/p/',
	carruselPath: 'https://autocine_laravel.test/uploads/carrusel/', // Ajustar a URL de API Laravel
	locationsPath: 'https://autocine_laravel.test/uploads/locations/', // Ajustar a URL de API Laravel
	productPath: 'https://autocine_laravel.test/uploads/products/', // Ajustar a URL de API Laravel
	moviesPath: 'https://autocine_laravel.test/uploads/movies/', // Ajustar a URL de API Laravel
	firebaseConfig: {
		// Agregar datos del json generado por Firebase
		apiKey: '',
		authDomain: '',
		databaseURL: '',
		projectId: '',
		storageBucket: '',
		messagingSenderId: '',
		appId: ''
	}
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
