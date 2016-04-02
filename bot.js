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
    var output;

    websocket = new WebSocket(wsUri);
    websocket.onopen = function(evt) {onOpen(evt);};
    websocket.onclose = function(evt) {onClose(evt);};
    websocket.onmessage = function(evt) {onMessage(evt); };
    websocket.onerror = function(evt) {onError(evt);};
    //set interval for start message
    setInterval(function(){ sendMessage("I am a bot, send me a message with @catfact for a cat fact! [https://github.com/AlexCatch/RobinCatFactsBot]");}, 300000);

    function onOpen(evt)
    {
        console.log('connected' + evt.data);
    }

    function onClose(evt)
    {
        writeToScreen("DISCONNECTED" + evt.data);
    }

    function onMessage(evt)
    {
        //recieved a message
        var jsonObject = JSON.parse(evt.data);
        if (jsonObject.type == "chat") {
            //recieved message is a chat message, compare contents
            if (jsonObject.payload.body == "@catfact") {
                console.log("make said request");
                //message was direcxted to us
                makeRequest(function(fact) {
                    console.log(fact);
                    sendMessage(fact);
                });
            }
        }else if (jsonObject.type == "join" && jsonObject.payload.user == "CatFactRobinBot") {
            //now send messsage
            //wait 2 seconds before sending welcome message to ensure connection
            console.log("Waiting 5 seconds");
            setTimeout(function() {
                sendMessage("I am a bot, send me a message with @catfact for a cat fact!");
            }, 2000);
        }
    }

    function onError(evt)
    {
        writeToScreen("error occured" + evt.data);
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
