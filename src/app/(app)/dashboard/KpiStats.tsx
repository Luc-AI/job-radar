import { Card } from "@/components/ui/card";

interface KpiStatsProps {
  totalJobs: number;
  newToday: number;
  topMatches: number;
  savedJobs: number;
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "blue" | "emerald" | "amber" | "purple";
}) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    purple: "bg-purple-50 text-purple-700",
  };

  return (
    <Card className={`px-4 py-3 ${colorClasses[color]} border-0`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm opacity-80">{label}</div>
    </Card>
  );
}

export function KpiStats({
  totalJobs,
  newToday,
  topMatches,
  savedJobs,
}: KpiStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <StatBox label="Total Jobs" value={totalJobs} color="blue" />
      <StatBox label="New Today" value={newToday} color="emerald" />
      <StatBox label="Top Matches (90%+)" value={topMatches} color="amber" />
      <StatBox label="Saved" value={savedJobs} color="purple" />
    </div>
  );
}
