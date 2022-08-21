function InfoTooltip({ isOpen, onClose, imgRegistration, title }) {
  return (
    <div className={`popup ${isOpen && 'popup_opened'}`}>
      <div className="popup__container">
        <div className="popup__tooltip">
          <img
            className="popup__tooltip-img"
            src={imgRegistration}
            alt={imgRegistration}
          />
          <h2 className="popup__tooltip-title">{title}</h2>
        </div>
        <button
          className="popup__close"
          type="button"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
}

export default InfoTooltip;
