(() => {
	const view = {};
	const maxContactsQuantity = 6;
	const maxVisibleContacts = 4;

	// const addContactElementWrapper = document.querySelector(".contact");
	// const addContactForNewClientBtn = document.querySelector("#addNewContact");

	const tooltipElement = document.querySelector(".tooltip");

	view.removeLoadingSpinner = (spinnerContainer) => {
		spinnerContainer.classList.add("clients__waiting-bg_inactive");
	};

	view.showAddClientBtn = (btnContainer) => {
		btnContainer.classList.add("clients__add-btn-wrapper_visible");
	};

	view.openOrCloseModal = (modalCompomemt, action = "close", operation = "create") => {
		if (action === "open") {
			if (operation === "create") {
				modalCompomemt.element.querySelector(".custom-modal__header-title").innerHTML = "Новый клиент";
				modalCompomemt.element
					.querySelector("form")
					.querySelectorAll("input")
					.forEach((element) => {
						element.value = "";
					});
				modalCompomemt.element.querySelectorAll(".contact__wrapper").forEach((element) => {
					element.remove();
				});
			}
			modalCompomemt.instance.show();
			return;
		}

		modalCompomemt.instance.hide();
	};

	view.renderClientsTable = (clients, tableElement) => {
		let tableBody = tableElement.querySelector("tbody");
		lib.removeChildren(tableBody);
		clients.forEach((client) => {
			let row = document.createElement("tr");

			let cellID = table.renderIdCell(client);
			let cellFullName = table.renderFullNameCell(client);
			let cellDateCreated = table.renderDateCell(client, 'createdAt');
			let cellDateUpdated = table.renderDateCell(client, 'updatedAt');
			let cellContacts = table.renderContactsCell(client, maxVisibleContacts);
			let { cellActions, cellUpdateBtn, cellDeleteBtn } = table.renderActionsCell();

			lib.appendCells([cellID, cellFullName, cellDateCreated, cellDateUpdated, cellContacts, cellActions], row);

			tableBody.append(row);

			const contactsIcon = document.querySelectorAll(".clients_contact-icon");
			contactsIcon.forEach((item) => {
				item.addEventListener("mouseenter", (e) => {
					let target = e.target;
					if (target.tagName != "svg") return;

					lib.showTooltip(target, tooltipElement);
				});

				item.addEventListener("mouseleave", (e) => {
					let target = e.target;
					if (target.tagName != "svg") return;
					tooltipElement.classList.remove("tooltip_active");
				});
			});

			cellDeleteBtn.addEventListener("click", () => {
				cellDeleteBtn.classList.add("clients__cell-btn_delete-active");
				lib.addBtnDeleteHandler(lib.deleteModal.element, cellDeleteBtn, client.id);
				cellDeleteBtn.classList.remove("clients__cell-btn_delete-active");
			});

			cellUpdateBtn.addEventListener("click", async () => {
				cellUpdateBtn.classList.add("clients__cell-btn_update-active");
				try {
					location.hash = cellID.getAttribute('data-id');
				} catch (error) {
					console.error(error);
				}
			});

			cellFullName.addEventListener("click", async () => {
				try {
					location.hash = cellID.getAttribute('data-id');
				} catch (error) {
					console.error(error);
				}
			});
		});
	};

	view.renderCustomSelect = (elements, firstElement) => {
		let optionsListElement = document.createElement("ul");
		optionsListElement.className = "contact__type-list";

		let topItemElement = document.createElement("li");
		topItemElement.className = "contact__type-item contact__type-item_top";
		topItemElement.textContent = firstElement;
		let type = lib.contactsDefaultData.filter((contact) => {
			return contact.name === firstElement;
		});
		topItemElement.setAttribute("data-contact-type", type[0].type);
		optionsListElement.append(topItemElement);

		let elementPosition = 0;
		elements.forEach((elem) => {
			if (elem.name != firstElement) {
				let item = document.createElement("li");
				item.className = "contact__type-item";
				item.textContent = elem.name;
				item.setAttribute("data-contact-type", elem.type);
				item.style.top = (elementPosition + 1) * 34 + "px";

				elementPosition++;
				optionsListElement.append(item);
			}
		});

		return {
			list: optionsListElement,
			topElement: topItemElement,
		};
	};

	view.updateCustomSelect = (parentContainer, prevActiveContact, currentActiveContact) => {
		let element = parentContainer.querySelectorAll(`[data-contact-type="${currentActiveContact.attr}"]`)[1];
		element.textContent = prevActiveContact.text;
		element.setAttribute("data-contact-type", prevActiveContact.type);
	};

	view.renderNewContactElement = (contactTypes, parentContainer, addContactBtn, firstElement) => {
		let contactWrapper = document.createElement("div");
		contactWrapper.className = "contact__wrapper";

		let contactTypeList = view.renderCustomSelect(contactTypes, firstElement);
		contactTypeList.list.className = "contact__type-list";
		contactWrapper.append(contactTypeList.list);

		let inputElement = document.createElement("input");
		inputElement.className = "contact__input";
		inputElement.setAttribute("placeholder", lib.getContactPlaceholder(contactTypeList.topElement.getAttribute("data-contact-type")));
		contactWrapper.append(inputElement);

		let removeContactBtn = document.createElement("button");
		removeContactBtn.className = "contact__remove-btn";
		removeContactBtn.setAttribute("data-remove-contact", "remove");
		let btnIcon = document.createElement("img");
		btnIcon.src = "./img/cancel-btn.png";
		btnIcon.setAttribute("data-title", "Удалить контакт");
		btnIcon.setAttribute("data-type", "delete");
		removeContactBtn.append(btnIcon);
		contactWrapper.append(removeContactBtn);
		view.removeContact(removeContactBtn, ".contact__wrapper");

		parentContainer.insertBefore(contactWrapper, addContactBtn);

		let deleteContactBtns = document.querySelectorAll(".contact__remove-btn");
		deleteContactBtns.forEach((btn) => {
			btn.addEventListener("mouseenter", (e) => {
				let target = e.target;
				if (target.tagName != "IMG") target = target.querySelector("img");
				lib.showTooltip(target, tooltipElement);
			});
			btn.addEventListener("mouseleave", (e) => {
				let target = e.target;
				if (target.tagName != "IMG") target = target.querySelector("img");
				tooltipElement.classList.remove("tooltip_active");
			});
		});
		return {
			contacts: contactTypeList.list,
			inputElement: inputElement,
		};
	};

	view.openContactsList = (element) => {
		if (element.closest(".contact").querySelector(".contact__type-list_open")) {
			element
				.closest(".contact")
				.querySelectorAll(".contact__type-list_open")
				.forEach((item) => {
					if (item != element) {
						item.classList.remove("contact__type-list_open");
					}
				});
		}
		if (element.classList.contains("contact__type-list_open")) {
			element.classList.remove("contact__type-list_open");
		} else {
			element.classList.add("contact__type-list_open");
		}
	};

	view.setContact = (elemContent, parentContainer, inputField, prevActiveContact) => {
		parentContainer.querySelector(".contact__type-item_top").textContent = elemContent.text;
		parentContainer.querySelector(".contact__type-item_top").setAttribute("data-contact-type", elemContent.attr);
		parentContainer.classList.remove("contact__type-list_open");
		view.updateCustomSelect(parentContainer, prevActiveContact, elemContent);

		inputField.setAttribute("placeholder", lib.getContactPlaceholder(elemContent.text));
	};

	view.isContactsQuantityMax = (element, contactsQty) => {
		if (element.getAttribute("id") === "addNewContact") {
			if (contactsQty === maxContactsQuantity) {
				element.classList.add("modal__add-contact_disable");
			}
		}

		if (element.getAttribute("data-remove-contact") === "remove") {
			contactsQty--;
			if (document.querySelector(".modal__add-contact_disable")) {
				document.querySelector(".modal__add-contact_disable").classList.remove("modal__add-contact_disable");
			}
		}

		return true;
	};

	view.removeContact = (target, parentCls) => {
		target.closest(parentCls).remove();
	};

	view.sortingHandler = (data, element) => {
		let elementAttr = element.getAttribute("data-sort-type");
		let sortingDirection;

		document.querySelector(".clients__head-cell-title_active").classList.remove("clients__head-cell-title_active");
		element.querySelector(".clients__head-cell-title").classList.add("clients__head-cell-title_active");

		if (element.classList.contains("clients__head-cell_asc")) {
			element.classList.remove("clients__head-cell_asc");
			element.classList.add("clients__head-cell_desc");
			sortingDirection = "desc";
		} else {
			element.classList.remove("clients__head-cell_desc");
			element.classList.add("clients__head-cell_asc");
			sortingDirection = "asc";
		}

		let sortingResult;
		switch (elementAttr) {
			case "id":
				sortingResult = controller.sortItems(data, sortingDirection).byID();
				break;
			case "name":
				sortingResult = controller.sortItems(data, sortingDirection).byName();
				break;
			case "updatedAt":
				sortingResult = controller.sortItems(data, sortingDirection).byUpdated();
				break;
			case "createdAt":
				sortingResult = controller.sortItems(data, sortingDirection).byCreated();
				break;
		}

		return sortingResult;
	};

	view.renderErrorsMessage = (errors, errorElements) => {
		console.log(errors);
		lib.removeChildren(errorElements.list);

		if (!Array.isArray(errors)) errors = new Array(errors);

		errors.forEach((error) => {
			let item = document.createElement("li");
			item.className = "error__item";
			item.textContent = error.message;
			errorElements.list.append(item);
		});

		errorElements.wrapper.classList.add("error_active");
	};

	window.view = view;
})();
