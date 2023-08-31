import { Outlet, Link } from "react-router-dom"
import { useEffect, useRef, useState } from 'react'
import { useRefreshMutation } from "./authApiSlice"
import usePersist from "../../hooks/usePersist"
import { useSelector } from 'react-redux'
import { selectCurrentToken } from "./authSlice"
import useAuth from '../../hooks/useAuth.js'
const PersistLogin = () => {
    const { username, email, user_id} = useAuth()
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
      

        if (effectRan.current === true || process.env.NODE_ENV !== 'development' || token) { // React 18 Strict Mode

            const verifyRefreshToken = async () => {
                try {
                    //const response = 
                    await refresh()
                    //const { accessToken } = response.data
                    setTrueSuccess(true)
                }
                catch (err) {
                    console.error(err)
                }
            }
            if (!token && persist) verifyRefreshToken()
        }

        return () => effectRan.current = true

        // eslint-disable-next-line
    }, [])

    let content

    
   if (isError) { //persist: yes, token: no
        content = (
            <p className='errmsg'>
                {error.data?.message}
                <Link to="/login">Please login again</Link>.
            </p>
        )
    } else {
        content = <Outlet />
    }

    return content
}
export default PersistLogin