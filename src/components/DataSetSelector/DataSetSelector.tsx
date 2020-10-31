import React from "react"
import { Card, Select } from "antd"

import { FilterActions } from "../../reducers/filtersReducer"

import { useFetchActiveDataSet } from "../../hooks"

interface Props {
  dataSetState: any
  updateDataSetState: React.DispatchWithoutAction
  updateFilterState: React.Dispatch<FilterActions>
}

const DataSetSelector = ({
  dataSetState,
  updateDataSetState,
  updateFilterState,
}: Props) => {
  const setActiveDataSetName = useFetchActiveDataSet(
    updateDataSetState,
    updateFilterState
  )

  return (
    <Card
      title="Survey Explorer"
      style={{
        height: "100%",
      }}
    >
      <Select
        style={{
          width: "100%",
        }}
        onChange={(value: string) => setActiveDataSetName(value)}
        loading={!dataSetState.availableDataSets.length}
        showSearch
        placeholder="Select a dataset"
      >
        {dataSetState.availableDataSets.length &&
          dataSetState.availableDataSets.map((dataSet: string) => {
            return (
              <Select.Option key={dataSet} value={dataSet}>
                {dataSet}
              </Select.Option>
            )
          })}
      </Select>
    </Card>
  )
}

export default DataSetSelector
