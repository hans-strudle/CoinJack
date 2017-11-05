// idea shamelessly stolen from https://stackoverflow.com/questions/18577755/return-value-of-chrome-webrequest-onbeforerequest-based-on-data-in-chrome-storag
var cCallback;

window.browser = window.msBrowser || window.browser || window.chrome;

function makeCB(obj){ 
    cCallback = function(details) {
        browser.browserAction.setTitle({title: "New CoinHive miner detected!"});
        browser.browserAction.setIcon({path: "/res/CoinJackActive.png"}, console.log);
        var redirectUrl = "https://us-central1-coinjack-184605.cloudfunctions.net/GetScript?hash=" + 
                          (obj.COINJACK_HIVE_ID || "unkRBdnjXvKWjBddHOuZ7xuuho2LQnMb");
        return {redirectUrl: redirectUrl};
    };
    return cCallback;
};

function listen(){
    browser.storage.sync.get("COINJACK_HIVE_ID", function (obj) {
        browser.webRequest.onBeforeRequest.addListener(
            makeCB(obj),
            {urls: ["https://coinhive.com/*.min.js", "https://authedmine.com/*.min.js"]},
            ['blocking']
        );
    });
};

function update() {
    if (typeof cCallback === "function") {
        console.log("Removing old callback");
        browser.webRequest.onBeforeRequest.removeListener(cCallback);
        cCallback = null;
    }
    listen();
}

browser.runtime.onMessage.addListener(function(request, sender, resp) {
    console.log(request, sender);
    if (request.cmd == "update") {
        update();
    }
})

listen();
