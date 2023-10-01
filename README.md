# Virgin Media Hub 4

Basic python utility to poke a Virgin Media Hub 4. By poke, I mean reboot.

## Overview

It's quickly becoming apparent this isn't going to be as easy as I'd hoped, with a few basic auth'd requests from python. Right now I'm very much leaning towards a "retail power-down" (ie. pulling the power) by using a [Smart Plug](https://www.mylocalbytes.com/products/smart-plug-pm) #NotSponsored via [Home Assistant](https://www.home-assistant.io/).

There is at least one easy-enough option to do this via software, which is to use Selenium to drive the UI. This [repo from andresp](https://github.com/andresp/cablemodem-status) may do the trick already. I believe the Hub 4 is "Arris’s Touchstone TG3492 Telephony Gateway router, which in the United Kingdom has been given the model code of TG3492LG-VMB ... Judging by these specs the Gigabit Connect Box (Hub 4) is a very close match for Arris’s TG3442 router" according to [ISPReview](https://www.ispreview.co.uk/index.php/2019/07/a-look-at-virgin-media-uks-future-hub-4-gigabit-connect-box-router.html).

If I'm going to write something new I want to understand how to authenticate and make the appropriate requests directly.

## Investigation

Initially there is a `POST` to `http://192.168.0.1/php/ajaxSet_Password.php` whihc returns a nonce in the body and a PHPSESSID cookie in the response headers which future requests send.

Response header

`Set-Cookie PHPSESSID=32_char_hex_string_here; path=/; HttpOnly`

Response body

```json
{
  "p_status": "Match",
  "nonce": "somerandomnoncevaluehere"
}
```

This would be simple if the credentials were sent via basic auth or similar, but the web UI doesn't use https, at least not to serve the login page on the default IP of <http://192.168.0.1/>.

This is the request bbody which is sent,

```json
{"encryptedBlob":"a_rather_long_hex_encoded_string","salt":"16_char_hex_string","iv":"16_char_hex_string","authData":"encryptData"}
```

Looking at the source code for the homepage there are a couple of interesting looking javascript files in a section commented as `ARRIS ADD START 37130`, these are `scripts/sjcl.js` and `crypto.js`.

`sjcl.js` appears obfuscated and might handle the low level encryption, `crypto.js` is more readable. Inspecting the login page, there is a password entry field and a "Next" button. I can see the on-click method by inspecting the Next button but not located the code which implements the on_click event handler yet. To be continued...
