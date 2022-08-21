import { useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();

  return (
    <>
      {location.pathname === "/signup" ? (
        <></>
      ) : location.pathname === "/signin" ? (
        <></>
      ) : (
        <footer className="footer">
          <p className="footer__copyrights">&copy; 2022 Mesto Russia</p>
        </footer>
      )}
    </>
  );
}

export default Footer;
