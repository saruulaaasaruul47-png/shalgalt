import { useCallback, useReducer } from 'react'
import { apiRequest } from '../services/apiClient'

const initialState = {
  courses: [],
  loading: false,
  error: '',
}

function courseReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: '' }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, courses: action.payload }
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'ADD_COURSE':
      return { ...state, courses: [action.payload, ...state.courses] }
    case 'UPDATE_COURSE':
      return {
        ...state,
        courses: state.courses.map((course) => (course.id === action.payload.id ? action.payload : course)),
      }
    case 'DELETE_COURSE':
      return {
        ...state,
        courses: state.courses.filter((course) => course.id !== action.payload),
      }
    default:
      return state
  }
}

export function useCourses() {
  const [state, dispatch] = useReducer(courseReducer, initialState)

  const fetchCourses = useCallback(async () => {
    dispatch({ type: 'FETCH_START' })
    try {
      const data = await apiRequest('/courses')
      dispatch({ type: 'FETCH_SUCCESS', payload: data })
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message || 'Хичээл татахад алдаа гарлаа.' })
    }
  }, [])

  const createCourse = useCallback(async (coursePayload) => {
    const created = await apiRequest('/courses', {
      method: 'POST',
      body: JSON.stringify(coursePayload),
    })
    dispatch({ type: 'ADD_COURSE', payload: created })
    return created
  }, [])

  const updateCourse = useCallback(async (id, payload) => {
    const updated = await apiRequest(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
    dispatch({ type: 'UPDATE_COURSE', payload: updated })
    return updated
  }, [])

  const deleteCourse = useCallback(async (id) => {
    await apiRequest(`/courses/${id}`, { method: 'DELETE' })
    dispatch({ type: 'DELETE_COURSE', payload: id })
  }, [])

  return {
    ...state,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
  }
}
