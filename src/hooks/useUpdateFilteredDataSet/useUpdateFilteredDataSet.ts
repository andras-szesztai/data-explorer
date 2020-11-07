import { useEffect } from "react"
import isEqual from "lodash/isEqual"

import { updateFilteredDataSet } from "../../actions/dataSetActions"

import { FilterQuestion, FilterQuestionsState } from "../../types/filters"

interface Params {
  updateDataSetState: React.DispatchWithoutAction
  prevFilterState?: FilterQuestionsState
  filterState: FilterQuestionsState
  activeDataSet: { [questionId: string]: number }[]
  filterQuestions: FilterQuestion[]
  availableGroups: string[]
}

const useUpdateFilteredDataSet = ({
  prevFilterState,
  updateDataSetState,
  filterState,
  activeDataSet,
  filterQuestions,
  availableGroups,
}: Params) => {
  useEffect(() => {
    if (prevFilterState && !isEqual(filterState, prevFilterState)) {
      updateFilteredDataSet(
        updateDataSetState,
        activeDataSet,
        filterQuestions,
        availableGroups
      )
    }
  }, [
    filterState,
    prevFilterState,
    activeDataSet,
    filterQuestions,
    availableGroups,
    updateDataSetState,
  ])
}

export default useUpdateFilteredDataSet
