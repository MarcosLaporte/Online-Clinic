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

export const ToastSuccess = Swal.mixin({
	icon: 'success',
	background: '#a5dc86',
	toast: true,
	position: 'top-right',
	iconColor: 'white',
	showConfirmButton: false,
	timer: 1500,
});

export const ToastWarning = Swal.mixin({
	icon: 'warning',
	background: '#3fc3ee',
	toast: true,
	position: 'top-right',
	iconColor: 'white',
	showConfirmButton: false,
	timer: 1500,
});

export const ToastError = Swal.mixin({
	icon: 'error',
	background: '#f27474',
	toast: true,
	position: 'top-right',
	iconColor: 'white',
	showConfirmButton: false,
	timer: 1500,
});

export const Loader = Swal.mixin({
	allowEscapeKey: false,
	allowOutsideClick: false,
	didOpen: () => {
		Swal.showLoading();
	}
});

export interface StringIdValuePair {
	id: string;
	value: string;
}

export const InputSwal = Swal.mixin({
	input: "textarea",
	inputPlaceholder: "Type your message here...",
	inputAttributes: {
		"aria-label": "Type your message here"
	},
	showCancelButton: true,
	inputValidator: (value) => {
		if (!value) {
			return "You need to write something!";
		}
		return undefined;
	},
});