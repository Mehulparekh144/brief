/** Today's forecast for a city: { city, highC, lowC, summary }. */
export async function getForecast(client, city) {
  const data = await client.getJson(`/forecast/${encodeURIComponent(city)}`);
  return { city, highC: data.high, lowC: data.low, summary: data.text };
}
