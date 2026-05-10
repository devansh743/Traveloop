// =============================
// SCREEN 2: DASHBOARD
// Terracotta & Ink
// =============================

Screens.dashboard = function() {
  const el = document.getElementById('screen-dashboard');
  const user = WL.currentUser || { name: 'Traveler' };
  const upcoming = WL.trips.filter(t => t.status === 'upcoming');
  const completed = WL.trips.filter(t => t.status === 'completed');
  const recommended = WL.cities.slice(0, 6);

  el.innerHTML = 
<!-- HERO WELCOME -->
  <div class="dashboard-hero reveal">
    <h2>Good ${getGreeting()}, ${user.name || 'Traveler'}</h2>
    <p>You have <strong>${upcoming.length} upcoming trip${upcoming.length !== 1 ? 's' : ''}</strong> planned. Ready to explore the world?</p>
    <div class="dashboard-hero-actions">
      <button class="btn btn-primary btn-lg" onclick="Router.navigate('create-trip')">⊕ Plan New Trip</button>
      <button class="btn btn-secondary" onclick="Router.navigate('my-trips')">◐ View All Trips</button>
      <button class="btn btn-secondary" onclick="Router.navigate('city-search')">◎ Explore Cities</button>
    </div>
  </div>

  <!-- STAT CARDS -->
  <div class="grid-4 reveal reveal-d1" style="margin-bottom:28px">
    <div class="stat-card terra">
      <div class="stat-icon">◐</div>
      <div class="stat-value">${WL.trips.length}</div>
      <div class="stat-label">Total Trips</div>
    </div>
    <div class="stat-card ocean">
      <div class="stat-icon">◎</div>
      <div class="stat-value">${WL.trips.reduce((a,t)=>a+t.destinations,0)}</div>
      <div class="stat-label">Destinations</div>
    </div>
    <div class="stat-card sage">
      <div class="stat-icon">◆</div>
      <div class="stat-value">${WL.trips.reduce((a,t)=>a+t.spent,0).toLocaleString()}</div>
      <div class="stat-label">Total Spent</div>
    </div>
    <div class="stat-card gold">
      <div class="stat-icon">✓</div>
      <div class="stat-value">${completed.length}</div>
      <div class="stat-label">Completed</div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 300px;gap:22px;margin-bottom:28px" class="dash-grid-main reveal reveal-d2">

    <!-- UPCOMING TRIPS -->
    <div>
      <div class="section-header">
        <h2 class="section-title">Upcoming <em>Trips</em></h2>
        <a href="#" class="btn btn-secondary btn-sm" onclick="Router.navigate('my-trips');return false">View all</a>
      </div>
      ${upcoming.length ? upcoming.map(trip => `
      <div class="card" style="margin-bottom:14px;cursor:pointer" onclick="Router.navigate('itinerary-view',{tripId:'${trip.id}'})">
        <div style="display:flex;align-items:center;gap:16px">
          <div style="font-size:40px;flex-shrink:0">${trip.emoji}</div>
          <div style="flex:1">
            <div style="font-family:'Cormorant Garamond',serif;font-size:19px;font-weight:700;margin-bottom:4px">${trip.name}</div>
            <div style="font-size:12.5px;color:var(--text-secondary);margin-bottom:10px">
              ${formatDate(trip.startDate)} → ${formatDate(trip.endDate)} · ${trip.destinations} destinations
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width:${Math.min(100,Math.round((trip.spent/trip.budget)*100))}%"></div>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-secondary);margin-top:6px">
              <span>Budget: ${trip.budget.toLocaleString()}</span>
              <span style="color:var(--sage)">Spent: ${trip.spent.toLocaleString()}</span>
            </div>
          </div>
          <span class="badge badge-primary">${daysUntil(trip.startDate)}</span>
        </div>
      </div>`).join('') : `
      <div class="empty-state">
        <div class="empty-icon">◐</div>
        <div class="empty-title">No Upcoming Trips</div>
        <div class="empty-text">Start planning your next adventure!</div>
        <button class="btn btn-primary" onclick="Router.navigate('create-trip')">Plan Now →</button>
      </div>`}
    </div>

    <!-- QUICK ACTIONS + BUDGET -->
    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="card">
        <div style="font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:700;margin-bottom:14px">Quick Actions</div>
        <div style="display:flex;flex-direction:column;gap:6px">
          ${[
            {icon:'⊕', label:'New Trip', screen:'create-trip'},
            {icon:'▦', label:'Itinerary Builder', screen:'itinerary-builder'},
            {icon:'☐', label:'Packing List', screen:'packing'},
            {icon:'≡', label:'Trip Notes', screen:'notes'},
            {icon:'↗', label:'Share Itinerary', screen:'shared'},
          ].map(a => `
          <button class="btn btn-secondary" style="justify-content:flex-start;border-radius:var(--radius-md)"
            onclick="Router.navigate('${a.screen}')">
            ${a.icon} ${a.label}
          </button>`).join('')}
        </div>
      </div>

      ${upcoming[0] ? `
      <div class="card">
        <div style="font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:700;margin-bottom:14px">Budget Highlight</div>
        <div style="font-size:12.5px;color:var(--text-secondary);margin-bottom:6px">${upcoming[0].name}</div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:700;color:var(--terracotta);margin-bottom:8px">${upcoming[0].budget.toLocaleString()}</div>
        <div class="progress-bar" style="margin-bottom:8px">
          <div class="progress-fill" style="width:${Math.round((upcoming[0].spent/upcoming[0].budget)*100)}%"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12.5px;color:var(--text-secondary)">
          <span>Spent: <strong style="color:var(--text-primary)">${upcoming[0].spent.toLocaleString()}</strong></span>
          <span>Left: <strong style="color:var(--sage)">${(upcoming[0].budget-upcoming[0].spent).toLocaleString()}</strong></span>
        </div>
        <button class="btn btn-secondary btn-sm btn-block" style="margin-top:12px" onclick="Router.navigate('budget')">View Full Budget →</button>
      </div>` : ''}
    </div>
  </div>

  <!-- RECOMMENDED DESTINATIONS -->
  <div class="section-header reveal reveal-d3">
    <h2 class="section-title">Recommended <em>Destinations</em></h2>
    <a href="#" class="btn btn-secondary btn-sm" onclick="Router.navigate('city-search');return false">Explore all</a>
  </div>
  <div class="recommended-scroll reveal reveal-d4">
    ${recommended.map(city => `
    <div class="dest-card" style="width:190px;min-width:190px" onclick="Router.navigate('city-search')">
      <div class="dest-card-img" style="background:${cityGradient(city.name)}">
        <span>${city.emoji}</span>
        <div class="dest-card-overlay">
          <div class="dest-card-info">
            <div class="dest-card-name">${city.name}</div>
            <div class="dest-card-country">${city.country} · ${city.cost}</div>
          </div>
        </div>
      </div>
    </div>`).join('')}
  </div>

  <style>
    @media(max-width:900px){.dash-grid-main{grid-template-columns:1fr!important}}
  </style>
;
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

function daysUntil(dateStr) {
  const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000*60*60*24));
  if (diff < 0) return 'Completed';
  if (diff === 0) return 'Today!';
  return `In ${diff} days`;
}

function cityGradient(name) {
  const gradients = {
    Paris:      'linear-gradient(135deg,#2a1a10,#3d2e20)',
    Tokyo:      'linear-gradient(135deg,#1a1a2e,#1b4965)',
    'New York': 'linear-gradient(135deg,#1a1a1a,#2a2a2a)',
    Bali:       'linear-gradient(135deg,#1a2d1a,#3d5a3d)',
    Barcelona:  'linear-gradient(135deg,#3d2010,#5a3020)',
    Dubai:      'linear-gradient(135deg,#3d3020,#5a4830)',
    Rome:       'linear-gradient(135deg,#2d1a14,#4a2a1a)',
    Sydney:     'linear-gradient(135deg,#1a2d3d,#1b4965)',
    Istanbul:   'linear-gradient(135deg,#2d1a2d,#4a2a4a)',
    Santorini:  'linear-gradient(135deg,#1a2040,#2a4070)',
  };
  return gradients[name] || 'linear-gradient(135deg,#2a2a2a,#3d3020)';
}
