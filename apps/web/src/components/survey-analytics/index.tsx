// Provider

// Types
export type { TimeRange } from "./providers";
export { SurveyAnalyticsProvider, useSurveyAnalytics } from "./providers";
// Query Hooks
export {
	useSurveyAllQuestionsQuery,
	useSurveyQuestionQuery,
	useSurveySummaryQuery,
	useSurveyTrendsQuery,
} from "./queries";

// Tabs
export {
	DemographicsTab,
	InsightsTab,
	OverviewTab,
	QuestionsTab,
	ResponsesTab,
	SurveyAnalyticsTabs,
} from "./tabs";

// Utils
export {
	formatDate,
	formatDuration,
	formatNumber,
	formatPercentage,
	getTrendDirection,
	getTrendStyle,
} from "./utils/formatters";

// Widget Parts (re-exported from dashboard)
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
	WidgetTooltip,
	type WidgetTooltipProps,
} from "./widget-parts";
// Widgets
export {
	OverviewStatsCard,
	OverviewStatsGrid,
	QuestionMetricsWidget,
	ResponseFunnelWidget,
	SurveyTrendsWidget,
} from "./widgets";
