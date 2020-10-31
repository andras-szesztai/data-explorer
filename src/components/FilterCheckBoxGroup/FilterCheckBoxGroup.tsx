import React from 'react'
import { Button, Checkbox, notification, Space, Tooltip } from 'antd'
import { CheckCircleFilled, DeleteFilled } from '@ant-design/icons'

import { removeFilter, updateFilters } from '../../actions/filtersActions'
import { FilterActions } from '../../reducers/filtersReducer'

import { DURATION_SECOND } from '../../constants/animations'
import { COLORS } from '../../constants/colors'

import { FilterQuestion } from '../../types/filters'

interface Props {
  updateFilterState: React.Dispatch<FilterActions>
  question: FilterQuestion
}

const FilterCheckBoxGroup = ({ updateFilterState, question }: Props) => {
  const deletedQuestionNotification = () => {
    const args = {
      message: 'Question removed from filters!',
      duration: DURATION_SECOND.lg,
      icon: <CheckCircleFilled style={{ color: COLORS.primary }} />
    }
    notification.open(args)
  }

  const [isAllChecked, setIsAllChecked] = React.useState(question.checkedOptions.length === question.options.length)
  React.useEffect(() => {
    if (isAllChecked && question.checkedOptions.length !== question.options.length) {
      setIsAllChecked(false)
    }
    if (!isAllChecked && question.checkedOptions.length === question.options.length) {
      setIsAllChecked(true)
    }
  }, [question.checkedOptions.length, isAllChecked, question.options.length])

  return (
    <Space direction="vertical">
      <Checkbox.Group
        options={question.options.map(o => String(o))}
        value={question.checkedOptions.map(o => String(o))}
        onChange={e => {
          updateFilterState(
            updateFilters(
              question.id,
              e.map(el => String(el))
            )
          )
        }}
      />
      <Space>
        <Button
          size="small"
          type="primary"
          shape="round"
          onClick={() => {
            if (isAllChecked) {
              updateFilterState(updateFilters(question.id, []))
            } else {
              updateFilterState(updateFilters(question.id, question.options))
            }
          }}
        >
          {isAllChecked ? 'Unselect' : 'Select'} all
        </Button>
        <Tooltip placement="topLeft" title="Remove question">
          <Button
            size="small"
            danger
            type="primary"
            icon={<DeleteFilled />}
            shape="round"
            onClick={() => {
              updateFilterState(removeFilter(question.id))
              deletedQuestionNotification()
            }}
          />
        </Tooltip>
      </Space>
    </Space>
  )
}

export default FilterCheckBoxGroup
