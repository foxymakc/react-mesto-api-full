import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = ({ onRegister }) => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((oldData) => ({
      ...oldData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data.password) {
      let { password, email } = data;
      onRegister(password, email);
    }
  };

  return (
    <form className="auth__form" onSubmit={handleSubmit}>
      <h2 className="auth__title">Регистрация</h2>
      <fieldset className="auth__fieldset">
        <input
          name="email"
          type="email"
          className="popup__input popup__input_auth-email"
          id="email"
          placeholder="Email"
          required
          value={data.email || ""}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          className="popup__input popup__input_auth-password"
          id="password"
          placeholder="Пароль"
          required
          value={data.password || ""}
          onChange={handleChange}
        />

        <button type="submit" className="auth__button">
          Зарегистрироваться
        </button>
      </fieldset>
      {"register" && (
        <Link className="auth__link" to="/signin">
          Уже зарегистрированы? Войти
        </Link>
      )}
    </form>
  );
};

export default Register;
