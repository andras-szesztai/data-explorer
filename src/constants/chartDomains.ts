export const CHART_DOMAINS: { [key: string]: { [key: string]: string[] } } = {
  accuracy: {
    Inaccurate: ["Very inaccurate", "Somewhat inaccurate"],
    Accurate: ["Somewhat accurate", "Very accurate"],
  },
  satisfaction: {
    Dissatisfied: ["Very dissatisfied", "Somewhat dissatisfied"],
    Neither: ["Neither satisfied nor dissatisfied"],
    Satisfied: ["Somewhat satisfied", "Very satisfied"],
  },
  agree: {
    Disagree: ["Totally disagree", "Somewhat disagree"],
    Agree: [ "Somewhat agree", "Totally agree"],
  },
  selection: {
    Selected: ["Selected"],
    "Not selected": ["Not selected"],
  },
  language: {
    None: ["None"],
    Basic: ["Basic"],
    Intermediate: ["Intermediate"],
    Fluent: ["Fluent"],
  },
  sex: {
    Male: ["Male"],
    Female: ["Female"],
  },
  boolean: {
    Yes: ["Yes"],
    No: ["No"],
  },
}
