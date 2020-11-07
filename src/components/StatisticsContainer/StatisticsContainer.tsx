import React from "react"
import { Card, Col, Row, Statistic } from "antd"
import numeral from "numeral"

import { DataSetStatistics } from "../../types/dataSets"

interface Props {
  activeDataSetStatistics: DataSetStatistics[]
  filteredDataSetStatistics: DataSetStatistics[]
}

function StatisticsContainer({
  activeDataSetStatistics,
  filteredDataSetStatistics,
}: Props) {
  return (
    <Card
      style={{
        height: "100%",
        paddingTop: 12,
      }}
    >
      <Row gutter={8}>
        <Col span={1} />
        {!!activeDataSetStatistics.length &&
          activeDataSetStatistics.map(
            (type: { label: string; value: number }, i: number) => {
              const filtered = filteredDataSetStatistics[i]
              const percentage = filtered.value / type.value
              return (
                <React.Fragment key={type.label}>
                  <Col span={5}>
                    <Statistic
                      title={`${type.label} Total`}
                      value={type.value}
                    />
                  </Col>
                  <Col span={5}>
                    <Statistic
                      title="Filtered"
                      value={`${filtered.value} (${numeral(percentage).format(
                        percentage === 1
                          ? "0%"
                          : percentage < 0.1
                          ? "0.00%"
                          : "0.0%"
                      )})`}
                    />
                  </Col>
                  {i === 0 && <Col span={2} />}
                </React.Fragment>
              )
            }
          )}
        <Col span={1} />
      </Row>
    </Card>
  )
}

export default StatisticsContainer
