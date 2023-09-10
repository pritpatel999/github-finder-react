import { createContext, useReducer } from "react";
import githubReducer from "./GithubReducer";

const GithubUserContext = createContext();
const Github_url = process.env.REACT_APP_GITHUB_URL;
const Github_token = process.env.REACT_APP_GITHUB_TOKEN;

export const GithubProvider = ({children})=>{
    const initialState = {
        users : [],
        user : {},
        repos : [],
        loading : false
    }
    const [state, dispatch] = useReducer(githubReducer, initialState)
    
    const searchUsers = async (text) => {
        setLoading()
        const param = new URLSearchParams({
            q:text
        })
        const response = await fetch(`${Github_url}/search/users?${param}`,{
          headers:{
            Authorization: `token ${Github_token}`
          }
        })
        const {items} = await response.json()
        console.log('data : ',items)
        
        dispatch({
            type:'GET_USERS',
            payload:items
        })

      }
      const getUser = async (login) => {
        setLoading()
        const response = await fetch(`${Github_url}/users/${login}`,{
          headers:{
            Authorization: `token ${Github_token}`
          }
        })
        if (response.status === 404){
            window.location = '/notfound'
        }else{
            const data = await response.json()
            console.log('data : ',data)
            
            dispatch({
                type:'GET_USER',
                payload:data
            })
        }
      }

    
      const getRepos = async (login) => {
        setLoading()
        const param = new URLSearchParams({
          sort: 'created',
          per_page:10
        })
        const response = await fetch(`${Github_url}/users/${login}/repos?${param}`,{
          headers:{
            Authorization: `token ${Github_token}`
          }
        })
        if (response.status === 404){
            window.location = '/notfound'
        }else{
            const data = await response.json()
            console.log('repository List : ',data)
            
            dispatch({
                type:'GET_REPOS',
                payload:data
            })
        }
      }
    
    const clearUsers = () => {
        dispatch({
            type:'CLEAR_USERS'
        })
    }
    const setLoading = () => {
        dispatch({
            type:'SET_LOADING',
        })
      }
      return <GithubUserContext.Provider value={{
        users : state.users,
        user : state.user,
        loading : state.loading,
        repos : state.repos,
        searchUsers,
        clearUsers,
        getUser,
        getRepos,
        }}>
        {children}
    </GithubUserContext.Provider>
}

export default GithubUserContext;