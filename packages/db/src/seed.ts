import "dotenv/config";
import { db } from "./index";
import { ruleSet } from "./schema/survey";

async function seed() {
	console.log("Seeding rulesets...");

	const rulesets = [
		{
			id: "rs_phone",
			name: "Phone Number",
			description: "Standard US phone number format",
			type: "text",
			config: {
				mask: "(999) 999-9999",
				inputType: "tel",
				placeholder: "(555) 000-0000",
				validationMessage: "Please enter a valid phone number",
			},
			isSystem: true,
		},
		{
			id: "rs_email",
			name: "Email Address",
			description: "Standard email format validation",
			type: "text",
			config: {
				inputType: "email",
				placeholder: "your@email.com",
				pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
				validationMessage: "Please enter a valid email address",
			},
			isSystem: true,
		},
		{
			id: "rs_currency_usd",
			name: "Currency (USD)",
			description: "US Dollar format",
			type: "text",
			config: {
				prefix: "$",
				inputType: "number",
				placeholder: "0.00",
				step: 0.01,
			},
			isSystem: true,
		},
		{
			id: "rs_url",
			name: "URL",
			description: "Website URL validation",
			type: "text",
			config: {
				inputType: "url",
				placeholder: "https://example.com",
				pattern: "^https?:\\/\\/.*",
				validationMessage:
					"Please enter a valid URL starting with http:// or https://",
			},
			isSystem: true,
		},
		{
			id: "rs_percent",
			name: "Percentage",
			description: "Percentage input",
			type: "text",
			config: {
				suffix: "%",
				inputType: "number",
				min: 0,
				max: 100,
				placeholder: "0",
			},
			isSystem: true,
		},
	];

	for (const rs of rulesets) {
		await db
			.insert(ruleSet)
			.values({
				...rs,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			.onConflictDoUpdate({
				target: ruleSet.id,
				set: {
					name: rs.name,
					description: rs.description,
					type: rs.type,
					config: rs.config,
					updatedAt: new Date(),
				},
			});
	}

	console.log("Seeding complete.");
}

seed().catch(console.error);
