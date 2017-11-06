var miners = {};

(function init() {
    if (window.CoinHive) {
        for (var key in window) {
            if (window[key] && window[key].goal > 0) continue; //it is a token so just skip it.
            if (window[key] && 
                window[key].hasOwnProperty('_siteKey') && 
                window[key].hasOwnProperty('_hashes') && 
                window[key].__proto__.hasOwnProperty('stop')) { // safe to assume this is a miner object
            
                    newMinerElement(window[key], key, document.body);
                
            }
        }
    }
})();

function newMinerElement(miner, name, node) {
    var el = document.createElement("span");
    el.style.display = 'none';
    el.dataset.name = "window." + name;
    el.className = "CoinJackMinerObj";
    el.dataset.running = miner.isRunning();
    node.appendChild(el);
    miners[miner] = setInterval(function(miner, el) {
        var hashes = miner.getTotalHashes(),
            hashesPerSec = miner.getHashesPerSecond().toFixed(2),
            running = miner.isRunning();
        
        if (el.dataset.hashes != hashes) el.dataset.hashes = hashes;
        if (el.dataset.hashesPerSec != hashesPerSec) el.dataset.hashesPerSec = hashesPerSec;
        if (miner.isRunning() && el.dataset.running == "false") {
            miner.stop();
        } else if (!miner.isRunning() && el.dataset.running == "true") {
            miner.start("forceMultiTab");
        }
        if (el.dataset.running != running) el.dataset.running = running;
    }.bind(this, miner, el), 100);
}
