import { ListHeader } from "../component/listHeader";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: null,
			message: null,
			currentUser: [],
			currentList: [],
			gift: [{
				id: "1",
				user_id: "1",
				title: "Example",
				link: "https://www.amazon.com/",
				status: "Disponible",
			}, {
				id: "2",
				user_id: "1",
				title: "Example",
				link: "https://www.amazon.com/",
				status: "Disponible",
			}, {
				id: "3",
				user_id: "1",
				title: "Example",
				link: "https://www.amazon.com/",
				status: "Disponible",
			}],
			images: [],
			profileImages: [],
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a fuction
			//ACTIONS REGALOS SOLO STORE
			getGift: () => {
				const store = getStore();
				return store.gift;
			},

			getGiftData: async (id) => {
				try {
					const store = getStore();
					const gift = store.gift.find(item => item.id === id);

					if (!gift) {
						console.error("El regalo no se encontró en la lista.");
						return null;
					}

					return gift;
				} catch (error) {
					console.error("Error en la búsqueda del regalo:", error);
					return null;
				}
			},

			saveGiftData: (formData, isEditing, gid) => {
				const store = getStore(); // Obtener el estado actual del store
				const gift = store.gift.slice(); // Copiar el array de regalos

				if (isEditing) {
					// Actualizar el regalo existente
					const updatedGiftIndex = gift.findIndex(g => g.id === gid);
					if (updatedGiftIndex !== -1) {
						gift[updatedGiftIndex] = { ...gift[updatedGiftIndex], ...formData };
						setStore({ ...store, gift });
						alert("¡Regalo actualizado correctamente!");
					} else {
						console.error("El regalo con el ID proporcionado no existe.");
					}
				} else {
					// Crear un nuevo regalo con un ID aleatorio
					const newId = Math.floor(Math.random() * 1000000); // Generar un número aleatorio
					const newGift = { id: newId.toString(), ...formData };
					setStore({ ...store, gift: [...gift, newGift] });
					alert("¡Regalo creado correctamente!");
				}
			},



			deleteGift: (id) => {
				const store = getStore();
				const updatedGifts = store.gift.filter(g => g.id !== id);

				setStore({ ...store, gift: updatedGifts });

				alert("¡Regalo eliminado correctamente!");
			},

			// fin de regalos
			// ACTIONS FOTOS
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
						// Almacena las URLs de las fotos en el store
						store.profileImages = photoUrls;
						console.log(store.profileImages)
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

			getGiftPhoto: async () => {
				try {
					const response = await fetch(`https://api.pexels.com/v1/search?query=caja&per_page=3&locale=es-ES`, {
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
						store.images = photoUrls;
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
					console.log(data.message)
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
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
						alert("Registro exitoso");
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
					const resp = await fetch(`${process.env.BACKEND_URL}/api/privateuser`, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${sessionStorage.getItem('token')}`
						}
					});
					const data = await resp.json()
					return data;

				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			getUserToStore: async () => {
				const store = getStore();
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/privateuser`, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${sessionStorage.getItem('token')}`
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
					console.log(store.currentUser);
					return data;

				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			logout: () => {
				sessionStorage.removeItem("token");
				console.log("session ends");
				setStore({
					token: null,
					currentList: [],
					currentUser: []
				});
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
			updateProfile: async (profileData) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/update-profile`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${sessionStorage.getItem('token')}`
						},
						body: JSON.stringify(profileData)
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
			// ACTIONS LIST
			newList: async (id) => {
				try {
					const res = await fetch(`${process.env.BACKEND_URL}/api/list`, {
						method: 'POST',
						body: JSON.stringify({
							name: "Lista general",
							id: id,
						}),
						headers: {
							'Content-Type': 'application/json'
						}
					});
					if (res.status === 200) {
						console.log("Lista creada")
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



			// POR REVISAR
			getAllList: async (id) => {
				console.log(id)
				const store = getStore();
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/list?id=${id}`, {
						headers: {
							'Content-Type': 'application/json',
						}
					});
					const data = await resp.json()
					console.log(data)
					// Mapear cada objeto de data y agregarlo a currentList
					const updatedList = data.map(item => ({
						id: item.id,
						user_id: item.user_id,
						name: item.name,
					}));

					// Combinar la lista actual con la nueva lista mapeada
					const mergedList = [...store.currentList, ...updatedList];

					// Actualizar el store con la nueva lista combinada
					setStore({
						...store,
						currentList: mergedList
					});
					console.log(store.currentList);
					return data;

				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
		}
	};
};

export default getState;