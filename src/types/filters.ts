export interface FilterQuestionsState {
  filterQuestions: FilterQuestion[]
}

export interface FilterQuestion {
  id: string
  question: string
  group: string
  options: string[]
  checkedOptions: string[]
  date: Date
}
