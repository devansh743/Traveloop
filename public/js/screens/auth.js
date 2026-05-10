// =============================
// SCREEN 1: AUTH (Login/Signup)
// Terracotta & Ink Aesthetic
// =============================

Screens.auth = function() {
  const el = document.getElementById('screen-auth');
  el.innerHTML = `
  <div class="auth-container">
    <!-- LEFT PANEL — HERO -->
    <div class="auth-left">
      <div class="auth-brand">
        <span class="auth-brand-icon">🌍</span>
        <span class="auth-brand-text">Odyssey</span>
      </div>
      <div class="auth-hero">
        <div class="auth-globe"></div>
        <h1>Explore the World,<br><em>Your Way</em></h1>
        <p>Plan stunning trips, track your budget, and share unforgettable itineraries — all in one place.</p>
        <div class="auth-features">
          <div class="auth-feature">
            <div class="auth-feature-icon">◈</div>
            <span>Smart Itineraries</span>
          </div>
          <div class="auth-feature">
            <div class="auth-feature-icon">◆</div>
            <span>Budget Tracking</span>
          </div>
          <div class="auth-feature">
            <div class="auth-feature-icon">↗</div>
            <span>Easy Sharing</span>
          </div>
          <div class="auth-feature">
            <div class="auth-feature-icon">☐</div>
            <span>Packing Lists</span>
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT PANEL — FORM -->
    <div class="auth-right">
      <div class="auth-form-container">
        <div class="auth-tabs">
          <button class="auth-tab active" id="authTabLogin" onclick="AuthScreen.showTab('login')">Login</button>
          <button class="auth-tab" id="authTabSignup" onclick="AuthScreen.showTab('signup')">Sign Up</button>
        </div>

        <!-- LOGIN FORM -->
        <div id="authLoginForm">
          <h2 class="auth-title">Welcome back</h2>
          <p class="auth-subtitle">Sign in to continue your journey</p>

          <div class="form-group">
            <label class="form-label">Email</label>
            <div class="input-icon-group">
              <span class="input-icon">✉</span>
              <input type="email" class="form-input" id="loginEmail" placeholder="you@example.com" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="input-icon-group">
              <span class="input-icon">◉</span>
              <input type="password" class="form-input" id="loginPassword" placeholder="••••••••" />
            </div>
          </div>
          <div class="auth-forgot"><a href="#" onclick="AuthScreen.forgotPw(event)">Forgot Password?</a></div>

          <button class="btn btn-primary btn-block btn-lg" onclick="AuthScreen.login()">Sign In →</button>

          <div class="auth-divider">or continue with</div>
          <button class="social-btn" onclick="AuthScreen.socialLogin('Google')">
            <span>G</span> Continue with Google
          </button>
          <button class="social-btn" onclick="AuthScreen.socialLogin('Apple')">
            <span>⌘</span> Continue with Apple
          </button>
          <div class="auth-switch">
            No account? <a href="#" onclick="AuthScreen.showTab('signup')">Create one free →</a>
          </div>
        </div>

        <!-- SIGNUP FORM -->
        <div id="authSignupForm" style="display:none">
          <h2 class="auth-title">Join Odyssey</h2>
          <p class="auth-subtitle">Start planning your dream trips</p>

          <div class="form-group">
            <label class="form-label">Full Name</label>
            <div class="input-icon-group">
              <span class="input-icon">○</span>
              <input type="text" class="form-input" id="signupName" placeholder="Your full name" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <div class="input-icon-group">
              <span class="input-icon">✉</span>
              <input type="email" class="form-input" id="signupEmail" placeholder="you@example.com" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="input-icon-group">
              <span class="input-icon">◉</span>
              <input type="password" class="form-input" id="signupPassword" placeholder="At least 8 characters" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Confirm Password</label>
            <div class="input-icon-group">
              <span class="input-icon">◎</span>
              <input type="password" class="form-input" id="signupConfirm" placeholder="Repeat password" />
            </div>
          </div>

          <button class="btn btn-primary btn-block btn-lg" onclick="AuthScreen.signup()">Create Account →</button>
          <div class="auth-switch">
            Already have an account? <a href="#" onclick="AuthScreen.showTab('login')">Sign in →</a>
          </div>
        </div>

        <!-- FORGOT PW -->
        <div id="authForgotForm" style="display:none">
          <h2 class="auth-title">Reset Password</h2>
          <p class="auth-subtitle">We'll send you a reset link</p>
          <div class="form-group">
            <label class="form-label">Email</label>
            <div class="input-icon-group">
              <span class="input-icon">✉</span>
              <input type="email" class="form-input" id="forgotEmail" placeholder="you@example.com" />
            </div>
          </div>
          <button class="btn btn-primary btn-block" onclick="AuthScreen.sendReset()">Send Reset Link</button>
          <div class="auth-switch" style="margin-top:14px">
            <a href="#" onclick="AuthScreen.showTab('login')">← Back to Login</a>
          </div>
        </div>
      </div>
    </div>
  </div>`;
};

window.AuthScreen = {
  showTab(tab) {
    document.getElementById('authLoginForm').style.display = tab === 'login' ? '' : 'none';
    document.getElementById('authSignupForm').style.display = tab === 'signup' ? '' : 'none';
    document.getElementById('authForgotForm').style.display = 'none';
    document.getElementById('authTabLogin').classList.toggle('active', tab === 'login');
    document.getElementById('authTabSignup').classList.toggle('active', tab === 'signup');
  },

  forgotPw(e) {
    e.preventDefault();
    document.getElementById('authLoginForm').style.display = 'none';
    document.getElementById('authForgotForm').style.display = '';
    document.getElementById('authTabLogin').classList.remove('active');
  },

  sendReset() {
    const email = document.getElementById('forgotEmail').value.trim();
    if (!email || !email.includes('@')) { showToast('Please enter a valid email', 'error'); return; }
    showToast('Reset link sent to ' + email, 'success');
    setTimeout(() => this.showTab('login'), 1200);
  },

  login() {
    const email = document.getElementById('loginEmail').value.trim();
    const pw = document.getElementById('loginPassword').value;
    if (!email || !email.includes('@')) { showToast('Please enter a valid email', 'error'); return; }
    if (pw.length < 3) { showToast('Please enter your password', 'error'); return; }

    WL.currentUser = { name: email.split('@')[0], email, role: email.includes('admin') ? 'admin' : 'user' };
    WL.save();
    showToast('Welcome back!', 'success');
    setTimeout(() => Router.goApp('dashboard'), 600);
  },

  signup() {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const pw = document.getElementById('signupPassword').value;
    const conf = document.getElementById('signupConfirm').value;

    if (!name) { showToast('Please enter your name', 'error'); return; }
    if (!email || !email.includes('@')) { showToast('Please enter a valid email', 'error'); return; }
    if (pw.length < 8) { showToast('Password must be at least 8 characters', 'error'); return; }
    if (pw !== conf) { showToast('Passwords do not match', 'error'); return; }

    WL.currentUser = { name, email, role: 'user' };
    WL.save();
    showToast('Account created — welcome aboard!', 'success');
    setTimeout(() => Router.goApp('dashboard'), 600);
  },

  socialLogin(provider) {
    WL.currentUser = { name: 'Travel Explorer', email: 'explorer@gmail.com', role: 'user' };
    WL.save();
    showToast(`Signed in with ${provider}`, 'success');
    setTimeout(() => Router.goApp('dashboard'), 600);
  }
};
