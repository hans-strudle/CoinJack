var miners = {};

chrome.extension.onMessage.addListener(
    function (message, sender, sendResponse) {
        minerName = 'tab' + sender.tab.id + '.' + message.name + '.miner-control';
        message.running = (message.running == 'true');
        miners[minerName] = miners[minerName] || {run: message.running, hashesPerSec: 0, hashes: 0}
        var miner = document.querySelector('.' + message.name);
        if (!document.querySelector('.miner-control')) document.getElementById("miners").innerHTML = '';
        if (!document.querySelector('#tab' + sender.tab.id)) {
            newControlElement(message.name, 'tab' +  sender.tab.id, message, document.getElementById("miners"), sender.tab);
        } else {
            updateControlElement(message.name, 'tab' +  sender.tab.id, message);
        }
        sendResponse(miners[minerName]);
    }
);

chrome.browserAction.setTitle({title: "CoinJack"});
chrome.browserAction.setIcon({path: "/res/CoinJack.png"}, console.log);

chrome.storage.sync.get("COINJACK_HIVE_ID", function (obj) {
    var HIVE_ID = obj.COINJACK_HIVE_ID;
    var hive_key = document.getElementById("hive_key");
    hive_key.value = HIVE_ID || "unkRBdnjXvKWjBddHOuZ7xuuho2LQnMb";
    hive_key.onchange = hive_key.onkeyup = function (e) {
        HIVE_ID = e.target.value;
        chrome.storage.sync.set({"COINJACK_HIVE_ID": e.target.value}, function(){
            chrome.extension.sendMessage({"cmd":"update"}, console.log)
        });
    }
    //window.onunload = window.onbeforeunload = function (e) { // this doesn't seem to work
    //    console.log(e);
    //    //if (document.getElementById("hive_key").value != HIVE_ID) {
    //        HIVE_ID = document.getElementById("hive_key").value;
    //        chrome.extension.sendMessage({"cmd":"update"}, console.log)
    //        chrome.storage.sync.set({"COINJACK_HIVE_ID": HIVE_ID}, function(){
    //            chrome.extension.sendMessage({"cmd":"update"}, console.log)
    //        
    //        })
    //    //}
    //}
});

function controlMiner(e) {
    e.target.src = ((e.target.src.endsWith("/res/start.png")) ? "/res/stop.png" : "/res/start.png");
    el = e.target.parentNode.parentNode.parentNode.parentNode
    miner = el.id + '.' + el.className.split(' ').join('.')
    miners[miner].run = !miners[miner].run;
};

function createElem(type, config) {
    var el = document.createElement(type);
    for (var x in config) {
        el[x] = config[x];
    }
    return el;
}

function updateControlElement(name, id, data) {
    var el = document.querySelector('#' + id + '.' + name);
    var src = ((data.running) ? "/res/stop.png" : "/res/start.png");
    el.getElementsByClassName("minerCtrlButton")[0].src = src;
    el.getElementsByClassName('hashesPerSec')[0].getElementsByClassName("num")[0].innerHTML = data.hashesPerSec;
    el.getElementsByClassName('hashes')[0].getElementsByClassName("num")[0].innerHTML = data.hashes;
}

function toTab(e) {
    var id = e.target.parentNode.parentNode.parentNode.id.substring(3, 6);
    chrome.tabs.update(parseInt(id), {selected: true});
}

function newControlElement(name, id, data, root, tab) {
    var el = createElem("div", {className: name.split('.').join(' ') + ' miner-control', id: id});
    var hashInfo = createElem("div", {className: "hashinfo"});
    var hashesPerSec = createElem("div", {className: "hashesPerSec"})
    var hashes = createElem("div", {className: "hashes"})
    var num = createElem("span", {className: "num", innerHTML: data.hashesPerSec})
    var num1 = createElem("span", {className: "num", innerHTML: data.hashes})
    var units = createElem("span", {className: "units", innerHTML: " H/s"})
    var units1 = createElem("span", {className: "units", innerHTML: " Hashes"})
    hashesPerSec.appendChild(num); 
    hashesPerSec.appendChild(units);
    hashes.appendChild(num1);
    hashes.appendChild(units1); 
    hashInfo.appendChild(hashesPerSec);
    hashInfo.appendChild(hashes);
    var control = createElem("div", {className: "controls"});
    var stop = createElem("div", {className: "stop"});
    var src = ((data.running) ? "/res/stop.png" : "/res/start.png");
    stop.appendChild(createElem("img", {onclick: controlMiner, src: src, className: "minerCtrlButton"}));
    control.appendChild(stop);
    var minerInfo = createElem("div", {className: "minerInfo"});
    var tabInfo = createElem("div", {className: "tabInfo"});
    tabInfo.appendChild(createElem("div", {className: "minerName"})
                        .appendChild(createElem("a", {href: "#", innerHTML: createTabLink(tab), onclick: toTab, className: "minerName"})));
    minerInfo.appendChild(hashInfo);
    minerInfo.appendChild(control);
    el.appendChild(minerInfo);
    el.appendChild(tabInfo);
    root.appendChild(el);
}

function createTabLink(tab) {
    return "<img width='16' height='16' src='" + tab.favIconUrl + 
           "' /><span style='vertical-align:top'>" + tab.title + "</span>";
}
