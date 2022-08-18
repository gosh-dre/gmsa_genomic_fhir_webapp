import { useLocation, useNavigate } from "react-router-dom";
import { FC, useEffect } from "react";

/**
 * Redirect with search parameters as this allows the FHIR authentication state to be set.
 * @constructor
 */
const AuthRedirect: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/add_report${location.search}`, { replace: true });
  }, [location]);
  const msg = "Successfully authenticated with FHIR API, redirecting to add a report";
  console.debug(msg);

  return <p>{msg}</p>;
};

export default AuthRedirect;
