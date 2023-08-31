import { store } from '../../app/store'
import { sessionsApiSlice } from '../sessions/api/sessionsApiSlice'
import { usersApiSlice } from '../users/api/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {
    useEffect(() => {
        const sessions = store.dispatch(sessionsApiSlice.endpoints.getSessions.initiate())
        const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())

        return () => {
            sessions.unsubscribe()
            users.unsubscribe()
        }
    }, [])

    return <Outlet />
}
export default Prefetch