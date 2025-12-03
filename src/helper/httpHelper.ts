const BASE_URL = 'https://dummyjson.com'; // Dummy API base, replace with ASP.NET Core endpoint later

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export async function callApi<T>(
  endpoint: string,
  method: ApiMethod = 'GET',
  data?: any
): Promise<T> {
  console.log('callApi', endpoint, method, data);
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: method !== 'GET' ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    throw new Error('API call failed');
  }

  return response.json();
}
