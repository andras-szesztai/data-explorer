import {useState, useEffect} from 'react'
import isEqual from "lodash/isEqual"
import isEmpty from "lodash/isEmpty"

import { getUniqIdsLength } from '../../utils/filterHelpers'

import { CHART_DOMAINS } from '../../constants/chartDomains'
import { QUESTION_TYPES } from '../../constants/filterValues'

import { ChartDataObject } from '../../types/charts'
import { AvailableQuestion, DataSetStatistics } from '../../types/dataSets'
import { usePrevious } from 'react-use'

interface Props {
  chart: AvailableQuestion
  prevChart: AvailableQuestion | undefined
  filteredDataSetStatistics: DataSetStatistics[],
  filteredDataSet: {[key: string]: string }[]
}

const useUpdateChartData = ({
  filteredDataSetStatistics,
  chart,
  prevChart,
  filteredDataSet,
}: Props) => {
  const prevFilteredDataSetStatistics = usePrevious(filteredDataSetStatistics)
  const [chartData, setChartData] = useState([] as ChartDataObject[])
  useEffect(() => {
    const makeChartData = () => {
      const totalRespondents = filteredDataSetStatistics.find(
        (s: DataSetStatistics) => s.label === chart.group
      )?.value
      const allOptions = QUESTION_TYPES[chart.type]
      const optionGroup = CHART_DOMAINS[chart.type]
      const newChartData = allOptions.map((option) => {
        const optionFiltered = filteredDataSet.filter(
          (d: { [key: string]: string }) =>
            d[`${chart.question} - ${chart.group}`] === option
        )
        return {
          labelGroup: Object.keys(optionGroup)[
            Object.values(optionGroup).findIndex((group) =>
              group.includes(option)
            )
          ],
          label: option,
          value: getUniqIdsLength(optionFiltered, chart.group) / (totalRespondents || 0),
        }
      })
      return newChartData
    }
    if (!isEqual(chart, prevChart)) {
      if (!isEmpty(chart)) setChartData(makeChartData())
      if (isEmpty(chart) && chartData.length)
        setChartData([] as ChartDataObject[])
    }
    if (!isEmpty(chart) && !isEqual(filteredDataSetStatistics, prevFilteredDataSetStatistics)) {
      setChartData(makeChartData())
    }
  }, [
    chart,
    filteredDataSet,
    prevChart,
    filteredDataSetStatistics,
    prevFilteredDataSetStatistics,
    chartData,
  ])

  return chartData
}

export default useUpdateChartData
