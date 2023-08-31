import {
  createSelector, 
  createEntityAdapter
} from "@reduxjs/toolkit"

import { apiSlice } from '../../app/api/apiSlice'

// we can sort ordering here. Using sortComparaer: compare function
const projectAdapter = createEntityAdapter({

})
const initialState = projectAdapter.getInitialState()

export const projectApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProjects: builder.query({
      query: (url) => ({url}),
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError
      },
      transformResponse: responseData => {
        // set frontend data from backend mongodb data
        const loadedProject = responseData.reverse().map(project => {
          project.id = project._id
          return project
        });
        return projectAdapter.setAll(initialState, loadedProject)
      },
      providesTags: (result, error, arg) => {
        if(result?.ids) {
          return [
            { type: 'Project', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Project', id }))
          ]
        } else return [{ type: 'Project', id: 'LIST' }]
      }
    }),
   
    addNewProject: builder.mutation({
      query: projectData => ({
        url: `/projects/${projectData.user_id}`,
        method: 'POST',
        body: {
          ...projectData,
        }
      }), // force update by invalidating user list
      invalidatesTags: [
        { type: 'Project', id: 'LIST' }
      ]
    }),
    updateProject: builder.mutation({
      query: projectData => ({
        url: `/projects/${projectData.id}`,
        method: 'PUT',
        body: {
          ...projectData,
        }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Project', id: arg.id }
      ]
    }),
    deleteProject: builder.mutation({
      query: id => ({
        url: `/projects/${id}`,
        method: 'DELETE',
        body: { id }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Project', id: arg.id }
      ]
    })

  }),
})

export const {
  useGetProjectsQuery,
  useAddNewProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation
} = projectApiSlice

