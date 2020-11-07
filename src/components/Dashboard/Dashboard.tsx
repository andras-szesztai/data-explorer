import React from "react"
import { Card, Row, Col } from "antd"
import styled from "styled-components"
import { usePrevious } from "react-use"

import DataSetSelector from "../DataSetSelector/DataSetSelector"
import ChartCard from "../ChartCard/ChartCard"
import ViewSelector from "../ViewSelector/ViewSelector"
import SaveView from "../SaveView/SaveView"
import StatisticsContainer from "../StatisticsContainer/StatisticsContainer"
import FilterContainer from "../FilterContainer/FilterContainer"

import {
  dataSetReducer,
  initialDataSetState,
} from "../../reducers/dataSetReducer"
import {
  filtersReducer,
  initialFiltersState,
} from "../../reducers/filtersReducer"
import { chartsReducer, initialChartsState } from "../../reducers/chartsReducer"

import {
  useInitializeAvailableDataSets,
  useUpdateFilteredDataSet,
  useEmptyActiveViewName,
} from "../../hooks"

import "../../styles/App.less"

const ChartsMainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 32%);
  grid-column-gap: 2%;
  grid-template-rows: repeat(2, 1fr);
  grid-row-gap: 8px;
`

const Dashboard = () => {
  const [dataSetState, updateDataSetState] = React.useReducer(
    dataSetReducer,
    initialDataSetState
  )
  const prevDataSetState = usePrevious(dataSetState)
  const [filterState, updateFilterState] = React.useReducer(
    filtersReducer,
    initialFiltersState
  )
  const prevFilterState = usePrevious(filterState)
  const [chartState, updateChartState] = React.useReducer(
    chartsReducer,
    initialChartsState
  )
  const prevChartState = usePrevious(chartState)
  const [activeViewName, setActiveViewName] = React.useState("")
  const prevActiveViewName = usePrevious(activeViewName)

  useInitializeAvailableDataSets(
    dataSetState.availableDataSets,
    updateDataSetState
  )
  useUpdateFilteredDataSet({
    prevFilterState,
    updateDataSetState,
    filterState,
    activeDataSet: dataSetState.activeDataSet,
    filterQuestions: filterState.filterQuestions,
    availableGroups: dataSetState.availableGroups,
  })
  useEmptyActiveViewName({
    activeViewName,
    setActiveViewName,
    prevActiveViewName,
    prevChartState,
    chartState,
  })

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <DataSetSelector
            dataSetState={dataSetState}
            updateDataSetState={updateDataSetState}
            updateFilterState={updateFilterState}
            updateChartState={updateChartState}
          />
        </Col>
        <Col span={18}>
          <StatisticsContainer
            activeDataSetStatistics={dataSetState.activeDataSetStatistics}
            filteredDataSetStatistics={dataSetState.filteredDataSetStatistics}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <FilterContainer
            availableQuestions={dataSetState.availableQuestions}
            filterQuestions={filterState.filterQuestions}
            updateFilterState={updateFilterState}
            availableGroups={dataSetState.availableGroups}
          />
        </Col>
        <Col span={18}>
          <Card
            style={{
              height: "100%",
            }}
            bodyStyle={{
              height: "100%",
            }}
          >
            <ChartsMainContainer>
              {Object.values(chartState).map((chart, i: number) => {
                return (
                  <ChartCard
                    key={i}
                    chartKey={i + 1}
                    chart={chart}
                    dataSetState={dataSetState}
                    chartState={chartState}
                    updateChartState={updateChartState}
                  />
                )
              })}
            </ChartsMainContainer>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <SaveView
            dataSetState={dataSetState}
            prevDataSetState={prevDataSetState}
            chartState={chartState}
            prevChartState={prevChartState}
            filterState={filterState}
            prevFilterState={prevFilterState}
            setActiveViewName={setActiveViewName}
            activeViewName={activeViewName}
          />
        </Col>
        <Col span={18}>
          <ViewSelector
            setActiveViewName={setActiveViewName}
            activeViewName={activeViewName}
            prevActiveViewName={prevActiveViewName}
            activeDataSetName={dataSetState.activeDataSetName}
            prevActiveDataSetName={prevDataSetState?.activeDataSetName}
            updateFilterState={updateFilterState}
            updateChartState={updateChartState}
          />
        </Col>
      </Row>
    </>
  )
}

export default Dashboard
