const headers = {
  'Content-Type': 'application/json',
};

const get = async url => {
  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  return await response.json();
};

const post = async (url, body) => {
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
  });

  return await response.json();
};

const put = async (url, body) => {
  const response = await fetch(url, {
    method: 'PUT',
    headers,
    body,
  });

  return await response.json();
};

const remove = async url => {
  const response = await fetch(url, {
    method: 'DELETE',
    headers,
  });

  return await response.json();
};

export const http = {
  get,
  post,
  put,
  remove,
};
