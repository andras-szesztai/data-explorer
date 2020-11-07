import React from "react"
import { Modal, Select } from "antd"

interface Props {
  isModalOpen: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  dataSetViews: string[]
  updateSelectedView: (value?: string) => void
}

const ViewSelectorModal = ({
  isModalOpen,
  setIsModalOpen,
  dataSetViews,
  updateSelectedView,
}: Props) => {
  const [selectedView, setSelectedView] = React.useState("")
  return (
    <Modal
      title="Your saved views:"
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
      }}
      onCancel={() => {
        setIsModalOpen(false)
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
    </Modal>
  )
}

export default ViewSelectorModal
