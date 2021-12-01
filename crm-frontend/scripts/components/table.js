(() => {
  const table = {};

  table.renderIdCell = (client) => {
    let cellID = document.createElement("td");
    cellID.setAttribute('data-id', client.id);
    cellID.textContent = client.id.substr(0, 6);
    cellID.className = "clients__cell-id-body";

    return cellID
  }

  table.renderFullNameCell = (client) => {
    let cellName = document.createElement("td");
    cellName.textContent = `${client.surname} ${client.name} ${client.lastName}`;
    cellName.className = "clients__cell-body";

    return cellName;
  }

  table.renderDateCell = (client, dateType) => {
    let cellDate = document.createElement("td");
    cellDate.className = "clients__cell-body clients__cell-body_date";

    let dateWrapper = document.createElement("div");

    let date = lib.parseDate(client[dateType]);
    let yearElement = document.createElement("span");
    yearElement.textContent = date.firstDatePart;

    let dayElement = document.createElement("span");
    dayElement.className = "clients__day-elem";
    dayElement.textContent = date.secondDatePart;

    dateWrapper.append(yearElement);
    dateWrapper.append(dayElement);
    cellDate.append(dateWrapper);

    return cellDate;
  }

  table.renderContactsCell = (client, maxVisibleContacts) => {
    let cellContacts = document.createElement("td");
    cellContacts.className = "clients__cell-body clients__cell-body_contacts";
    if (client.contacts.length) {
      for (let i = 0; i < client.contacts.length; i++) {
        let contact = client.contacts[i];
        if (i === maxVisibleContacts) {
          let contactElement = document.createElement("p");
          contactElement.className = "clients__contact-num";
          contactElement.textContent = `+${-(maxVisibleContacts - client.contacts.length)}`;
          cellContacts.append(contactElement);
          break;
        }

        let contactLink = document.createElement("a");
        contactLink.className = "clients_contact-link";
        contactLink.setAttribute("target", "_blank");
        contactLink.setAttribute("href", lib.getContactLink(contact));

        let icon = lib.contactsIcon.find((item) => item.type === contact.type);
        contactLink.innerHTML = `<svg class="clients_contact-icon" data-title="${contact.value}" data-type="${contact.type}"><use xlink:href="#${icon.url}"></use></svg>`;

        cellContacts.append(contactLink);
      }
    }

    return cellContacts
  }

  table.renderActionsCell = () => {
    let cellActions = document.createElement("td");
    cellActions.className = "clients__cell-body clients__cell-body_actions";
    let cellUpdateBtn = lib.renderCellBtnFull({ cls: "clients__cell-btn clients__cell-btn_update" }, { cls: "clients__actions-btn-text", text: "Изменить" }, { cls: "clients__actions-btn-icon clients__actions-btn-icon_update" });
    cellActions.append(cellUpdateBtn);

    let cellDeleteBtn = lib.renderCellBtnFull({ cls: "clients__cell-btn clients__cell-btn_delete" }, { cls: "clients__actions-btn-text", text: "Удалить" }, { cls: "clients__actions-btn-icon clients__actions-btn-icon_delete" });
    cellActions.append(cellDeleteBtn);

    return {
      cellActions,
      cellUpdateBtn,
      cellDeleteBtn
    }
  }



  window.table = table;
})();