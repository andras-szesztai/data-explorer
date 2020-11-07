import React from "react"
import { Button, Modal, Popconfirm, Select, Space } from "antd"
import styled from "styled-components"
import { DeleteFilled } from "@ant-design/icons"

import { UserDispatchContext } from "../../App"
import { deleteView } from "../../actions/userActions"

import { COLORS } from "../../constants/colors"

interface Props {
  isModalOpen: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  dataSetViews: string[]
  updateSelectedView: (value?: string) => void
  activeDataSetName: string
  projectAccessor: string
  activeViewName: string
  setActiveViewName: React.Dispatch<React.SetStateAction<string>>
  setViewListUpdateShouldRun: React.Dispatch<React.SetStateAction<boolean>>
}

const SelectedContainer = styled.div`
  padding: 0 12px;
  display: grid;
  align-items: center;
  grid-template-columns: repeat(3, max-content);
  grid-column-gap: 12px;
`

const ViewSelectorModal = ({
  isModalOpen,
  setIsModalOpen,
  dataSetViews,
  updateSelectedView,
  activeDataSetName,
  projectAccessor,
  activeViewName,
  setActiveViewName,
  setViewListUpdateShouldRun,
}: Props) => {
  const updateUserState = React.useContext(UserDispatchContext)
  const [selectedView, setSelectedView] = React.useState("")
  return (
    <Modal
      title="Your saved views for this dataset:"
      centered
      visible={isModalOpen}
      okText={
        selectedView
          ? `Populate dashboard with ${selectedView} view`
          : "Select a saved view"
      }
      okButtonProps={{ disabled: !selectedView }}
      onOk={() => {
        updateSelectedView(selectedView)
        setIsModalOpen(false)
        setSelectedView("")
      }}
      onCancel={() => {
        setIsModalOpen(false)
        setSelectedView("")
      }}
    >
      <Space
        direction="vertical"
        size="middle"
        style={{
          width: "100%",
        }}
      >
        <Select
          style={{
            width: "100%",
          }}
          onChange={(value: string) => setSelectedView(value)}
          showSearch
          placeholder="Select a view"
          disabled={!dataSetViews.length}
        >
          {dataSetViews.map((view) => {
            return (
              <Select.Option key={view} value={view}>
                {view}
              </Select.Option>
            )
          })}
        </Select>
        {!!selectedView && (
          <SelectedContainer>
            <span>{selectedView}</span>
            <Popconfirm
              title="Are you sure you want to delete this saved view?"
              onConfirm={() => {
                updateUserState(
                  deleteView(
                    `${activeDataSetName} - ${selectedView}`,
                    projectAccessor
                  )
                )
                if (activeViewName === selectedView) {
                  setActiveViewName("")
                }
                setSelectedView("")
                setViewListUpdateShouldRun(true)
              }}
              okText="Yes"
              cancelText="No"
              okButtonProps={{
                style: {
                  background: COLORS.secondaryOrange,
                  borderColor: COLORS.secondaryOrange,
                },
              }}
            >
              <Button
                icon={<DeleteFilled />}
                style={{
                  background: COLORS.secondaryOrange,
                  borderColor: COLORS.secondaryOrange,
                }}
                type="primary"
              />
            </Popconfirm>
          </SelectedContainer>
        )}
      </Space>
    </Modal>
  )
}

export default ViewSelectorModal
