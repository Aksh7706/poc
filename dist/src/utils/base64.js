"use strict";
/**
 *
 *  Base64 encode / decode
 *  http://www.webtoolkit.info/
 *
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base64 = void 0;
class Base64 {
    static encode(data) {
        var encodedStr = btoa(data);
        var removeSpecial = encodedStr.replaceAll('+', '_');
        var urlSafe = removeSpecial.replaceAll('/', '-');
        return urlSafe;
    }
    static decode(data) {
        var urlFix = data.replaceAll('-', '/');
        var encodedStr = urlFix.replaceAll('_', '+');
        return atob(encodedStr);
    }
}
exports.Base64 = Base64;
