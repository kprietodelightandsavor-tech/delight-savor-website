export default async function handler(request, context) {
  const response = await context.next();
  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) return response;
  try {
    let html = await response.text();
    const css = '<link rel="stylesheet" href="/teaching-method-notes.css">';
    const js = '<script src="/teaching-method-notes.js" defer></script>';
    if (!html.includes('/teaching-method-notes.css')) html = html.replace('</head>', css + '\n</head>');
    if (!html.includes('/teaching-method-notes.js')) html = html.replace('</body>', js + '\n</body>');
    const headers = new Headers(response.headers);
    headers.delete('content-length');
    return new Response(html,{status:response.status,statusText:response.statusText,headers});
  } catch(err){ return response; }
}
