import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../components/authentication/authSlice'
const baseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token

        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    // reach out to the server
    let result = await baseQuery(args, api, extraOptions)
    // check for auth
    // If you want, handle other status codes, too
    if (result?.error?.status === 403) {
        console.log('sending refresh token')

        // send refresh token to get new access token 
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

        if (refreshResult?.data) {
            // store the new token 
            api.dispatch(setCredentials({ ...refreshResult.data }))

            // retry original query with new access token
            result = await baseQuery(args, api, extraOptions)
        } else {

            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = "Your login has expired. "
            }
            return refreshResult
        }
    } 
    return result
}


export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Session', 'User'],
  endpoints: builder => ({})
})