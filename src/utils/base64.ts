/**
 *
 *  Base64 encode / decode
 *  http://www.webtoolkit.info/
 *
 **/

export class Base64 {
  static encode(data: string) {
    var encodedStr = btoa(data);
    var removeSpecial = encodedStr.replaceAll('+', '_');
    var urlSafe = removeSpecial.replaceAll('/', '-');
    return urlSafe;
  }

  static decode(data: string) {
    var urlFix = data.replaceAll('-', '/');
    var encodedStr = urlFix.replaceAll('_', '+');
    return atob(encodedStr);
  }
}
