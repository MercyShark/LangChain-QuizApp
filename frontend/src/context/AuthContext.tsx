import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser , login, logout} from "../api/quiz";


const AuthContext = createContext();

const AuthProvider = ({ children  }) => {
  const [user, setUser] = useState<null | {}>(null);
  const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();

    useEffect(() => { 
        setIsLoading(true)
    getUser().then((response) => {
        console.log("called")
      setUser(response);
    }).catch((error) => {
      console.log(error);
    }).finally(() => {
        setIsLoading(false)
    })
    },[])

  const SignOut = () => {
      logout().then((response) => {
        setUser(null);
      })
    // setUser(null);
    // setToken("");
    // localStorage.removeItem("site");
    // navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, SignOut,isLoading }}>
      {children}
    </AuthContext.Provider>
  );

};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
