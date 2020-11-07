import React from "react"
import { Button, Card, Select, Tooltip } from "antd"
import styled from "styled-components"
import { FileExcelFilled } from "@ant-design/icons"

import { FilterActions } from "../../reducers/filtersReducer"
import { ChartActions } from "../../reducers/chartsReducer"

import { useFetchActiveDataSet } from "../../hooks"
import { exportToExcel } from "../../utils/dataHelpers"

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

interface Props {
  dataSetState: any
  updateDataSetState: React.DispatchWithoutAction
  updateFilterState: React.Dispatch<FilterActions>
  updateChartState: React.Dispatch<ChartActions>
}

const DataSetSelector = ({
  dataSetState,
  updateDataSetState,
  updateFilterState,
  updateChartState,
}: Props) => {
  const setActiveDataSetName = useFetchActiveDataSet(
    updateDataSetState,
    updateFilterState,
    updateChartState
  )

  const currentExcel = dataSetState.activeDataSet
  const filteredCurrentExcel = dataSetState.filteredDataSet

  return (
    <Card
      title={
        <TitleContainer>
          <span>Data Explorer</span>
          <div>
            <Tooltip
              placement="bottomLeft"
              title="Download unfiltered dataset"
              arrowPointAtCenter
            >
              <Button
                onClick={() => {
                  exportToExcel(currentExcel, dataSetState.activeDataSetName)
                }}
                disabled={!currentExcel.length}
                type="primary"
                size="small"
                icon={<FileExcelFilled />}
                style={{
                  marginRight: 8,
                }}
              />
            </Tooltip>
            <Tooltip
              placement="bottomLeft"
              title="Download filtered dataset"
              arrowPointAtCenter
            >
              <Button
                onClick={() => {
                  exportToExcel(
                    filteredCurrentExcel,
                    dataSetState.activeDataSetName
                  )
                }}
                disabled={
                  !filteredCurrentExcel.length ||
                  currentExcel.length === filteredCurrentExcel.length
                }
                size="small"
                icon={<FileExcelFilled />}
              />
            </Tooltip>
          </div>
        </TitleContainer>
      }
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
