# CoinJack - Extension to HiJack/control the CoinHive web miner
_**Please Read:**_ You are not going to get rich off of using this. Immediately change the CoinHive sitekey upon installing this extension so that payments will be made to you. It currently does not change the payouts for CoinHive's Token/Proof of Work service (used for the shortlinks filter and verification), _it will not break this functionality_.

## Get it
[![Chrome Extension](https://raw.githubusercontent.com/hans-strudle/CoinJack/master/res/ChromeWebStore_Badge.png)](https://chrome.google.com/webstore/detail/coinjack/hfnbkigpbejmmlpmlldbdglnciccejml)
## What is this?
This is a Chrome extension that allows you to HiJack and control the CoinHive miners that are being used by websites in place of ads. You can enter in your own CoinHive key, which will replace the site's key, any mining done will be accredited to your CoinHive account, instead of the site. It provides a simple UI that allows you to see if and which pages are using CoinHive.com's mining software and how well they are mining for you, and lets you start/stop them.

![CoinJack Screenshot](https://raw.githubusercontent.com/hans-strudle/CoinJack/master/res/screenshot-1.PNG)

## How to use
First, go over to [CoinHive.com](https://coinhive.com) and make an account. Then go to your [Settings > Site & Api Keys](https://coinhive.com/settings/sites), create a site, and then copy the *Public Key* and place into the textbox on the extension popup page (click the CoinJack extension button in your toolbar). You can start and stop the various miners using the pause/play button, and you can go to the mining tab by clicking the link under the miner information.

## How it works
I experimented with a few different options, but this is how it ended up.

When a page request's CoinHive's mining script, `coinhive.min.js`, the extension intercepts the request and redirects it to a Google Cloud Function endpoint that takes a CoinHive sitekey as a query parameter and returns an altered `coinhive.min.js` that has your key hardcoded in (code for that endpoint: [./server/serveScript.js](./server/serveScript.js)). Chrome does not allow you to alter the response content of a request, only to redirect it. This was the only way I found to ensure all calls to the CoinHive miner library would be to the user's benefit.

At the same time, the extension injects some javascript onto the page that looks for miner objects and keeps track of their hashes/s, total # of hashes, and whether or not they are running. Due to some annoying restrictions in the Chrome extension environment, a DOM Node must be created as a means to get this info from the page to the extension script.
