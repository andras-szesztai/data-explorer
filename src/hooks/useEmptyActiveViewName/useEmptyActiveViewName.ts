import { useEffect } from "react"
import { isEqual } from "lodash"

import { AvailableQuestion } from "../../types/dataSets"

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
}

const useEmptyActiveViewName = ({
  activeViewName,
  setActiveViewName,
  prevActiveViewName,
  prevChartState,
  chartState,
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
    if (activeViewName && activeViewName === prevActiveViewName) {
      setActiveViewName("")
    }
  }, [
    chartState,
    prevChartState,
    activeViewName,
    prevActiveViewName,
    setActiveViewName,
  ])
}

export default useEmptyActiveViewName
