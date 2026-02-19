// Providers

// Placeholders
export { CohortPlaceholder } from "./cohort-placeholder";
export { CSATCESWidget } from "./csat-ces-widget";
export { EngagementWidget } from "./engagement-widget";
export { FunnelWidget } from "./funnel-widget";
export { HeatmapPlaceholder } from "./heatmap-placeholder";
export { NPSWidget } from "./nps-widget";
// Widgets
export { OverviewSection, OverviewWidget } from "./overview-widget";
export {
	type DashboardFilterParams,
	DashboardFiltersProvider,
	type SurveyOption,
	type TimeRange,
	useDashboardFilters,
} from "./providers";
// Query hooks
export {
	useDemographicsQuery,
	useFunnelQuery,
	useNPSQuery,
	useRatingsQuery,
	useSummaryQuery,
	useTrendsQuery,
} from "./queries";
export { SentimentWidget } from "./sentiment-widget";
// Filter controls
export { SurveyFilter } from "./survey-filter";
export { TimeRangeToggle } from "./time-range-toggle";
export { TrendsChart, TrendsWidget } from "./trends-widget";
// Utilities
export { WidgetTooltip, type WidgetTooltipProps } from "./widget-tooltip";
// Widget parts
export {
	WidgetCard,
	type WidgetCardProps,
	WidgetEmpty,
	type WidgetEmptyProps,
	WidgetError,
	type WidgetErrorProps,
	WidgetLoading,
	type WidgetLoadingProps,
	type WidgetLoadingType,
	WidgetRefreshButton,
	type WidgetRefreshButtonProps,
} from "./widgets/parts";
