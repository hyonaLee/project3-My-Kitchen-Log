import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { auth } from '../../_actions/user_action';

export default function Auth({children}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    dispatch(auth())
    .then((response) => {
        const isAuth = response.payload.isAuth;
        // console.log("이름",response.payload.name)
        if (!isAuth) navigate("/login")
    });
    
    return children;
}
