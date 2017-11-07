window.browser = window.msBrowser || window.browser || window.chrome;

function init(){
    var miners = document.getElementsByClassName("CoinJackMinerObj");
    window.CoinJackObserver = new MutationObserver(function(mutation) {
        var data = Object.assign({}, mutation[0].target.dataset); // DOMStringMap -> a normal obj for firefox support
        browser.runtime.sendMessage(data, function(resp) {
            if (resp && (data.running == 'true') != resp.run) {
                mutation[0].target.dataset.running = resp.run;
            }
        })
    });
    for (var miner of miners) {
        window.CoinJackObserver.observe(miner, {attributes:true})
    }
};

console.log('CoinHive Jacker extension');
injectJs(browser.extension.getURL("/extension/inject.js"))
setTimeout(init, 1000);

function injectJs (src) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    (document.head || document.body || document.documentElement).appendChild(script);
}
