export const initialUserSettings = {
  pauseOnLoad: false,
  maxOfflineProgressSpeed: 10,
};

export const isValidUserSettings = (userSettings) => {
  if (!userSettings.hasOwnProperty('pauseOnLoad')) {
    return false;
  }
  return true;
};