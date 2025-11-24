"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { mockVendorMetrics, mockRecoveryPipeline } from "@/lib/mock-data"
import { TrendingUp, Award, BarChart3, Target } from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

export default function SavingsRecoveryPage() {
  const totalRecovered = mockRecoveryPipeline.recovered_ytd
  const recoveryGoal = mockRecoveryPipeline.total_identified
  const recoveryRate = ((mockRecoveryPipeline.recovered_ytd / mockRecoveryPipeline.total_identified) * 100).toFixed(1)
  const potentialRemaining = mockRecoveryPipeline.pending_approval + mockRecoveryPipeline.pending_processing

  const donutData = [
    { name: "Recovered", value: totalRecovered },
    { name: "Pending", value: potentialRemaining },
  ]

  const COLORS = ["#10b981", "#f59e0b"]

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Savings & Recovery</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 border-l-4 border-l-success/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">YTD Recovered</p>
                <p className="text-2xl font-bold text-success">${(totalRecovered / 1000).toFixed(0)}K</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success/30" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recovery Goal</p>
                <p className="text-2xl font-bold text-foreground">${(recoveryGoal / 1000).toFixed(0)}K</p>
              </div>
              <Target className="h-8 w-8 text-primary/30" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recovery Rate</p>
                <p className="text-2xl font-bold text-foreground">{recoveryRate}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary/30" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Remaining Pipeline</p>
                <p className="text-2xl font-bold text-warning">${(potentialRemaining / 1000).toFixed(0)}K</p>
              </div>
              <Award className="h-8 w-8 text-warning/30" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recovery Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={donutData} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={90}>
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: `1px solid var(--color-border)`,
                  }}
                  formatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Recovery Rate Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={mockRecoveryPipeline.monthly_recovery_rate}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: `1px solid var(--color-border)`,
                  }}
                />
                <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recovery by Exception Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockRecoveryPipeline.recovery_by_category}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: `1px solid var(--color-border)`,
                }}
              />
              <Legend />
              <Bar dataKey="recovered" fill="#10b981" name="Recovered" />
              <Bar dataKey="identified" fill="#cbd5e1" name="Identified" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Top 10 Overcharging Vendors</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Vendor</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Total Overcharged</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Recovered</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Recovery Rate</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Compliance</th>
                </tr>
              </thead>
              <tbody>
                {mockVendorMetrics
                  .sort((a, b) => b.overchargeAmount - a.overchargeAmount)
                  .map((vendor) => (
                    <tr key={vendor.vendorId} className="border-b border-border hover:bg-muted/30">
                      <td className="px-6 py-3 font-medium text-foreground">{vendor.vendorName}</td>
                      <td className="px-6 py-3 font-semibold text-destructive">
                        ${vendor.overchargeAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-3 font-semibold text-success">
                        ${vendor.recoveredAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-3">
                        <span className="font-semibold text-foreground">{vendor.recoveryRate.toFixed(1)}%</span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-foreground">{vendor.complianceRate.toFixed(1)}%</span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
