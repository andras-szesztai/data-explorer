export interface AvailableQuestion {
  id: string
  question: string
  type: string
  group: string
  options: string[]
}

export interface DataSetStatistics  {
  label: string
  value: number
}