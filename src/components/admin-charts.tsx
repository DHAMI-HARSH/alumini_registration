"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChartBarChart,
  ChartPieChart,
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartTitle,
  ChartXAxis,
  ChartYAxis,
  ChartGrid,
  ChartBar,
  ChartPie,
  ChartDonut,
} from "@/components/ui/chart"

interface AdminChartsProps {
  students: any[]
}

export function AdminCharts({ students }: AdminChartsProps) {
  const programCounts = students.reduce((acc: Record<string, number>, student) => {
    const program = student.program || "Unknown"
    acc[program] = (acc[program] || 0) + 1
    return acc
  }, {})

  const programData = Object.entries(programCounts).map(([name, value]) => ({ name, value }))

  const genderCounts = students.reduce((acc: Record<string, number>, student) => {
    const gender = student.gender || "Unknown"
    acc[gender] = (acc[gender] || 0) + 1
    return acc
  }, {})

  const genderData = Object.entries(genderCounts).map(([name, value]) => ({ name, value }))

  const semesterCounts = students.reduce((acc: Record<string, number>, student) => {
    const semester = student.semester || "Unknown"
    acc[semester] = (acc[semester] || 0) + 1
    return acc
  }, {})

  const semesterData = Object.entries(semesterCounts)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([name, value]) => ({ name: `Semester ${name}`, value }))

  const feeData = students
    .map((student) => ({
      name: student.fullName || "Unknown",
      deposited: Number.parseInt(student.feeDeposited) || 0,
      pending: Number.parseInt(student.pendingFee) || 0,
    }))
    .sort((a, b) => b.deposited - a.deposited)
    .slice(0, 10)

  return (
    <Tabs defaultValue="distribution">
      <TabsList className="mb-4">
        <TabsTrigger value="distribution">Distribution</TabsTrigger>
        <TabsTrigger value="fees">Fees</TabsTrigger>
      </TabsList>

      <TabsContent value="distribution" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Program Distribution</CardTitle>
              <CardDescription>Students by program</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-80">
                <ChartPieChart>
                  <ChartTitle>Program Distribution</ChartTitle>
                  <ChartLegend />
                  <ChartPie
                    data={programData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  />
                  <ChartTooltip />
                </ChartPieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gender Distribution</CardTitle>
              <CardDescription>Students by gender</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-80">
                <ChartDonut
                  data={genderData}
                  dataKey="value"
                  nameKey="name"
                />
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Semester Distribution</CardTitle>
            <CardDescription>Students by semester</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-80">
              <ChartBarChart data={semesterData}>
                <ChartTitle>Semester Distribution</ChartTitle>
                <ChartXAxis dataKey="name" />
                <ChartYAxis />
                <ChartGrid />
                <ChartBar dataKey="value" fill="hsl(var(--primary))" radius={4} />
                <ChartTooltip />
              </ChartBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="fees">
        <Card>
          <CardHeader>
            <CardTitle>Fee Distribution (Top 10 Students)</CardTitle>
            <CardDescription>Fee deposited vs pending by student</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-96">
              <ChartBarChart data={feeData}>
                <ChartTitle>Fee Distribution</ChartTitle>
                <ChartXAxis dataKey="name" />
                <ChartYAxis />
                <ChartGrid />
                <ChartBar
                  dataKey="deposited"
                  name="Fee Deposited"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
                <ChartBar
                  dataKey="pending"
                  name="Pending Fee"
                  fill="hsl(var(--destructive))"
                  radius={[4, 4, 0, 0]}
                />
                <ChartLegend />
                <ChartTooltip />
              </ChartBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
