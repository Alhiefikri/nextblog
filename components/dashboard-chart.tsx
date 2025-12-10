"use client";

import { Bar, BarChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Category, Post } from "@/app/generated/prisma/client";

const chartConfig = {
  desktop: {
    color: "#2563eb",
  },
} satisfies ChartConfig;

interface ChartProps {
  data: Post[];
}

const DasboardChart = ({ data }: ChartProps) => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Views</CardTitle>
          <CardDescription>Trending posts by number of views</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart data={data}>
              <Bar dataKey="views" />
              <ChartTooltip content={<ChartTooltipContent />} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DasboardChart;
