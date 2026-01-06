import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  isDarkMode: boolean;
}

export function StatCard({ title, value, icon: Icon, trend, trendUp, isDarkMode }: StatCardProps) {
  return (
    <Card className={isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{title}</p>
            <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} mt-2`}>{value}</h3>
            {trend && (
              <p className={`text-sm mt-2 ${trendUp ? "text-green-500" : "text-red-500"}`}>
                {trend}
              </p>
            )}
          </div>
          <div className="bg-red-600/10 p-3 rounded-lg">
            <Icon className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}