"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockBenchmarks } from "@/lib/mock-data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"

export default function BenchmarksPage() {
  const benchmarkChartData = mockBenchmarks.map((b) => ({
    category: b.category.split(" ")[0],
    your: b.yourRate,
    median: b.medianRate,
    p75: b.p75Rate,
  }))

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Service Benchmarks</h2>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-2">Categories Benchmarked</p>
            <p className="text-2xl font-bold text-foreground">{mockBenchmarks.length}</p>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-2">Avg Percentile</p>
            <p className="text-2xl font-bold text-foreground">
              {(mockBenchmarks.reduce((sum, b) => sum + b.percentile, 0) / mockBenchmarks.length).toFixed(0)}th
            </p>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-2">Categories Above Median</p>
            <p className="text-2xl font-bold text-warning">
              {mockBenchmarks.filter((b) => b.yourRate > b.medianRate).length}
            </p>
          </Card>
        </div>

        {/* Price Comparison Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Your Rate vs Benchmarks</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={benchmarkChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="category"
                angle={-45}
                textAnchor="end"
                height={80}
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: `1px solid var(--color-border)`,
                }}
              />
              <Bar dataKey="your" fill="var(--color-chart-1)" name="Your Rate" />
              <Bar dataKey="median" fill="var(--color-muted)" name="Median" />
              <Bar dataKey="p75" fill="var(--color-chart-2)" name="75th Percentile" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Detailed Benchmark Table */}
        <Card>
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Service Category Details</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Category</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Your Rate</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Median</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">25th %ile</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">75th %ile</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Percentile</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Position</th>
                </tr>
              </thead>
              <tbody>
                {mockBenchmarks.map((benchmark) => {
                  const isAboveMedian = benchmark.yourRate > benchmark.medianRate
                  return (
                    <tr key={benchmark.category} className="border-b border-border hover:bg-muted/30">
                      <td className="px-6 py-3 font-medium text-foreground">{benchmark.category}</td>
                      <td className="px-6 py-3 font-semibold text-foreground">
                        ${benchmark.yourRate.toLocaleString()}
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">${benchmark.medianRate.toLocaleString()}</td>
                      <td className="px-6 py-3 text-muted-foreground">${benchmark.p25Rate.toLocaleString()}</td>
                      <td className="px-6 py-3 text-muted-foreground">${benchmark.p75Rate.toLocaleString()}</td>
                      <td className="px-6 py-3 font-semibold">{benchmark.percentile}th</td>
                      <td className="px-6 py-3">
                        <Badge
                          variant="outline"
                          className={`flex w-fit items-center gap-1 ${
                            isAboveMedian
                              ? "bg-warning/10 text-warning border-warning/20"
                              : "bg-success/10 text-success border-success/20"
                          }`}
                        >
                          {isAboveMedian ? (
                            <>
                              <TrendingUp className="h-3 w-3" />
                              Above Median
                            </>
                          ) : (
                            <>
                              <TrendingDown className="h-3 w-3" />
                              Below Median
                            </>
                          )}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
