import type { NextRequest } from "next/server";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ orgSlug: string; surveySlug: string }> },
) {
	const { orgSlug, surveySlug } = await params;
	const baseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3001";

	const script = `
(function() {
  const ORG_SLUG = "${orgSlug}";
  const SURVEY_SLUG = "${surveySlug}";
  const BASE_URL = "${baseUrl}";

  function showSurvey() {
    const iframe = document.createElement('iframe');
    iframe.src = BASE_URL + '/s/' + ORG_SLUG + '/' + SURVEY_SLUG + '?embed=true';
    iframe.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;border:none;z-index:2147483647;';
    document.body.appendChild(iframe);
  }

  window.showHandshakeSurvey = showSurvey;
})();
`;

	return new Response(script, {
		headers: {
			"Content-Type": "application/javascript; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
}
