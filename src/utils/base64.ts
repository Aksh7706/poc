/**
 *
 *  Base64 encode / decode
 *  http://www.webtoolkit.info/
 *
 **/

export class Base64 {
  static encode(data: string) {
    return data;
    // if(!data.includes('.')) return data;
    // var encodedStr = btoa(data);
    // var removeSpecial = encodedStr.replaceAll('+', '_');
    // var urlSafe = removeSpecial.replaceAll('/', '-');
    // return urlSafe;
  }

  static decode(data: string) {
    return data;
    // try{
    //     var urlFix = data.replaceAll('-', '/');
    //     var encodedStr = urlFix.replaceAll('_', '+');
    //     return atob(encodedStr);
    // } catch (e) {
    //     console.log("Decode Error : ", e)
    //     return data;
    // }
  }
}
