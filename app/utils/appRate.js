import {AppVersion, Dialogs} from 'ionic-native';

import {platform} from './platform';
import storage from './storage';

import {appRateUrl} from '../config';
import StorageKeys from '../constants/StorageKeys';

const rateCounter = 3;

export async function increaseLaunchCounter() {
  let launchCounter = await storage.get(StorageKeys.LAUNCH_COUNTER);

  launchCounter = parseInt(launchCounter, 10) || 0;

  return storage.set(StorageKeys.LAUNCH_COUNTER, launchCounter + 1);
};

export async function openRateDialog() {
  const url = appRateUrl[platform];

  let launchCounter = await storage.get(StorageKeys.LAUNCH_COUNTER);

  launchCounter = parseInt(launchCounter, 10) || 0;

  if (launchCounter - rateCounter === 0 && url) {
    let appName;

    await AppVersion.getAppName().then(function (_appName) {
      appName = _appName;
    });

    let title = '为“' + appName + '”评分';
    let message = '您的好评是我们开发更好功能的动力，给个好评吧！';
    let buttons = ['现在去评分', '稍后再说', '不了，谢谢'];

    return Dialogs.confirm(message, title, buttons).then(onButtonClick);
  }

  function onButtonClick(index) {
    switch (index) {
      case 1:
        window.open(url, '_system');
        storage.set(StorageKeys.LAUNCH_COUNTER, rateCounter + 1);
        break;
      case 2:
        storage.set(StorageKeys.LAUNCH_COUNTER, 0);
        break;
      case 3:
        storage.set(StorageKeys.LAUNCH_COUNTER, rateCounter + 1);
        break;
    }
  }
}
