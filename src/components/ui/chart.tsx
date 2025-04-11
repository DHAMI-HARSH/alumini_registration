"use client"

import * as React from "react"
import * as Recharts from "recharts"
import { cn } from "@/lib/utils"

const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) throw new Error("useChart must be used within a <ChartContainer />")
  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config?: ChartConfig
    children: React.ReactNode
  }
>(({ id, className, children, config = {}, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn("flex aspect-video justify-center text-xs", className)}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <Recharts.ResponsiveContainer>{children}</Recharts.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "ChartContainer"

// The actual chart containers — required for Recharts context
const ChartBarChart = Recharts.BarChart
const ChartPieChart = Recharts.PieChart

// Other components
const ChartTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-semibold">{children}</h3>
)
const ChartLegend = Recharts.Legend
const ChartTooltip = Recharts.Tooltip
const ChartXAxis = Recharts.XAxis
const ChartYAxis = Recharts.YAxis
const ChartGrid = Recharts.CartesianGrid
const ChartBar = Recharts.Bar
const ChartPie = Recharts.Pie
const ChartDonut = ({
  data,
  nameKey,
  dataKey,
  ...props
}: React.ComponentProps<typeof Recharts.Pie>) => {
  return (
    <Recharts.PieChart>
      <Recharts.Pie
        data={data}
        dataKey={dataKey}
        nameKey={nameKey}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        label
        {...props}
      />
      <Recharts.Tooltip />
      <Recharts.Legend />
    </Recharts.PieChart>
  )
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, conf]) => conf.theme || conf.color
  )

  if (!colorConfig.length) return null

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] || itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

export {
  ChartContainer,
  ChartBarChart,
  ChartPieChart,
  ChartTitle,
  ChartLegend,
  ChartTooltip,
  ChartXAxis,
  ChartYAxis,
  ChartGrid,
  ChartBar,
  ChartDonut,

  ChartPie,
}
