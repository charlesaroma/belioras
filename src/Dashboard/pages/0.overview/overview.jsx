import { useMemo } from "react";

import { useAsyncData } from "../../../hooks/useAsyncData";
import { useCurrency } from "../../../context/CurrencyContext";
import { useLanguage } from "../../../context/LanguageContext";
import { getDashboardStats, getRecentOrders } from "../../../services/dashboardApi";

import KeyFigures from "./sections/OverviewKeyFigures";
import RevenuePanel from "./sections/OverviewRevenuePanel";
import RecentOrders from "./sections/overviewTable/OverviewRecentOrders";

const RECENT_ORDER_COUNT = 6;

/**
 * Overview — the dashboard's index page.
 *
 * Every figure is derived from the same order and product data the storefront
 * reads; previously they were hardcoded, showing dollar amounts in a euro
 * store and dates from 2024. A test order placed on the site now appears here.
 *
 * This file fetches and formats; each band of the page is a section beside it.
 */
export default function DashOverview() {
  const { data: stats, loading } = useAsyncData(getDashboardStats, []);
  const { data: orders } = useAsyncData(() => getRecentOrders(RECENT_ORDER_COUNT), []);
  const { format, currency } = useCurrency();
  const { locale } = useLanguage();

  // Compact so a five-figure month does not wrap the chart's axis labels.
  const formatCompact = useMemo(() => {
    const fmt = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    });
    return (value) => fmt.format(value);
  }, [locale, currency]);

  const dateFmt = useMemo(
    () => new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }),
    [locale],
  );

  return (
    <div className="space-y-10">
      <KeyFigures stats={stats} loading={loading} format={format} locale={locale} />
      <RevenuePanel series={stats?.series} formatCompact={formatCompact} />
      <RecentOrders orders={orders} format={format} dateFmt={dateFmt} />
    </div>
  );
}
