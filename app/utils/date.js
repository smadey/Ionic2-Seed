export function dateFormat(date, format) {
  format = format || 'YYYY-MM-DD HH:mm:ss';

  var o = {
    'M+': date.getMonth() + 1,
    'D+': date.getDate(),
    'H+': date.getHours(),
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  };

  if (/(Y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  if (/(dd+)/.test(format)) {
    format = format.replace(RegExp.$1, '日一二三四五六七'.split('')[date.getDay()]);
  }

  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }

  return format;
};

export default {
  format: dateFormat
};
