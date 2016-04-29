import {Platform} from 'ionic-angular';

const inst = new Platform();

export const isIOS = inst.is('ios');
export const isAndroid = inst.is('android');
export const platform = isIOS ? 'ios' : isAndroid ? 'android' : '';
