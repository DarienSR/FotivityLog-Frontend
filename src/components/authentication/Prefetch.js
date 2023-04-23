import { store } from '../../app/store'
import { sessionsApiSlice } from '../sessions/sessionsApiSlice'
import { usersApiSlice } from '../users/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {
    useEffect(() => {
        console.log('subscribing')
        const sessions = store.dispatch(sessionsApiSlice.endpoints.getSessions.initiate())
        const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())

        return () => {
            console.log('unsubscribing')
            sessions.unsubscribe()
            users.unsubscribe()
        }
    }, [])

    return <Outlet />
}
export default Prefetch