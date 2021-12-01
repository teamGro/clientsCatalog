(() => {
	const modal = {};

	function deleteModalMarkup() {
		return `
      <div class="delete-modal" >
        <div class="delete-modal__wrapper modal__wrapper">
          <div class="delete-modal__header-wrapper">
            <h3 class="modal__header delete-modal__header">Удалить клиента</h3>
            <button class="modal__close" type="button" data-close>
              <img src="./img/close-icon.png" />
            </button>
          </div>
          <input type="hidden" id="deleteClientID">
          <p class="delete-modal__text">Вы действительно хотите удалить данного клиента?</p>

          <div class="delete-modal__btns-wrapper">
            <button class="modal__action" type="submit" id="deleteClient">Удалить</button>
            <button class="modal__cancel" type="button" data-close>Отмена</button>
          </div>
        </div>
      </div>
    `;
	}

	function createUpdateModalMarkup() {
		//custom-modal__header
		return `
		<div class="create-update-modal" id="CreateUpdateModalClient">
			<div class="modal-wrapper">
				<div class="create-update-modal__header-wrapper ">
					<h3 class="modal__header create-update-modal__header">Новый клиент</h3>
					<button class="modal__close" id="closeCreateUpdateModal" type="button" data-close>
              			<img src="./img/close-icon.png" />
            		</button>
				</div>

				<div class="create-update-modal__body">
					<form class="clients__form">
						<input type="hidden" id="updateClientID" />
						<div class="modal__inputs-wrapper">
							<div class="modal__input-wrapper">
								<input type="text" class="modal__input" id="newClientSurname" placeholder="Фамилия" required value="test" />
							</div>
							<div class="modal__input-wrapper">
								<input type="text" class="modal__input" id="newClientName" placeholder="Имя" required value="test" />
							</div>
							<div class="modal__input-wrapper">
								<input type="text" class="modal__input" id="newClientLastName" placeholder="Отчество" required value="test" />
							</div>
						</div>
						<div class="modal__add-btn-wrapper contact">
							<button class="modal__add-contact" type="button" id="addNewContact">
								<img class="modal__add-btn-icon" src="./img/add-icon.png" alt="" />
								<span class="modal__add-contact-title">Добавить контакт</span>
							</button>
						</div>
						<div class="modal-footer modal__footer">
							<button type="button" class="modal__btn modal__btn_save" id="saveClient">Сохранить</button>
							<button type="button" class="modal__btn-cancel">Отмена</button>
						</div>
					</form>
				</div>
			</div>
		</div>
		`;
	}

	modal.renderDeleteModal = () => {
		let deleteModal = document.createElement("div");
		document.body.append(deleteModal);
		deleteModal.innerHTML = deleteModalMarkup();
		deleteModal.className = "modal";
		deleteModal.setAttribute("id", "deleteModal");
		return deleteModal;
	};

	modal.renderCreateUpdateModal = () => {
		let modal = document.createElement("div");
		document.body.append(modal);
		modal.innerHTML = createUpdateModalMarkup();
		modal.className = "modal";
		modal.setAttribute("id", "createUpdateModal");
		return modal;
	};

	modal.close = (modal) => {
		modal.classList.remove("modal_active");
		modal.querySelector(".error")?.classList.remove("error_active");

		modal.querySelector('[data-id]')?.setAttribute('data-id', '');

		if (modal.querySelector(".modal__add-contact_disable")) {
			modal.querySelector(".modal__add-contact_disable").classList.remove("modal__add-contact_disable");
		}

		if (modal.querySelector(".contact_active")) {
			modal.querySelector(".contact_active").classList.remove("contact_active");
		}
		location.hash = '';
	};

	modal.open = (modal, options = null) => {
		modal.classList.add("modal_active");
		if (options?.type === "delete") {
			document.querySelector(`#deleteClientID`).value = options.id;
		}
	};

	modal.clearData = (modal) => {
		modal.querySelectorAll("input").forEach((input) => {
			input.value = "";
		});

		modal.querySelectorAll("label").forEach((label) => {
			label.classList.remove("modal__label_active");
		});

		modal.querySelectorAll(".contact__wrapper").forEach((element) => {
			element.remove();
		});

		modal.querySelector(".modal__header").innerHTML = "Новый контакт";
	};

	function deleteClient() { }

	window.modal = modal;
})();
