// =============================
// SCREEN 9: BUDGET
// Terracotta & Ink
// =============================

Screens.budget = function() {
  const el = document.getElementById('screen-budget');
  const trip = WL.trips[0];

  // Updated colors for the terracotta palette
  const bd = {
    transport:     { amount: 620, label: 'Transport',    emoji: '✈', color: '#1b4965' },
    accommodation: { amount: 980, label: 'Stay',         emoji: '⌂', color: '#c2703e' },
    activities:    { amount: 340, label: 'Activities',   emoji: '◇', color: '#c9a959' },
    food:          { amount: 420, label: 'Food',         emoji: '⊙', color: '#7c9473' },
    shopping:      { amount: 240, label: 'Shopping',     emoji: '◈', color: '#c17c74' },
  };

  if (!trip) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">◆</div>
    <div class="empty-title">No Trips Yet</div>
    <button class="btn btn-primary" onclick="Router.navigate('create-trip')">Create a Trip</button></div>`;
    return;
  }

  const total = Object.values(bd).reduce((s, v) => s + v.amount, 0);
  const budget = trip.budget || 3500;
  const remaining = budget - total;
  const pct = Math.round((total / budget) * 100);
  const days = Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (86400000)) || 1;

  // Build CSS conic-gradient for donut
  let cumulative = 0;
  const colors = Object.values(bd).map(v => v.color);
  const segments = Object.values(bd).map((v, i) => {
    const pctSeg = (v.amount / total) * 360;
    const seg = `${colors[i]} ${cumulative}deg ${cumulative + pctSeg}deg`;
    cumulative += pctSeg;
    return seg;
  });
  const donutGradient = `conic-gradient(${segments.join(', ')})`;

  el.innerHTML = `
  <div style="margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px" class="reveal">
    <div>
      <h1 style="font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:700;margin-bottom:4px">Budget & Costs</h1>
      <p style="color:var(--text-secondary)">${trip.emoji} ${trip.name}</p>
    </div>
    ${WL.trips.length > 1 ? `
    <select class="form-select" style="width:auto" onchange="Screens.budget()">
      ${WL.trips.map(t=>`<option>${t.emoji} ${t.name}</option>`).join('')}
    </select>` : ''}
  </div>

  <!-- Overview Stats -->
  <div class="grid-4 reveal reveal-d1" style="margin-bottom:24px">
    <div class="stat-card ocean">
      <div class="stat-icon">◆</div>
      <div class="stat-value">$${budget.toLocaleString()}</div>
      <div class="stat-label">Total Budget</div>
    </div>
    <div class="stat-card terra">
      <div class="stat-icon">◈</div>
      <div class="stat-value">$${total.toLocaleString()}</div>
      <div class="stat-label">Estimated Cost</div>
    </div>
    <div class="stat-card ${remaining >= 0 ? 'sage' : 'gold'}">
      <div class="stat-icon">${remaining >= 0 ? '✓' : '!'}</div>
      <div class="stat-value" style="color:${remaining >= 0 ? 'var(--sage)' : 'var(--warm-gold)'}">
        ${remaining >= 0 ? '' : '-'}$${Math.abs(remaining).toLocaleString()}
      </div>
      <div class="stat-label">${remaining >= 0 ? 'Remaining' : 'Over Budget'}</div>
    </div>
    <div class="stat-card gold">
      <div class="stat-icon">⊙</div>
      <div class="stat-value">$${Math.round(total / days).toLocaleString()}</div>
      <div class="stat-label">Avg per Day</div>
    </div>
  </div>

  ${remaining < 0 ? `
  <div class="card-warm reveal reveal-d2" style="display:flex;gap:12px;align-items:center;margin-bottom:22px;border-left:3px solid var(--warm-gold)">
    <span style="font-size:20px">!</span>
    <div>
      <div style="font-weight:700;color:var(--warm-gold);margin-bottom:2px">Over Budget Alert</div>
      <div style="font-size:13px;color:var(--text-secondary)">Your estimated spend exceeds your budget by $${Math.abs(remaining).toLocaleString()}. Consider adjusting.</div>
    </div>
  </div>` : ''}

  <!-- Budget Progress -->
  <div class="card reveal reveal-d2" style="margin-bottom:20px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <span style="font-weight:600;font-size:15px">Overall Budget Usage</span>
      <span style="font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:700;color:${pct > 100 ? 'var(--dusty-rose)' : 'var(--terracotta)'}">${pct}%</span>
    </div>
    <div class="progress-bar" style="height:10px">
      <div class="progress-fill" style="width:${Math.min(100, pct)}%;background:${pct > 100 ? 'linear-gradient(90deg,var(--warm-gold),var(--dusty-rose))' : ''}"></div>
    </div>
    <div style="display:flex;justify-content:space-between;font-size:12.5px;color:var(--text-secondary);margin-top:8px">
      <span>$0</span><span>$${budget.toLocaleString()}</span>
    </div>
  </div>

  <!-- Breakdown -->
  <div style="display:grid;grid-template-columns:auto 1fr;gap:28px;align-items:center;margin-bottom:24px" class="budget-overview reveal reveal-d3">
    <div class="donut-chart" style="background:${donutGradient}">
      <div class="donut-inner">
        <div class="donut-total">$${total.toLocaleString()}</div>
        <div class="donut-label">Total Spend</div>
      </div>
    </div>
    <div class="budget-bars">
      ${Object.values(bd).map(cat => `
      <div class="budget-bar-item">
        <div class="budget-bar-label">
          <span>${cat.emoji} ${cat.label}</span>
          <span>$${cat.amount.toLocaleString()} (${Math.round((cat.amount/total)*100)}%)</span>
        </div>
        <div class="progress-bar">
          <div style="height:100%;border-radius:999px;width:${Math.round((cat.amount/total)*100)}%;background:${cat.color};transition:width 0.6s ease"></div>
        </div>
      </div>`).join('')}
    </div>
  </div>

  <!-- Legend -->
  <div class="budget-legend card reveal reveal-d4" style="margin-bottom:24px">
    ${Object.values(bd).map(cat => `
    <div class="legend-item">
      <div class="legend-dot" style="background:${cat.color}"></div>
      ${cat.emoji} ${cat.label}: <strong>$${cat.amount.toLocaleString()}</strong>
    </div>`).join('')}
  </div>

  <!-- Daily Breakdown -->
  <div class="section-header reveal reveal-d4">
    <h2 class="section-title">Day-by-Day <em>Estimate</em></h2>
  </div>
  <div class="card reveal reveal-d5">
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:12px">
      ${Array.from({length: Math.min(days, 10)}, (_, i) => {
        const dayAmt = Math.round((total / days) * (0.8 + Math.random() * 0.4));
        const isOver = dayAmt > Math.round(budget / days);
        return `
        <div style="text-align:center;padding:14px;background:var(--bg-raised);border:1px solid ${isOver ? 'rgba(201,169,89,0.3)' : 'var(--border)'};border-radius:var(--radius-md)">
          <div style="font-size:11px;color:var(--text-muted);margin-bottom:6px">Day ${i + 1}</div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:700;color:${isOver ? 'var(--warm-gold)' : 'var(--text-primary)'}">$${dayAmt}</div>
          ${isOver ? '<div style="font-size:10px;color:var(--warm-gold)">! High</div>' : ''}
        </div>`;
      }).join('')}
      ${days > 10 ? `<div style="text-align:center;padding:14px;color:var(--text-muted);font-size:12.5px">+${days - 10} more</div>` : ''}
    </div>
  </div>

  <style>@media(max-width:700px){.budget-overview{grid-template-columns:1fr!important}}</style>`;
};
