async function fetchLatestOrder() {
  const res = await fetch(`http://localhost:8080/getorder/latest`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`fetchLatestOrder fetch is not ok`);
  }

  return res.json();
}

export default fetchLatestOrder;
