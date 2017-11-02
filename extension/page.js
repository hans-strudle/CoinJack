function init(){
    var miners = document.getElementsByClassName("CoinJackMinerObj");
    var observer = new MutationObserver(function(muts) {
        chrome.extension.sendMessage(muts[0].target.dataset, function(resp) {
            if (resp && (muts[0].target.dataset.running == 'true') != resp.run) {
                muts[0].target.dataset.running = resp.run;
            }
        })
    });
    for (var miner of miners) {
        observer.observe(miner, {attributes:true})
    }
};

console.log('CoinHive Jacker extension');
injectJs(chrome.extension.getURL("/extension/inject.js"))
setTimeout(init, 1000);

function injectJs (src) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    (document.head || document.body || document.documentElement).appendChild(script);
}
