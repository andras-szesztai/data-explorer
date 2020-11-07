import { AvailableQuestion } from "../types/dataSets"
import { FilterQuestion } from "../types/filters"

export const ADD_FILTER = "ADD_FILTER"
export const REMOVE_FILTER = "REMOVE_FILTER"
export const UPDATE_FILTERS = "UPDATE_FILTERS"
export const REMOVE_ALL_FILTERS = "REMOVE_ALL_FILTERS"
export const UPDATE_ALL_FILTERS = "UPDATE_ALL_FILTERS"

export const addFilter = (question: AvailableQuestion) => {
  const filterQuestion = {
    ...question,
    checkedOptions: question.options,
    date: new Date(),
  }
  return { type: ADD_FILTER, questionToAdd: filterQuestion } as const
}

export const removeFilter = (questionId: string) => {
  return { type: REMOVE_FILTER, questionToRemove: questionId } as const
}

export const updateFilters = (id: string, newCheckedOptions: string[]) => {
  return {
    type: UPDATE_FILTERS,
    questionToUpdate: { id, newCheckedOptions },
  } as const
}

export const updateAllFilters = (newFilterQuestions: FilterQuestion[]) => {
  return {
    type: UPDATE_ALL_FILTERS,
    newFilterQuestions,
  } as const
}

export const removeAllFilters = () => {
  return { type: REMOVE_ALL_FILTERS } as const
}
