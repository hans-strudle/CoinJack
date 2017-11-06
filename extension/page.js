window.browser = window.msBrowser || window.browser || window.chrome;

function init(){
    var miners = document.getElementsByClassName("CoinJackMinerObj");
    window.CoinJackObserver = new MutationObserver(function(muts) {
        var data = Object.assign({}, muts[0].target.dataset); // DOMStringMap needs to be converted to a normal obj for firefox
        browser.runtime.sendMessage(data, function(resp) {
            if (resp && (muts[0].target.dataset.running == 'true') != resp.run) {
                muts[0].target.dataset.running = resp.run;
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
