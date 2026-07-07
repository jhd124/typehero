export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // In the browser, we return a relative URL
    return '';
  }
  // When rendering on the server, we return an absolute URL

  if (process.env.AOT_URL) {
    return process.env.AOT_URL;
  }

  if (process.env.APP_URL) {
    return process.env.APP_URL;
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
