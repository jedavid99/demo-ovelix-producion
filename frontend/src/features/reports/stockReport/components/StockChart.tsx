import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { CategoryData } from '../types';

interface StockChartProps {
  data: CategoryData[];
}

export function StockChart({ data }: StockChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock por Categoría</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <Card className="p-3 shadow-lg">
                      <p className="text-sm font-semibold">{payload[0].payload.name}</p>
                      <p className="text-sm text-muted-foreground">{payload[0].value} unidades</p>
                    </Card>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="stock" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
