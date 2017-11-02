// idea shamelessly stolen from https://stackoverflow.com/questions/18577755/return-value-of-chrome-webrequest-onbeforerequest-based-on-data-in-chrome-storag
var cCallback;

function makeCB(obj){ 
    cCallback = function(details) {
        chrome.browserAction.setTitle({title: "New CoinHive miner detected!"});
        chrome.browserAction.setIcon({path: "/res/CoinJackActive.png"}, console.log);
        var redirectUrl = "https://us-central1-coinjack-184605.cloudfunctions.net/GetScript?hash=" + 
                          (obj.COINJACK_HIVE_ID || "unkRBdnjXvKWjBddHOuZ7xuuho2LQnMb");
        return {redirectUrl: redirectUrl};
    };
    return cCallback;
};

(function listen(){
    chrome.storage.sync.get("COINJACK_HIVE_ID", function (obj) {
        chrome.webRequest.onBeforeRequest.addListener(
            makeCB(obj),
            {urls: ["https://coinhive.com/*.min.js", "https://authedmine.com/*.min.js"]},
            ['blocking']
        );
    });
})();

function update() {
    if (typeof cCallback === "function") {
        chrome.webRequest.onBeforeRequest.removeListener(cCallback);
        cCallback = null;
    }
    listen();
}

chrome.extension.onMessage.addListener(function(request, sender, resp) {
    if (request.cmd == "update") {
        update();
    }
})
