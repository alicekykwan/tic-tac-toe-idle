import { Tune } from '@material-ui/icons';
import { AUTOMATABLE_UPGRADES, UPGRADE_WARNING } from '../constants/upgradeTypes';

export const initialUserSettings = {
  pauseOnLoad: false,
  maxOfflineSpeed: 5,
  autoSaveSeconds: 15,
  confirmPrestige: true,
  confirmStartChallenge: true,
  autoBuyers: {},
  confirmUpgrade: {},
};

for (let upgradeType in UPGRADE_WARNING) {
  initialUserSettings.confirmUpgrade[upgradeType] = true;
}

for (let upgradeTypes of Object.values(AUTOMATABLE_UPGRADES)) {
  for (let upgradeType of upgradeTypes){
    initialUserSettings.autoBuyers[upgradeType] = {on: false, lim: 100};
  }
}

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