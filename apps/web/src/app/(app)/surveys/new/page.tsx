"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { CreateSurveyForm } from "./components";

export default function NewSurveyPage() {
	return (
		<div className="mx-auto w-full max-w-2xl p-6">
			<div className="mb-6">
				<Button
					variant="ghost"
					size="sm"
					nativeButton={false}
					render={<Link href="/surveys" />}
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Surveys
				</Button>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Create New Survey</CardTitle>
					<CardDescription>
						Set up a new survey to start collecting responses
					</CardDescription>
				</CardHeader>
				<CardContent>
					<CreateSurveyForm />
				</CardContent>
			</Card>
		</div>
	);
}
