// =============================
// WANDERLUST – APP INIT
// =============================

document.addEventListener('DOMContentLoaded', () => {
  // Route to correct screen based on session state
  if (WL.currentUser) {
    if (WL.currentUser.role === 'admin') {
      Router.goApp('dashboard');
    } else {
      Router.goApp('my-trips');
    }
  } else {
    Router.goAuth();
  }

  // Mobile: close sidebar on nav click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('mobile-open');
      }
    });
  });

  // Mobile and Desktop menu toggle
  document.getElementById('menuToggle')?.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      document.getElementById('sidebar').classList.toggle('mobile-open');
    } else {
      document.getElementById('sidebar').classList.toggle('collapsed');
      document.body.classList.toggle('sidebar-collapsed');
    }
  });

  // Profile Dropdown Toggle
  document.getElementById('headerAvatar')?.addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('profileDropdown')?.classList.toggle('open');
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown && dropdown.classList.contains('open')) {
      if (!e.target.closest('.profile-dropdown-container')) {
        dropdown.classList.remove('open');
      }
    }
  });

  // Close modal on overlay click
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.classList.remove('open');
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
      document.getElementById('profileDropdown')?.classList.remove('open');
    }
  });
});

// Preferences Modal Logic
window.openPreferencesModal = function() {
  document.getElementById('profileDropdown')?.classList.remove('open');
  document.getElementById('preferencesModal').classList.add('open');
};

window.closePreferencesModal = function() {
  document.getElementById('preferencesModal').classList.remove('open');
};
