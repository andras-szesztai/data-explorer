import React from "react"
import {
  Select,
  Space,
  Card,
  Collapse,
  Badge,
  Tooltip,
  Row,
  Col,
  Statistic,
  Button,
} from "antd"
import { SaveFilled } from "@ant-design/icons"
import styled from "styled-components"
import { useMeasure, usePrevious } from "react-use"
import isEqual from "lodash/isEqual"
import isEmpty from "lodash/isEmpty"
import numeral from "numeral"

import FilterCheckBoxGroup from "../../components/FilterCheckBoxGroup/FilterCheckBoxGroup"
import DataSetSelector from "../../components/DataSetSelector/DataSetSelector"
import ChartCard from "../../components/ChartCard/ChartCard"

import { addFilter } from "../../actions/filtersActions"
import { updateFilteredDataSet } from "../../actions/dataSetActions"
import {
  dataSetReducer,
  initialDataSetState,
} from "../../reducers/dataSetReducer"
import {
  filtersReducer,
  initialFiltersState,
} from "../../reducers/filtersReducer"
import { chartsReducer, initialChartsState } from "../../reducers/chartsReducer"

import { useInitializeAvailableDataSets } from "../../hooks"
import { COLORS } from "../../constants/colors"
import { CHART_AREA_HEIGHT } from "../../constants/dimensions"
import { AvailableQuestion } from "../../types/dataSets"

import "../../styles/App.less"

const ChartsMainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 33.33%);
  grid-column-gap: 8px;
  grid-template-rows: repeat(2, 1fr);
  grid-row-gap: 8px;
`

// TODO: chop it up
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

  const [isNewView, setIsNewView] = React.useState(false)
  React.useEffect(() => {
    if (
      !isNewView &&
      prevDataSetState &&
      dataSetState.activeDataSetName === prevDataSetState.activeDataSetName &&
      (!!Object.values(chartState).find((d) => !isEmpty(d)) ||
        filterState.filterQuestions.length) &&
      ((prevChartState && !isEqual(chartState, prevChartState)) ||
        (prevFilterState && !isEqual(filterState, prevFilterState)))
    ) {
      setIsNewView(true)
    }
    if (
      isNewView &&
      ((prevDataSetState &&
        dataSetState.activeDataSetName !==
          prevDataSetState.activeDataSetName) ||
        (!Object.values(chartState).find((d) => !isEmpty(d)) &&
          !filterState.filterQuestions.length))
    ) {
      setIsNewView(false)
    }
  }, [
    chartState,
    prevChartState,
    filterState,
    prevFilterState,
    isNewView,
    dataSetState,
    prevDataSetState,
  ])

  const [questionSearchRef, { height: questionSearchRefHeight }] = useMeasure<
    HTMLDivElement
  >()

  useInitializeAvailableDataSets(
    dataSetState.availableDataSets,
    updateDataSetState
  )

  React.useEffect(() => {
    if (prevFilterState && !isEqual(filterState, prevFilterState)) {
      updateFilteredDataSet(
        updateDataSetState,
        dataSetState.activeDataSet,
        filterState.filterQuestions,
        dataSetState.availableGroups
      )
    }
  }, [filterState, prevFilterState, dataSetState])
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
          <Card
            style={{
              height: "100%",
              paddingTop: 12,
            }}
          >
            <Row gutter={8}>
              <Col span={1} />
              {!!dataSetState.activeDataSetStatistics.length &&
                dataSetState.activeDataSetStatistics.map(
                  (type: { label: string; value: number }, i: number) => {
                    const filtered = dataSetState.filteredDataSetStatistics[i]
                    const percentage = filtered.value / type.value
                    return (
                      <React.Fragment key={type.label}>
                        <Col span={5}>
                          <Statistic
                            title={`${type.label} Total`}
                            value={type.value}
                          />
                        </Col>
                        <Col span={5}>
                          <Statistic
                            title="Filtered"
                            value={`${filtered.value} (${numeral(
                              percentage
                            ).format(
                              percentage === 1
                                ? "0%"
                                : percentage < 0.1
                                ? "0.00%"
                                : "0.0%"
                            )})`}
                          />
                        </Col>
                        {i === 0 && <Col span={2} />}
                      </React.Fragment>
                    )
                  }
                )}
              <Col span={1} />
            </Row>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card
            style={{
              height: CHART_AREA_HEIGHT,
            }}
          >
            <div ref={questionSearchRef}>
              <Space
                direction="vertical"
                style={{
                  width: "100%",
                  marginBottom: 8,
                }}
              >
                <Select
                  onChange={(value) => {
                    const selectedQuestion = dataSetState.availableQuestions.find(
                      (q: AvailableQuestion) => q.question === value
                    )
                    updateFilterState(addFilter(selectedQuestion))
                  }}
                  disabled={!dataSetState.availableQuestions.length}
                  style={{ width: "100%" }}
                  showSearch
                  showArrow={false}
                  placeholder={
                    !dataSetState.availableQuestions.length
                      ? "Select a dataset to start"
                      : "Add a question as filter"
                  }
                  value={filterState.filterQuestions.length ? "" : undefined}
                >
                  {dataSetState.availableGroups.map((group: string) => {
                    // TODO: make component
                    return (
                      <Select.OptGroup label={group} key={`${group}-chart-q`}>
                        {dataSetState.availableQuestions
                          .filter(
                            (question: AvailableQuestion) =>
                              question.group === group
                          )
                          .filter((question: AvailableQuestion) =>
                            filterState.filterQuestions.length
                              ? !filterState.filterQuestions.find(
                                  (q) => q.id === question.id
                                )
                              : true
                          )
                          .sort((a: AvailableQuestion, b: AvailableQuestion) =>
                            a.question.localeCompare(b.question)
                          )
                          .map((question: AvailableQuestion) => {
                            return (
                              <Select.Option
                                key={question.id}
                                value={question.question}
                              >
                                {question.question}
                              </Select.Option>
                            )
                          })}
                      </Select.OptGroup>
                    )
                  })}
                </Select>
              </Space>
            </div>
            {!!filterState.filterQuestions.length && (
              <Collapse
                style={{
                  maxHeight: CHART_AREA_HEIGHT - questionSearchRefHeight - 48,
                  overflowY: "scroll",
                  overflowX: "hidden",
                  marginBottom: 8,
                }}
              >
                {filterState.filterQuestions.map((question) => {
                  return (
                    <Collapse.Panel
                      key={question.id}
                      header={
                        <>
                          <Badge
                            count={question.group}
                            style={{ backgroundColor: COLORS.primaryBlue }}
                          />{" "}
                          {question.question}{" "}
                          {question.options.length !==
                            question.checkedOptions.length && (
                            <Tooltip
                              placement="topLeft"
                              title="This question is actively filtering the dataset"
                            >
                              <Badge
                                count="Active"
                                style={{
                                  backgroundColor: COLORS.secondaryOrange,
                                }}
                              />
                            </Tooltip>
                          )}
                        </>
                      }
                    >
                      <FilterCheckBoxGroup
                        updateFilterState={updateFilterState}
                        question={question}
                      />
                    </Collapse.Panel>
                  )
                })}
              </Collapse>
            )}
          </Card>
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
          <Button
            block
            type="primary"
            icon={<SaveFilled />}
            disabled={!isNewView}
          >
            Save current view
          </Button>
        </Col>
      </Row>
    </>
  )
}

export default Dashboard
