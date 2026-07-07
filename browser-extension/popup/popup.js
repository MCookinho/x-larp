const $ = id => document.getElementById(id);

const loadingEl = $('loading');
const foundEl = $('found');
const missingEl = $('missing');
const actionsEl = $('actions');
const refreshBtn = $('refreshBtn');

async function checkCookies() {
  loadingEl.style.display = 'flex';
  foundEl.style.display = 'none';
  missingEl.style.display = 'none';
  actionsEl.style.display = 'none';

  chrome.runtime.sendMessage({ type: 'LARP_GET_COOKIES' }, (response) => {
    loadingEl.style.display = 'none';
    actionsEl.style.display = 'block';

    if (chrome.runtime.lastError || !response) {
      missingEl.style.display = 'flex';
      missingEl.querySelector('small')!.innerHTML =
        'Não foi possível contactar a extensão.';
      return;
    }

    if (response.authToken && response.ct0) {
      foundEl.style.display = 'flex';
    } else {
      missingEl.style.display = 'flex';
    }
  });
}

refreshBtn?.addEventListener('click', checkCookies);
document.addEventListener('DOMContentLoaded', checkCookies);
