import * as React from "react"
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, TooltipProps } from "recharts"
import { cn } from "@/lib/utils"

interface ChartWrapperProps {
  children: React.ReactElement
  className?: string
  height?: number
}

export const ChartWrapper = React.forwardRef<HTMLDivElement, ChartWrapperProps>(
  ({ children, className, height = 300 }, ref) => (
    <div 
      ref={ref} 
      className={cn("w-full", className)} 
      style={{ height: `${height}px` }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
)
ChartWrapper.displayName = "ChartWrapper"

interface ModernTooltipProps extends TooltipProps<number, string> {
  labelFormatter?: (value: number | string) => string
  valueFormatter?: (value: number | string, name: string) => [string, string]
}

export const ModernTooltip: React.FC<ModernTooltipProps> = ({ 
  active, 
  payload, 
  label,
  labelFormatter,
  valueFormatter
}) => {
  if (!active || !payload || !payload.length) {
    return null
  }

  return (
    <div className="modern-card p-4 min-w-[200px] shadow-xl border border-border/50">
      {label && (
        <p className="font-semibold text-foreground mb-2">
          {labelFormatter ? labelFormatter(label) : label}
        </p>
      )}
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-muted-foreground">
                {entry.name || entry.dataKey}
              </span>
            </div>
            <span className="font-medium text-foreground">
              {valueFormatter 
                ? valueFormatter(entry.value, entry.name || entry.dataKey)?.[0] || entry.value
                : entry.value
              }
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export const EnhancedLineChart: React.FC<{
  data: Record<string, number | string>[]
  lines: Array<{
    dataKey: string
    name?: string
    color: string
    strokeWidth?: number
    strokeDasharray?: string
  }>
  height?: number
  className?: string
  labelFormatter?: (value: number | string) => string
  valueFormatter?: (value: number | string, name: string) => [string, string]
  showTooltip?: boolean
  showLegend?: boolean
  showGrid?: boolean
}> = ({ data, lines, height = 300, className, labelFormatter, valueFormatter, showTooltip = true, showLegend = true, showGrid = true }) => (
  <ChartWrapper height={height} className={className}>
    <LineChart data={data}>
      {showGrid && (
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="hsl(var(--border))" 
          opacity={0.3}
        />
      )}
      <XAxis 
        dataKey="month"
        stroke="hsl(var(--muted-foreground))"
        fontSize={12}
        tickLine={false}
        axisLine={false}
      />
      <YAxis 
        stroke="hsl(var(--muted-foreground))"
        fontSize={12}
        tickLine={false}
        axisLine={false}
        tickFormatter={(value) => valueFormatter ? valueFormatter(value, 'value')[0] : value}
      />
      {showTooltip && (
        <Tooltip 
          content={<ModernTooltip labelFormatter={labelFormatter} valueFormatter={valueFormatter} />}
          cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeOpacity: 0.3 }}
        />
      )}
      {showLegend && <Legend />}
      {lines.map((line, index) => (
        <Line
          key={line.dataKey}
          type="monotone"
          dataKey={line.dataKey}
          name={line.name || line.dataKey}
          stroke={line.color}
          strokeWidth={line.strokeWidth || 3}
          strokeDasharray={line.strokeDasharray}
          dot={{ 
            fill: line.color, 
            strokeWidth: 0, 
            r: 4,
            className: "hover:r-6 transition-all duration-200"
          }}
          activeDot={{ 
            r: 6, 
            stroke: line.color, 
            strokeWidth: 2,
            fill: 'hsl(var(--background))'
          }}
        />
      ))}
    </LineChart>
  </ChartWrapper>
)

export const EnhancedAreaChart: React.FC<{
  data: Record<string, number | string>[]
  areas: Array<{
    dataKey: string
    name?: string
    color: string
    fillOpacity?: number
    stackId?: string
  }>
  height?: number
  className?: string
  labelFormatter?: (value: number | string) => string
  valueFormatter?: (value: number | string, name: string) => [string, string]
  showTooltip?: boolean
  showLegend?: boolean
  showGrid?: boolean
}> = ({ data, areas, height = 300, className, labelFormatter, valueFormatter, showTooltip = true, showLegend = true, showGrid = true }) => (
  <ChartWrapper height={height} className={className}>
    <AreaChart data={data}>
      {showGrid && (
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="hsl(var(--border))" 
          opacity={0.3}
        />
      )}
      <XAxis 
        dataKey="month"
        stroke="hsl(var(--muted-foreground))"
        fontSize={12}
        tickLine={false}
        axisLine={false}
      />
      <YAxis 
        stroke="hsl(var(--muted-foreground))"
        fontSize={12}
        tickLine={false}
        axisLine={false}
        tickFormatter={(value) => valueFormatter ? valueFormatter(value, 'value')[0] : value}
      />
      {showTooltip && (
        <Tooltip 
          content={<ModernTooltip labelFormatter={labelFormatter} valueFormatter={valueFormatter} />}
          cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeOpacity: 0.3 }}
        />
      )}
      {showLegend && <Legend />}
      {areas.map((area, index) => (
        <Area
          key={area.dataKey}
          type="monotone"
          dataKey={area.dataKey}
          name={area.name || area.dataKey}
          stackId={area.stackId || "1"}
          stroke={area.color}
          fill={area.color}
          fillOpacity={area.fillOpacity || 0.6}
          strokeWidth={2}
        />
      ))}
    </AreaChart>
  </ChartWrapper>
)

export const EnhancedBarChart: React.FC<{
  data: Record<string, number | string>[]
  bars: Array<{
    dataKey: string
    name?: string
    color: string
    radius?: [number, number, number, number]
  }>
  height?: number
  className?: string
  labelFormatter?: (value: number | string) => string
  valueFormatter?: (value: number | string, name: string) => [string, string]
  showTooltip?: boolean
  showLegend?: boolean
  showGrid?: boolean
}> = ({ data, bars, height = 300, className, labelFormatter, valueFormatter, showTooltip = true, showLegend = true, showGrid = true }) => (
  <ChartWrapper height={height} className={className}>
    <BarChart data={data}>
      {showGrid && (
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="hsl(var(--border))" 
          opacity={0.3}
        />
      )}
      <XAxis 
        dataKey="month"
        stroke="hsl(var(--muted-foreground))"
        fontSize={12}
        tickLine={false}
        axisLine={false}
      />
      <YAxis 
        stroke="hsl(var(--muted-foreground))"
        fontSize={12}
        tickLine={false}
        axisLine={false}
        tickFormatter={(value) => valueFormatter ? valueFormatter(value, 'value')[0] : value}
      />
      {showTooltip && (
        <Tooltip 
          content={<ModernTooltip labelFormatter={labelFormatter} valueFormatter={valueFormatter} />}
          cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
        />
      )}
      {showLegend && <Legend />}
      {bars.map((bar, index) => (
        <Bar
          key={bar.dataKey}
          dataKey={bar.dataKey}
          name={bar.name || bar.dataKey}
          fill={bar.color}
          radius={bar.radius || [4, 4, 0, 0]}
        />
      ))}
    </BarChart>
  </ChartWrapper>
)

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent
}: {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
}) => {
  // Hide labels for very small slices
  if (percent < 0.05) return null;
  // Move label closer to center (60% of the way from inner to outer radius)
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor="middle" 
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
      pointerEvents="none"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export const EnhancedPieChart: React.FC<{
  data: Array<{ name: string; value: number; color: string; gradient?: [string, string] }>
  height?: number
  className?: string
  innerRadius?: number
  outerRadius?: number
  showLabels?: boolean
  valueFormatter?: (value: number | string) => string
  showTooltip?: boolean
  showLegend?: boolean
}> = ({ 
  data, 
  height = 300, 
  className, 
  innerRadius = 0, 
  outerRadius = 100, 
  showLabels = true,
  valueFormatter,
  showTooltip = true,
  showLegend = true
}) => {
  // Generate unique gradient IDs for each slice
  const gradientIds = data.map((_, i) => `pie-gradient-${i}`);
  // Default gradients if not provided
  const defaultGradients: [string, string][] = [
    ['#2563eb', '#60a5fa'], // blue
    ['#f59e42', '#fbbf24'], // gold
    ['#22c55e', '#bbf7d0'], // green
    ['#a21caf', '#f472b6'], // purple
  ];
  return (
    <ChartWrapper height={height} className={className}>
      <PieChart>
        <defs>
          {data.map((entry, i) => {
            const [start, end] = entry.gradient || defaultGradients[i % defaultGradients.length];
            return (
              <linearGradient id={gradientIds[i]} key={gradientIds[i]} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={start} />
                <stop offset="100%" stopColor={end} />
              </linearGradient>
            );
          })}
        </defs>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={showLabels ? renderCustomizedLabel : false}
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          fill="#8884d8"
          dataKey="value"
          stroke="hsl(var(--background))"
          strokeWidth={2}
        >
          {data.map((entry, i) => (
            <Cell key={`cell-${i}`} fill={`url(#${gradientIds[i]})`} />
          ))}
        </Pie>
        <Tooltip 
          content={
            <ModernTooltip 
              valueFormatter={valueFormatter ? (value, name) => [valueFormatter(value), name] : undefined} 
            />
          }
        />
        <Legend 
          wrapperStyle={{
            paddingTop: '20px',
            fontSize: '14px'
          }}
          iconType="circle"
        />
      </PieChart>
    </ChartWrapper>
  );
}