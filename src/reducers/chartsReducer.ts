import { addChartQuestion, ADD_CHART_QUESTION, removeChartQuestion,REMOVE_CHART_QUESTION } from '../actions/chartsActions'

import { AvailableQuestion } from '../types/dataSets'

export const initialChartsState = { 1: {} as AvailableQuestion, 2: {} as AvailableQuestion, 3: {} as AvailableQuestion, 4: {} as AvailableQuestion, 5: {} as AvailableQuestion, 6: {} as AvailableQuestion}

export type ChartActions = ReturnType<typeof addChartQuestion | typeof removeChartQuestion>

export const chartsReducer = (state= initialChartsState, action: ChartActions) => {
  switch (action.type) {
    case ADD_CHART_QUESTION:
      return {
        ...state,
        [action.questionToAdd.key]: action.questionToAdd.questionObj
      }
      case REMOVE_CHART_QUESTION:
        return {
        ...state,
        [action.questionToRemove]: {} as AvailableQuestion
      }
    default:
      return state
  }
}
