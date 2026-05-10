// =============================
// SCREENS 5 & 6: ITINERARY
// Builder + View
// =============================

// ---- SCREEN 5: ITINERARY BUILDER ----
Screens['itinerary-builder'] = function(data = {}) {
  const el = document.getElementById('screen-itinerary-builder');
  const tripId = data.tripId || (WL.trips[0] && WL.trips[0].id);
  const trip = WL.trips.find(t => t.id === tripId) || WL.trips[0];

  if (!trip) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">🗺️</div>
    <div class="empty-title">No Trips Yet</div>
    <button class="btn btn-primary" onclick="Router.navigate('create-trip')">Create First Trip</button></div>`;
    return;
  }

  el.innerHTML = `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:14px">
    <div>
      <h1 style="font-size:26px;font-weight:800;margin-bottom:4px">${trip.emoji} ${trip.name}</h1>
      <p style="color:var(--text-secondary)">Build your day-by-day itinerary below</p>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn btn-secondary" onclick="ItineraryBuilder.addStop('${trip.id}')">➕ Add Stop</button>
      <button class="btn btn-primary" onclick="Router.navigate('itinerary-view',{tripId:'${trip.id}'})">👁️ Preview</button>
    </div>
  </div>

  <!-- Trip Selector (if multiple trips) -->
  ${WL.trips.length > 1 ? `
  <div class="form-group" style="max-width:300px;margin-bottom:24px">
    <label class="form-label">Select Trip</label>
    <select class="form-select" onchange="Router.navigate('itinerary-builder',{tripId:this.value})">
      ${WL.trips.map(t=>`<option value="${t.id}" ${t.id===trip.id?'selected':''}>${t.emoji} ${t.name}</option>`).join('')}
    </select>
  </div>` : ''}

  <div class="stops-container" id="stopsContainer">
    ${renderStops(trip)}
  </div>

  ${!trip.stops.length ? `
  <div class="empty-state" style="border:2px dashed var(--border);border-radius:var(--radius-lg)">
    <div class="empty-icon">📍</div>
    <div class="empty-title">No Stops Added</div>
    <div class="empty-text">Add cities and activities to build your itinerary</div>
    <button class="btn btn-primary" onclick="ItineraryBuilder.addStop('${trip.id}')">Add First Stop ➕</button>
  </div>` : `
  <button class="btn btn-success" style="margin-top:16px" onclick="Router.navigate('itinerary-view',{tripId:'${trip.id}'})">
    ✅ View Full Itinerary
  </button>`}`;
};

function renderStops(trip) {
  return (trip.stops || []).map((stop, i) => `
  <div class="stop-card" id="stop-${i}">
    <div class="stop-header" onclick="ItineraryBuilder.toggleStop(${i})">
      <div class="stop-num">${i + 1}</div>
      <div class="stop-city">${stop.emoji || '📍'} ${stop.city}, ${stop.country}</div>
      <span style="color:var(--text-muted);font-size:13px">${stop.dates || ''}</span>
      <div style="display:flex;gap:8px;margin-left:auto">
        <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation();ItineraryBuilder.addActivity('${trip.id}',${i})">+ Activity</button>
        <button class="btn btn-danger btn-sm" onclick="event.stopPropagation();ItineraryBuilder.removeStop('${trip.id}',${i})">✕</button>
      </div>
    </div>
    <div class="stop-body" id="stop-body-${i}">
      <div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap">
        <div class="form-group" style="flex:1;margin-bottom:0">
          <label class="form-label">Start Date</label>
          <input type="date" class="form-input" value="${stop.startDate||''}"
            onchange="ItineraryBuilder.updateStopDate('${trip.id}',${i},'startDate',this.value)" />
        </div>
        <div class="form-group" style="flex:1;margin-bottom:0">
          <label class="form-label">End Date</label>
          <input type="date" class="form-input" value="${stop.endDate||''}"
            onchange="ItineraryBuilder.updateStopDate('${trip.id}',${i},'endDate',this.value)" />
        </div>
      </div>

      <div style="font-size:13px;font-weight:600;color:var(--text-secondary);margin-bottom:10px;text-transform:uppercase;letter-spacing:.5px">Activities</div>
      <div class="activities-list" id="activities-${i}">
        ${(stop.activities || []).map((a, ai) => `
        <div class="activity-item">
          <span class="activity-item-icon">🎯</span>
          <span style="flex:1">${a}</span>
          <span style="color:var(--text-muted);font-size:12px">08:00</span>
          <button class="checklist-del" onclick="ItineraryBuilder.removeActivity('${trip.id}',${i},${ai})">✕</button>
        </div>`).join('')}
      </div>
      ${!stop.activities.length ? '<div style="color:var(--text-muted);font-size:13px;padding:8px 0">No activities yet. Add some!</div>' : ''}
    </div>
  </div>`).join('');
}

window.ItineraryBuilder = {
  toggleStop(i) {
    const body = document.getElementById('stop-body-' + i);
    body.style.display = body.style.display === 'none' ? '' : 'none';
  },

  addStop(tripId) {
    const trip = WL.trips.find(t => t.id === tripId);
    if (!trip) return;

    const city = WL.cities[Math.floor(Math.random() * WL.cities.length)];
    trip.stops.push({
      city: city.name, country: city.country, emoji: city.emoji,
      dates: '', startDate: '', endDate: '', activities: []
    });
    trip.destinations = trip.stops.length;
    WL.save();
    Screens['itinerary-builder']({ tripId });
    showToast(`📍 Added ${city.name}`, 'success');
  },

  removeStop(tripId, idx) {
    const trip = WL.trips.find(t => t.id === tripId);
    if (!trip) return;
    trip.stops.splice(idx, 1);
    trip.destinations = trip.stops.length;
    WL.save();
    Screens['itinerary-builder']({ tripId });
    showToast('Stop removed');
  },

  addActivity(tripId, stopIdx) {
    const name = prompt('Enter activity name:');
    if (!name) return;
    const trip = WL.trips.find(t => t.id === tripId);
    if (!trip || !trip.stops[stopIdx]) return;
    trip.stops[stopIdx].activities.push(name);
    WL.save();
    Screens['itinerary-builder']({ tripId });
    showToast('🎯 Activity added!', 'success');
  },

  removeActivity(tripId, stopIdx, actIdx) {
    const trip = WL.trips.find(t => t.id === tripId);
    if (!trip || !trip.stops[stopIdx]) return;
    trip.stops[stopIdx].activities.splice(actIdx, 1);
    WL.save();
    Screens['itinerary-builder']({ tripId });
  },

  updateStopDate(tripId, stopIdx, field, value) {
    const trip = WL.trips.find(t => t.id === tripId);
    if (!trip || !trip.stops[stopIdx]) return;
    trip.stops[stopIdx][field] = value;
    WL.save();
  }
};

// ---- SCREEN 6: ITINERARY VIEW ----
Screens['itinerary-view'] = function(data = {}) {
  const el = document.getElementById('screen-itinerary-view');
  const tripId = data.tripId || (WL.trips[0] && WL.trips[0].id);
  const trip = WL.trips.find(t => t.id === tripId) || WL.trips[0];

  if (!trip) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">📅</div>
    <div class="empty-title">No Trips Yet</div>
    <button class="btn btn-primary" onclick="Router.navigate('create-trip')">Create First Trip</button></div>`;
    return;
  }

  const sampleTimes = ['08:00', '10:30', '13:00', '15:30', '18:00', '20:00'];

  el.innerHTML = `
  <!-- Header -->
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:28px;flex-wrap:wrap;gap:14px">
    <div>
      <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:8px">
        <span style="font-size:40px">${trip.emoji}</span>
        <div>
          <h1 style="font-size:28px;font-weight:800">${trip.name}</h1>
          <div style="color:var(--text-secondary);font-size:14px">
            📅 ${formatDate(trip.startDate)} → ${formatDate(trip.endDate)}
            &nbsp;|&nbsp; 📍 ${trip.destinations} destinations
          </div>
        </div>
      </div>
      ${trip.description ? `<p style="color:var(--text-secondary);font-size:14.5px;max-width:560px">${trip.description}</p>` : ''}
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn btn-secondary" onclick="Router.navigate('itinerary-builder',{tripId:'${trip.id}'})">✏️ Edit</button>
      <button class="btn btn-secondary" onclick="Router.navigate('shared')">🔗 Share</button>
      <button class="btn btn-primary" onclick="Router.navigate('budget')">💰 Budget</button>
    </div>
  </div>

  <!-- View Toggle -->
  <div class="itinerary-view-nav">
    <div class="tabs">
      <button class="tab active" id="viewTabList" onclick="ItineraryView.toggle('list',this)">📋 List View</button>
      <button class="tab" id="viewTabTimeline" onclick="ItineraryView.toggle('timeline',this)">📅 Timeline</button>
    </div>
    ${WL.trips.length > 1 ? `
    <select class="form-select" style="max-width:220px" onchange="Screens['itinerary-view']({tripId:this.value})">
      ${WL.trips.map(t=>`<option value="${t.id}" ${t.id===trip.id?'selected':''}>${t.emoji} ${t.name}</option>`).join('')}
    </select>` : ''}
  </div>

  <!-- LIST VIEW -->
  <div id="ivListView">
    ${trip.stops.length ? trip.stops.map((stop, si) => `
    <div class="day-block">
      <div class="day-block-header">
        <div>
          <div class="day-number">Stop ${si + 1}</div>
          <div class="day-city">${stop.emoji || '📍'} ${stop.city}, ${stop.country}</div>
        </div>
        ${stop.dates ? `<span class="badge badge-info" style="margin-left:auto">${stop.dates}</span>` : ''}
      </div>
      <div class="day-activities">
        ${stop.activities.length ? stop.activities.map((a, ai) => `
        <div class="day-activity">
          <div class="day-activity-time">${sampleTimes[ai % sampleTimes.length]}</div>
          <div class="day-activity-content">
            <div class="day-activity-name">🎯 ${a}</div>
            <div class="day-activity-cost">~$${(Math.random() * 80 + 10).toFixed(0)}</div>
          </div>
        </div>`).join('') : `<div style="color:var(--text-muted);font-size:13.5px">No activities added yet. <a href="#" onclick="Router.navigate('itinerary-builder',{tripId:'${trip.id}'});return false" style="color:var(--primary-light)">Edit itinerary →</a></div>`}
      </div>
    </div>`).join('') : `
    <div class="empty-state">
      <div class="empty-icon">📍</div>
      <div class="empty-title">No stops added yet</div>
      <div class="empty-text">Build your itinerary by adding cities and activities</div>
      <button class="btn btn-primary" onclick="Router.navigate('itinerary-builder',{tripId:'${trip.id}'})">Open Builder 🏗️</button>
    </div>`}
  </div>

  <!-- TIMELINE VIEW -->
  <div id="ivTimelineView" style="display:none">
    <div class="timeline">
      ${trip.stops.map((stop, si) => `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div style="font-size:16px;font-weight:700;margin-bottom:6px">${stop.emoji || '📍'} ${stop.city}</div>
          <div style="font-size:13px;color:var(--text-secondary);margin-bottom:12px">${stop.country} ${stop.dates ? '• ' + stop.dates : ''}</div>
          <div style="display:flex;flex-wrap:wrap;gap:8px">
            ${stop.activities.map(a => `<span class="badge badge-primary">${a}</span>`).join('')}
            ${!stop.activities.length ? '<span style="color:var(--text-muted);font-size:13px">No activities yet</span>' : ''}
          </div>
        </div>
      </div>`).join('')}
      ${!trip.stops.length ? '<div style="color:var(--text-muted);padding:20px 0">No stops to show.</div>' : ''}
    </div>
  </div>`;
};

window.ItineraryView = {
  toggle(mode, btn) {
    document.querySelectorAll('.itinerary-view-nav .tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('ivListView').style.display = mode === 'list' ? '' : 'none';
    document.getElementById('ivTimelineView').style.display = mode === 'timeline' ? '' : 'none';
  }
};
