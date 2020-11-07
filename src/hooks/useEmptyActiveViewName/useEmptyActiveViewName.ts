import { useEffect } from "react"
import { isEqual } from "lodash"

import { AvailableQuestion } from "../../types/dataSets"
import { FilterQuestionsState } from "../../types/filters"

interface Params {
  activeViewName: string
  prevActiveViewName?: string
  setActiveViewName: React.Dispatch<React.SetStateAction<string>>
  prevChartState?: {
    [key: number]: AvailableQuestion
  }
  chartState: {
    [key: number]: AvailableQuestion
  }
  filterState: FilterQuestionsState
  prevFilterState?: FilterQuestionsState
}

const useEmptyActiveViewName = ({
  activeViewName,
  setActiveViewName,
  prevActiveViewName,
  prevChartState,
  chartState,
  prevFilterState,
  filterState,
}: Params) => {
  useEffect(() => {
    if (
      activeViewName &&
      activeViewName === prevActiveViewName &&
      prevChartState &&
      !isEqual(chartState, prevChartState)
    ) {
      setActiveViewName("")
    }
    if (
      activeViewName &&
      activeViewName === prevActiveViewName &&
      prevFilterState &&
      !isEqual(filterState, prevFilterState)
    ) {
      setActiveViewName("")
    }
  }, [
    chartState,
    prevChartState,
    activeViewName,
    prevActiveViewName,
    setActiveViewName,
    filterState,
    prevFilterState,
  ])
}

export default useEmptyActiveViewName
