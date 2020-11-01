export const COLORS = {
  primaryBlack: "#000000D9",
  primaryGray: "#54575C",
  primaryBlue: "#017CB7",
  secondaryTeal: "#359EA6",
  secondaryOrange: "#F26651",
  secondaryMagenta: "#BF1D79",
  secondaryPurple: "#6950A1",
}


export const CHART_COLORS = {
  accuracy: {
    'No answer': COLORS.primaryGray,
    'Very inaccurate': COLORS.secondaryMagenta,
    'Somewhat inaccurate': COLORS.secondaryOrange,
    'Somewhat accurate': COLORS.secondaryPurple,
    'Very accurate': COLORS.secondaryTeal
  },
  satisfaction: {
    'No answer': COLORS.primaryGray,
    'Very dissatisfied': COLORS.secondaryMagenta,
    'Somewhat dissatisfied': COLORS.secondaryOrange,
    'Neither satisfied nor dissatisfied': COLORS.primaryGray,
    'Somewhat satisfied': COLORS.secondaryPurple,
    'Very satisfied': COLORS.secondaryTeal
  },
  agree: {
    'No answer': COLORS.primaryGray,
    'Totally disagree': COLORS.secondaryMagenta,
    'Somewhat disagree': COLORS.secondaryOrange,
    'Somewhat agree': COLORS.secondaryPurple,
    'Totally agree': COLORS.secondaryTeal
  },
  selection: {
    'Selected': COLORS.primaryBlue,
    'Not selected': COLORS.primaryBlue
  },
  language: {
    'No answer': COLORS.primaryBlue,
    'None': COLORS.primaryBlue,
    'Basic': COLORS.primaryBlue,
    'Intermediate': COLORS.primaryBlue,
    'Fluent': COLORS.primaryBlue,
  },
  sex: {
    'Male': COLORS.primaryBlue,
    'Female': COLORS.primaryBlue,
    'No answer': COLORS.primaryBlue,
  },
  boolean: {
    'Yes': COLORS.primaryBlue,
    'No': COLORS.primaryBlue,
    'No answer': COLORS.primaryBlue,
  }
}
