async function fetchDeliveryOptions() {
  const res = await fetch(
    `http://localhost:8080/order/getdeliveryoptions`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error(`delivery options fetch is not ok`);
  }

  return res.json();
}

export default fetchDeliveryOptions;
