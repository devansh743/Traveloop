// =============================
// SCREEN: DASHBOARD
// =============================

Screens.dashboard = function() {
  const el = document.getElementById('screen-dashboard');
  const user = WL.currentUser || { name: 'Traveler' };
  const upcoming = WL.trips.filter(t => t.status === 'upcoming');
  const completed = WL.trips.filter(t => t.status === 'completed');
  const recommended = WL.cities.slice(0, 6);
  const nextTrip = upcoming[0] || WL.trips[0];
  const totalSpent = WL.trips.reduce((sum, trip) => sum + (trip.spent || 0), 0);
  const totalBudget = WL.trips.reduce((sum, trip) => sum + (trip.budget || 0), 0);

  el.innerHTML = `
  <section class="dashboard-hero reveal">
    <div class="dashboard-hero-copy">
      <span class="eyebrow">Odyssey AI travel command center</span>
      <h1>Good ${getGreeting()}, ${escapeHtml(user.name || 'Traveler')}</h1>
      <p>Build multi-city plans, keep costs in range, and turn scattered ideas into a polished itinerary.</p>
      <div class="dashboard-hero-actions">
        <button class="btn btn-primary btn-lg" onclick="Router.navigate('create-trip')">Plan new trip</button>
        <button class="btn btn-secondary" onclick="Router.navigate('chat')">Ask Odyssey AI</button>
        <button class="btn btn-secondary" onclick="Router.navigate('city-search')">Explore cities</button>
      </div>
    </div>
    <div class="hero-trip-panel" aria-label="Next trip snapshot">
      ${nextTrip ? `
        <div class="hero-trip-image" style="background-image:linear-gradient(180deg,rgba(8,20,34,0.1),rgba(8,20,34,0.82)),url('${tripImage(nextTrip.name)}')">
          <span>${escapeHtml(nextTrip.emoji || '✈️')}</span>
        </div>
        <div class="hero-trip-content">
          <div>
            <span class="badge badge-info">Next itinerary</span>
            <h2>${escapeHtml(nextTrip.name)}</h2>
            <p>${formatDate(nextTrip.startDate)} to ${formatDate(nextTrip.endDate)} · ${nextTrip.destinations || 0} stops</p>
          </div>
          <button class="btn btn-primary btn-block" onclick="Router.navigate('itinerary-view',{tripId:'${nextTrip.id}'})">Open itinerary</button>
        </div>` : `
        <div class="hero-trip-content">
          <span class="badge badge-info">Ready when you are</span>
          <h2>No trip yet</h2>
          <p>Create a trip to unlock itinerary, packing, budget, and sharing tools.</p>
          <button class="btn btn-primary btn-block" onclick="Router.navigate('create-trip')">Create first trip</button>
        </div>`}
    </div>
  </section>

  <section class="grid-4 reveal reveal-d1 metric-row">
    <div class="stat-card ocean">
      <div class="stat-icon">✈</div>
      <div class="stat-value">${WL.trips.length}</div>
      <div class="stat-label">Total trips</div>
    </div>
    <div class="stat-card teal">
      <div class="stat-icon">◎</div>
      <div class="stat-value">${WL.trips.reduce((a, t) => a + (t.destinations || 0), 0)}</div>
      <div class="stat-label">Destinations</div>
    </div>
    <div class="stat-card sage">
      <div class="stat-icon">$</div>
      <div class="stat-value">$${totalSpent.toLocaleString()}</div>
      <div class="stat-label">Tracked spend</div>
    </div>
    <div class="stat-card gold">
      <div class="stat-icon">✓</div>
      <div class="stat-value">${completed.length}</div>
      <div class="stat-label">Completed</div>
    </div>
  </section>

  <section class="dash-grid-main reveal reveal-d2">
    <div>
      <div class="section-header">
        <h2 class="section-title">Upcoming <em>Trips</em></h2>
        <button class="btn btn-secondary btn-sm" onclick="Router.navigate('my-trips')">View all</button>
      </div>
      <div class="trip-stack">
        ${upcoming.length ? upcoming.map(trip => renderDashboardTrip(trip)).join('') : `
          <div class="empty-state">
            <div class="empty-icon">✈</div>
            <div class="empty-title">No upcoming trips</div>
            <div class="empty-text">Start with a destination, dates, and a budget. Odyssey will shape the rest.</div>
            <button class="btn btn-primary" onclick="Router.navigate('create-trip')">Plan now</button>
          </div>`}
      </div>
    </div>

    <aside class="dashboard-side">
      <div class="card">
        <div class="mini-card-title">Quick actions</div>
        <div class="action-list">
          ${[
            { label: 'New trip', screen: 'create-trip', icon: '+' },
            { label: 'Itinerary builder', screen: 'itinerary-builder', icon: '▦' },
            { label: 'Budget cockpit', screen: 'budget', icon: '$' },
            { label: 'Packing list', screen: 'packing', icon: '✓' },
            { label: 'Public share page', screen: 'shared', icon: '↗' },
          ].map(action => `
            <button class="action-row" onclick="Router.navigate('${action.screen}')">
              <span>${action.icon}</span>
              <strong>${action.label}</strong>
            </button>`).join('')}
        </div>
      </div>

      <div class="card budget-card">
        <div class="mini-card-title">Budget pulse</div>
        <div class="budget-pulse-value">$${totalBudget.toLocaleString()}</div>
        <p>${totalBudget ? Math.round((totalSpent / totalBudget) * 100) : 0}% of planned budgets already tracked.</p>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${totalBudget ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0}%"></div>
        </div>
        <button class="btn btn-secondary btn-sm btn-block" onclick="Router.navigate('budget')">Analyze spend</button>
      </div>
    </aside>
  </section>

  <section class="section-header reveal reveal-d3">
    <h2 class="section-title">Recommended <em>Destinations</em></h2>
    <button class="btn btn-secondary btn-sm" onclick="Router.navigate('city-search')">Explore all</button>
  </section>
  <section class="recommended-scroll reveal reveal-d4">
    ${recommended.map(city => `
      <article class="dest-card" onclick="Router.navigate('city-search')">
        <div class="dest-card-img" style="background-image:linear-gradient(180deg,rgba(8,20,34,0.06),rgba(8,20,34,0.78)),url('${cityImage(city.name)}')">
          <div class="dest-card-overlay">
            <div class="dest-card-info">
              <div class="dest-card-name">${escapeHtml(city.name)}</div>
              <div class="dest-card-country">${escapeHtml(city.country)} · ${escapeHtml(city.cost)}</div>
            </div>
          </div>
        </div>
      </article>`).join('')}
  </section>`;
};

function renderDashboardTrip(trip) {
  const budget = trip.budget || 1;
  const spent = trip.spent || 0;
  const pct = Math.min(100, Math.round((spent / budget) * 100));

  return `
    <article class="dashboard-trip-card" onclick="Router.navigate('itinerary-view',{tripId:'${trip.id}'})">
      <div class="dashboard-trip-thumb" style="background-image:linear-gradient(180deg,rgba(8,20,34,0.04),rgba(8,20,34,0.78)),url('${tripImage(trip.name)}')">
        <span>${escapeHtml(trip.emoji || '✈️')}</span>
      </div>
      <div class="dashboard-trip-body">
        <div class="dashboard-trip-top">
          <div>
            <h3>${escapeHtml(trip.name)}</h3>
            <p>${formatDate(trip.startDate)} to ${formatDate(trip.endDate)} · ${trip.destinations || 0} stops</p>
          </div>
          <span class="badge badge-primary">${daysUntil(trip.startDate)}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${pct}%"></div>
        </div>
        <div class="dashboard-trip-meta">
          <span>Budget $${budget.toLocaleString()}</span>
          <span>Spent $${spent.toLocaleString()}</span>
        </div>
      </div>
    </article>`;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

function daysUntil(dateStr) {
  const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return 'Completed';
  if (diff === 0) return 'Today';
  return `In ${diff} days`;
}

function tripImage(name = '') {
  const key = name.toLowerCase();
  if (key.includes('tokyo')) return 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop';
  if (key.includes('asia') || key.includes('bali')) return 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200&auto=format&fit=crop';
  if (key.includes('europe') || key.includes('summer')) return 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1200&auto=format&fit=crop';
  return 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop';
}

function cityImage(name = '') {
  const images = {
    Paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop',
    Tokyo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop',
    'New York': 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?q=80&w=800&auto=format&fit=crop',
    Bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop',
    Barcelona: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=800&auto=format&fit=crop',
    Dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop',
  };
  return images[name] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop';
}
