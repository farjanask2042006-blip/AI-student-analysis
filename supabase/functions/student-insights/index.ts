// Supabase Edge Function: student-insights
// Secure server-side OpenAI integration for EduPulse AI
// Follows Deno TypeScript standard for Supabase Edge Functions

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

// @ts-ignore - resolved by the Deno/Supabase runtime at execution time.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { type, payload } = await req.json();

    const openAiApiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openAiApiKey) {
      return new Response(
        JSON.stringify({
          error: "OPENAI_API_KEY_NOT_CONFIGURED",
          message: "OpenAI API key is not configured in Supabase Edge Function secrets. Utilizing deterministic rule-based fallback.",
          isFallback: true,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Build targeted prompt based on insight type
    let systemPrompt = `You are EduPulse AI, an institutional decision-support co-pilot for university faculty and academic advisors.
You analyze student academic, attendance, LMS, skills, and placement metrics to provide explainable, constructive recommendations.
CRITICAL ETHICAL & ACCURACY RULES:
1. Decision support ONLY: Never declare that a student is guaranteed to fail, drop out, or get hired.
2. Maintain data integrity: Never fabricate, hallucinate, or alter input scores or attendance percentages.
3. Constructive tone: Focus on actionable pedagogical support, faculty mentorship, and skill building.
4. Output MUST be valid JSON adhering strictly to the schema provided.`;

    let userPrompt = "";

    if (type === "student") {
      userPrompt = `Analyze student ${payload.student_id} (${payload.department}, Semester ${payload.semester || 7}):
Metrics:
- Student Success Score: ${payload.score !== null ? `${payload.score}/100` : "Incomplete Data"}
- CGPA: ${payload.cgpa !== null ? payload.cgpa : "Missing"}
- Attendance: ${payload.attendance_pct !== null ? `${payload.attendance_pct}%` : "Missing"}
- Assignment Completion: ${payload.assignment_completion_pct !== null ? `${payload.assignment_completion_pct}%` : "Missing"}
- Placement Readiness: ${payload.placement_readiness_pct !== null ? `${payload.placement_readiness_pct}%` : "Missing"}
- Skills Score: ${payload.skills_score !== null ? `${payload.skills_score}/100` : "Missing"}
- Engagement Score: ${payload.engagement_score !== null ? `${payload.engagement_score}/100` : "Missing"}
- Academic Flag: ${payload.academicRisk || "None"}
- Placement Flag: ${payload.placementRisk || "None"}
- Assigned Segment: ${payload.segment || "Unassigned"}
- Missing Indicators: ${payload.missingFields?.join(", ") || "None"}

Provide structured response in this exact JSON format:
{
  "summary": "2-3 concise sentences summarizing student status",
  "supportingIndicators": ["key metric 1", "key metric 2", "key metric 3"],
  "potentialConcerns": ["specific challenge area 1", "challenge area 2"],
  "suggestedActions": ["concrete faculty action 1", "concrete action 2", "concrete action 3"],
  "facultyQuestions": ["exploratory question for 1-on-1 meeting 1", "exploratory question 2"],
  "limitations": "Statement of any missing data or prototype constraints"
}`;
    } else if (type === "department") {
      userPrompt = `Analyze department-level aggregate for '${payload.department}':
- Total Students: ${payload.totalStudents}
- Average Success Score: ${payload.avgScore}
- Average CGPA: ${payload.avgCGPA}
- Average Attendance: ${payload.avgAttendance}%
- Average Placement Readiness: ${payload.avgPlacement}%
- Academic Review Flagged Count: ${payload.academicFlagCount}
- Placement Support Flagged Count: ${payload.placementFlagCount}

Provide structured response in this exact JSON format:
{
  "summary": "High-level department performance overview",
  "supportingIndicators": ["aggregate trend 1", "aggregate trend 2"],
  "potentialConcerns": ["departmental challenge 1", "departmental challenge 2"],
  "suggestedActions": ["department-level faculty initiative 1", "curriculum recommendation 2"],
  "facultyQuestions": ["topic for department chair review"],
  "limitations": "Based on aggregated sample cohort records"
}`;
    } else {
      userPrompt = `Analyze student cohort segment: '${payload.segmentName}' (${payload.studentCount} students):
- Common traits: ${payload.traits}
- Benchmark gaps: ${payload.gaps}

Provide structured response in this exact JSON format:
{
  "summary": "Cohort overview and pedagogical rationale",
  "supportingIndicators": ["segment pattern 1", "segment pattern 2"],
  "potentialConcerns": ["cohort risk 1", "cohort risk 2"],
  "suggestedActions": ["targeted cohort intervention 1", "targeted intervention 2"],
  "facultyQuestions": ["faculty review question for this cohort"],
  "limitations": "Synthesized from cross-sectional sample"
}`;
    }

    const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
    });

    if (!openAiResponse.ok) {
      const errText = await openAiResponse.text();
      console.error("OpenAI API call failed:", errText);
      return new Response(
        JSON.stringify({
          error: "OPENAI_REQUEST_FAILED",
          details: errText,
          isFallback: true,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const aiData = await openAiResponse.json();
    const parsedContent = JSON.parse(aiData.choices[0].message.content);

    return new Response(
      JSON.stringify({
        success: true,
        isFallback: false,
        insights: parsedContent,
        model: "gpt-4o-mini",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("Error in student-insights edge function:", error);
    const message = error instanceof Error ? error.message : "Unknown error";

    return new Response(
      JSON.stringify({
        error: "INTERNAL_EDGE_ERROR",
        message,
        isFallback: true,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
