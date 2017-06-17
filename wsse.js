//
// wsse.js - Generate WSSE authentication header in JavaScript
// (C) 2005 Victor R. Ruiz <victor*sixapart.com> - http://rvr.typepad.com/
//
// Parts:
//   SHA-1 library (C) 2000-2002 Paul Johnston - BSD license
//   ISO 8601 function (C) 2000 JF Walker All Rights
//   Base64 function (C) aardwulf systems - Creative Commons
//
// Example call:
//
//   let w = wsseHeader(Username, Password);
//   alert('X-WSSE: ' + w);
//
// Changelog:
//   2005.07.21 - Release 1.0
//

/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
/* hex output format. 0 - lowercase; 1 - uppercase        */
let b64pad = "=";
/* base-64 pad character. "=" for strict RFC compliance   */
let chrsz = 8;
/* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function b64_sha1(s) {
    return binb2b64(core_sha1(str2binb(s), s.length * chrsz));
}

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function core_sha1(x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << (24 - len % 32);
    x[((len + 64 >> 9) << 4) + 15] = len;

    let w = new Array(80);
    let a = 1732584193;
    let b = -271733879;
    let c = -1732584194;
    let d = 271733878;
    let e = -1009589776;

    for (let i = 0; i < x.length; i += 16) {
        let olda = a;
        let oldb = b;
        let oldc = c;
        let oldd = d;
        let olde = e;

        for (let j = 0; j < 80; j++) {
            if (j < 16) w[j] = x[i + j];
            else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            let t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
                safe_add(safe_add(e, w[j]), sha1_kt(j)));
            e = d;
            d = c;
            c = rol(b, 30);
            b = a;
            a = t;
        }

        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
        e = safe_add(e, olde);
    }
    return [a, b, c, d, e];

}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d) {
    if (t < 20) return (b & c) | ((~b) & d);
    if (t < 40) return b ^ c ^ d;
    if (t < 60) return (b & c) | (b & d) | (c & d);
    return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t) {
    return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 :
        (t < 60) ? -1894007588 : -899497514;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y) {
    let lsw = (x & 0xFFFF) + (y & 0xFFFF);
    let msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert an 8-bit or 16-bit string to an array of big-endian words
 * In 8-bit function, characters >255 have their hi-byte silently ignored.
 */
function str2binb(str) {
    let bin = [];
    let mask = (1 << chrsz) - 1;
    for (let i = 0; i < str.length * chrsz; i += chrsz)
        bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (32 - chrsz - i % 32);
    return bin;
}

/*
 * Convert an array of big-endian words to a base-64 string
 */
function binb2b64(binarray) {
    let tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let str = "";
    for (let i = 0; i < binarray.length * 4; i += 3) {
        let triplet = (((binarray[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16)
            | (((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8 )
            | ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF);
        for (let j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
            else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
        }
    }
    return str;
}

// aardwulf systems
// This work is licensed under a Creative Commons License.
// http://www.aardwulf.com/tutor/base64/
function encode64(input) {
    let keyStr = "ABCDEFGHIJKLMNOP" +
        "QRSTUVWXYZabcdef" +
        "ghijklmnopqrstuv" +
        "wxyz0123456789+/" +
        "=";

    let output = "";
    let chr1, chr2, chr3 = "";
    let enc1, enc2, enc3, enc4 = "";
    let i = 0;

    do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output +
            keyStr.charAt(enc1) +
            keyStr.charAt(enc2) +
            keyStr.charAt(enc3) +
            keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
    } while (i < input.length);

    return output;
}

// TITLE
// TempersFewGit v 2.1 (ISO 8601 Time/Date script)
//
// OBJECTIVE
// Javascript script to detect the time zone where a browser
// is and display the date and time in accordance with the
// ISO 8601 standard.
//
// AUTHOR
// John Walker
// http://321WebLiftOff.net
// jfwalker@ureach.com
//
// ENCOMIUM
// Thanks to Stephen Pugh for his help.
//
// CREATED
// 2000-09-15T09:42:53+01:00
//
// REFERENCES
// For more about ISO 8601 see:
// http://www.w3.org/TR/NOTE-datetime
// http://www.cl.cam.ac.uk/~mgk25/iso-time.html
//
// COPYRIGHT
// This script is Copyright  2000 JF Walker All Rights
// Reserved but may be freely used provided this colophon is
// included in full.
//
function isodatetime() {
    let today = new Date();
    let year = today.getFullYear(),
        month = '00' + (today.getMonth() + 1),
        day = '00' + today.getDate(),
        hour = '00' + today.getHours(),
        minute = '00' + today.getMinutes(),
        second = '00' + today.getSeconds(),
        offsetModifier = (today.getTimezoneOffset()) < 0 ? '+' : '-',
        offsetHour = '00' + Math.abs(Math.floor(today.getTimezoneOffset() / 60)),
        offsetMinute = '00' + (today.getTimezoneOffset() % 60);

    return year + "-" +
        month.slice(-2, month.length) + "-" +
        day.slice(-2, day.length) + "T" +
        hour.slice(-2, hour.length) + ":" +
        minute.slice(-2, minute.length) + ":" +
        second.slice(-2, second.length) +
        offsetModifier +
        offsetHour.slice(-2, offsetHour.length) + ':' +
        offsetMinute.slice(-2, offsetMinute.length);
}

// (C) 2005 Victor R. Ruiz <victor*sixapart.com>
// Code to generate WSSE authentication header
//
// http://www.sixapart.com/pronet/docs/typepad_atom_api
//
// X-WSSE: UsernameToken Username="name", PasswordDigest="digest", Created="timestamp", Nonce="nonce"
//
//  * Username- The username that the user enters (the TypePad username).
//  * Nonce. A secure token generated anew for each HTTP request.
//  * Created. The ISO-8601 timestamp marking when Nonce was created.
//  * PasswordDigest. A SHA-1 digest of the Nonce, Created timestamp, and the password
//    that the user supplies, base64-encoded. In other words, this should be calculated
//    as: base64(sha1(Nonce . Created . Password))
//

function wsse(Password) {
    let PasswordDigest, Nonce, Created;
    let r = [];

    Nonce = b64_sha1(isodatetime() + 'There is more than words');
    let nonceEncoded = encode64(Nonce);
    Created = isodatetime();
    PasswordDigest = b64_sha1(Nonce + Created + Password);

    r[0] = nonceEncoded;
    r[1] = Created;
    r[2] = PasswordDigest;
    return r;
}

function wsseHeader(Username, Password) {
    let w = wsse(Password);
    return 'UsernameToken Username="' + Username + '", PasswordDigest="' + w[2] + '", Nonce="' + w[0] + '", Created="' + w[1] + '"';
}
