(() => {
	const controller = {};
	const nameOrderElement = document.querySelector(".clients__head-cell-order");

	controller.addContacts = (form, contactsElementClass) => {
		let contacts = [];
		form.querySelectorAll(contactsElementClass).forEach((contact) => {
			if (contact.getAttribute("data-contact-type")) {
				let value = contact.closest(".contact__wrapper").querySelector("input").value.trim();
				console.log(value);
				contacts.push({ type: contact.getAttribute("data-contact-type"), value: value });
			}
		});
		return contacts;
	};

	controller.sortItems = (data, direction) => {
		let result;
		return {
			byID: () => {
				console.log(data);
				if (direction === "asc") {
					result = data.sort((a, b) => {
						return a.id - b.id;
					});
				} else {
					result = data.sort((a, b) => {
						return b.id - a.id;
					});
				}
				console.log(result);
				return result;
			},
			byName: () => {
				if (direction === "asc") {
					nameOrderElement.textContent = "А-Я";
					result = data.sort((a, b) => {
						return `${a.surname} ${a.name} ${a.lastName}` > `${b.surname} ${b.name} ${b.lastName}` ? 1 : -1;
					});
				} else {
					nameOrderElement.textContent = "Я-А";
					result = data.sort((a, b) => {
						return `${a.surname} ${a.name} ${a.lastName}` < `${b.surname} ${b.name} ${b.lastName}` ? 1 : -1;
					});
				}
				return result;
			},
			byCreated: () => {
				if (direction === "asc") {
					result = data.sort((a, b) => {
						return new Date(a.createdAt) - new Date(b.createdAt);
					});
				} else {
					result = data.sort((a, b) => {
						return new Date(b.createdAt) - new Date(a.createdAt);
					});
				}
				return result;
			},
			byUpdated: () => {
				if (direction === "asc") {
					result = data.sort((a, b) => {
						return new Date(a.updatedAt) - new Date(b.updatedAt);
					});
				} else {
					result = data.sort((a, b) => {
						return new Date(b.updatedAt) - new Date(a.updatedAt);
					});
				}
				return result;
			},
		};
	};

	controller.updateClientData = (clientsData, updatedData) => {
		let clientID = updatedData.id;
		clientsData.forEach((item) => {
			if (item.id === clientID) {
				Object.assign(item, updatedData);
			}
		});

		return clientsData;
	};

	controller.deleteClient = (itemId, clients) => {
		const itemIndex = clients.findIndex(({ id }) => id === itemId);
		clients.splice(itemIndex, 1);
		return clients;
	};

	controller.errorHandler = (errors) => {
		let resultStr = ``;
		errors.forEach((error) => {
			resultStr += error.message + "; ";
		});
		return resultStr || "Что-то пошло не так...";
	};

	window.controller = controller;
})();
