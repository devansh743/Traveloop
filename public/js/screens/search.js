// =============================
// SCREENS 7 & 8: SEARCH
// City Search + Activity Search
// =============================

// ---- SCREEN 7: CITY SEARCH ----
Screens['city-search'] = function() {
  const el = document.getElementById('screen-city-search');

  el.innerHTML = `
  <div style="margin-bottom:28px">
    <h1 style="font-size:26px;font-weight:800;margin-bottom:6px">🔍 Explore Cities</h1>
    <p style="color:var(--text-secondary)">Discover and add amazing destinations to your trips</p>
  </div>

  <!-- Search + Filters -->
  <div style="display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap;align-items:center">
    <div class="search-bar" style="flex:1;min-width:220px">
      <span class="search-icon">🔍</span>
      <input type="text" placeholder="Search cities, countries..." id="citySearch"
        oninput="CitySearch.search(this.value)" />
    </div>
    <select class="form-select" style="width:auto" id="cityRegion" onchange="CitySearch.filterRegion(this.value)">
      <option value="">All Regions</option>
      <option>Europe</option>
      <option>Asia</option>
      <option>Americas</option>
      <option>Oceania</option>
      <option>Africa</option>
      <option>Middle East</option>
    </select>
    <select class="form-select" style="width:auto" id="cityCost" onchange="CitySearch.filterCost(this.value)">
      <option value="">Any Budget</option>
      <option value="$">Budget ($)</option>
      <option value="$$">Mid-range ($$)</option>
      <option value="$$$">Premium ($$$)</option>
    </select>
  </div>

  <!-- Chips -->
  <div class="chip-group" id="cityChips">
    ${['All','Europe','Asia','Americas','Africa','Oceania'].map((r,i) =>
      `<button class="chip ${i===0?'active':''}" onclick="CitySearch.chipFilter('${r}',this)">${r}</button>`
    ).join('')}
  </div>

  <!-- Results -->
  <div id="cityResults" style="display:flex;flex-direction:column;gap:12px">
    ${renderCityCards(WL.cities)}
  </div>`;
};

function renderCityCards(cities) {
  if (!cities.length) return `<div class="empty-state">
    <div class="empty-icon">🌍</div>
    <div class="empty-title">No cities found</div>
    <div class="empty-text">Try a different search or filter</div>
  </div>`;

  return cities.map(city => `
  <div class="city-card">
    <div class="city-emoji">${city.emoji}</div>
    <div class="city-info">
      <div class="city-name">${city.name}</div>
      <div class="city-country">${city.country} &middot; ${city.region}</div>
      <div class="city-meta">
        <span class="city-meta-item">💰 ${city.cost}</span>
        <span class="city-meta-item">⭐ ${city.rating}</span>
        <span class="city-meta-item">🔥 ${city.popularity}% popular</span>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end">
      <button class="btn btn-primary btn-sm" onclick="CitySearch.addToTrip('${city.name}')">+ Add to Trip</button>
      <button class="btn btn-secondary btn-sm" onclick="Router.navigate('activity-search')">🎯 Activities</button>
    </div>
  </div>`).join('');
}

window.CitySearch = {
  search(q) {
    const filtered = WL.cities.filter(c =>
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.country.toLowerCase().includes(q.toLowerCase())
    );
    document.getElementById('cityResults').innerHTML = renderCityCards(filtered);
  },

  filterRegion(region) {
    const filtered = region ? WL.cities.filter(c => c.region === region) : WL.cities;
    document.getElementById('cityResults').innerHTML = renderCityCards(filtered);
  },

  filterCost(cost) {
    const filtered = cost ? WL.cities.filter(c => c.cost === cost) : WL.cities;
    document.getElementById('cityResults').innerHTML = renderCityCards(filtered);
  },

  chipFilter(region, btn) {
    document.querySelectorAll('#cityChips .chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const filtered = region === 'All' ? WL.cities : WL.cities.filter(c => c.region === region);
    document.getElementById('cityResults').innerHTML = renderCityCards(filtered);
  },

  addToTrip(cityName) {
    if (!WL.trips.length) {
      showToast('Create a trip first!', 'error'); return;
    }
    const trip = WL.trips[0];
    const city = WL.cities.find(c => c.name === cityName);
    if (!city) return;
    trip.stops.push({ city: city.name, country: city.country, emoji: city.emoji, dates: '', activities: [] });
    trip.destinations = trip.stops.length;
    WL.save();
    showToast(`📍 ${cityName} added to "${trip.name}"!`, 'success');
  }
};

// ---- SCREEN 8: ACTIVITY SEARCH ----
Screens['activity-search'] = function() {
  const el = document.getElementById('screen-activity-search');

  el.innerHTML = `
  <div style="margin-bottom:28px">
    <h1 style="font-size:26px;font-weight:800;margin-bottom:6px">🎯 Explore Activities</h1>
    <p style="color:var(--text-secondary)">Find experiences, tours, and adventures for your trip</p>
  </div>

  <!-- Search + Filter -->
  <div style="display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap">
    <div class="search-bar" style="flex:1;min-width:220px">
      <span class="search-icon">🔍</span>
      <input type="text" placeholder="Search activities..." id="actSearch"
        oninput="ActivitySearch.search(this.value)" />
    </div>
    <select class="form-select" style="width:auto" id="actType" onchange="ActivitySearch.filterType(this.value)">
      <option value="">All Types</option>
      <option>Sightseeing</option>
      <option>Culture</option>
      <option>Adventure</option>
      <option>Food</option>
      <option>Nature</option>
      <option>History</option>
    </select>
    <select class="form-select" style="width:auto" id="actCost" onchange="ActivitySearch.filterCost(this.value)">
      <option value="">Any Cost</option>
      <option value="free">Free</option>
      <option value="low">Under $30</option>
      <option value="mid">$30–$80</option>
      <option value="high">$80+</option>
    </select>
  </div>

  <!-- Type Chips -->
  <div class="chip-group" id="actChips">
    ${['All','Sightseeing','Culture','Adventure','Food','Nature','History'].map((t,i) =>
      `<button class="chip ${i===0?'active':''}" onclick="ActivitySearch.chipFilter('${t}',this)">${t}</button>`
    ).join('')}
  </div>

  <!-- Grid -->
  <div class="grid-3" id="actGrid">
    ${renderActivityCards(WL.activities)}
  </div>`;
};

function renderActivityCards(acts) {
  if (!acts.length) return `<div class="empty-state" style="grid-column:1/-1">
    <div class="empty-icon">🎯</div>
    <div class="empty-title">No activities found</div>
  </div>`;

  return acts.map(act => `
  <div class="activity-card">
    <div class="activity-card-img">${act.emoji}</div>
    <div class="activity-card-body">
      <div class="activity-card-title">${act.name}</div>
      <div class="activity-card-meta">
        📍 ${act.city} &nbsp;|&nbsp; ⏱️ ${act.duration} &nbsp;|&nbsp; ⭐ ${act.rating}
      </div>
      <div style="margin-top:8px">
        <span class="badge badge-info">${act.type}</span>
      </div>
      <div class="activity-card-cost">${act.cost === 0 ? 'FREE' : '$' + act.cost}</div>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="btn btn-primary btn-sm" onclick="ActivitySearch.add('${act.id}')">+ Add to Trip</button>
        <button class="btn btn-secondary btn-sm" onclick="ActivitySearch.info('${act.id}')">Info</button>
      </div>
    </div>
  </div>`).join('');
}

window.ActivitySearch = {
  search(q) {
    const filtered = WL.activities.filter(a =>
      a.name.toLowerCase().includes(q.toLowerCase()) ||
      a.city.toLowerCase().includes(q.toLowerCase())
    );
    document.getElementById('actGrid').innerHTML = renderActivityCards(filtered);
  },

  filterType(type) {
    const filtered = type ? WL.activities.filter(a => a.type === type) : WL.activities;
    document.getElementById('actGrid').innerHTML = renderActivityCards(filtered);
  },

  filterCost(range) {
    const costMap = { free: a => a.cost === 0, low: a => a.cost < 30, mid: a => a.cost >= 30 && a.cost <= 80, high: a => a.cost > 80 };
    const filtered = range ? WL.activities.filter(costMap[range]) : WL.activities;
    document.getElementById('actGrid').innerHTML = renderActivityCards(filtered);
  },

  chipFilter(type, btn) {
    document.querySelectorAll('#actChips .chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const filtered = type === 'All' ? WL.activities : WL.activities.filter(a => a.type === type);
    document.getElementById('actGrid').innerHTML = renderActivityCards(filtered);
  },

  add(actId) {
    if (!WL.trips.length) { showToast('Create a trip first!', 'error'); return; }
    const act = WL.activities.find(a => a.id === actId);
    const trip = WL.trips[0];
    if (trip.stops.length) {
      trip.stops[0].activities.push(act.name);
      WL.save();
      showToast(`🎯 "${act.name}" added!`, 'success');
    } else {
      showToast('Add a stop to your trip first', 'error');
    }
  },

  info(actId) {
    const act = WL.activities.find(a => a.id === actId);
    if (!act) return;
    showToast(`${act.emoji} ${act.name} — ${act.duration}, $${act.cost}`);
  }
};
