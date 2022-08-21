class Api {
  constructor(config) {
    this._url = config.url;
    this._headers = config.headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  handleAvatar(data) {
    return fetch(this._url + `/users/me/avatar`, {
      credentials: 'include',
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    }).then(this._checkResponse);
  }

  getUserInfo() {
    return fetch(this._url + "/users/me", {
      credentials: 'include',
      method: "GET",
      headers: this._headers,
    }).then(this._checkResponse);
  }

  handleUserInfoApi(data) {
    return fetch(this._url + "/users/me", {
      credentials: 'include',
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      }),
    }).then(this._checkResponse);
  }

  getInitialCards() {
    return fetch(this._url + "/cards", {
      credentials: 'include',
      method: "GET",
      headers: this._headers,
    }).then(this._checkResponse);
  }

  handleAddCard(data) {
    return fetch(this._url + "/cards", {
      credentials: 'include',
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      }),
    }).then(this._checkResponse);
  }

  getInformation() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()]);
  }

  deleteCard(data) {
    return fetch(this._url + `/cards/${data._id}`, {
      credentials: 'include',
      method: "DELETE",
      headers: this._headers,
    }).then(this._checkResponse);
  }

  changeLikeCardStatus(cardId, isLiked) {
    return fetch(this._url + `/cards/${cardId}/likes`, {
      credentials: 'include',
      method: `${isLiked ? "PUT" : "DELETE"}`,
      headers: this._headers,
    }).then(this._checkResponse);
  }
}



const api = new Api({
  url: "https://api.domain15pr.chelovskiy.nomoredomains.sbs",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
