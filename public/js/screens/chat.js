// =============================
// SCREEN: AI CHAT ASSISTANT
// =============================

Screens.chat = function() {
  const el = document.getElementById('screen-chat');
  
  el.innerHTML = `
  <div class="section-header reveal">
    <h2 class="section-title">AI Travel <em>Assistant</em></h2>
  </div>
  
  <div class="card reveal reveal-d1" style="display:flex;flex-direction:column;height:65vh;padding:0;">
    <div style="flex:1;overflow-y:auto;padding:24px;display:flex;flex-direction:column;gap:16px;" id="chatHistory">
      <div style="align-self:flex-start;background:var(--bg-inset);padding:12px 16px;border-radius:16px 16px 16px 0;max-width:80%;">
        Hello! I'm your Odyssey AI Assistant. How can I help you plan your next adventure?
      </div>
    </div>
    
    <div style="border-top:1px solid var(--border);padding:16px;display:flex;gap:12px;">
      <input type="text" class="form-input" id="chatInput" placeholder="Ask me about destinations, packing, or budgets..." style="flex:1;" onkeypress="if(event.key==='Enter') sendChatMessage()">
      <button class="btn btn-primary" onclick="sendChatMessage()">Send ↗</button>
    </div>
  </div>
  `;
};

window.sendChatMessage = function() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  
  const history = document.getElementById('chatHistory');
  
  // User message
  const userMsg = document.createElement('div');
  userMsg.style.cssText = "align-self:flex-end;background:var(--terracotta);color:#fff;padding:12px 16px;border-radius:16px 16px 0 16px;max-width:80%;";
  userMsg.textContent = text;
  history.appendChild(userMsg);
  
  input.value = '';
  history.scrollTop = history.scrollHeight;
  
  // AI Loading
  const aiMsg = document.createElement('div');
  aiMsg.style.cssText = "align-self:flex-start;background:var(--bg-inset);padding:12px 16px;border-radius:16px 16px 16px 0;max-width:80%;font-style:italic;color:var(--text-muted);";
  aiMsg.textContent = "Thinking...";
  history.appendChild(aiMsg);
  history.scrollTop = history.scrollHeight;
  
  // Mock AI Response (Connect to backend later)
  setTimeout(() => {
    aiMsg.style.fontStyle = 'normal';
    aiMsg.style.color = 'var(--text-primary)';
    aiMsg.innerHTML = "I am currently running in offline mode, but once connected to the Odyssey backend, I can analyze your budget, build itineraries, and give real-time advice for <strong>" + text + "</strong>!";
    history.scrollTop = history.scrollHeight;
  }, 1000);
};
