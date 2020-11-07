import {
  addChartQuestion,
  ADD_CHART_QUESTION,
  removeAllCharts,
  removeChartQuestion,
  REMOVE_ALL_CHARTS,
  REMOVE_CHART_QUESTION,
  updateAllCharts,
  UPDATE_ALL_CHARTS,
} from "../actions/chartsActions"

import { AvailableQuestion } from "../types/dataSets"

export const initialChartsState = {
  1: {} as AvailableQuestion,
  2: {} as AvailableQuestion,
  3: {} as AvailableQuestion,
  4: {} as AvailableQuestion,
  5: {} as AvailableQuestion,
  6: {} as AvailableQuestion,
}

export type ChartActions = ReturnType<
  typeof addChartQuestion | typeof removeChartQuestion | typeof removeAllCharts
  | typeof updateAllCharts
>

export const chartsReducer = (
  state: {
    [key: number]: AvailableQuestion
  },
  action: ChartActions
) => {
  switch (action.type) {
    case ADD_CHART_QUESTION:
      return {
        ...state,
        [action.questionToAdd.key]: action.questionToAdd.questionObj,
      }
    case REMOVE_CHART_QUESTION:
      return {
        ...state,
        [action.questionToRemove]: {} as AvailableQuestion,
      }
    case UPDATE_ALL_CHARTS:
      return action.newChartState
    case REMOVE_ALL_CHARTS:
      return initialChartsState
    default:
      return state
  }
}
