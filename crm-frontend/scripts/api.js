(() => {
  const api = {};
  const URL = 'http://localhost:3000/api/clients';

  api.getClients = async () => {
    let response = await fetch(URL);
    return await response.json();
  }

  api.getClient = async (id) => {
    let response = await fetch(`${URL}/${id}`);
    return await response.json();
  }

  api.updateClient = async (id, data, errorElements) => {
    const response = await fetch(`${URL}/${id}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    await serverErrorHandling(response, errorElements);
    return await response.json();
  }

  api.createClient = async (data, errorElements) => {
    let response = await fetch(URL, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    await serverErrorHandling(response, errorElements);
    return await response.json();
  }

  api.deleteClient = async (id, errorElements) => {
    const response = await fetch(`${URL}/${id}`, {
      method: "DELETE",
    });
    await serverErrorHandling(response, errorElements);
    return response;
  }

  api.searchClients = async (searchParam) => {
    let response = await fetch(`${URL}?search=${searchParam}`);
    return await response.json();
  }

  async function serverErrorHandling(response, errorElements) {
    lib.removeChildren(errorElements.list);
    switch (response?.status) {
      case 404:
        renderErrorMessage('Клиент не найден', errorElements.list);
        errorElements.wrapper.classList.add("error_active");
        throw new Error(404);
      case 422:
        response = await response.json();
        response.errors.forEach((error) => {
          renderErrorMessage(error.message, errorElements.list)
        });
        errorElements.wrapper.classList.add("error_active");
        throw new Error(422);
      case 500:
        renderErrorMessage('Что-то пошло не так', errorElements.list);
        throw new Error(response.status);
    }
  }

  function renderErrorMessage(message, errorElement) {
    let item = document.createElement("li");
    item.className = "error__item";
    item.textContent = message;
    errorElement.append(item);
  }

  window.api = api;
})();