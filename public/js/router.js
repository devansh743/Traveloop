// =============================
// TRAVELOOP ROUTER
// =============================

const Router = {
  currentScreen: 'auth',
  history: [],

  screenTitles: {
    dashboard: 'Dashboard',
    'my-trips': 'My Trips',
    'create-trip': 'New Trip',
    'itinerary-builder': 'Itinerary Builder',
    'itinerary-view': 'Itinerary View',
    'city-search': 'City Search',
    'activity-search': 'Activities',
    budget: 'Budget',
    packing: 'Packing List',
    notes: 'Trip Notes',
    shared: 'Public Itinerary',
    chat: 'AI Planner',
    profile: 'Profile Settings',
    admin: 'Admin Dashboard',
  },

  navigate(screen, data = {}, options = {}) {
    if (screen === 'dashboard' && WL.currentUser && WL.currentUser.role !== 'admin') {
      screen = 'my-trips';
    }

    if (!options.replace && this.currentScreen && this.currentScreen !== screen && this.currentScreen !== 'auth') {
      this.history.push({ screen: this.currentScreen, data: this.currentData || {} });
      this.history = this.history.slice(-20);
    }

    document.querySelectorAll('#app-main > .screen').forEach(section => {
      section.classList.remove('active');
      section.style.display = 'none';
    });

    const target = document.querySelector(`#app-main > [data-screen="${screen}"]`);
    if (target) {
      target.classList.add('active');
      target.style.display = 'block';
      this.currentScreen = screen;
      this.currentData = data;
    }

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.screen === screen);
    });

    this.updateHeader(screen);
    this.trackRecentTrip(data.tripId);

    if (window.Screens && Screens[screen]) Screens[screen](data);
    window.scrollTo(0, 0);
  },

  back() {
    const previous = this.history.pop();
    if (previous) {
      this.navigate(previous.screen, previous.data, { replace: true });
    } else {
      this.navigate('my-trips', {}, { replace: true });
    }
  },

  updateHeader(screen) {
    const title = this.screenTitles[screen] || screen;
    const titleEl = document.getElementById('headerTitle');
    const crumbEl = document.getElementById('breadcrumbs');
    const backEl = document.getElementById('headerBack');
    if (titleEl) titleEl.textContent = title;
    if (crumbEl) crumbEl.textContent = `Odyssey / ${title}`;
    if (backEl) backEl.disabled = this.history.length === 0;
  },

  trackRecentTrip(tripId) {
    const select = document.getElementById('recentTripSelect');
    if (!select) return;

    if (tripId) {
      const recent = JSON.parse(localStorage.getItem('tl_recent_trips') || '[]');
      const next = [tripId, ...recent.filter(id => id !== tripId)].slice(0, 5);
      localStorage.setItem('tl_recent_trips', JSON.stringify(next));
    }

    const ids = JSON.parse(localStorage.getItem('tl_recent_trips') || '[]');
    const trips = ids.map(id => WL.trips.find(trip => trip.id === id)).filter(Boolean);
    select.innerHTML = '<option value="">Recent trips</option>' + trips.map(trip =>
      `<option value="${trip.id}">${escapeHtml(trip.name)}</option>`
    ).join('');
  },

  goAuth() {
    document.getElementById('sidebar').classList.add('hidden');
    document.getElementById('app-header').classList.add('hidden');
    document.getElementById('app-main').style.display = 'none';

    const auth = document.getElementById('screen-auth');
    auth.classList.add('active');
    auth.style.display = 'flex';
    this.currentScreen = 'auth';
    this.history = [];
    if (window.Screens && Screens.auth) Screens.auth();
  },

  goApp(screen = 'dashboard') {
    const auth = document.getElementById('screen-auth');
    auth.classList.remove('active');
    auth.style.display = 'none';

    document.getElementById('sidebar').classList.remove('hidden');
    document.getElementById('app-header').classList.remove('hidden');
    document.getElementById('app-main').style.display = 'block';

    const user = WL.currentUser;
    if (user) {
      const initial = (user.name || user.email || 'T')[0].toUpperCase();
      const headerAvatar = document.getElementById('headerAvatar');
      const sidebarAvatar = document.getElementById('sidebarAvatar');
      const sidebarName = document.getElementById('sidebarName');
      const sidebarRole = document.getElementById('sidebarRole');
      if (headerAvatar) headerAvatar.textContent = initial;
      if (sidebarAvatar) sidebarAvatar.textContent = initial;
      if (sidebarName) sidebarName.textContent = user.name || user.email || 'Traveler';
      if (sidebarRole) sidebarRole.textContent = user.role === 'admin' ? 'Admin workspace' : 'Explorer plan';

      const dashboardLink = document.querySelector('.nav-link[data-screen="dashboard"]');
      if (dashboardLink && dashboardLink.parentElement) {
        dashboardLink.parentElement.style.display = user.role === 'admin' ? 'block' : 'none';
      }
    }

    this.navigate(screen, {}, { replace: true });
  }
};

document.querySelectorAll('.nav-link[data-screen]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    Router.navigate(link.dataset.screen);
  });
});

document.getElementById('logoutBtn')?.addEventListener('click', () => {
  WL.currentUser = null;
  localStorage.removeItem('wl_user');
  showToast('Signed out. Until next time!', 'success');
  setTimeout(() => Router.goAuth(), 500);
});

window.Screens = {};
