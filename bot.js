// ==UserScript==
// @name         CatFactsRobinBot
// @namespace    https://github.com/AlexCatch/RobinCatFactsBot
// @version      1
// @description  Say @catfact
// @author       AlexCatch
// @match        https://www.reddit.com/robin/
// @grant GM_xmlhttpRequest
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

(function() {
   'use strict';
    var websocket;
    var wsUri = r.config.robin_websocket_url;

    websocket = new WebSocket(wsUri);
    websocket.onmessage = function(evt) {onMessage(evt); };
    
    setTimeout(function() {
        sendMessage("I am a bot, send me a message with either !catfact, @catfact or @catfacts for a cat fact! [https://github.com/AlexCatch/RobinCatFactsBot]");
    }, 2000);
    
    setInterval(function(){ sendMessage("I am a bot, send me a message with either !catfact, @catfact or @catfacts for a cat fact! [https://github.com/AlexCatch/RobinCatFactsBot]");}, 300000);

    function onMessage(evt)
    {
        //recieved a message
        var jsonObject = JSON.parse(evt.data);
        if (jsonObject.type == "chat") {
            var regex = /^(!|@)cat\s?(bot|facts?)/i;
            //recieved message is a chat message, compare contents
            if (regex.test(jsonObject.payload.body.toLowerCase())) {
                console.log("make said request");
                //message was direcxted to us
                makeRequest(function(fact) {
                    console.log(fact);
                    sendMessage(fact);
                });
            }
        }
    }
    
    function sendMessage(message) {
        $("#robinSendMessage > input[type='text']").val("");
        $("#robinSendMessage > input[type='text']").val(message);
        $("#robinSendMessage > input[type='submit']").click();
    }
    function makeRequest(callback) {
        GM_xmlhttpRequest ({
            method: 'GET',
            url: "https://catfacts-api.appspot.com/api/facts",
            onload: function (responseDetails) {
                // DO ALL RESPONSE PROCESSING HERE..
                var jsonResponse = JSON.parse(responseDetails.response);
                var fact = jsonResponse.facts[0];
                console.log(fact.length);
                if (fact.length > 137) {
                    console.log("fact is too long");
                    makeRequest(function(fact){
                        sendMessage(fact);
                    });
                }else {
                    callback(fact + "...");
                }
            }
        });
    }
})();
