import { ListHeader } from "../component/listHeader";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: null,
			message: null,
			currentUser: [],
			currentList: [],
			currentGift: [],
			currentAvailable: [],
			currentPurchased: [],
			guestImages: [],
			profileImages: [],
		},
		actions: {
			// Use getActions to call a function within a fuction

			getProfilePhoto: async () => {
				try {
					const response = await fetch(`https://api.pexels.com/v1/search?query=animal&per_page=3&locale=es-ES`, {
						method: "GET",
						headers: {
							"Authorization": `${process.env.API_PEXELS_TOKEN}`
						},
					});

					if (response.ok) {
						const store = getStore();
						const responseData = await response.json();
						const photoUrls = responseData.photos.map(photo => photo.src.original);
						store.profileImages = photoUrls;
						return photoUrls;
					} else {
						console.error("Error al buscar la foto:", response.status, response.statusText);
						return null;
					}
				} catch (error) {
					console.error("Error en el fetch de la foto:", error);
					return null;
				}
			},

			getGuestPhoto: async () => {
				try {
					const response = await fetch(`https://api.pexels.com/v1/search?query=surprise&per_page=3&locale=es-ES`, {
						method: "GET",
						headers: {
							"Authorization": `${process.env.API_PEXELS_TOKEN}`
						},
					});

					if (response.ok) {
						const store = getStore();
						const responseData = await response.json();
						const photoUrls = responseData.photos.map(photo => photo.src.original);
						// Almacena las URLs de las fotos en el store
						store.guestImages = photoUrls;
						return photoUrls;
					} else {
						console.error("Error al buscar la foto:", response.status, response.statusText);
						return null;
					}
				} catch (error) {
					console.error("Error en el fetch de la foto:", error);
					return null;
				}
			},

			transformLink: async (link) => {
				try {
					const response = await fetch(`https://api-ssl.bitly.com/v4/shorten`, {
						method: "POST",
						body: JSON.stringify({
							group_guid: "",
							domain: "bit.ly",
							long_url: link,
						}),
						headers: {
							"Authorization": 'Bearer ' + "81eae330cbee80e40eb3d71bb98413b00b415d96",
							'Content-Type': 'application/json'
						},
					});

					if (response.ok) {
						const responseData = await response.json();
						const newLink = responseData.link;
						return newLink;
					} else {
						console.error("Error al acortar el link:", response.status, response.statusText);
						return undefined;
					}
				} catch (error) {
					console.error("Error en el fetch del link:", error);
					return undefined;
				}
			},
			// ACTIONS TOKEN

			syncToken: () => {
				const token = sessionStorage.getItem("token");
				console.log("session loading getting token")
				if (token && token != "" && token != undefined && token != null) setStore({ token: token })
			},

			// ACTIONS MENSAJES
			getMessage: async () => {
				const store = getStore();
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/hello`, {
						headers: {
							'Authorization': 'Bearer ' + store.token
						}
					});
					const data = await resp.json()
					setStore({ message: data.message })
					return data;
				} catch (error) {
					console.error("Error loading message from backend", error)
				}
			},

			// ACTIONS USER
			register: async (email, password, randomProfileImage) => {
				try {
					const res = await fetch(`${process.env.BACKEND_URL}/api/user`, {
						method: 'POST',
						body: JSON.stringify({
							name: "",
							email: email,
							password: password,
							img: randomProfileImage,
						}),
						headers: {
							'Content-Type': 'application/json'
						}
					});

					if (res.status === 200) {
						// alert("Registration complete! Welcome aboard!");
						return true;
					} else if (res.status === 401) {
						const errorData = await res.json();
						alert(errorData.msg)
						return false
					};
				} catch (error) {
					console.error("There has been an error:", error);
					return false;
				}
			},

			recoveryToken: async (email) => {
				try {
					const res = await fetch(`${process.env.BACKEND_URL}/api/recoverytoken`, {
						method: 'POST',
						body: JSON.stringify({
							email: email,
						}),
						headers: {
							'Content-Type': 'application/json'
						}
					});

					if (res.status === 200) {
						const data = await res.json();
						return data.access_token;
					} else if (res.status === 401) {
						const errorData = await res.json();
						alert(errorData.msg);
						return false;
					}
				} catch (error) {
					console.error("There has been an error:", error);
					return false;
				}
			},

			recoveryUser: async (token) => {
				const store = getStore();
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/user`, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': "Bearer " + token
						}
					});
					const data = await resp.json()
					return data;

				} catch (error) {
					console.error("Error loading message from backend", error)
				}
			},

			recoveryAccessUser: async (uid, token) => {
				const store = getStore();
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/reset-password/${uid}`, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': "Bearer " + token
						}
					});
					const data = await resp.json()
					return data;
					// TODO: MANEJO DE ERRORES EXPIRES
				} catch (error) {
					console.error("Error loading message from backend", error)
				}
			},

			login: async (email, password) => {
				try {
					const res = await fetch(`${process.env.BACKEND_URL}/api/token`, {
						method: 'POST',
						body: JSON.stringify({
							email: email,
							password: password
						}),
						headers: {
							'Content-Type': 'application/json'
						}
					});

					if (res.status === 200) {
						const data = await res.json();
						sessionStorage.setItem("token", data.access_token);
						setStore({ token: data.access_token });
						return true;
					} else if (res.status === 401) {
						const errorData = await res.json();
						alert(errorData.msg);
						return false;
					}
				} catch (error) {
					console.error("There has been an error:", error);
					return false;
				}
			},

			getUser: async () => {
				const store = getStore();
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/user`, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${sessionStorage.getItem('token')}`
						}
					});
					const data = await resp.json()
					return data;

				} catch (error) {
					console.error("Error loading message from backend", error)
				}
			},



			getUserToStore: async () => {
				const store = getStore();
				const actions = getActions();
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/user`, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${sessionStorage.getItem('token')}`
						}
					});

					const data = await resp.json();
					if (!data || typeof data.id === 'undefined') {
						throw new Error('Invalid response format: missing user ID');
					}
					actions.getAllList(data.id);
					setStore({
						...store,
						currentUser: {
							id: data.id,
							name: data.name,
							email: data.email,
							img: data.img,
							message: data.message
						}
					});
					return data;

				} catch (error) {
					console.error("Error loading message from backend", error)
				}
			},

			getPublicUserToStore: async (uid) => {
				const store = getStore();
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/guest/${uid}`, {
						headers: {
							'Content-Type': 'application/json',
						}
					});

					const data = await resp.json();
					if (!data || typeof data.id === 'undefined') {
						throw new Error('Invalid response format: missing user ID');
					}
					setStore({
						...store,
						currentUser: {
							id: data.id,
							name: data.name,
							email: data.email,
							img: data.img,
							message: data.message
						}
					});

					return data;

				} catch (error) {
					console.error("Error loading message from backend", error)
				}
			},

			logout: () => {
				sessionStorage.removeItem("token");
				console.log("session ends");
				setStore({
					token: null,
					currentList: [],
					currentUser: [],
					currentGift: [],
					currentAvailable: [],
					currentPurchased: [],
				});
			},

			cleanStore: () => {
				sessionStorage.removeItem("token");
				console.log("store cleaned");
				setStore({
					token: null,
					currentList: [],
					currentUser: [],
					currentGift: [],
					currentAvailable: [],
					currentPurchased: [],
				});
			},

			deleteUser: async (uid) => {
				try {
					const token = sessionStorage.getItem('token');
					const response = await fetch(`${process.env.BACKEND_URL}/api/user/${uid}`, {
						method: 'DELETE',
						headers: {
							'Authorization': `Bearer ${token}`,
							'Content-Type': 'application/json'
						}
					});

					if (response.ok) {
						console.log('User deleted');
						return true;
					} else {
						throw new Error('Failed to delete user');
					}
				} catch (error) {
					console.error('Error deleting user:', error);
					return false;
				}
			},

			updateUser: async (name, email, password) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/user`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${sessionStorage.getItem('token')}`
						},
						body: JSON.stringify({
							name: name,
							email: email,
							password: password,
						}),
					});

					if (response.ok) {
						console.log('Update SUCCESS')
						return true;
					} else {
						throw new Error('Failed to update profile');
					}
				} catch (error) {
					console.error('Error updating profile:', error);
					return false;
				}
			},

			updatePassword: async (newPassword, token) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/new-password`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': "Bearer " + token
						},
						body: JSON.stringify({
							newPassword: newPassword,
						}),
					});

					if (response.status === 200) {
						console.log("Password updated")
						return true;
					} else if (response.status === 401) {
						const errorData = await res.json();
						alert(errorData.msg)
						return false
					};
				} catch (error) {
					console.error('Error updating password:', error);
					return false;
				}
			},


			// ACTIONS EXAMPLE
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				// exampleFunction: () => {
				// 	getActions().changeColor(0, "green");
				// },	

				//reset the global store
				setStore({ demo: demo });
			},

			// ACTIONS LIST
			newList: async (id) => {
				try {
					const res = await fetch(`${process.env.BACKEND_URL}/api/list`, {
						method: 'POST',
						body: JSON.stringify({
							name: "Default List",
							id: id,
						}),
						headers: {
							'Content-Type': 'application/json'
						}
					});
					if (res.status === 200) {
						return true;
					} else if (res.status === 401) {
						const errorData = await res.json();
						alert(errorData.msg)
						return false
					};
				} catch (error) {
					console.error("There has been an error:", error);
					return false;
				}
			},

			getAllList: async (id) => {
				const store = getStore();
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/user/${id}/giftlist`, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${sessionStorage.getItem('token')}`
						}
					});
					const data = await resp.json()
					// Mapear cada objeto de data y agregarlo a currentList
					const updatedList = data.map(item => ({
						id: item.id,
						user_id: item.user_id,
						name: item.name,
					}));

					// Combinar la lista actual con la nueva lista mapeada
					const mergedList = [...updatedList];

					// Actualizar el store con la nueva lista combinada
					setStore({
						...store,
						currentList: mergedList
					});

					return data;

				} catch (error) {
					console.error("Error loading message from backend", error)
				}
			},
			getPublicAllList: async (uid, lid) => {
				const store = getStore();
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/guest/${uid}/giftlist/${lid}`, {
						headers: {
							'Content-Type': 'application/json',
						}
					});
					const data = await resp.json()

					const updatedList = data.map(item => ({
						id: item.id,
						user_id: item.user_id,
						name: item.name,
					}));

					// Combinar la lista actual con la nueva lista mapeada
					const mergedList = [...updatedList];

					// Actualizar el store con la nueva lista combinada
					setStore({
						...store,
						currentList: mergedList
					});

					return data;

				} catch (error) {
					console.error("Error loading message from backend", error)
				}
			},

			// ACTIONS GIFT
			newFirstGift: async (uid, lid) => {
				try {
					const res = await fetch(`${process.env.BACKEND_URL}/api/gifts`, {
						method: 'POST',
						body: JSON.stringify({
							title: "Default gift",
							link: "https://www.defaultLink.com/",
							status: "Available",
							img: "https://images.pexels.com/photos/1573324/pexels-photo-1573324.jpeg",
							list_id: lid,
							user_id: uid
						}),
						headers: {
							'Content-Type': 'application/json'
						}
					});
					if (res.status === 200) {
						console.log("Regalo creado")
						return true;
					} else if (res.status === 401) {
						const errorData = await res.json();
						alert(errorData.msg)
						return false
					};
				} catch (error) {
					console.error("There has been an error:", error);
					return false;
				}
			},
			saveGift: async (updatedFormData, isEditing, uid, lid, gid) => {
				try {
					const url = isEditing ? `${process.env.BACKEND_URL}/api/guest/${uid}/giftlist/${lid}/gifts/${gid}` : `${process.env.BACKEND_URL}/api/gifts`;
					const method = isEditing ? "PUT" : "POST";

					const res = await fetch(url, {
						method: method,
						body: JSON.stringify({
							title: updatedFormData.title,
							link: updatedFormData.link,
							status: updatedFormData.status,
							img: "",
							list_id: lid,
							user_id: updatedFormData.user_id
						}),
						headers: {
							'Content-Type': 'application/json'
						}
					});
					if (res.status === 200) {
						const responseData = await res.json();
						// console.log(responseData.response);
						return true;
					} else if (res.status === 401) {
						const errorData = await res.json();
						alert(errorData.msg)
						return false
					};
				} catch (error) {
					console.error("There has been an error:", error);
					return false;
				}
			},
			// TODO: EJEMPLO PARA USAR POST Y PUT EN MISMA FUNCION
			// saveContact: (formData, isEditing, id) => {
			// 	const url = isEditing ? `https://playground.4geeks.com/apis/fake/contact/${id}` : "https://playground.4geeks.com/apis/fake/contact/";

			// 	const method = isEditing ? "PUT" : "POST";

			// 	fetch(url, {
			// 		method: method,
			// 		headers: {
			// 			"Content-Type": "application/json"
			// 		},
			// 		body: JSON.stringify({
			// 			full_name: formData.fullName,
			// 			email: formData.email,
			// 			agenda_slug: "limberg",
			// 			address: formData.address,
			// 			phone: formData.phone
			// 		})
			// 	})
			// 		.then(res => res.json())
			// 		.then(data => {
			// 			alert(method === "POST" ? "Contact created successfully" : "Contact saved successfully");
			// 		})
			// 		.catch(error => {
			// 			console.error("Error al guardar el contacto:", error);
			// 		});
			// },
			getGiftToStore: async (uid, lid) => {
				const store = getStore();
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/user/${uid}/giftlist/${lid}/gifts`, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${sessionStorage.getItem('token')}`
						}
					});
					const data = await resp.json()

					const updatedGiftList = Array.isArray(data) && data.length > 0 ?
						data.map(item => ({
							id: item.id,
							title: item.title,
							link: item.link,
							status: item.status,
							list_id: item.list_id,
							img: item.img,
						})) : [];


					const mergedGiftList = [...updatedGiftList];


					setStore({
						...store,
						currentGift: mergedGiftList
					});
					// console.log("Regalos agregados al store", store.currentGift);
					return data;

				} catch (error) {
					console.error("Error loading message from backend", error)
				}
			},
			getGiftToStoreAvailable: async (uid, lid) => {
				const store = getStore();
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/user/${uid}/giftlist/${lid}/gifts/available`, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${sessionStorage.getItem('token')}`
						}
					});
					const data = await resp.json()
					// console.log("regalos available conseguido", data)

					const updatedGiftAvailableList = Array.isArray(data) && data.length > 0 ?
						data.map(item => ({
							id: item.id,
							title: item.title,
							link: item.link,
							status: item.status,
							list_id: item.list_id,
							img: item.img,
						})) : [];


					// Combinar la lista actual con la nueva lista mapeada
					const mergedGiftAvailableList = [...updatedGiftAvailableList];

					// Actualizar el store con la nueva lista combinada
					setStore({
						...store,
						currentAvailable: mergedGiftAvailableList
					});
					// console.log("Regalos available agregados al store ", store.currentAvailable);
					return data;

				} catch (error) {
					console.error("Error loading message from backend", error)
				}
			},
			getGiftToStorePurchased: async (uid, lid) => {
				const store = getStore();
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/user/${uid}/giftlist/${lid}/gifts/purchased`, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${sessionStorage.getItem('token')}`
						}
					});
					const data = await resp.json();
					// console.log("regalos purchased conseguido", data);

					// Verificar si data es un array y tiene al menos un elemento
					const updatedGiftPurchasedList = Array.isArray(data) && data.length > 0 ?
						data.map(item => ({
							id: item.id,
							title: item.title,
							link: item.link,
							status: item.status,
							list_id: item.list_id,
							img: item.img,
						})) : [];

					// Combinar la lista actual con la nueva lista mapeada
					const mergedGiftPurchasedList = [...updatedGiftPurchasedList];

					// Actualizar el store con la nueva lista combinada
					setStore({
						...store,
						currentPurchased: mergedGiftPurchasedList
					});
					// console.log("Regalos purchased agregados al store ", store.currentPurchased);
					return data;
				} catch (error) {
					console.error("Error loading message from backend", error);
				}
			},

			getOneGift: async (uid, lid, gid) => {
				const store = getStore();
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/user/${uid}/giftlist/${lid}/gifts/${gid}`, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${sessionStorage.getItem('token')}`
						}
					});
					const data = await resp.json()
					// console.log("regalo encontrado", data)
					return data;

				} catch (error) {
					console.error("Error loading message from backend", error)
				}
			},

			getOneGiftPublic: async (uid, lid, gid) => {
				const store = getStore();
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/guest/${uid}/giftlist/${lid}/gifts/${gid}`, {
						headers: {
							'Content-Type': 'application/json',
						}
					});
					const data = await resp.json()
					// console.log("regalo público encontrado", data)
					return data;

				} catch (error) {
					console.error("Error loading message from backend", error)
				}
			},

			getPublicGiftToStore: async (uid, lid) => {
				// TODO: REVISAR CUANDO ESTE LA ENTRADA PUBLICA
				const store = getStore();
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/guest/${uid}/giftlist/${lid}/gifts`, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${sessionStorage.getItem('token')}`
						}
					});
					const data = await resp.json()
					// console.log("regalos conseguido", data)
					// Mapear cada objeto de data y agregarlo a currentList
					const updatedGiftList = Array.isArray(data) && data.length > 0 ?
						data.map(item => ({
							id: item.id,
							title: item.title,
							link: item.link,
							status: item.status,
							list_id: item.list_id,
							img: item.img,
						})) : [];

					// Combinar la lista actual con la nueva lista mapeada
					const mergedGiftList = [...updatedGiftList];

					// Actualizar el store con la nueva lista combinada
					setStore({
						...store,
						currentGift: mergedGiftList
					});
					// console.log("Regalos agregados al store", store.currentGift);
					return data;

				} catch (error) {
					console.error("Error loading message from backend", error)
				}
			},
			getPublicGiftToStoreAvailable: async (uid, lid) => {
				// TODO: REVISAR CUANDO ESTE LA ENTRADA PUBLICA
				const store = getStore();
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/guest/${uid}/giftlist/${lid}/gifts/available`, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${sessionStorage.getItem('token')}`
						}
					});
					const data = await resp.json()
					// console.log("regalos available conseguido", data)

					const updatedGiftAvailableList = Array.isArray(data) && data.length > 0 ?
						data.map(item => ({
							id: item.id,
							title: item.title,
							link: item.link,
							status: item.status,
							list_id: item.list_id,
							img: item.img,
						})) : [];

					// Combinar la lista actual con la nueva lista mapeada
					const mergedGiftAvailableList = [...updatedGiftAvailableList];

					// Actualizar el store con la nueva lista combinada
					setStore({
						...store,
						currentAvailable: mergedGiftAvailableList
					});
					// console.log("Regalos available agregados al store ", store.currentAvailable);
					return data;

				} catch (error) {
					console.error("Error loading message from backend", error)
				}
			},

			deleteGift: async (uid, lid, gid) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/user/${uid}/giftlist/${lid}/gifts/${gid}`, {
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${sessionStorage.getItem('token')}`

						}
					});

					if (response.status === 200) {
						const responseData = await response.json();
						alert(responseData.response);
						return true;
					} else if (response.status === 401) {
						const errorData = await response.json();
						alert(errorData.msg)
						return false
					};
				} catch (error) {
					console.error("There has been an error:", error);
					return false;
				}
			},

		}
	};
};

export default getState;