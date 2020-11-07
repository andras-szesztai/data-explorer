import { AvailableQuestion } from "../types/dataSets"

export const ADD_CHART_QUESTION = "ADD_CHART_QUESTION"
export const REMOVE_CHART_QUESTION = "REMOVE_CHART_QUESTION"
export const REMOVE_ALL_CHARTS = "REMOVE_ALL_CHARTS"
export const UPDATE_ALL_CHARTS = "UPDATE_ALL_CHARTS"

export const addChartQuestion = (
  questionObj: AvailableQuestion,
  key: number
) => {
  return {
    type: ADD_CHART_QUESTION,
    questionToAdd: { questionObj, key },
  } as const
}

export const removeChartQuestion = (key: number) => {
  return { type: REMOVE_CHART_QUESTION, questionToRemove: key } as const
}

export const removeAllCharts = () => {
  return { type: REMOVE_ALL_CHARTS } as const
}

export const updateAllCharts = (newChartState: {
  [key: number]: AvailableQuestion
}) => {
  return { type: UPDATE_ALL_CHARTS, newChartState } as const
}
