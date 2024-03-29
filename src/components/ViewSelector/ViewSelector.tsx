import React from "react"
import { Button, Card } from "antd"
import styled from "styled-components"
import { EyeFilled } from "@ant-design/icons"

import ViewSelectorModal from "../ViewSelectorModal/ViewSelectorModal"

import { UserDispatchContext, UserStateContext } from "../../App"
import { updateAllFilters } from "../../actions/filtersActions"
import { updateViewLastActive } from "../../actions/userActions"
import { updateAllCharts } from "../../actions/chartsActions"
import { FilterActions } from "../../reducers/filtersReducer"
import { ChartActions } from "../../reducers/chartsReducer"

import { SavedViewObject } from "../../types/user"

const MainContainer = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 32%);
  grid-column-gap: 2%;
`

const ElementContainer = styled.div`
  display: flex;
  justify-content: ${(props: { justify?: string }) =>
    props.justify || "center"};
  align-items: center;
`

interface Props {
  setActiveViewName: React.Dispatch<React.SetStateAction<string>>
  activeViewName: string
  prevActiveViewName?: string
  activeDataSetName: string
  prevActiveDataSetName?: string
  updateFilterState: React.Dispatch<FilterActions>
  updateChartState: React.Dispatch<ChartActions>
}

const projectAccessor = "samenHier"

const ViewSelector = ({
  setActiveViewName,
  activeViewName,
  activeDataSetName,
  prevActiveDataSetName,
  updateFilterState,
  prevActiveViewName,
  updateChartState,
}: Props) => {
  const { currentUser } = React.useContext(UserStateContext)
  const updateUserState = React.useContext(UserDispatchContext)

  const [dataSetViews, setDataSetViews] = React.useState([] as string[])
  const [currentQuickSelector, setCurrentQuickSelector] = React.useState("")
  React.useEffect(() => {
    if (
      activeViewName
        ? dataSetViews.filter((d) => d !== activeViewName)
        : dataSetViews.length
    ) {
      const newValue = activeViewName
        ? dataSetViews.find((d) => d !== activeViewName)
        : dataSetViews[0]
      setCurrentQuickSelector(newValue || dataSetViews[0])
    }
    if (!dataSetViews.length && currentQuickSelector) {
      setCurrentQuickSelector("")
    }
  }, [dataSetViews, activeViewName, currentQuickSelector])

  const [viewListUpdateShouldRun, setViewListUpdateShouldRun] = React.useState(
    false
  )
  React.useEffect(() => {
    if (
      (activeDataSetName && activeDataSetName !== prevActiveDataSetName) ||
      (activeViewName && activeViewName !== prevActiveViewName) ||
      viewListUpdateShouldRun
    ) {
      const allViews = Object.values(currentUser[projectAccessor].savedViews)
      const dataSetFilteredViews = allViews.filter(
        (v) => v && v.dataSet === activeDataSetName
      )
      const lastActiveSorted = dataSetFilteredViews.length
        ? dataSetFilteredViews
            .sort((a: any, b: any) => {
              let aValue =
                a.lastActive instanceof Date
                  ? a.lastActive
                  : a.lastActive.toDate()
              let bValue =
                b.lastActive instanceof Date
                  ? b.lastActive
                  : b.lastActive.toDate()
              return bValue - aValue
            })
            .map((v: SavedViewObject) => v.title)
        : []
      setDataSetViews(lastActiveSorted)
      viewListUpdateShouldRun && setViewListUpdateShouldRun(false)
    }
    if (prevActiveDataSetName && !activeDataSetName) {
      setDataSetViews([])
    }
  }, [
    activeDataSetName,
    prevActiveDataSetName,
    currentUser,
    activeViewName,
    prevActiveViewName,
    viewListUpdateShouldRun,
  ])

  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const updateSelectedView = (value?: string) => {
    if (value) {
      const view =
        currentUser[projectAccessor].savedViews[
          `${activeDataSetName} - ${value}`
        ]
      const viewFilters = JSON.parse(view.filters)
      const viewCharts = JSON.parse(view.charts)
      updateFilterState(updateAllFilters(viewFilters))
      updateChartState(updateAllCharts(viewCharts))
      setActiveViewName(value)
      updateUserState(
        updateViewLastActive(`${activeDataSetName} - ${value}`, projectAccessor)
      )
    }
  }

  return (
    <Card
      style={{
        height: "100%",
      }}
      bodyStyle={{
        height: "100%",
        padding: "12px 24px",
      }}
    >
      <MainContainer>
        <ElementContainer>
          Your most recently active saved view:
        </ElementContainer>
        <ElementContainer justify={!!dataSetViews.length ? "flex-start" : ""}>
          {!!currentQuickSelector ? (
            <Button
              icon={<EyeFilled />}
              onClick={() => {
                updateSelectedView(currentQuickSelector)
              }}
            >
              {currentQuickSelector}
            </Button>
          ) : !activeDataSetName ? (
            "Select a dataset or saved view first"
          ) : (
            "You haven't yet saved views for this dataset"
          )}
        </ElementContainer>
        <ElementContainer>
          <Button
            type="primary"
            block
            icon={<EyeFilled />}
            disabled={!dataSetViews.length}
            onClick={() => !!dataSetViews.length && setIsModalOpen(true)}
          >
            Show all saved views
          </Button>
        </ElementContainer>
        <ViewSelectorModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          dataSetViews={dataSetViews}
          updateSelectedView={updateSelectedView}
          activeDataSetName={activeDataSetName}
          projectAccessor={projectAccessor}
          activeViewName={activeViewName}
          setActiveViewName={setActiveViewName}
          setViewListUpdateShouldRun={setViewListUpdateShouldRun}
        />
      </MainContainer>
    </Card>
  )
}

export default ViewSelector
