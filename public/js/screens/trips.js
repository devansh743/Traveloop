// =============================
// SCREENS 3 & 4: TRIPS
// Create Trip + My Trips
// =============================

// ---- SCREEN 3: CREATE TRIP ----
Screens['create-trip'] = function() {
  const el = document.getElementById('screen-create-trip');
  el.innerHTML = `
  <div style="max-width:640px;margin:0 auto">
    <div style="margin-bottom:24px" class="reveal">
      <h1 style="font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:700;margin-bottom:6px">Plan a New Trip</h1>
      <p style="color:var(--text-secondary)">Fill in the details to start building your dream itinerary.</p>
    </div>

    <div class="card reveal reveal-d1">
      <!-- Trip Name -->
      <div class="form-group">
        <label class="form-label">Trip Name *</label>
        <input type="text" class="form-input" id="ctName" placeholder="e.g. European Summer 2026" />
      </div>

      <!-- Emoji Picker -->
      <div class="form-group">
        <label class="form-label">Trip Emoji</label>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:4px" id="emojiPicker">
          ${['✈️','🗺️','🌍','🏖️','🏔️','🌴','🗼','🏛️','🎭','🚢','🏕️','🌊'].map(e=>
            `<button class="emoji-pick-btn" onclick="EmojiPicker.select(this,'${e}')" data-emoji="${e}"
              style="font-size:22px;background:var(--bg-raised);border:1px solid var(--border);
              border-radius:var(--radius-sm);padding:8px 11px;cursor:pointer;transition:all 0.2s">${e}</button>`
          ).join('')}
        </div>
        <input type="hidden" id="ctEmoji" value="✈️" />
      </div>

      <!-- Dates -->
      <div class="grid-2">
        <div class="form-group">
          <label class="form-label">Start Date *</label>
          <input type="date" class="form-input" id="ctStart" />
        </div>
        <div class="form-group">
          <label class="form-label">End Date *</label>
          <input type="date" class="form-input" id="ctEnd" />
        </div>
      </div>

      <!-- Budget -->
      <div class="form-group">
        <label class="form-label">Total Budget (USD)</label>
        <div class="input-icon-group">
          <span class="input-icon">$</span>
          <input type="number" class="form-input" id="ctBudget" placeholder="e.g. 2000" style="padding-left:40px" />
        </div>
      </div>

      <!-- Description -->
      <div class="form-group">
        <label class="form-label">Trip Description</label>
        <textarea class="form-textarea" id="ctDesc" placeholder="Describe your trip plan, highlights, or goals..."></textarea>
      </div>

      <!-- Cover Photo -->
      <div class="form-group">
        <label class="form-label">Cover Photo (Optional)</label>
        <div id="ctCoverDrop"
          style="border:2px dashed var(--border-strong);border-radius:var(--radius-md);
          padding:32px;text-align:center;cursor:pointer;transition:var(--transition)"
          onclick="document.getElementById('ctCoverFile').click()"
          ondragover="event.preventDefault();this.style.borderColor='var(--terracotta)'"
          ondragleave="this.style.borderColor='var(--border-strong)'">
          <div style="font-size:36px;margin-bottom:10px;opacity:0.4">⊕</div>
          <div style="font-size:13.5px;color:var(--text-secondary)">Click or drag to upload</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:4px">JPG, PNG up to 5MB</div>
        </div>
        <input type="file" id="ctCoverFile" accept="image/*" style="display:none" onchange="CreateTrip.previewCover(event)" />
        <div id="ctCoverPreview" style="margin-top:10px;display:none">
          <img id="ctCoverImg" src="" style="width:100%;height:160px;object-fit:cover;border-radius:var(--radius-md)" />
          <button class="btn btn-danger btn-sm" style="margin-top:8px" onclick="CreateTrip.removeCover()">Remove Photo</button>
        </div>
      </div>

      <div style="display:flex;gap:12px;margin-top:8px">
        <button class="btn btn-primary btn-lg" onclick="CreateTrip.save()">Save Trip →</button>
        <button class="btn btn-secondary" onclick="Router.navigate('my-trips')">Cancel</button>
      </div>
    </div>
  </div>`;

  // Set default date (today)
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('ctStart').min = today;
  document.getElementById('ctEnd').min = today;
  document.getElementById('ctStart').value = today;

  // Select first emoji
  document.querySelector('.emoji-pick-btn')?.classList.add('selected');
};

window.EmojiPicker = {
  select(btn, emoji) {
    document.querySelectorAll('.emoji-pick-btn').forEach(b => {
      b.style.borderColor = 'var(--border)';
      b.style.background = 'var(--bg-raised)';
    });
    btn.style.borderColor = 'var(--terracotta)';
    btn.style.background = 'rgba(194,112,62,0.12)';
    document.getElementById('ctEmoji').value = emoji;
  }
};

window.CreateTrip = {
  previewCover(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      document.getElementById('ctCoverImg').src = ev.target.result;
      document.getElementById('ctCoverPreview').style.display = '';
      document.getElementById('ctCoverDrop').style.display = 'none';
    };
    reader.readAsDataURL(file);
  },

  removeCover() {
    document.getElementById('ctCoverPreview').style.display = 'none';
    document.getElementById('ctCoverDrop').style.display = '';
    document.getElementById('ctCoverFile').value = '';
  },

  save() {
    const name = document.getElementById('ctName').value.trim();
    const start = document.getElementById('ctStart').value;
    const end = document.getElementById('ctEnd').value;
    const budget = parseFloat(document.getElementById('ctBudget').value) || 0;
    const desc = document.getElementById('ctDesc').value.trim();
    const emoji = document.getElementById('ctEmoji').value || '✈️';

    if (!name) { showToast('Please enter a trip name', 'error'); return; }
    if (!start || !end) { showToast('Please select travel dates', 'error'); return; }
    if (new Date(end) < new Date(start)) { showToast('End date must be after start date', 'error'); return; }

    const newTrip = {
      id: 't' + genId(), name, emoji,
      startDate: start, endDate: end,
      description: desc, budget, spent: 0,
      status: 'upcoming', destinations: 0, stops: []
    };
    WL.trips.unshift(newTrip);
    WL.save();

    showToast('Trip "' + name + '" created!', 'success');
    setTimeout(() => Router.navigate('my-trips'), 600);
  }
};

// ---- SCREEN 4: MY TRIPS ----
Screens['my-trips'] = function() {
  const el = document.getElementById('screen-my-trips');
  const trips = WL.trips;

  el.innerHTML = `
  <div class="trips-header reveal">
    <div>
      <h1 style="font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:700;margin-bottom:4px">My Trips</h1>
      <p style="color:var(--text-secondary)">${trips.length} trip${trips.length !== 1 ? 's' : ''} planned</p>
    </div>
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
      <div class="search-bar" style="min-width:200px">
        <span class="search-icon">◎</span>
        <input type="text" placeholder="Search trips..." id="tripSearch" oninput="MyTrips.search(this.value)" />
      </div>
      <button class="btn btn-primary" onclick="Router.navigate('create-trip')">⊕ New Trip</button>
    </div>
  </div>

  <!-- Filter Tabs -->
  <div class="tabs reveal reveal-d1" style="margin-bottom:22px">
    <button class="tab active" id="tabAll" onclick="MyTrips.filter('all',this)">All (${trips.length})</button>
    <button class="tab" id="tabUp" onclick="MyTrips.filter('upcoming',this)">Upcoming (${trips.filter(t=>t.status==='upcoming').length})</button>
    <button class="tab" id="tabDone" onclick="MyTrips.filter('completed',this)">Completed (${trips.filter(t=>t.status==='completed').length})</button>
  </div>

  <div class="trips-grid reveal reveal-d2" id="tripsGrid">
    ${renderTripCards(trips)}
  </div>`;
};

function renderTripCards(trips) {
  if (!trips.length) return `
  <div class="empty-state" style="grid-column:1/-1">
    <div class="empty-icon">◐</div>
    <div class="empty-title">No trips found</div>
    <div class="empty-text">Create your first trip to get started!</div>
    <button class="btn btn-primary" onclick="Router.navigate('create-trip')">Plan New Trip →</button>
  </div>`;

  return trips.map(trip => `
  <div class="trip-card">
    <div class="trip-card-img image-card" style="background-image:linear-gradient(180deg,rgba(8,20,34,0.08),rgba(8,20,34,0.76)),url('${tripImage(trip.name)}')">${trip.emoji}</div>
    <div class="trip-card-body">
      <div class="trip-card-title">${trip.name}</div>
      <div class="trip-card-meta">
        <span>${formatDate(trip.startDate)}</span>
        <span>${trip.destinations} stops</span>
      </div>
      <div style="margin-top:10px">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-secondary);margin-bottom:5px">
          <span>Budget: $${trip.budget.toLocaleString()}</span>
          <span>${Math.round((trip.spent/trip.budget)*100)||0}% used</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${Math.min(100,Math.round((trip.spent/trip.budget)*100))||0}%"></div></div>
      </div>
      <div style="margin-top:10px">
        <span class="badge ${trip.status==='upcoming'?'badge-primary':'badge-success'}">${trip.status}</span>
      </div>
      <div class="trip-card-actions">
        <button class="btn btn-secondary btn-sm" onclick="Router.navigate('itinerary-view',{tripId:'${trip.id}'})">View</button>
        <button class="btn btn-secondary btn-sm" onclick="Router.navigate('itinerary-builder',{tripId:'${trip.id}'})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="MyTrips.delete('${trip.id}')">✕</button>
      </div>
    </div>
  </div>`).join('');
}

window.MyTrips = {
  filter(status, btn) {
    document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    const filtered = status === 'all' ? WL.trips : WL.trips.filter(t => t.status === status);
    document.getElementById('tripsGrid').innerHTML = renderTripCards(filtered);
  },

  search(val) {
    const filtered = WL.trips.filter(t => t.name.toLowerCase().includes(val.toLowerCase()));
    document.getElementById('tripsGrid').innerHTML = renderTripCards(filtered);
  },

  delete(id) {
    if (!confirm('Delete this trip? This cannot be undone.')) return;
    WL.trips = WL.trips.filter(t => t.id !== id);
    WL.save();
    showToast('Trip deleted', 'error');
    Screens['my-trips']();
  }
};
