import sortBy from "lodash/sortBy"

import {
  ADD_FILTER,
  REMOVE_FILTER,
  addFilter,
  removeFilter,
  updateFilters,
  removeAllFilters,
  UPDATE_FILTERS,
  REMOVE_ALL_FILTERS,
  UPDATE_ALL_FILTERS,
  updateAllFilters,
} from "../actions/filtersActions"

import { FilterQuestion, FilterQuestionsState } from "../types/filters"

export const initialFiltersState = { filterQuestions: [] as FilterQuestion[] }

export type FilterActions = ReturnType<
  | typeof addFilter
  | typeof removeFilter
  | typeof updateFilters
  | typeof removeAllFilters
  | typeof updateAllFilters
>

export const filtersReducer = (
  state: FilterQuestionsState,
  action: FilterActions
) => {
  switch (action.type) {
    case ADD_FILTER:
      return {
        ...state,
        filterQuestions: sortBy(
          [...state.filterQuestions, action.questionToAdd],
          "date"
        ),
      }
    case REMOVE_FILTER:
      return {
        ...state,
        filterQuestions: state.filterQuestions.filter(
          (q) => q.id !== action.questionToRemove
        ),
      }
    case UPDATE_FILTERS: {
      const questionToUpdate = state.filterQuestions.find(
        (q) => q.id === action.questionToUpdate.id
      )
      let updatedQuestion
      if (questionToUpdate) {
        updatedQuestion = {
          ...questionToUpdate,
          checkedOptions: action.questionToUpdate.newCheckedOptions,
        }
      }
      const newFilterQuestions = state.filterQuestions.filter(
        (q) => q.id !== action.questionToUpdate.id
      )
      return {
        ...state,
        filterQuestions: sortBy(
          questionToUpdate && updatedQuestion
            ? [...newFilterQuestions, updatedQuestion]
            : state.filterQuestions,
          "date"
        ),
      }
    }
    case UPDATE_ALL_FILTERS:
      return {
        ...state,
        filterQuestions: action.newFilterQuestions,
      }
    case REMOVE_ALL_FILTERS: {
      return initialFiltersState
    }
    default:
      return state
  }
}
