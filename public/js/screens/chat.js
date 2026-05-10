// =============================
// SCREEN: AI CHAT ASSISTANT
// =============================

Screens.chat = function() {
  const el = document.getElementById('screen-chat');

  el.innerHTML = `
  <div class="section-header reveal">
    <div>
      <h2 class="section-title">Odyssey <em>AI Planner</em></h2>
      <p style="color:var(--text-secondary);font-size:14px;margin-top:4px">Ask for routes, packing, budget tradeoffs, hidden gems, or itinerary refinements.</p>
    </div>
  </div>

  <div class="card reveal reveal-d1 chat-shell">
    <div class="chat-suggestion-row">
      ${['Plan 3 days in Tokyo under $900', 'What should I pack for Bali?', 'Reduce my Europe trip budget', 'Find hidden gems in Paris'].map(prompt => `
        <button class="chip" onclick="ChatScreen.usePrompt('${escapeHtml(prompt)}')">${escapeHtml(prompt)}</button>
      `).join('')}
    </div>

    <div class="chat-history" id="chatHistory">
      <div class="chat-message ai">
        <strong>Odyssey AI</strong>
        <span>I can help shape trips, compare cities, generate packing ideas, and spot budget risks. What are we planning?</span>
      </div>
    </div>

    <div class="chat-compose">
      <input type="text" class="form-input" id="chatInput" placeholder="Ask about destinations, packing, budgets, or routes..." onkeypress="if(event.key==='Enter') ChatScreen.send()">
      <button class="btn btn-primary" onclick="ChatScreen.send()">Send</button>
    </div>
  </div>`;
};

window.ChatScreen = {
  usePrompt(prompt) {
    document.getElementById('chatInput').value = prompt;
    this.send();
  },

  async send() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;

    const history = document.getElementById('chatHistory');
    history.insertAdjacentHTML('beforeend', `<div class="chat-message user">${escapeHtml(text)}</div>`);
    input.value = '';

    const loading = document.createElement('div');
    loading.className = 'chat-message ai loading';
    loading.textContent = 'Thinking through the trip details...';
    history.appendChild(loading);
    history.scrollTop = history.scrollHeight;

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, trips: WL.trips })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'AI request failed');
      loading.className = 'chat-message ai';
      loading.innerHTML = `<strong>Odyssey AI</strong><span>${escapeHtml(data.reply || 'I have a few ideas for that trip.')}</span>${renderActions(data.suggested_actions)}`;
    } catch (error) {
      loading.className = 'chat-message ai';
      loading.innerHTML = `<strong>Offline mode</strong><span>${offlineReply(text, error.message)}</span>`;
    }

    history.scrollTop = history.scrollHeight;
  }
};

function renderActions(actions = []) {
  if (!actions.length) return '';
  return `<div class="chat-actions">${actions.slice(0, 3).map(action => `<span class="badge badge-info">${escapeHtml(action)}</span>`).join('')}</div>`;
}

function offlineReply(text, reason) {
  const lower = text.toLowerCase();
  if (lower.includes('pack')) {
    return 'API key is not configured yet, so here is a practical starter set: documents, chargers, weather-ready clothing, compact toiletries, medicines, and one flexible outfit per two travel days.';
  }
  if (lower.includes('budget') || lower.includes('cheap')) {
    return 'API key is not configured yet, so here is the quick budget move: cap stays and food first, group activities by neighborhood, keep one free activity daily, and reserve 12-15% for surprises.';
  }
  return `AI backend is reachable, but ${escapeHtml(reason)}. For now, start with destination, dates, budget, pace, and interests, then use the itinerary builder to turn that into stops and activities.`;
}
