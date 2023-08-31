import {
  createSelector, 
  createEntityAdapter
} from "@reduxjs/toolkit"

import { apiSlice } from '../../../app/api/apiSlice'

// we can sort ordering here. Using sortComparaer: compare function
const sessionsAdapter = createEntityAdapter({

})
const initialState = sessionsAdapter.getInitialState()

export const sessionsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getSessions: builder.query({
      query: (id) => ({url: `/sessions/${id}`}),
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError
      },
      transformResponse: responseData => {
        // set frontend data from backend mongodb data
        const loadedSessions = responseData.reverse().map(session => {
          session.id = session._id
          return session
        });
        return sessionsAdapter.setAll(initialState, loadedSessions)
      },
      providesTags: (result, error, arg) => {
        if(result?.ids) {
          return [
            { type: 'Session', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Session', id }))
          ]
        } else return [{ type: 'Session', id: 'LIST' }]
      }
    }),
    getSessionsById: builder.query({
      query: (id) => ({url: `/sessions/unique/${id}`}),
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError
      },
      transformResponse: responseData => {
        // set frontend data from backend mongodb data
        const loadedSessions = responseData.map(session => {
          session.id = session._id
          return session
        });
        return sessionsAdapter.setAll(initialState, loadedSessions)
      },
      providesTags: (result, error, arg) => {
        if(result?.ids) {
          return [
            { type: 'Session', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Session', id }))
          ]
        } else return [{ type: 'Session', id: 'LIST' }]
      }
    }),
    checkForActiveSession: builder.query({
      query: (id) => ({url: `/sessions/active/${id}`}),
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError
      },
      transformResponse: responseData => {
        // set frontend data from backend mongodb data
        const loadedSessions = responseData.map(session => {
          session.id = session._id
          return session
        });
        return sessionsAdapter.setAll(initialState, loadedSessions)
      },
      providesTags: (result, error, arg) => {
        if(result?.ids) {
          return [
            { type: 'Session', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Session', id }))
          ]
        } else return [{ type: 'Session', id: 'LIST' }]
      }
    }),
    addNewSession: builder.mutation({
      query: sessionData => ({
        url: `/sessions/${sessionData.userID}`,
        method: 'POST',
        body: {
          ...sessionData,
        }
      }), // force update by invalidating user list
      invalidatesTags: [
        { type: 'Session', id: 'LIST' }
      ]
    }),
    updateSession: builder.mutation({
      query: sessionData => ({
        url: `/sessions/${sessionData.userID}`,
        method: 'PUT',
        body: {
          ...sessionData,
        }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Session', id: arg.id }
      ]
    }),
    deleteSession: builder.mutation({
      query: id => ({
        url: `/sessions/${id}`,
        method: 'DELETE',
        body: { id }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Session', id: arg.id }
      ]
    })

  }),
})

export const {
  useGetSessionsQuery,
  useGetSessionsByIdQuery,
  useCheckForActiveSessionQuery,
  useAddNewSessionMutation,
  useUpdateSessionMutation,
  useDeleteSessionMutation
} = sessionsApiSlice

// returns the query result object
export const selectSessionsResult = sessionsApiSlice.endpoints.getSessionsById.select()

// creates memoized selector
const selectSessionsData = createSelector(
  selectSessionsResult,
  sessionsResult => sessionsResult.data // normalizewd state object wiht ids and entities
)
// selectAll, selectById, etc. are created automatically, we are renaming them 
export const {
  selectAll: selectAllSessions,
  selectById: selectSessionById,
  selectIds: selectSessionIds
} = sessionsAdapter.getSelectors(state => selectSessionsData(state) ?? initialState) // if null, go to initialState

