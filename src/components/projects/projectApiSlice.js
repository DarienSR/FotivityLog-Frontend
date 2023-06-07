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
    getAllProjects: builder.query({
      query: (user_id) => ({url: `/projects/${user_id}`}),
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
    getProjectById: builder.query({
      query: (id) => ({url: `/projects/project/${id}`}),
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError
      },
      transformResponse: responseData => {
        // set frontend data from backend mongodb data
        const loadedProject = responseData.map(project => {
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
        url: `/projects/project/${projectData.id}`,
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
        url: `/projects/project/${id}`,
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
  useGetAllProjectsQuery,
  useGetProjectByIdQuery,
  useCheckForActiveProjectQuery,
  useAddNewProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation
} = projectApiSlice

// returns the query result object
export const selectProjectResult = projectApiSlice.endpoints.getProjectById.select()

// creates memoized selector
const selectProjectData = createSelector(
  selectProjectResult,
  projectResult => projectResult.data // normalizewd state object wiht ids and entities
)
// selectAll, selectById, etc. are created automatically, we are renaming them 
export const {
  selectAll: selectAllProject,
  selectById: selectProjectById,
  selectIds: selectProjectIds
} = projectAdapter.getSelectors(state => selectProjectData(state) ?? initialState) // if null, go to initialState

