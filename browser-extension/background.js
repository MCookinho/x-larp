chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'LARP_GET_COOKIES') {
    getCookies().then(sendResponse);
    return true;
  }
  if (message.type === 'LARP_PING') {
    sendResponse({ alive: true });
    return true;
  }
});

async function getCookies() {
  try {
    const cookies = await chrome.cookies.getAll({ domain: 'x.com' });
    const authToken = cookies.find(c => c.name === 'auth_token')?.value || null;
    const ct0 = cookies.find(c => c.name === 'ct0')?.value || null;
    return { authToken, ct0 };
  } catch {
    return { authToken: null, ct0: null };
  }
}
