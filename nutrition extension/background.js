// background.js
const BOT_ID      = "";
const WORKFLOW_ID = "";
const API_KEY     = "";
const RUN_URL     = "https://api.coze.com/v1/workflow/run";

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type !== "FETCH_NUTRITION") return;
  console.log("Message received for:", msg.itemName);

  fetch(RUN_URL, {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      bot_id:      BOT_ID,
      workflow_id: WORKFLOW_ID,
      parameters: { input: msg.itemName }
    })
  })
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(data => {
    console.log("Workflow raw response:", data);
    // The markdown might be under data.output or data.result
    const summary = typeof data.output === "string"
      ? data.output
      : typeof data.result === "string"
        ? data.result
        : `Unexpected response: ${JSON.stringify(data)}`;
    sendResponse(summary);
  })
  .catch(err => {
    console.error("Nutrition API error:", err);
    sendResponse(`ERROR: ${err.message}`);
  });

  return true; // keep sendResponse alive
});
