import xlsx from "xlsx"
import FileSaver from "file-saver"

export const exportToExcel = (
  json: any,
  datasetName: string
) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
  const fileExtension = ".xlsx"
  const ws = xlsx.utils.json_to_sheet(json)
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] }
  const excelBuffer = xlsx.write(wb, { bookType: "xlsx", type: "array" })
  const data = new Blob([excelBuffer], { type: fileType })
  FileSaver.saveAs(data, datasetName + fileExtension)
}
