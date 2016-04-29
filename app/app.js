import {App, IonicApp, Platform} from 'ionic-angular';
import {Splashscreen, StatusBar} from 'ionic-native';

import {WhatsNewPage} from './pages/whatsNew/whatsNew';
import {TabsPage} from './pages/tabs/tabs';

import {getNewVersion} from './utils/version';
import {increaseLaunchCounter, openRateDialog} from './utils/appRate';

@App({
  template: '<ion-nav id="nav" [root]="rootPage"></ion-nav>',
  config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
})
export class SeedApp {
  static get parameters() {
    return [[Platform], [IonicApp]];
  }

  constructor(platform, app) {
    this.platform = platform;
    this.app = app;

    this.rootPage = WhatsNewPage;
  }

  ngAfterViewInit() {
    this.nav = this.app.getComponent('nav');
    this.platform.ready().then(this.onReady.bind(this));
  }

  onReady() {
    StatusBar.styleDefault();

    getNewVersion().then((newVersion) => {
      Splashscreen.hide();

      if (newVersion === true) {
        this.nav.setRoot(WhatsNewPage);
      } else if (newVersion) {
        this.nav.setRoot(TabsPage);
        increaseLaunchCounter();
        openRateDialog(newVersion);
      } else {
        increaseLaunchCounter();
      }
    }, () => {
      Splashscreen.hide();
      this.nav.setRoot(TabsPage);
    });
  }
}
