// =============================
// SCREEN: PROFILE SETTINGS
// =============================

Screens.profile = function() {
  const el = document.getElementById('screen-profile');
  const user = WL.currentUser || { name: 'Traveler', email: '', role: 'user' };
  
  el.innerHTML = `
  <div class="section-header reveal">
    <h2 class="section-title">Profile <em>Settings</em></h2>
  </div>
  
  <div class="grid-2 reveal reveal-d1" style="gap:24px;">
    <div class="card">
      <h3 style="font-family:'Cormorant Garamond',serif;font-size:22px;margin-bottom:16px;">Personal Information</h3>
      <div class="form-group">
        <label class="form-label">Full Name</label>
        <div class="input-icon-group">
          <span class="input-icon">○</span>
          <input type="text" class="form-input" id="profileName" value="${user.name}">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Email Address</label>
        <div class="input-icon-group">
          <span class="input-icon">✉</span>
          <input type="email" class="form-input" id="profileEmail" value="${user.email}" disabled>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Role</label>
        <div class="input-icon-group">
          <span class="input-icon">★</span>
          <input type="text" class="form-input" value="${user.role.toUpperCase()}" disabled>
        </div>
      </div>
      <button class="btn btn-primary" onclick="saveProfile()">Save Changes</button>
    </div>
  </div>
  `;
};

window.saveProfile = function() {
  const name = document.getElementById('profileName').value.trim();
  if (!name) {
    showToast('Name cannot be empty', 'error');
    return;
  }
  if (WL.currentUser) {
    WL.currentUser.name = name;
    WL.save();
    
    // Update Header Avatar
    const av = document.getElementById('headerAvatar');
    if (av) av.textContent = name[0].toUpperCase();
    
    showToast('Profile updated successfully!', 'success');
  }
};
