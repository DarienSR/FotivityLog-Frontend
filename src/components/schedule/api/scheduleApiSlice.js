import {
  createSelector, 
  createEntityAdapter
} from "@reduxjs/toolkit"

import { apiSlice } from '../../../app/api/apiSlice'

// we can sort ordering here. Using sortComparaer: compare function
const tasksAdapter = createEntityAdapter({})
const initialState = tasksAdapter.getInitialState()

export const tasksApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getScheduledTasks: builder.query({
      query: (url) => ({ url }),
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError
      },
      transformResponse: responseData => {
        // set frontend data from backend mongodb data
        console.log('returned response', responseData);
        
        if(responseData) {
          const loadedTasks = responseData?.reverse().map(task => {
            task.id = task._id
            return task
          });
          return tasksAdapter.setAll(initialState, loadedTasks)
        }
        
      },
      providesTags: (result, error, arg) => {
        if(result?.ids) {
          return [
            { type: 'Task', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Task', id }))
          ]
        } else return [{ type: 'Task', id: 'LIST' }]
      }
    }),

    newScheduledTask: builder.mutation({
      query: taskData => ({
        url: `/schedule/tasks/${taskData.user_id}`,
        method: 'POST',
        body: {
          ...taskData,
        }
      }), // force update by invalidating user list
      invalidatesTags: [
        { type: 'Task', id: 'LIST' }
      ]
    }),

    updateScheduledTask: builder.mutation({
      query: (taskData) => ({
        url: `/schedule/tasks/${taskData.user_id}/${taskData._id}`,
        method: 'PUT',
        body: {
          ...taskData,
        }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Task', id: arg.id }
      ]
    }),

    deleteScheduledTask: builder.mutation({
      query: (taskData) => ({
        url: `/schedule/tasks/${taskData.user_id}/${taskData.id}`,
        method: 'DELETE',
        body: { ...taskData }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Task', id: arg.id }
      ]
    })

  }),
})

export const {
  useGetScheduledTasksQuery,
  useNewScheduledTaskMutation,
  useUpdateScheduledTaskMutation,
  useDeleteScheduledTaskMutation
} = tasksApiSlice


