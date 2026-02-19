"use client";

import { BarChart3, Globe, MessageSquare, Table } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DemographicsTab } from "./demographics-tab";
import { InsightsTab } from "./insights-tab";
import { OverviewTab } from "./overview-tab";
import { QuestionsTab } from "./questions-tab";
import { ResponsesTab } from "./responses-tab";

export function SurveyAnalyticsTabs() {
	return (
		<Tabs defaultValue="overview" className="space-y-6">
			<TabsList className="lg:max-w-max">
				<TabsTrigger value="overview" className="gap-2">
					<BarChart3 className="h-4 w-4" />
					<span className="hidden sm:inline">Overview</span>
				</TabsTrigger>
				<TabsTrigger value="questions" className="gap-2">
					<BarChart3 className="h-4 w-4" />
					<span className="hidden sm:inline">Questions</span>
				</TabsTrigger>
				<TabsTrigger value="responses" className="gap-2">
					<Table className="h-4 w-4" />
					<span className="hidden sm:inline">Responses</span>
				</TabsTrigger>
				<TabsTrigger value="insights" className="gap-2">
					<MessageSquare className="h-4 w-4" />
					<span className="hidden sm:inline">AI Insights</span>
				</TabsTrigger>
				<TabsTrigger value="demographics" className="gap-2">
					<Globe className="h-4 w-4" />
					<span className="hidden sm:inline">Demographics</span>
				</TabsTrigger>
			</TabsList>

			<TabsContent value="overview" className="mt-6">
				<OverviewTab />
			</TabsContent>

			<TabsContent value="questions" className="mt-6">
				<QuestionsTab />
			</TabsContent>

			<TabsContent value="responses" className="mt-6">
				<ResponsesTab />
			</TabsContent>

			<TabsContent value="insights" className="mt-6">
				<InsightsTab />
			</TabsContent>

			<TabsContent value="demographics" className="mt-6">
				<DemographicsTab />
			</TabsContent>
		</Tabs>
	);
}
