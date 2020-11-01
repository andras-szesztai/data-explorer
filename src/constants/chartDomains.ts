export const CHART_DOMAINS: { [key: string]: { [key: string]: string[] } } = {
  accuracy: {
    "No answer": ["No answer"],
    Inaccurate: ["Very inaccurate", "Somewhat inaccurate"],
    Accurate: ["Very accurate", "Somewhat accurate"],
  },
  satisfaction: {
    "No answer": ["No answer"],
    Dissatisfied: ["Very dissatisfied", "Somewhat dissatisfied"],
    Neither: ["Neither satisfied nor dissatisfied"],
    Satisfied: ["Very satisfied", "Somewhat satisfied"],
  },
  agree: {
    "No answer": ["No answer"],
    Disagree: ["Very disagree", "Somewhat disagree"],
    Agree: ["Very agree", "Somewhat agree"],
  },
  selection: {
    Selected: ["Selected"],
    "Not selected": ["Not selected"],
  },
  language: {
    "No answer": ["No answer"],
    None: ["None"],
    Basic: ["Basic"],
    Intermediate: ["Intermediate"],
    Fluent: ["Fluent"],
  },
  sex: {
    Male: ["Male"],
    Female: ["Female"],
    "No answer": ["No answer"],
  },
  boolean: {
    Yes: ["Yes"],
    No: ["No"],
    "No answer": ["No answer"],
  },
}
