import {useEffect} from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


const Layout = (props:any) => {

    const navigate = useNavigate();
    const token = Cookies.get("token");

    useEffect(() => {
      if(!token){
        navigate("/");
      }
  
    },[token,navigate]);    

    return (
        <>
        {props.children}
        </>
    );

}

export default Layout;