import { initKC } from '../../pkg/ksAdapter/adapter';

initKC().catch(() => {
  window.location.href = `${window.location.pathname}?authorised=true`;
});
