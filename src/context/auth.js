import React, { useReducer, createContext } from 'react'
import jwtDecode from 'jwt-decode'

const initialState = {
    user: null
}

if(localStorage.getItem('jwtToken')){
    const decodedToken = jwtDecode(localStorage.getItem('jwtToken'))

    if(decodedToken.exp * 1000 < Date.now()){//loginがどれくらいで無効になるか
        localStorage.removeItem('jwtToken')
    } else {
        initialState.user = decodedToken;
    }
}

const AuthContext = createContext({
    user: null,
    login: (userData) => {},
    logout: () => {}
})

function authReducer(state, action){
    switch(action.type){
        case 'LOGIN':
            return{
                ...state,
                user: action.payload
            }
        case 'LOGOUT':
            return{
                ...state,
                user: null
            }
        default:
            return state;
    }
}

//https://ja.reactjs.org/docs/hooks-reference.html#usereducer
//stateを何回も使わなくて済む
function AuthProvider(props){
    const [state, dispatch] = useReducer(authReducer,initialState);

    function login(userData){
        localStorage.setItem("jwtToken", userData.token)//一旦ログインしたらローカルストレージに保存する。リフレッシュした時に元に戻らないように
        dispatch({
            type: 'LOGIN',
            payload: userData
        })
    }

    function logout(){
        localStorage.removeItem('jwtToken');
        dispatch({ type: 'LOGOUT'});
    }

    return(
        <AuthContext.Provider
            value={{user: state.user, login, logout}}
            {...props}
            />
    )
}

export { AuthContext, AuthProvider }