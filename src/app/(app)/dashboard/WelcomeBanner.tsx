export interface BannerStats {
  displayName: string;
  /** Total new jobs in last 24h */
  newToday: number;
  /** Jobs in last 24h scoring ≥ threshold */
  topPicksToday: number;
  /** Top 1–2 industries from today's jobs */
  topIndustriesToday: string[];
  /** Last 7d new jobs count (zero-state fallback) */
  newLast7d: number;
  /** Last 7d top picks count (zero-state fallback) */
  topPicksLast7d: number;
  appliedThisWeek: number;
  savedThisWeek: number;
  profileCompleteness: number;
  thresholdPct: number;
}

interface WelcomeBannerProps {
  stats: BannerStats;
}

export function WelcomeBanner({ stats }: WelcomeBannerProps) {
  const {
    displayName,
    topPicksToday,
    topIndustriesToday,
    topPicksLast7d,
    thresholdPct,
  } = stats;

  const hasTopPicksToday = topPicksToday > 0;

  // Contextual message
  let message: string;
  if (hasTopPicksToday) {
    if (topIndustriesToday.length > 0) {
      const industries = topIndustriesToday.join(" and ");
      message = `${topPicksToday} top pick${topPicksToday !== 1 ? "s" : ""} today — mainly in ${industries}.`;
    } else {
      message = `${topPicksToday} top pick${topPicksToday !== 1 ? "s" : ""} scoring ${thresholdPct}%+ today.`;
    }
  } else if (topPicksLast7d > 0) {
    message = `No new top matches today — ${topPicksLast7d} top pick${topPicksLast7d !== 1 ? "s" : ""} this week.`;
  } else {
    message = `No new top matches today — here's what trended this week.`;
  }

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-foreground">
        Hello, {displayName}
      </h1>
      <p className="mt-2 text-muted-foreground">{message}</p>
    </div>
  );
}
