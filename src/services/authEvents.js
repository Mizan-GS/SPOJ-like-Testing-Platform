let onLogout = null;

export const setLogoutHandler = (handler) => {
  onLogout = handler;
};

export const triggerLogout = () => {
  if (onLogout) {
    onLogout();
  }
};
