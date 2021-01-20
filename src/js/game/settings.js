export const initialUserSettings = {
  pauseOnLoad: false,
  maxOfflineSpeed: 10,
  autoSaveSeconds: 15,
  confirmBoardSize: true,
  confirmSuperBoardSize: true,
  confirmPrestige: true,
};

export const isValidUserSettings = (userSettings) => {
  if (!userSettings.hasOwnProperty('pauseOnLoad')) {
    return false;
  }
  if (userSettings.maxOfflineSpeed < 1 || userSettings.maxOfflineSpeed > 20) {
    return false;
  }
  if (userSettings.autoSaveSeconds < 0) {
    return false;
  }
  return true;
};