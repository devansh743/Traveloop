// =============================
// SCREENS 11–14: MISC SCREENS
// Shared View, Profile, Notes, Admin
// =============================

// ---- SCREEN 11: SHARED VIEW ----
Screens.shared = function() {
  const el = document.getElementById('screen-shared');
  const trip = WL.trips[0];
  const shareUrl = 'https://odyssey.app/share/' + (trip ? trip.id : 'demo');

  el.innerHTML = `
  <div class="shared-header">
    <div style="font-size:48px;margin-bottom:12px">${trip ? trip.emoji : '🌍'}</div>
    <h1>${trip ? trip.name : 'My Trip'}</h1>
    <p>${trip ? `${formatDate(trip.startDate)} → ${formatDate(trip.endDate)} &middot; ${trip.destinations} stops` : 'Public itinerary view'}</p>
    ${trip && trip.description ? `<p style="font-style:italic;margin-top:8px;opacity:0.8">"${trip.description}"</p>` : ''}

    <div class="share-url-box">
      <span class="share-icon">🔗</span>
      <span class="share-url" id="shareUrlText">${shareUrl}</span>
      <button class="btn btn-secondary btn-sm" onclick="SharedView.copyUrl('${shareUrl}')">📋 Copy</button>
    </div>

    <div class="share-actions">
      <button class="btn btn-primary" onclick="SharedView.copyUrl('${shareUrl}')">🔗 Copy Link</button>
      <button class="btn btn-secondary" onclick="SharedView.shareToSocial('twitter')">🐦 Twitter</button>
      <button class="btn btn-secondary" onclick="SharedView.shareToSocial('facebook')">📘 Facebook</button>
      <button class="btn btn-secondary" onclick="SharedView.shareToSocial('whatsapp')">💬 WhatsApp</button>
      <button class="btn btn-success" onclick="SharedView.copyTrip()">📋 Copy Trip</button>
    </div>
  </div>

  ${trip && trip.stops.length ? `
  <!-- READ-ONLY ITINERARY -->
  <div class="card" style="margin-bottom:20px">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">
      <span style="font-size:20px">👁️</span>
      <span style="font-size:17px;font-weight:700">Public Itinerary (Read-only)</span>
      <span class="badge badge-success" style="margin-left:auto">🔓 Public</span>
    </div>
    ${trip.stops.map((stop, i) => `
    <div style="display:flex;gap:16px;margin-bottom:18px;align-items:flex-start">
      <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--secondary));
        display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0">${i+1}</div>
      <div>
        <div style="font-size:17px;font-weight:700;margin-bottom:4px">${stop.emoji || '📍'} ${stop.city}, ${stop.country}</div>
        ${stop.dates ? `<div style="font-size:13px;color:var(--text-secondary);margin-bottom:8px">📅 ${stop.dates}</div>` : ''}
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          ${stop.activities.map(a => `<span class="badge badge-primary">🎯 ${a}</span>`).join('')}
        </div>
      </div>
    </div>
    ${i < trip.stops.length - 1 ? '<div class="divider"></div>' : ''}`).join('')}
  </div>` : `
  <div class="empty-state">
    <div class="empty-icon">📋</div>
    <div class="empty-title">No itinerary to share yet</div>
    <button class="btn btn-primary" onclick="Router.navigate('itinerary-builder')">Build Itinerary</button>
  </div>`}`;
};

window.SharedView = {
  copyUrl(url) {
    navigator.clipboard.writeText(url).then(() => showToast('🔗 Link copied!', 'success'))
      .catch(() => showToast('Could not copy: ' + url));
  },

  shareToSocial(platform) {
    showToast(`Opening ${platform} share... 📤`, 'success');
  },

  copyTrip() {
    if (!WL.trips[0]) return;
    const copy = JSON.parse(JSON.stringify(WL.trips[0]));
    copy.id = 't' + genId();
    copy.name = copy.name + ' (Copy)';
    copy.spent = 0; copy.status = 'upcoming';
    WL.trips.push(copy);
    WL.save();
    showToast('✅ Trip copied to your account!', 'success');
    setTimeout(() => Router.navigate('my-trips'), 800);
  }
};

// ---- SCREEN 12: PROFILE ----
Screens.profile = function() {
  const el = document.getElementById('screen-profile');
  const user = WL.currentUser || { name: 'Traveler', email: 'traveler@example.com', role: 'user' };

  el.innerHTML = `
  <h1 style="font-size:26px;font-weight:800;margin-bottom:24px">👤 Profile & Settings</h1>

  <!-- Profile Hero -->
  <div class="profile-hero">
    <div class="avatar profile-avatar-large">${(user.name || 'T')[0].toUpperCase()}</div>
    <div class="profile-info">
      <h2>${user.name}</h2>
      <p>${user.email}</p>
      <div class="profile-stats">
        <div class="profile-stat">
          <div class="profile-stat-val">${WL.trips.length}</div>
          <div class="profile-stat-lbl">Trips</div>
        </div>
        <div class="profile-stat">
          <div class="profile-stat-val">${WL.trips.reduce((a,t)=>a+t.destinations,0)}</div>
          <div class="profile-stat-lbl">Cities</div>
        </div>
        <div class="profile-stat">
          <div class="profile-stat-val">$${WL.trips.reduce((a,t)=>a+t.spent,0).toLocaleString()}</div>
          <div class="profile-stat-lbl">Spent</div>
        </div>
      </div>
    </div>
    <button class="btn btn-secondary btn-sm" style="margin-left:auto;align-self:flex-start"
      onclick="ProfileScreen.enableEdit()">✏️ Edit</button>
  </div>

  <!-- Edit Form -->
  <div class="card" style="margin-bottom:20px" id="profileForm">
    <div style="font-size:17px;font-weight:700;margin-bottom:20px">✏️ Edit Profile</div>
    <div class="grid-2">
      <div class="form-group">
        <label class="form-label">Full Name</label>
        <input type="text" class="form-input" id="profName" value="${user.name || ''}" />
      </div>
      <div class="form-group">
        <label class="form-label">Email</label>
        <input type="email" class="form-input" id="profEmail" value="${user.email || ''}" />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Language Preference</label>
      <select class="form-select" id="profLang">
        <option>English</option><option>Spanish</option><option>French</option>
        <option>German</option><option>Japanese</option><option>Hindi</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Currency</label>
      <select class="form-select" id="profCurrency">
        <option>USD ($)</option><option>EUR (€)</option><option>GBP (£)</option>
        <option>INR (₹)</option><option>JPY (¥)</option>
      </select>
    </div>
    <div style="display:flex;gap:10px">
      <button class="btn btn-primary" onclick="ProfileScreen.save()">💾 Save Changes</button>
      <button class="btn btn-secondary" onclick="ProfileScreen.cancel()">Cancel</button>
    </div>
  </div>

  <!-- Saved Destinations -->
  <div class="card" style="margin-bottom:20px">
    <div style="font-size:17px;font-weight:700;margin-bottom:16px">📍 Saved Destinations</div>
    <div style="display:flex;flex-wrap:wrap;gap:10px">
      ${WL.cities.slice(0,5).map(c => `
      <div style="display:flex;align-items:center;gap:8px;padding:8px 14px;background:var(--bg-card2);
        border:1px solid var(--border-light);border-radius:var(--radius-full);font-size:14px">
        ${c.emoji} ${c.name}
        <button style="background:none;border:none;color:var(--text-muted);cursor:pointer;padding:0;margin-left:4px"
          onclick="this.parentElement.remove()">✕</button>
      </div>`).join('')}
    </div>
  </div>

  <!-- Danger Zone -->
  <div class="card" style="border-color:rgba(239,71,111,0.2)">
    <div style="font-size:17px;font-weight:700;color:var(--danger);margin-bottom:16px">⚠️ Danger Zone</div>
    <div style="display:flex;flex-wrap:wrap;gap:12px">
      <button class="btn btn-danger" onclick="ProfileScreen.exportData()">📤 Export My Data</button>
      <button class="btn btn-danger" onclick="ProfileScreen.deleteAccount()">🗑️ Delete Account</button>
    </div>
  </div>`;
};

window.ProfileScreen = {
  enableEdit() { showToast('You can now edit your profile ✏️'); },
  cancel() { Screens.profile(); },
  save() {
    const name = document.getElementById('profName').value.trim();
    const email = document.getElementById('profEmail').value.trim();
    if (!name) { showToast('Name cannot be empty', 'error'); return; }
    WL.currentUser = { ...WL.currentUser, name, email };
    WL.save();
    showToast('✅ Profile updated!', 'success');
    setTimeout(() => Screens.profile(), 400);
  },
  exportData() {
    const data = JSON.stringify({ user: WL.currentUser, trips: WL.trips }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'odyssey-data.json'; a.click();
    showToast('📤 Data exported!', 'success');
  },
  deleteAccount() {
    if (!confirm('⚠️ Delete your account? This cannot be undone.')) return;
    localStorage.clear();
    showToast('Account deleted', 'error');
    setTimeout(() => { WL.currentUser = null; Router.goAuth(); }, 800);
  }
};

// ---- SCREEN 13: NOTES ----
Screens.notes = function() {
  const el = document.getElementById('screen-notes');
  const notes = [...WL.notes].sort((a, b) => new Date(b.date) - new Date(a.date));

  el.innerHTML = `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:14px">
    <div>
      <h1 style="font-size:26px;font-weight:800;margin-bottom:4px">📝 Trip Notes</h1>
      <p style="color:var(--text-secondary)">${notes.length} note${notes.length!==1?'s':''} saved</p>
    </div>
    <button class="btn btn-primary" onclick="NotesScreen.showAdd()">+ New Note</button>
  </div>

  ${WL.trips.length ? `
  <div class="form-group" style="max-width:280px;margin-bottom:22px">
    <select class="form-select" id="notesTripFilter" onchange="NotesScreen.filter(this.value)">
      <option value="">All Trips</option>
      ${WL.trips.map(t=>`<option value="${t.id}">${t.emoji} ${t.name}</option>`).join('')}
    </select>
  </div>` : ''}

  <div id="notesGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px">
    ${renderNoteCards(notes)}
  </div>

  <!-- Add Note Modal -->
  <div class="modal-overlay" id="noteModal">
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">📝 New Note</h3>
        <button class="modal-close" onclick="document.getElementById('noteModal').classList.remove('open')">✕</button>
      </div>
      <div class="form-group">
        <label class="form-label">Title</label>
        <input type="text" class="form-input" id="noteTitle" placeholder="e.g. Hotel Check-in Info" />
      </div>
      <div class="form-group">
        <label class="form-label">Note</label>
        <textarea class="form-textarea" id="noteText" placeholder="Write your note here..." style="min-height:120px"></textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Trip</label>
        <select class="form-select" id="noteTripId">
          <option value="">General (No Trip)</option>
          ${WL.trips.map(t=>`<option value="${t.id}">${t.emoji} ${t.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Stop / City (Optional)</label>
        <input type="text" class="form-input" id="noteStop" placeholder="e.g. Paris" />
      </div>
      <div style="display:flex;gap:10px">
        <button class="btn btn-primary btn-block" onclick="NotesScreen.save()">Save Note</button>
        <button class="btn btn-secondary" onclick="document.getElementById('noteModal').classList.remove('open')">Cancel</button>
      </div>
    </div>
  </div>`;
};

function renderNoteCards(notes) {
  if (!notes.length) return `<div class="empty-state" style="grid-column:1/-1">
    <div class="empty-icon">📝</div>
    <div class="empty-title">No notes yet</div>
    <div class="empty-text">Add notes, reminders, and trip details here</div>
    <button class="btn btn-primary" onclick="NotesScreen.showAdd()">Add First Note</button>
  </div>`;

  const trip = id => WL.trips.find(t => t.id === id);
  return notes.map(note => `
  <div class="note-card">
    <div class="note-card-actions">
      <button class="checklist-del" onclick="NotesScreen.edit('${note.id}')">✏️</button>
      <button class="checklist-del" onclick="NotesScreen.delete('${note.id}')">🗑️</button>
    </div>
    <div style="font-size:15px;font-weight:700;margin-bottom:6px;padding-right:60px">${note.title || 'Untitled'}</div>
    <div class="note-card-time">
      🕐 ${new Date(note.date).toLocaleString()} 
      ${note.tripId && trip(note.tripId) ? ` &middot; ${trip(note.tripId).emoji} ${trip(note.tripId).name}` : ''}
      ${note.stop ? ` &middot; 📍 ${note.stop}` : ''}
    </div>
    <div class="note-card-text">${note.text}</div>
  </div>`).join('');
}

window.NotesScreen = {
  showAdd() {
    document.getElementById('noteModal').classList.add('open');
    document.getElementById('noteTitle').focus();
  },

  filter(tripId) {
    const filtered = tripId ? WL.notes.filter(n => n.tripId === tripId) : WL.notes;
    document.getElementById('notesGrid').innerHTML = renderNoteCards(filtered);
  },

  save() {
    const title = document.getElementById('noteTitle').value.trim();
    const text = document.getElementById('noteText').value.trim();
    const tripId = document.getElementById('noteTripId').value;
    const stop = document.getElementById('noteStop').value.trim();
    if (!text) { showToast('Note content cannot be empty', 'error'); return; }
    WL.notes.unshift({ id: 'n' + genId(), title: title || 'Note', text, tripId, stop, date: new Date().toISOString() });
    WL.save();
    document.getElementById('noteModal').classList.remove('open');
    Screens.notes();
    showToast('📝 Note saved!', 'success');
  },

  delete(id) {
    WL.notes = WL.notes.filter(n => n.id !== id);
    WL.save();
    Screens.notes();
    showToast('Note deleted');
  },

  edit(id) {
    const note = WL.notes.find(n => n.id === id);
    if (!note) return;
    const newText = prompt('Edit note:', note.text);
    if (newText === null) return;
    note.text = newText;
    note.date = new Date().toISOString();
    WL.save();
    Screens.notes();
    showToast('✅ Note updated!', 'success');
  }
};

// ---- SCREEN 14: ADMIN ----
Screens.admin = function() {
  const el = document.getElementById('screen-admin');

  // Mock analytics data
  const topCities = WL.cities.slice(0, 5);
  const topActivities = WL.activities.slice(0, 5);

  el.innerHTML = `
  <div style="margin-bottom:28px;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
    <div>
      <h1 style="font-size:26px;font-weight:800;margin-bottom:4px">📊 Admin Dashboard</h1>
      <p style="color:var(--text-secondary)">Platform usage stats and user management</p>
    </div>
    <span class="badge badge-danger" style="margin-left:auto">🔒 Admin Only</span>
  </div>

  <!-- KPI Cards -->
  <div class="grid-4" style="margin-bottom:28px">
    <div class="stat-card blue"><div class="stat-icon">👤</div><div class="stat-value">1,248</div><div class="stat-label">Total Users</div></div>
    <div class="stat-card pink"><div class="stat-icon">🗺️</div><div class="stat-value">4,821</div><div class="stat-label">Trips Created</div></div>
    <div class="stat-card green"><div class="stat-icon">📍</div><div class="stat-value">18,430</div><div class="stat-label">Cities Added</div></div>
    <div class="stat-card yellow"><div class="stat-icon">📈</div><div class="stat-value">+23%</div><div class="stat-label">Growth (30d)</div></div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px" class="admin-grid">
    <!-- Top Cities -->
    <div class="card">
      <div style="font-size:16px;font-weight:700;margin-bottom:16px">🏙️ Top Cities</div>
      <table class="admin-table">
        <thead><tr><th>City</th><th>Country</th><th>Popularity</th><th>Rating</th></tr></thead>
        <tbody>
          ${topCities.map(c => `
          <tr>
            <td>${c.emoji} ${c.name}</td>
            <td>${c.country}</td>
            <td>
              <div style="display:flex;align-items:center;gap:8px">
                <div class="progress-bar" style="width:80px;height:6px">
                  <div class="progress-fill" style="width:${c.popularity}%"></div>
                </div>
                <span style="font-size:12px">${c.popularity}%</span>
              </div>
            </td>
            <td><span class="badge badge-success">⭐ ${c.rating}</span></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>

    <!-- Top Activities -->
    <div class="card">
      <div style="font-size:16px;font-weight:700;margin-bottom:16px">🎯 Top Activities</div>
      <table class="admin-table">
        <thead><tr><th>Activity</th><th>City</th><th>Type</th><th>Cost</th></tr></thead>
        <tbody>
          ${topActivities.map(a => `
          <tr>
            <td>${a.emoji} ${a.name}</td>
            <td>${a.city}</td>
            <td><span class="badge badge-info">${a.type}</span></td>
            <td>${a.cost === 0 ? '<span class="badge badge-success">Free</span>' : '$' + a.cost}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <!-- User Engagement -->
  <div class="card" style="margin-bottom:20px">
    <div style="font-size:16px;font-weight:700;margin-bottom:20px">📈 User Engagement (Last 7 Days)</div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:10px;align-items:end;height:120px">
      ${[65,72,58,90,84,71,95].map((v,i) => {
        const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
        return `
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;height:100%;justify-content:flex-end">
          <span style="font-size:11px;color:var(--text-muted)">${v}%</span>
          <div style="width:100%;background:linear-gradient(to top,var(--primary),var(--secondary));
            border-radius:4px 4px 0 0;height:${v}%;transition:height 0.8s ease;min-height:4px"></div>
          <span style="font-size:11px;color:var(--text-secondary)">${days[i]}</span>
        </div>`;
      }).join('')}
    </div>
  </div>

  <!-- User Management -->
  <div class="card">
    <div style="font-size:16px;font-weight:700;margin-bottom:16px">👥 User Management</div>
    <table class="admin-table">
      <thead><tr><th>User</th><th>Email</th><th>Trips</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        ${[
          {name:'Alice Wanderer', email:'alice@email.com', trips:8, status:'active'},
          {name:'Bob Explorer', email:'bob@email.com', trips:3, status:'active'},
          {name:'Carol Traveler', email:'carol@email.com', trips:12, status:'premium'},
          {name:'David Journey', email:'david@email.com', trips:1, status:'inactive'},
          {name:'Emma Nomad', email:'emma@email.com', trips:6, status:'active'},
        ].map(u => `
        <tr>
          <td><div style="display:flex;align-items:center;gap:10px">
            <div class="avatar" style="width:32px;height:32px;font-size:13px">${u.name[0]}</div>
            ${u.name}
          </div></td>
          <td style="color:var(--text-secondary)">${u.email}</td>
          <td>${u.trips}</td>
          <td><span class="badge ${u.status==='premium'?'badge-warning':u.status==='active'?'badge-success':'badge-danger'}">${u.status}</span></td>
          <td>
            <div style="display:flex;gap:6px">
              <button class="btn btn-secondary btn-sm" onclick="showToast('Viewing ${u.name}')">View</button>
              <button class="btn btn-danger btn-sm" onclick="showToast('User managed')">Manage</button>
            </div>
          </td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
  <style>@media(max-width:800px){.admin-grid{grid-template-columns:1fr!important}}</style>`;
};
