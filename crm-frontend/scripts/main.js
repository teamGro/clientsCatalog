window.addEventListener("DOMContentLoaded", () => {
	let allClientsData;

	const addClientBtnContainer = document.querySelector(".clients__add-btn-wrapper");

	const clientsTableElement = document.querySelector("#clientsTable");

	const sortingElements = document.querySelectorAll("[data-sort]");

	document.querySelectorAll(".modal_loading").forEach((element) => {
		element.classList.remove("modal_loading");
	});

	let deleteModal = document.querySelector("#deleteModal");
	lib.deleteModal.element = deleteModal;
	const deleteInputIDElement = deleteModal.querySelector("#deleteClientID");
	const cancelDeleteBtn = deleteModal.querySelector(".modal__cancel");
	const closeModalDeleteBtn = deleteModal.querySelector(".modal__close");
	const deleteClientBtn = deleteModal.querySelector("#deleteClient");

	const loaderElement = document.querySelector(".load__wrapp");
	Promise.all([api.getClients(), new Promise(resolve => setTimeout(resolve, 1000))])
		.then((clients) => {
			clients = clients[0];
			view.showAddClientBtn(addClientBtnContainer);
			allClientsData = clients;
			view.renderClientsTable(clients, clientsTableElement);
			loaderElement.classList.remove("load__wrapp_active");
			clientsTableElement.classList.remove("clients__table_load");
		})
		.catch((err) => console.error(err));

	const errorsWrapperDeleteElement = deleteModal.querySelector(".modal__errors-wrapper");
	const errorsListDeleteElement = deleteModal.querySelector(".error__list");
	deleteClientBtn.addEventListener("click", async (e) => {
		e.preventDefault();
		try {
			let clientID = deleteInputIDElement.getAttribute('data-id');
			await api.deleteClient(clientID, { list: errorsListDeleteElement, wrapper: errorsWrapperDeleteElement });
			allClientsData = controller.deleteClient(clientID, allClientsData);
			modal.close(deleteModal);
			view.renderClientsTable(allClientsData, clientsTableElement);
		} catch (error) {
			console.error(error);
		}
	});

	cancelDeleteBtn.addEventListener("click", () => {
		modal.close(deleteModal);
	});

	closeModalDeleteBtn.addEventListener("click", () => {
		modal.close(deleteModal);
	});

	sortingElements.forEach((element) => {
		element.addEventListener("click", (e) => {
			allClientsData = view.sortingHandler(allClientsData, element);
			view.renderClientsTable(allClientsData, clientsTableElement);
		});
	});

	let createOrUpdateClientModal = document.querySelector("#createUpdateModal");
	lib.createUpdateModal.element = createOrUpdateClientModal;
	const addClientBtn = document.querySelector("#addClient");
	addClientBtn.addEventListener("click", () => {
		modal.clearData(createOrUpdateClientModal);
		modal.open(createOrUpdateClientModal);
	});

	const updateIDElement = createOrUpdateClientModal.querySelector("#updateClientID");

	const errorsWrapperElement = createOrUpdateClientModal.querySelector(".modal__errors-wrapper");
	const errorsListElement = createOrUpdateClientModal.querySelector(".error__list");
	const saveClientBtn = createOrUpdateClientModal.querySelector("#saveClient");
	saveClientBtn.addEventListener("click", async function (e) {
		e.preventDefault();
		const formElement = this.closest(".clients__form");
		let clientData = {
			name: formElement.querySelector("#newClientName").value,
			surname: formElement.querySelector("#newClientSurname").value,
			lastName: formElement.querySelector("#newClientLastName").value,
			contacts: controller.addContacts(formElement, ".contact__type-item_top"),
		};
		let response;
		try {
			debugger;
			if (!updateIDElement.getAttribute("data-id")) {
				response = await api.createClient(clientData, { list: errorsListElement, wrapper: errorsWrapperElement });
				allClientsData.push(response);
			} else {
				let clientID = updateIDElement.getAttribute("data-id");
				response = await api.updateClient(clientID, clientData, { list: errorsListElement, wrapper: errorsWrapperElement });
				allClientsData = controller.updateClientData(allClientsData, response);
			}
			modal.close(createOrUpdateClientModal);
			view.renderClientsTable(allClientsData, clientsTableElement);
		} catch (error) {
			console.error(error);
		}
	});

	const closeCreateUpdateModalBtn = createOrUpdateClientModal.querySelector("#closeCreateUpdateModal");
	closeCreateUpdateModalBtn.addEventListener("click", () => {
		modal.close(createOrUpdateClientModal);
	});

	const cancelCreateUpdateModalBtn = createOrUpdateClientModal.querySelector(".modal__btn-cancel");
	cancelCreateUpdateModalBtn.addEventListener("click", () => {
		modal.close(createOrUpdateClientModal);
	});

	const addContactForNewClientBtn = document.querySelector("#addNewContact");
	const addContactElementWrapper = document.querySelector(".contact");

	let activeContact = {};
	addContactElementWrapper.addEventListener("click", (e) => {
		e.preventDefault();
		let target = e.target;

		//открыть список с доступными типами контактов
		if (target.classList.contains("contact__type-item_top")) {
			view.openContactsList(target.closest("ul"));
			activeContact = { type: target.getAttribute("data-contact-type"), text: target.textContent };
			console.log(activeContact);
			return;
		}

		if (target.closest(".contact__type-list_open") && target.classList.contains("contact__type-item") && !target.classList.contains("contact__type-item_top")) {
			console.log(activeContact);
			let inputField = target.closest(".contact__wrapper").querySelector(".contact__input");
			view.setContact({ text: target.textContent, attr: target.getAttribute("data-contact-type") }, target.closest(".contact__type-list_open"), inputField, activeContact);
		}

		console.log(target);
		if (target.getAttribute("id") === "addNewContact" || target.closest("#addNewContact")) {
			target = target.closest("#addNewContact");
			document.querySelector(".contact").classList.add("contact_active");
			let contactsQuantity = document.querySelectorAll(".contact__wrapper").length + 1;
			let isContactsQuantityMax = view.isContactsQuantityMax(target, contactsQuantity);
			if (isContactsQuantityMax) {
				if (!target.closest(".modal-wrapper").querySelector("#updateClientID").value) {
				} else {
				}
				view.renderNewContactElement(lib.contactsDefaultData, addContactElementWrapper, addContactForNewClientBtn, "Телефон");
			}
			if (document.querySelectorAll(".contact__wrapper").length > 1) {
				for (let i = 0; i < document.querySelectorAll(".contact__wrapper").length - 1; i++) {
					let wrapper = document.querySelectorAll(".contact__wrapper")[i];
					wrapper.querySelector(".contact__remove-btn").classList.add("contact__remove-btn_active");
				}
			}
			return;
		}

		if (target.closest(".contact__remove-btn")) {
			target = target.closest(".contact__remove-btn");
			view.removeContact(target, ".contact__wrapper");
			document.querySelector(".tooltip_active").classList.remove("tooltip_active");
			view.isContactsQuantityMax(target);

			if (document.querySelectorAll(".contact__wrapper").length === 0) {
				document.querySelector(".contact").classList.remove("contact_active");
			}
		}
	});

	let deleteContactBtns = document.querySelectorAll(".contact__remove-btn");
	deleteContactBtns.forEach((btn) => {
		btn.addEventListener("mouseenter", () => {
			let target = e.target;
			lib.showTooltip(target, tooltipElement);
		});
	});

	document.querySelectorAll(".modal__input").forEach((input) => {
		let self = input;
		let labelElement = self.parentElement.querySelector("label");
		input.addEventListener("focus", () => {
			labelElement.classList.add("modal__label_active");
		});

		input.addEventListener("blur", () => {
			if (self.value.trim() === "") {
				labelElement.classList.remove("modal__label_active");
			}
		});
	});

	const searchInputElement = document.querySelector(".header__search");
	let timer = null;
	searchInputElement.addEventListener("input", function () {
		let value = this.value;
		clearTimeout(timer);

		timer = setTimeout(async () => {
			loaderElement.classList.add("load__wrapp_active");
			Promise.all([api.searchClients(value), new Promise(resolve => setTimeout(resolve, 500))]).
			then(response => {
				let searchResult = response[0] ;
				view.renderClientsTable(searchResult, clientsTableElement);
				loaderElement.classList.remove("load__wrapp_active");
			});			
		}, 300);
	});

	window.addEventListener('hashchange', async () => {
		console.log(location.hash);
		if (location.hash.length) {
			await lib.showModalByID(lib.createUpdateModal.element, location.hash.slice(1));
		}
	})
});
