import {AppVersion} from 'ionic-native';
import Promise from 'bluebird';

import {dateFormat} from './date';
import fetch from './fetch';
import {platform} from './platform';
import storage from './storage';

import {appUpgradeUrl} from '../config';
import StorageKeys from '../constants/StorageKeys';

export async function getNewVersion() {
  let promises = [
    getStorageAppInfo(),
    getLocalAppInfo(),
    getRemoteAppInfo(),
  ];

  let [storageAppInfo, localAppInfo, remoteAppInfo] = await Promise.all(promises);

  if (storageAppInfo.version !== localAppInfo.version ||
    storageAppInfo.versionCode !== localAppInfo.versionCode) {
    return true;
  }

  if (remoteAppInfo.version > localAppInfo.version ||
    (remoteAppInfo.versionCode && remoteAppInfo.versionCode > localAppInfo.versionCode)) {
    return remoteAppInfo;
  }

  return;
}

export async function getStorageAppInfo() {
  let promises = [
    storage.get(StorageKeys.APP_VERSION),
    storage.get(StorageKeys.APP_VERSION_CODE)
  ];

  let [version, versionCode] = await Promise.all(promises);

  return {
    version,
    versionCode
  };
}

export async function getLocalAppInfo() {
  let promises = [
    AppVersion.getVersionNumber(),
    AppVersion.getVersionCode()
  ];

  let [version, versionCode] = await Promise.all(promises);

  return {
    version,
    versionCode
  };
}

export async function getRemoteAppInfo() {
  let version;
  let versionCode;
  let extra = {};

  const url = appUpgradeUrl[platform];

  if (url) {
    await fetch(url)
      .then(function (response) {
        return response.json();
      }).then(function (result) {
        if (url.search('itunes.apple.com') > -1) {
          if (result.resultCount > 0) {
            result = result.results[0];

            version = result.version;
            versionCode = version.version;

            extra.upgradeUrl = result.trackViewUrl.replace('https://', 'itms-apps://');
            extra.upgradeLogs = result.releaseNotes.replace(/ (\d\.)/g, '\n$1').split('\n');
            extra.releaseDate = result.currentVersionReleaseDate.replace('T', '').replace('Z', '');
          }
          else {
            throw new Error('Apple Store 检查更新地址配置错误！');
          }
        }
        else if (url.search('fir.im') > -1) {
          if (result.versionShort) {
            version = result.versionShort;
            versionCode = result.version;

            extra.installUrl = result.install_url;
            extra.upgradeUrl = result.update_url;
            extra.upgradeLogs = result.changelog;
            extra.releaseDate = dateFormat(new Date(result.updated_at * 1000));
          }
          else {
            throw new Error('Fir.im 检查更新地址配置错误！');
          }
        }
        else {
          throw new Error('检查更新地址配置错误！');
        }
      }).catch(function (ex) {
        throw new Error('获取服务器版本信息失败！');
      });
  }

  return {
    version,
    versionCode,
    extra
  };
}
