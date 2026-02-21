import { Card } from "@/components/ui/card";

const mockDimensions = [
  {
    label: "Role Fit",
    score: 92,
    reason: "Strong match for your product management experience and leadership skills.",
    barColor: "bg-green-500",
    textColor: "text-green-700",
  },
  {
    label: "Company",
    score: 85,
    reason: "Series B startup in your preferred size range with strong culture signals.",
    barColor: "bg-blue-500",
    textColor: "text-blue-700",
  },
  {
    label: "Location",
    score: 78,
    reason: "Hybrid role in Zurich — matches your preferred work mode and city.",
    barColor: "bg-sky-500",
    textColor: "text-sky-700",
  },
  {
    label: "Industry",
    score: 88,
    reason: "Fintech aligns with your domain expertise and stated preferences.",
    barColor: "bg-blue-500",
    textColor: "text-blue-700",
  },
  {
    label: "Growth",
    score: 80,
    reason: "Clear path to Head of Product within 2 years based on company trajectory.",
    barColor: "bg-blue-500",
    textColor: "text-blue-700",
  },
];

export function ScoringDemo() {
  return (
    <Card className="p-6 shadow-lg">
      {/* Header with overall score */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-foreground">
          AI Match Breakdown
        </h3>
        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800 border border-green-200">
          85% match
        </span>
      </div>

      {/* Summary */}
      <div className="p-3 bg-muted rounded-lg mb-5">
        <p className="text-sm text-foreground leading-relaxed">
          This role closely aligns with your experience in product leadership and your preference for hybrid fintech positions in the Zurich area.
        </p>
      </div>

      {/* Dimensions */}
      <div className="space-y-3">
        {mockDimensions.map((dim) => (
          <div key={dim.label} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {dim.label}
              </span>
              <span className={`text-sm font-semibold ${dim.textColor}`}>
                {dim.score}%
              </span>
            </div>

            {/* Pure CSS progress bar */}
            <div className="h-2 w-full rounded-full bg-primary/10">
              <div
                className={`scoring-bar h-full rounded-full ${dim.barColor}`}
                style={{ "--bar-width": `${dim.score}%` } as React.CSSProperties}
              />
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {dim.reason}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
