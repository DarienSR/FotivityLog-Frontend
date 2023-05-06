import {
  createSelector, 
  createEntityAdapter
} from "@reduxjs/toolkit"

import { apiSlice } from '../../app/api/apiSlice'

// we can sort ordering here. Using sortComparaer: compare function
const tasksAdapter = createEntityAdapter({

})
const initialState = tasksAdapter.getInitialState()

export const tasksApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getScheduledTasks: builder.query({
      query: (user_id) => ({url: `/tasks/${user_id}/schedule`}),
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError
      },
      transformResponse: responseData => {
        // set frontend data from backend mongodb data
        const loadedTasks = responseData.reverse().map(task => {
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
    getProjectTasks: builder.query({
      query: (user_id, id) => ({url: `/tasks/${user_id}/project/${id}`}),
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError
      },
      transformResponse: responseData => {
        // set frontend data from backend mongodb data
        const loadedTasks = responseData.reverse().map(task => {
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
    getTasksById: builder.query({
      query: (user_id, id) => ({url: `/tasks/${user_id}/${id}`}),
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError
      },
      transformResponse: responseData => {
        // set frontend data from backend mongodb data
        const loadedTasks = responseData.map(task => {
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
    addNewTask: builder.mutation({
      query: taskData => ({
        url: `/tasks/${taskData.user_id}`,
        method: 'POST',
        body: {
          ...taskData,
        }
      }), // force update by invalidating user list
      invalidatesTags: [
        { type: 'Task', id: 'LIST' }
      ]
    }),
    updateTask: builder.mutation({
      query: taskData => ({
        url: `/tasks/${taskData.user_id}/${taskData.id}`,
        method: 'PUT',
        body: {
          ...taskData,
        }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Task', id: arg.id }
      ]
    }),
    deleteTask: builder.mutation({
      query: taskData => ({
        url: `/tasks/${taskData.user_id}/${taskData.id}`,
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
  useGetProjectTasksQuery,
  useGetTasksByIdQuery,
  useAddNewTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation
} = tasksApiSlice

// returns the query result object
export const selectTasksResult = tasksApiSlice.endpoints.getTasksById.select()

// creates memoized selector
const selectTasksData = createSelector(
  selectTasksResult,
  tasksResult => tasksResult.data // normalizewd state object wiht ids and entities
)
// selectAll, selectById, etc. are created automatically, we are renaming them 
export const {
  selectAll: selectAllTasks,
  selectById: selectTaskById,
  selectIds: selectTaskIds
} = tasksAdapter.getSelectors(state => selectTasksData(state) ?? initialState) // if null, go to initialState

