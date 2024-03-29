import React from "react"
import { SaveFilled } from "@ant-design/icons"
import { Button, Card, Form, Input, Modal } from "antd"
import isEqual from "lodash/isEqual"
import isEmpty from "lodash/isEmpty"

import { UserDispatchContext, UserStateContext } from "../../App"
import { FilterQuestionsState } from "../../types/filters"
import { AvailableQuestion } from "../../types/dataSets"
import { addNewView } from "../../actions/userActions"
interface Props {
  dataSetState: any
  prevDataSetState: any
  chartState: { [key: number]: AvailableQuestion }
  prevChartState?: { [key: number]: AvailableQuestion }
  filterState: FilterQuestionsState
  prevFilterState?: FilterQuestionsState
  setActiveViewName: React.Dispatch<React.SetStateAction<string>>
  activeViewName: string
}

// Can be prop later
const projectAccessor = "samenHier"

const SaveView = ({
  dataSetState,
  prevDataSetState,
  chartState,
  prevChartState,
  filterState,
  prevFilterState,
  setActiveViewName,
  activeViewName,
}: Props) => {
  const { currentUser } = React.useContext(UserStateContext)
  const updateUserState = React.useContext(UserDispatchContext)
  const [isNewView, setIsNewView] = React.useState(false)
  React.useEffect(() => {
    if (
      !isNewView &&
      !activeViewName &&
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
          !filterState.filterQuestions.length) ||
        activeViewName)
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
    activeViewName
  ])

  const [modalIsOpen, setModalIsOpen] = React.useState(false)
  const [title, setTitle] = React.useState("")
  const [titleExist, setTitleExist] = React.useState(false)

  const makeViewId = (titleString: string) =>
    `${dataSetState.activeDataSetName} - ${titleString}`

  const saveNewTitle = () => {
    updateUserState(
      addNewView({
        projectAccessor,
        filters: JSON.stringify(filterState.filterQuestions),
        charts: JSON.stringify(chartState),
        viewId: makeViewId(title),
        dataSet: dataSetState.activeDataSetName,
        title,
      })
    )
    setActiveViewName(title)
    setModalIsOpen(false)
    titleExist && setTitleExist(false)
    setTitle("")
    setIsNewView(false)
  }

  return (
    <Card
      bodyStyle={{
        height: "100%",
        padding: 12,
      }}
    >
      <Button
        block
        type="primary"
        icon={<SaveFilled />}
        disabled={!isNewView}
        onClick={() => isNewView && setModalIsOpen(true)}
      >
        Save current view
      </Button>
      <Modal
        title="Please provide a title for the new view"
        centered
        visible={modalIsOpen}
        okText="Save"
        okButtonProps={{ disabled: !title }}
        onOk={saveNewTitle}
        onCancel={() => {
          setModalIsOpen(false)
          setTitle("")
          titleExist && setTitleExist(false)
        }}
      >
        <Form.Item
          hasFeedback={titleExist}
          help={
            titleExist &&
            "Title already exist for dataset, by saving you will overwrite it"
          }
          validateStatus={titleExist ? "warning" : undefined}
        >
          <Input
            placeholder="New view title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              const isExist =
                currentUser[projectAccessor].savedViews[
                  makeViewId(e.target.value)
                ]
              if (isExist && !titleExist) setTitleExist(true)
              if (!isExist && titleExist) setTitleExist(false)
            }}
            onPressEnter={saveNewTitle}
          />
        </Form.Item>
      </Modal>
    </Card>
  )
}

export default SaveView
