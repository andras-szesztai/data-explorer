import { addFilter } from '../actions/filtersActions'
import { ChartValueObject } from '../types/charts'

interface FullChartObject {
  question: string
  values: ChartValueObject[]
}

interface State {
  [key: number]: FullChartObject
}

export const initialChartsState = { 1: {
  question: "",
  values: [] as ChartValueObject[]
}, 2: {
  question: "",
  values: [] as ChartValueObject[]
}, 3: {
  question: "",
  values: [] as ChartValueObject[]
}, 4: {
  question: "",
  values: [] as ChartValueObject[]
}, 5: {
  question: "",
  values: [] as ChartValueObject[]
}, 6: {
  question: "",
  values: [] as ChartValueObject[]
}}

export type ChartActions = ReturnType<typeof addFilter>

export const chartsReducer = (state: State, action: ChartActions) => {
  switch (action.type) {
    default:
      return state
  }
}
