(() => {
	const lib = {};

	const url = "http://localhost:3000/api/clients";
	const addContactForNewClientBtn = document.querySelector("#addNewContact");

	const addContactElementWrapper = document.querySelector(".contact");

	lib.dateOptions = {
		year: "numeric",
		month: "numeric",
		day: "numeric",
		timezone: "UTC",
		hour: "numeric",
		minute: "numeric",
	};

	lib.parseDate = (dateStr) => {
		let date = new Date(dateStr);
		date = date.toLocaleString("ru", lib.dateOptions).split(",");
		return {
			firstDatePart: date[0],
			secondDatePart: date[1],
		};
	};

	lib.contactsDefaultData = [
		{ type: "Телефон", name: "Телефон" },
		{ type: "Email", name: "Email" },
		{ type: "Facebook", name: "Facebook" },
		{ type: "vk", name: "VK" },
		{ type: "other", name: "Другое" },
	];

	lib.findContactsData = (data, value) => {
		return data.type === value;
	};

	lib.contactsIcon = [
		{ type: "Телефон", url: "phoneIcon" },
		{ type: "Email", url: "mailIcon" },
		{ type: "Facebook", url: "fbIcon" }, 
		{ type: "vk", url: "vkIcon" },
		{ type: "other", url: "otherIcon" },
	];

	lib.getContactLink = (contact) => {
		let href;
		switch (contact.type) {
			case "Телефон":
				href = `tel:${contact.value}`;
				break;
			case "Email":
				href = `mailto:${contact.value}`;
				break;
			case "Facebook":
				href = `https://ru-ru.facebook.com/${contact.value}`;
				break;
			case "vk":
				href = `https://vk.com/${contact.value}`;
				break;
			default:
				href = contact.value;
				break;
		}

		return href;
	};

	lib.getContactPlaceholder = (contactType) => {
		//TODO: подумать над однообразием для VK
		if (contactType === "Facebook" || contactType === "vk" || contactType === "VK") {
			return `ID пользователя`;
		}
		return "Введите данные";
	};

	lib.showTooltip = (element, tooltipElement) => {
		if (element.getAttribute("data-type") === "delete") {
			tooltipElement.querySelector(".tooltip__text").innerHTML = `
				<span class="tooltip__contact-type">${element.getAttribute("data-title")}</span>`;
		} else if (element.getAttribute("data-type") != "Email" && element.getAttribute("data-type") != "Телефон") {
			tooltipElement.querySelector(".tooltip__text").innerHTML = `
				<span class="tooltip__contact-type">${element.getAttribute("data-type")}:</span>
				<a>@${element.getAttribute("data-title")}</a>`;
		} else {
			tooltipElement.querySelector(".tooltip__text").innerHTML = `
				<span class="tooltip__contact-type">${element.getAttribute("data-type")}:</span>
				<a>${element.getAttribute("data-title")}</a>`;
		}

		let targetCoords = element.getBoundingClientRect();
		let topPosition = targetCoords.top;
		tooltipElement.style.top = topPosition - 25 + "px";
		let targetCenterCoords = (targetCoords.right - targetCoords.left) / 2;
		tooltipElement.style.left = targetCoords.left + targetCenterCoords + "px";

		tooltipElement.classList.add("tooltip_active");
	};

	lib.renderCellBtn = (text, cls) => {
		let btn = document.createElement("button");
		btn.className = cls;
		btn.textContent = text;

		return btn;
	};

	lib.renderCellBtnFull = (btnSettings, textSettings, iconSettings) => {
		let btn = document.createElement("button");
		btn.className = btnSettings.cls;

		let iconElement = document.createElement("span");
		iconElement.className = iconSettings.cls;
		btn.append(iconElement);

		let textElement = document.createElement("span");
		textElement.className = textSettings.cls;
		textElement.textContent = textSettings.text;
		btn.append(textElement);

		return btn;
	};

	lib.appendCells = (elements, row) => {
		elements.forEach((element) => {
			row.append(element);
		});
	};

	lib.addBtnHandler = (btn, modalID) => {
		btn.addEventListener("click", () => {
			modalID.modal("show");
		});
	};

	lib.addBtnDeleteHandler = (deleteModal, currentElement, clientID) => {
		modal.open(deleteModal);
		let inputIDElement = deleteModal.querySelector("#deleteClientID");
		inputIDElement.setAttribute("data-id", clientID);
	};

	lib.addBtnUpdateClientHandler = async (modalElement, clientId) => {
		modal.open(modalElement);
		let inputIDElement = modalElement.querySelector("#updateClientID");
		inputIDElement.setAttribute("data-id", clientId);
		document.querySelectorAll(".contact__wrapper").forEach((node) => {
			node.remove();
		});
		try {
			return await api.getClient(inputIDElement.getAttribute("data-id"));
		} catch (error) {
			console.error(error);
		}
	};

	lib.showModalByID = async (modalElement, id)=> {
		let response = await lib.addBtnUpdateClientHandler(modalElement, id);

		let modalHeaderElement = lib.createUpdateModal.element.querySelector(".modal__header");
		modalHeaderElement.textContent = "Изменить данные";
		let idElement = document.createElement("span");
		idElement.className = "modal__update-title";
		idElement.textContent = ` ID: ${response.id}`;
		modalHeaderElement.append(idElement);

		lib.setValueAndLabelState(lib.createUpdateModal.element, response);

		document.querySelector('.clients__cell-btn_update-active')?.classList.remove("clients__cell-btn_update-active");

		if (response.contacts?.length) {
			document.querySelector(".contact").classList.add("contact_active");
			response.contacts.forEach((contact) => {
				let contactName = lib.contactsDefaultData.find((item) => item.type === contact.type);
				contactName = contactName.name;
				let element = view.renderNewContactElement(lib.contactsDefaultData, addContactElementWrapper, addContactForNewClientBtn, contactName);
				element.inputElement.value = contact.value;
				element = element.contacts.querySelector(".contact__type-item_top");
				element.setAttribute("data-contact-type", contact.type);
				element.textContent = contactName;
			});
		}
	}

	lib.getRowID = (element) => {
		return element.closest("tr").querySelector(".clients__cell-id-body").textContent;
	};

	lib.getRowDataID = (element) => {
		return element.closest("tr").querySelector(".clients__cell-id-body").getAttribute("data-id");
	};

	lib.removeChildren = (element) => {
		while (element.firstChild) {
			element.removeChild(element.firstChild);
		}
	};

	lib.createUpdateModal = {
		element: null,
		bootstrapElement: null,
		render: function () {
			modal.renderCreateUpdateModal();
			this.element = document.querySelector("#createUpdateModal");
		},
	};

	lib.deleteModal = {
		element: null,
		modalElement: null,
		render: function () {
			modal.renderDeleteModal();
			this.element = document.querySelector("#deleteModal");
		},
	};

	lib.setValueAndLabelState = (modal, data) => {
		modal.querySelectorAll("input").forEach((input) => {
			let inputType = input.getAttribute("name");
			input.value = data[inputType] || "";
			if (input.value.trim() != "") {
				input.parentElement.querySelector("label").classList.add("modal__label_active");
			}
		});
	};

	lib.addActiveClassToLabel = (label) => {
		label.classList.add("modal__label_active");
	};

	window.lib = lib;
})();
