import React, { useState } from "react";

const Login = ({ onLogin }) => {
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

  function handleSubmit(e) {
    e.preventDefault();
    const { email, password } = data;
    if (!email || !password) {
      return;
    }
    onLogin(password, email);
  }

  return (
    <form
      className="auth__form auth__form_login"
      onSubmit={handleSubmit}
    >
      <h2 className="auth__title">Вход</h2>
      <fieldset className="auth__fieldset">
        <input
          name="email"
          type="email"
          className="popup__input popup__input_auth-email"
          id="email"
          placeholder="Email"
          required
          value={data.email}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          className="popup__input popup__input_auth-password"
          id="password"
          placeholder="Пароль"
          required
          value={data.password}
          onChange={handleChange}
        />

        <button type="submit" className="auth__button">
          Войти
        </button>
      </fieldset>
    </form>
  );
};

export default Login;
