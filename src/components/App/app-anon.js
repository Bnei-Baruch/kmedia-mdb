import { initKC, login } from '../../pkg/ksAdapter/adapter';

// Lightweight auth bootstrap for unauthenticated users.
// No React, no Redux — just KC session check.
initKC().then(kcInfo => {
  if (kcInfo?.token) {
    // SSO session found — cookie 'authorised=true' was set by initKC.
    // Reload so the server routes to full SSR via renderAuth.
    //window.location.reload();
    console.log('SSO session found, but reload is disabled for now. kcInfo:', kcInfo);
  } else {
    // No session — redirect to KC login.
    // KC will redirect back with ?authorised=true; middleware serves full HTML + app-anon.js.
    //login();
    console.log('No SSO session found, but login is disabled for now.');
  }
});
