import React from "react"
import { SaveFilled } from "@ant-design/icons"
import { Button, Form, Input, Modal } from "antd"
import isEqual from "lodash/isEqual"
import isEmpty from "lodash/isEmpty"

import { UserDispatchContext, UserStateContext } from "../../App"
import { FilterQuestionsState } from "../../types/filters"
import { AvailableQuestion } from "../../types/dataSets"

interface Props {
  dataSetState: any
  prevDataSetState: any
  chartState: { [key: number]: AvailableQuestion }
  prevChartState?: { [key: number]: AvailableQuestion }
  filterState: FilterQuestionsState
  prevFilterState?: FilterQuestionsState
}

const SaveView = ({
  dataSetState,
  prevDataSetState,
  chartState,
  prevChartState,
  filterState,
  prevFilterState,
}: Props) => {
  const { currentUser } = React.useContext(UserStateContext)
  const updateUserState = React.useContext(UserDispatchContext)

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

  const [modalIsOpen, setModalIsOpen] = React.useState(false)
  const [title, setTitle] = React.useState("")
  const [titleExist, setTitleExist] = React.useState(false)

  return (
    <>
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
        onOk={() => {
          setModalIsOpen(false)
        }}
        onCancel={() => setModalIsOpen(false)}
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
                currentUser.samenHier.savedViews[
                  `${dataSetState.activeDataSetName} - ${e.target.value}`
                ]
              if (isExist) {
                setTitleExist(true)
              }
            }}
            onPressEnter={() => console.log(title)}
          />
        </Form.Item>
      </Modal>
    </>
  )
}

export default SaveView
