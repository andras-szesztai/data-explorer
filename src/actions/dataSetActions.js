import uniq from 'lodash/uniq'
import { v4 as uuidv4 } from 'uuid'

import { getQuestionType, getStatistics } from '../utils/filterHelpers.ts'

import { QUESTION_TYPES } from '../constants/filterValues.ts'

export const INITIALIZE_AVAILABLE_DATASETS = 'INITIALIZE_AVAILABLE_DATASETS'
export const UPDATE_ACTIVE_DATASET = 'UPDATE_ACTIVE_DATASET'
export const UPDATE_FILTERED_DATASET = 'UPDATE_FILTERED_DATASET'

export const initializeAvailableDatasets = (dispatch, list) => {
  dispatch({ type: INITIALIZE_AVAILABLE_DATASETS, payload: list })
}

export const updateActiveDataSet = (dispatch, newDataSet, availableGroups) => {
  const questions = Object.keys(newDataSet[0])
  const availableQuestions = questions.map(q => {
    const options = uniq(newDataSet.map(d => d[q])).filter(Boolean)
    const questionType = getQuestionType(options.join(','))
    const group = q.substr(q.length - 2) // Change if more type comes
    const qId = uuidv4()
    return {
      id: qId,
      question: q.slice(0, q.length - 5),
      type: questionType,
      group,
      options: questionType
        ? Object.values(QUESTION_TYPES[questionType])
            .filter(t => options.includes(t))
            .reverse()
        : options.sort((a, b) => String(a).localeCompare(b))
    }
  })
  const statistics = getStatistics(availableGroups, newDataSet)
  dispatch({ type: UPDATE_ACTIVE_DATASET, payload: { newDataSet, availableQuestions, availableGroups, statistics } })
}

export const updateFilteredDataSet = (dispatch, fullDataSet, activeFilters, availableGroups) => {
  let filteredDataSet = fullDataSet
  activeFilters.forEach(filter => {
    filteredDataSet = filteredDataSet.filter(d => filter.checkedOptions.includes(String(d[`${filter.question} - ${filter.group}`])))
  })
  const newStatistics = getStatistics(availableGroups, filteredDataSet)
  dispatch({ type: UPDATE_FILTERED_DATASET, payload: { filteredDataSet, newStatistics } })
}
