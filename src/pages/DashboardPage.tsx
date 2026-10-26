import React, { useEffect, useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  ShoppingBag,
  Palette,
  CalendarHeart,
  TrendingUp,
  MousePointerClick,
  PlayCircle,
} from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { StatCard } from "@/components/common/StatCard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { productService } from "@/services/productService"
import { workshopService } from "@/services/workshopService"
import { eventService } from "@/services/eventService"
import { analyticsService } from "@/services/analyticsService"
import { AnalyticsData, Product, Workshop } from "@/types"

export const DashboardPage: React.FC = () => {
  const [productCount, setProductCount] = useState(0)
  const [workshopCount, setWorkshopCount] = useState(0)
  const [eventCount, setEventCount] = useState(0)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [topProducts, setTopProducts] = useState<Product[]>([])
  const [topWorkshops, setTopWorkshops] = useState<Workshop[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [products, workshops, events, stats] = await Promise.all([
          productService.getAll(),
          workshopService.getAll(),
          eventService.getAll(),
          analyticsService.get(),
        ])

        setProductCount(products.length)
        setWorkshopCount(workshops.length)
        setEventCount(events.length)
        setAnalytics(stats)

        // Top 5 products by total_click
        const sortedProducts = [...products]
          .sort((a, b) => b.total_click - a.total_click)
          .slice(0, 5)
        setTopProducts(sortedProducts)

        // Top 5 workshops by total_play
        const sortedWorkshops = [...workshops]
          .sort((a, b) => b.total_play - a.total_play)
          .slice(0, 5)
        setTopWorkshops(sortedWorkshops)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Monitor website traffic, product clicks, and workshop views."
      />

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Products"
          value={isLoading ? "..." : productCount}
          icon={ShoppingBag}
          colorClass="text-pink-deep"
          bgClass="bg-pink-light dark:bg-pink-900/30"
        />
        <StatCard
          title="Total Workshop"
          value={isLoading ? "..." : workshopCount}
          icon={Palette}
          colorClass="text-amber-500"
          bgClass="bg-yellow-light dark:bg-yellow-900/30"
        />
        <StatCard
          title="Upcoming Events"
          value={isLoading ? "..." : eventCount}
          icon={CalendarHeart}
          colorClass="text-sky-500"
          bgClass="bg-sky-50 dark:bg-sky-900/30"
        />
      </div>

      {/* Analytics Chart with Tabs */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-pink-deep" />
              <span>Visitor Analytics</span>
            </CardTitle>
            <CardDescription>
              Real-time website traffic breakdown across daily, weekly, and monthly intervals
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily" className="w-full">
            <div className="flex justify-start sm:justify-end mb-4">
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </div>

            {/* Daily Chart */}
            <TabsContent value="daily">
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics?.daily || []}>
                    <defs>
                      <linearGradient id="colorPink" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ED5B82" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#ED5B82" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#7A7A7A", fontSize: 12 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#7A7A7A", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "1rem",
                        borderColor: "#F8C8DC",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="visitors"
                      stroke="#ED5B82"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorPink)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            {/* Weekly Chart */}
            <TabsContent value="weekly">
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics?.weekly || []}>
                    <defs>
                      <linearGradient id="colorYellow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F5B041" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#F5B041" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#7A7A7A", fontSize: 12 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#7A7A7A", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "1rem",
                        borderColor: "#FFD966",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="visitors"
                      stroke="#F5B041"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorYellow)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            {/* Monthly Chart */}
            <TabsContent value="monthly">
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics?.monthly || []}>
                    <defs>
                      <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5DADE2" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#5DADE2" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#7A7A7A", fontSize: 12 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#7A7A7A", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "1rem",
                        borderColor: "#A8D8EA",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="visitors"
                      stroke="#5DADE2"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorBlue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Two cards: Top Products & Top Workshops */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MousePointerClick className="h-4 w-4 text-pink-deep" />
              <span>Most Clicked Products</span>
            </CardTitle>
            <CardDescription>Top 5 products clicked by potential buyers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topProducts.map((p, idx) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-secondary/40 border border-pink/30 hover:border-pink transition-all"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="font-heading font-black text-sm text-pink-deep w-5 text-center">
                    #{idx + 1}
                  </span>
                  <div className="h-10 w-10 rounded-xl overflow-hidden bg-card shrink-0 border border-pink/30">
                    <img
                      src={p.images[0] || "/mock/fashion1.jpeg"}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-bold text-foreground truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.action_label}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-heading font-bold text-sm text-pink-deep">
                    {p.total_click}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">clicks</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Workshops */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PlayCircle className="h-4 w-4 text-amber-500" />
              <span>Top Viewed Workshops</span>
            </CardTitle>
            <CardDescription>Classes with the highest continuous play &gt; 5 seconds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topWorkshops.map((w, idx) => (
              <div
                key={w.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-secondary/40 border border-pink/30 hover:border-pink transition-all"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="font-heading font-black text-sm text-amber-500 w-5 text-center">
                    #{idx + 1}
                  </span>
                  <div className="h-10 w-10 rounded-xl overflow-hidden bg-card shrink-0 border border-pink/30">
                    <img
                      src={w.thumbnail || "/mock/diy1.jpeg"}
                      alt={w.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-bold text-foreground truncate">{w.title}</p>
                    <p className="text-xs text-muted-foreground">{w.sub_title || "DIY Class"}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-heading font-bold text-sm text-amber-500">
                    {w.total_play}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">plays</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
