// Deploy: npx supabase functions deploy kyc-verify
// Secret:  npx supabase secrets set XOBRIQ_API_TOKEN=xob_test_...
//
// Thin proxy so the Xobriq bearer token never reaches the browser. Supabase verifies
// the caller's auth JWT before this function runs (default behavior), so only signed-in
// users can trigger a check. No other business logic belongs here.

const XOBRIQ_BASE_URL = "https://xobriq.ai/api/v1/kyc";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function buildXobriqRequest(payload) {
  switch (payload.type) {
    case "identity":
      return {
        endpoint: "verify-identity",
        body: {
          identifierType: payload.documentType,
          identifierNumber: payload.reference,
          lastName: payload.lastName || undefined,
        },
      };
    case "phone":
      return {
        endpoint: "verify-phone",
        body: {
          nationalId: payload.nationalId,
          mobileNumber: payload.reference,
        },
      };
    case "business":
      return {
        endpoint: "verify-business",
        body: {
          registrationNumber: payload.reference,
        },
      };
    default:
      return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    const payload = await req.json();
    const request = buildXobriqRequest(payload);

    if (!request) {
      return new Response(JSON.stringify({ errorMessage: `Unknown verification type: ${payload.type}` }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const xobriqResponse = await fetch(`${XOBRIQ_BASE_URL}/${request.endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("XOBRIQ_API_TOKEN")}`,
      },
      body: JSON.stringify(request.body),
    });

    const data = await xobriqResponse.json();

    return new Response(JSON.stringify(data), {
      status: xobriqResponse.status,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ errorMessage: err.message }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});
