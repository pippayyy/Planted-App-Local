async function fetchOrders() {
  const res = await fetch(`http://localhost:8080/getorders`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`getorders fetch is not ok`);
  }

  return res.json();
}

export default fetchOrders;
