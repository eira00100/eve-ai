export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {
        const body = await request.json();

        if (!body.message) {
          return Response.json(
            { error: "Message is required." },
            { status: 400 }
          );
        }

        const response = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct",
          {
            messages: [
              {
                role: "system",
                content: `You are EVE, an intelligent and natural AI assistant.

Be conversational, thoughtful, concise, and honest.

Separate facts from assumptions.
Never invent information.
If you are uncertain, say so.
Adapt to the user's communication style.
Do not claim to have performed actions you did not perform.`
              },
              {
                role: "user",
                content: body.message
              }
            ]
          }
        );

        return Response.json({
          answer: response.response
        });

      } catch (error) {
        return Response.json(
          {
            error: "EVE encountered an error.",
            details: error.message
          },
          { status: 500 }
        );
      }
    }

    return env.ASSETS.fetch(request);
  }
};
