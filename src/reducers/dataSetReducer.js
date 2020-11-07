import { INITIALIZE_AVAILABLE_DATASETS, UPDATE_ACTIVE_DATASET, UPDATE_FILTERED_DATASET } from '../actions/dataSetActions'

// TODO: type it
export const initialDataSetState = {
  activeDataSetName: "",
  availableDataSets: [],
  activeDataSet: [],
  activeDataSetStatistics: [],
  filteredDataSet: [],
  filteredDataSetStatistics: [],
  availableQuestions: [],
  availableGroups: []
}

export const dataSetReducer = (state, action) => {
  const { type, payload } = action
  switch (type) {
    case INITIALIZE_AVAILABLE_DATASETS:
      return { ...state, availableDataSets: payload }
    case UPDATE_ACTIVE_DATASET:
      return {
        ...state,
        activeDataSetName: payload.activeDataSetName,
        activeDataSet: payload.newDataSet,
        activeDataSetStatistics: payload.statistics,
        filteredDataSet: payload.newDataSet,
        filteredDataSetStatistics: payload.statistics,
        availableQuestions: payload.availableQuestions,
        availableGroups: payload.availableGroups
      }
    case UPDATE_FILTERED_DATASET:
      return {
        ...state,
        filteredDataSet: payload.filteredDataSet,
        filteredDataSetStatistics: payload.newStatistics
      }
    default:
      return state
  }
}
