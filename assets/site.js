(() => {
  document.querySelector('[data-print]')?.addEventListener('click', () => window.print());
  // Socials are configured in the public Markdown table.
  const socialGrid = document.querySelector('.social-grid');
  if (socialGrid) {
    const socialSearch = document.querySelector('#social-search');
    const socialFilters = [...document.querySelectorAll('[data-social-filter]')];
    let onlyAvailable = false;
    function updateSocials() {
      const cards = [...socialGrid.querySelectorAll('.social-card')];
      const query = socialSearch.value.trim().toLocaleLowerCase();
      let visible = 0;
      let available = 0;
      cards.forEach(card => {
        const active = card.dataset.available === 'true';
        if (active) available++;
        card.hidden = !((!onlyAvailable || active) && `${card.dataset.name} ${card.dataset.username || ''}`.toLocaleLowerCase().includes(query));
        if (!card.hidden) visible++;
      });
      document.querySelector('.social-count').textContent = `${visible} ${visible === 1 ? 'platform' : 'platforms'} · ${available} ${available === 1 ? 'available link' : 'available links'}`;
      document.querySelector('.social-empty').hidden = visible > 0;
      socialFilters.forEach(button => {
        const selected = (button.dataset.socialFilter === 'available') === onlyAvailable;
        button.classList.toggle('active', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
    }
    socialSearch.addEventListener('input', updateSocials);
    socialFilters.forEach(button => button.addEventListener('click', () => {
      onlyAvailable = button.dataset.socialFilter === 'available';
      updateSocials();
    }));
    updateSocials();
    Promise.all([fetch('/content/socials.md').then(response => { if (!response.ok) throw new Error('Social links unavailable'); return response.text(); }), fetch('/assets/social-icons.json').then(response => { if (!response.ok) throw new Error('Social icons unavailable'); return response.json(); })]).then(([markdown, icons]) => {
      const cards = [];
      for (const line of markdown.split('\n')) {
        if (!line.startsWith('|')) continue;
        const parts = line.replace(/^\||\|$/g, '').split('|').map(value => value.trim());
        if (parts.length !== 3) continue;
        const [label, username, value] = parts;
        if (label === 'Platform' || label.startsWith('---')) continue;
        let url;
        try { url = new URL(value); } catch { /* A placeholder has no URL. */ }
        const available = Boolean(url && ((url.protocol === 'https:' && url.hostname) || (url.protocol === 'mailto:' && url.pathname.includes('@'))));
        const card = document.createElement(available ? 'a' : 'div');
        card.className = `social-card${available ? '' : ' placeholder'}`;
        card.dataset.name = label;
        card.dataset.username = username && username !== 'PLACEHOLDER' ? username : '@username';
        card.dataset.available = String(available);
        if (available) {
          card.href = url.href;
          if (url.protocol === 'https:') { card.target = '_blank'; card.rel = 'noopener noreferrer'; }
        }
        const symbol = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); symbol.classList.add('social-icon'); symbol.setAttribute('viewBox', '0 0 24 24'); symbol.setAttribute('aria-hidden', 'true');
        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use'); use.setAttribute('href', `/assets/social-icons.svg#${icons[label] || 'icon-personalwebsite'}`); symbol.append(use);
        const name = document.createElement('h3'); name.textContent = label;
        const status = document.createElement('span'); status.className = 'social-status'; status.textContent = available ? (url.protocol === 'mailto:' ? 'Send an email' : 'Visit profile') : 'Link coming soon';
        const handle = document.createElement('span'); handle.className = 'social-username'; handle.textContent = card.dataset.username;
        card.append(symbol, name, handle, status); cards.push(card);
      }
      socialGrid.replaceChildren(...cards);
      updateSocials();
    }).catch(() => { /* Keep generated cards available offline. */ });
  }
  const search = document.querySelector('#directory-search');
  if (!search) return;
  const cards = [...document.querySelectorAll('.destination')];
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const count = document.querySelector('.result-count');
  let category = 'all';
  function update() {
    const query = search.value.trim().toLocaleLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const match = (category === 'all' || card.dataset.category === category) && card.textContent.toLocaleLowerCase().includes(query);
      card.hidden = !match;
      if (match) visible++;
    });
    count.textContent = `${visible} ${visible === 1 ? 'destination' : 'destinations'}`;
    document.querySelector('.empty-state').hidden = visible > 0;
    buttons.forEach(button => {
      const selected = button.dataset.filter === category;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }
  buttons.forEach(button => button.addEventListener('click', () => { category = button.dataset.filter; update(); }));
  search.addEventListener('input', update);
  update();
})();

(() => {
  const buttons = [...document.querySelectorAll('[data-theme-toggle]')];
  function apply(theme) {
    const light = theme === 'light';
    document.documentElement.dataset.theme = light ? 'light' : 'dark';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', light ? '#f2efdf' : '#333c43');
    for (const button of buttons) {
      const label = light ? 'Switch to dark mode' : 'Switch to light mode';
      button.setAttribute('aria-label', label);
      button.title = label;
      button.querySelector('.theme-icon').textContent = light ? '☾' : '☀';
      button.querySelector('.theme-label').textContent = light ? 'Dark mode' : 'Light mode';
    }
  }
  apply(document.documentElement.dataset.theme);
  buttons.forEach(button => button.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    apply(theme);
    try { localStorage.setItem('sebi-theme', theme); } catch { /* Mode still works for this visit. */ }
  }));
  window.addEventListener('storage', event => {
    if (event.key === 'sebi-theme') apply(event.newValue === 'light' ? 'light' : 'dark');
  });
})();

(() => {
  document.querySelectorAll('[data-emoji-play]').forEach(button => {
    const image = button.querySelector('img');
    button.style.setProperty('--sticker-image', `url("${image.getAttribute('src')}")`);
    button.addEventListener('click', () => {
      button.classList.remove('celebrate');
      void button.offsetWidth;
      button.classList.add('celebrate');
    });
  });
})();
