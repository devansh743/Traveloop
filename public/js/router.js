// =============================
// WANDERLUST – ROUTER
// =============================

const Router = {
  currentScreen: 'auth',

  screenTitles: {
    dashboard:          '◈ Dashboard',
    'my-trips':         '◐ My Trips',
    'create-trip':      '⊕ New Trip',
    'itinerary-builder':'▦ Itinerary Builder',
    'itinerary-view':   '▤ Itinerary View',
    'city-search':      '◎ City Search',
    'activity-search':  '◇ Activities',
    budget:             '◆ Budget',
    packing:            '☐ Packing List',
    notes:              '≡ Trip Notes',
    shared:             '↗ Shared View',
    chat:               '✨ AI Chat',
    profile:            '○ Profile Settings',
    admin:              '⬡ Admin Dashboard',
  },

  navigate(screen, data = {}) {
    // Admin check
    if (screen === 'dashboard' && WL.currentUser && WL.currentUser.role !== 'admin') {
      screen = 'my-trips';
    }

    // Hide all screens inside app-main
    document.querySelectorAll('#app-main > .screen').forEach(s => {
      s.classList.remove('active');
      s.style.display = 'none';
    });

    // Show target screen
    const target = document.querySelector(`#app-main > [data-screen="${screen}"]`);
    if (target) {
      target.classList.add('active');
      target.style.display = 'block';
      this.currentScreen = screen;
    }

    // Update sidebar active state
    document.querySelectorAll('.nav-link').forEach(l => {
      l.classList.toggle('active', l.dataset.screen === screen);
    });

    // Update header title
    const titleEl = document.getElementById('headerTitle');
    if (titleEl) titleEl.textContent = this.screenTitles[screen] || screen;

    // Render the screen content
    if (window.Screens && Screens[screen]) Screens[screen](data);

    // Scroll top
    window.scrollTo(0, 0);
  },

  goAuth() {
    // Hide the app chrome
    document.getElementById('sidebar').classList.add('hidden');
    document.getElementById('app-header').classList.add('hidden');
    document.getElementById('app-main').style.display = 'none';

    // Show auth screen
    const auth = document.getElementById('screen-auth');
    auth.classList.add('active');
    auth.style.display = 'flex';
    if (window.Screens && Screens.auth) Screens.auth();
  },

  goApp(screen = 'dashboard') {
    // Hide auth screen
    const auth = document.getElementById('screen-auth');
    auth.classList.remove('active');
    auth.style.display = 'none';

    // Show app chrome
    document.getElementById('sidebar').classList.remove('hidden');
    document.getElementById('app-header').classList.remove('hidden');
    document.getElementById('app-main').style.display = 'block';

    // Update avatar and role-based UI
    const u = WL.currentUser;
    if (u) {
      const av = document.getElementById('headerAvatar');
      if (av) av.textContent = (u.name || u.email || 'W')[0].toUpperCase();
      
      const dashboardLink = document.querySelector('.nav-link[data-screen="dashboard"]');
      if (dashboardLink && dashboardLink.parentElement) {
        dashboardLink.parentElement.style.display = (u.role === 'admin') ? 'block' : 'none';
      }
    }

    this.navigate(screen);
  }
};

// Sidebar nav link clicks
document.querySelectorAll('.nav-link[data-screen]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    Router.navigate(link.dataset.screen);
  });
});

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  WL.currentUser = null;
  localStorage.removeItem('wl_user');
  showToast('Signed out. Until next time!', 'success');
  setTimeout(() => Router.goAuth(), 500);
});

// Global Screens registry
window.Screens = {};
