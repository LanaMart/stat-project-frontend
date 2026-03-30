const callApi = async ({ endpoint, method = "GET", body = null }) => {
  var url = "http://localhost:8000/";
  try {
    const res = await fetch(url + endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : null,
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("API call error:", err);
    return null;
  }
};

//USAGE EXAMPLES for get and post
// GET request
const data = await callApi({ endpoint: "/some-endpoint" });

// POST request
const result = await callApi({
  endpoint: "/your-endpoint",
  method: "POST",
  body: { key: "value" },
});

//Then your button handler becomes super clean:
const handleClick = async () => {
  const data = await callApi({
    endpoint: "/your-endpoint",
    method: "POST",
    body: { key: "value" },
  });
  console.log("Response:", data);
};
