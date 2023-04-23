import { Outlet, Link } from "react-router-dom"
import { useEffect, useRef, useState } from 'react'
import { useRefreshMutation } from "./authApiSlice"
import usePersist from "../../hooks/usePersist"
import { useSelector } from 'react-redux'
import { selectCurrentToken } from "./authSlice"
import useAuth from '../../hooks/useAuth.js'
const PersistLogin = () => {
    const { username, email, id} = useAuth()
    const [persist] = usePersist()
    const token = useSelector(selectCurrentToken)
    const effectRan = useRef(true)

    const [trueSuccess, setTrueSuccess] = useState(false)

    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation()


    useEffect(() => {
        console.log("dd", token)

        if (effectRan.current === true || process.env.NODE_ENV !== 'development' || token) { // React 18 Strict Mode

            const verifyRefreshToken = async () => {
                try {
                    console.log('verifying refresh token')
                    //const response = 
                    await refresh()
                    //const { accessToken } = response.data
                    setTrueSuccess(true)
                }
                catch (err) {
                    console.log("error")
                    console.error(err)
                }
            }
            console.log(!token, persist)
            if (!token && persist) verifyRefreshToken()
        }

        return () => effectRan.current = true

        // eslint-disable-next-line
    }, [])

    let content

    
   if (isError) { //persist: yes, token: no
        console.log('error')
        content = (
            <p className='errmsg'>
                {error.data?.message}
                <Link to="/login">Please login again</Link>.
            </p>
        )
    } else {
        console.log("authenticated: ", token, id, username)
        content = <Outlet />
    }

    return content
}
export default PersistLogin