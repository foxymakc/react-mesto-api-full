import React from "react";
import { Link, useLocation } from "react-router-dom";
import headerLogo from "../images/logo.svg";

function Header({ loggedIn, email, onSignOut }) {
  const location = useLocation();
  return (
    <header className="header">
      <img className="header__logo" src={headerLogo} alt="Логотип Место" />
      {loggedIn ? (
        <div className="header__info">
          <p className="header__email">{email}</p>
          <Link
            to="sign-up"
            className={`header__link ${
              loggedIn && "header__link_login"
            }`}
            onClick={onSignOut}
          >
            Выйти
          </Link>
        </div>
      ) : (
        <>
          {location.pathname === "/signin" ? (
            <Link className="header__link" to="/signup">
              Регистрация
            </Link>
          ) : (
            <Link className="header__link" to="/signin">
              Войти
            </Link>
          )}
        </>
      )}
    </header>
  );
}

export default Header;
