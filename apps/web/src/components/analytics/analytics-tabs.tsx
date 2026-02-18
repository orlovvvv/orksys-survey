"use client";

import type { Question } from "@orksys-survey/db";
import { BarChart3, Download, Globe, MessageSquare, Table } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIInsights } from "./ai-insights";
import { DemographicsPanel } from "./demographics-panel";
import { QuestionCharts } from "./question-charts";
import { ResponseTable } from "./response-table";

interface AnalyticsTabsProps {
	surveyId: string;
	questions: Question[];
}

export function AnalyticsTabs({ surveyId, questions }: AnalyticsTabsProps) {
	return (
		<Tabs defaultValue="charts" className="space-y-6">
			<TabsList>
				<TabsTrigger value="charts" className="gap-2">
					<BarChart3 className="h-4 w-4" />
					Charts
				</TabsTrigger>
				<TabsTrigger value="responses" className="gap-2">
					<Table className="h-4 w-4" />
					Responses
				</TabsTrigger>
				<TabsTrigger value="insights" className="gap-2">
					<MessageSquare className="h-4 w-4" />
					AI Insights
				</TabsTrigger>
				<TabsTrigger value="demographics" className="gap-2">
					<Globe className="h-4 w-4" />
					Demographics
				</TabsTrigger>
			</TabsList>

			<TabsContent value="charts" className="mt-6">
				<QuestionCharts surveyId={surveyId} questions={questions} />
			</TabsContent>

			<TabsContent value="responses" className="mt-6">
				<ResponseTable surveyId={surveyId} questions={questions} />
			</TabsContent>

			<TabsContent value="insights" className="mt-6">
				<AIInsights surveyId={surveyId} questions={questions} />
			</TabsContent>

			<TabsContent value="demographics" className="mt-6">
				<DemographicsPanel surveyId={surveyId} />
			</TabsContent>
		</Tabs>
	);
}
