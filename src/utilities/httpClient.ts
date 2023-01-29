import fetch from "node-fetch";

export const get = async (url: string): Promise<any> => {
  const response = await fetch(url);
  const body = await response.json();

  if (!response.ok) {
    throw new Error(
      `Something went wrong. Status: '${response.status}'. ${
        body?.message || ""
      }`
    );
  }

  return body;
};
