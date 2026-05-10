// =============================
// TRAVELOOP APP INIT
// =============================

document.addEventListener('DOMContentLoaded', () => {
  if (WL.currentUser) {
    Router.goApp(WL.currentUser.role === 'admin' ? 'dashboard' : 'my-trips');
  } else {
    Router.goAuth();
  }

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('mobile-open');
      }
    });
  });

  document.getElementById('menuToggle')?.addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth <= 768) {
      sidebar.classList.toggle('mobile-open');
      document.body.classList.toggle('nav-open', sidebar.classList.contains('mobile-open'));
    } else {
      sidebar.classList.toggle('collapsed');
      document.body.classList.toggle('sidebar-collapsed');
    }
  });

  document.getElementById('headerBack')?.addEventListener('click', () => Router.back());

  document.getElementById('recentTripSelect')?.addEventListener('change', event => {
    if (event.target.value) {
      Router.navigate('itinerary-view', { tripId: event.target.value });
      event.target.value = '';
    }
  });

  document.getElementById('headerAvatar')?.addEventListener('click', event => {
    event.stopPropagation();
    document.getElementById('profileDropdown')?.classList.toggle('open');
  });

  document.addEventListener('click', event => {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown?.classList.contains('open') && !event.target.closest('.profile-dropdown-container')) {
      dropdown.classList.remove('open');
    }

    if (event.target.classList.contains('modal-overlay')) {
      event.target.classList.remove('open');
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(modal => modal.classList.remove('open'));
      document.getElementById('profileDropdown')?.classList.remove('open');
      document.getElementById('sidebar')?.classList.remove('mobile-open');
      document.body.classList.remove('nav-open');
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      document.getElementById('sidebar')?.classList.remove('mobile-open');
      document.body.classList.remove('nav-open');
    }
  });
});

window.openPreferencesModal = function() {
  document.getElementById('profileDropdown')?.classList.remove('open');
  document.getElementById('preferencesModal').classList.add('open');
};

window.closePreferencesModal = function() {
  document.getElementById('preferencesModal').classList.remove('open');
};
