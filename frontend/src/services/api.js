const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Error de red");
  }

  return response.json();
}

export function fetchProjectState() {
  return request("/project-state");
}

export function triggerEvent(eventTemplateId, lang) {
  return request("/events/trigger", {
    method: "POST",
    body: JSON.stringify({ eventTemplateId, lang }),
  });
}

export function resetDemo() {
  return request("/reset", { method: "POST" });
}
