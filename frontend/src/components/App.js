import React, { useEffect, useState} from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import api from "../utils/Api";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import * as auth from "../utils/auth";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import success from "../images/success.svg";
import fail from "../images/fail.svg";

const App = () => {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] =
    useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [message, setMessage] = useState({
    imgRegistration: "",
    text: "",
  });

  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then((data) => {
          const [userData, cardsData] = data;
          setCards(cardsData.data.reverse())
          setCurrentUser(userData);
        })
        .catch((err) => console.log(err));
    }
  }, [loggedIn]);

  useEffect(() => {
    tokenCheck()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setEditAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setSelectedCard(null);
    setIsInfoTooltipOpen(false);
  }

  function handleUpdateUser(userData) {
    api
      .handleUserInfoApi(userData)
      .then((user) => {
        setCurrentUser(user.data)
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar(userData) {
    api
      .handleAvatar(userData)
      .then((user) => {
        setCurrentUser(user.data)
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard.data : c))
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card)
      .then(() => {
        setCards(cards => cards.filter((item) => item !== card))
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit(cardData) {
    api
      .handleAddCard(cardData)
      .then((newCard) => {
        setCards([newCard.data, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  const onLogin = (password, email) => {
    auth
      .authorize(password, email)
      .then(data => {
        if(data) {
          localStorage.setItem('jwt', data.token);
          setLoggedIn(true);
          setEmail(email);
          history.push('/');
        }
      })
      .catch((err) =>
        console.log(
          err,
          setMessage({
            imgRegistration: fail,
            text: "Что-то пошло не так! Попробуйте ещё раз.",
          }),
          setIsInfoTooltipOpen(true)
        )
      );
  };

  const onRegister = (password, email) => {
    auth
      .register(password, email)
      .then((data) => {
        if (data._id || data.email) {
        setMessage({
          imgRegistration: success,
          text: "Вы успешно зарегистрировались!",
        });
      }
      })
      .catch(() =>
        setMessage({
          imgRegistration: fail,
          text: "Что-то пошло не так! Попробуйте ещё раз.",
        })
      )
      .finally(() => setIsInfoTooltipOpen(true));
  };

  function tokenCheck() {
    auth.getContent()
    .then(res => {
      if(res) {
        setEmail(res.email);
        setLoggedIn(true);
        history.push('/');
      }
      })
      .catch((err) => console.log(err))
  }

  const onSignOut = () => {
    auth.logout()
    .then(() => {
    setLoggedIn(false);
    setEmail('');
    setCards([])
    setCurrentUser({})
    history.push('/signin')
  })
  .catch(err => console.log(err));
}

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header loggedIn={loggedIn} email={email} onSignOut={onSignOut} />
        <Switch>
          <ProtectedRoute
            exact
            path="/"
            loggedIn={loggedIn}
            cards={cards}
            component={Main}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            handleCardLike={handleCardLike}
            handleCardDelete={handleCardDelete}
          />
          <Route path="/signup">
            <Register onRegister={onRegister} />
          </Route>
          <Route path="/signin">
            <Login onLogin={onLogin} />
          </Route>

          <Route path="*">
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
          </Route>
        </Switch>
        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />

        <InfoTooltip
          name="tooltip"
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          title={message.text}
          imgRegistration={message.imgRegistration}
        />
      </div>
    </CurrentUserContext.Provider>
  );
};

export default App;
