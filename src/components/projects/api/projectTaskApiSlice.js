import {
  createSelector, 
  createEntityAdapter
} from "@reduxjs/toolkit"

import { apiSlice } from '../../../app/api/apiSlice'

// we can sort ordering here. Using sortComparaer: compare function
const tasksAdapter = createEntityAdapter({

})
const initialState = tasksAdapter.getInitialState()

export const projectTasksApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProjectTasks: builder.query({
      query: (url) => ({url}),
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError
      },
      transformResponse: responseData => {
        // set frontend data from backend mongodb data
        const loadedTasks = responseData?.reverse().map(task => {
          task.id = task._id
          return task
        });
        return tasksAdapter.setAll(initialState, loadedTasks)
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
    addNewProjectTask: builder.mutation({
      query: (taskData) => ({
        url: `/projects/${taskData.user_id}/${taskData.project_id}/tasks`,
        method: 'POST',
        body: {
          ...taskData,
        }
      }), // force update by invalidating user list
      invalidatesTags: [
        { type: 'Task', id: 'LIST' }
      ]
    }),
    updateProjectTask: builder.mutation({
      query: (taskData) => ({
        url: `/projects/${taskData.user_id}/${taskData.project_id}/tasks?_id=${taskData._id}`,
        method: 'PUT',
        body: {
          ...taskData,
        }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Task', id: arg.id }
      ]
    }),
    deleteProjectTask: builder.mutation({
      query: taskData => ({
        url: `/projects/${taskData.user_id}/${taskData.project_id}/tasks?_id=${taskData._id}`,
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
  useGetProjectTasksQuery,
  useAddNewProjectTaskMutation,
  useUpdateProjectTaskMutation,
  useDeleteProjectTaskMutation
} = projectTasksApiSlice



