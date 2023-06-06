const fetchCategoryActive = async () => {
  const apiRes = await fetch(
    `http://localhost:8080/categories/active`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!apiRes.ok) {
    throw new Error(`categories fetch is not ok`);
  }

  return apiRes.json();
};

export default fetchCategoryActive;
