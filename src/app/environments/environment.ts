import Swal from "sweetalert2";

export const environment = {
	firebase:
	{
		projectId: "la-clinica-111655",
		appId: "1:139443659844:web:56ea20cc0268b7afb54811",
		storageBucket: "la-clinica-111655.appspot.com",
		apiKey: "AIzaSyDhjoZlOyHYyEZqXKF8Txb2QdcBAx6eCJQ",
		authDomain: "la-clinica-111655.firebaseapp.com",
		messagingSenderId: "139443659844",
	}
}

export const Loader = Swal.mixin({
	allowEscapeKey: false,
	allowOutsideClick: false,
	didOpen: () => {
		Swal.showLoading();
	}
});