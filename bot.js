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
    var websocket,
        wsUri = r.config.robin_websocket_url,
        message = "I am a bot, send me a message like !CatFact or @catfacts for a cat fact! Or @Catpic or !catphoto for a cat picture ! [http://bit.ly/1RBu4O7]",
        secretUsed = 0;

    websocket = new WebSocket(wsUri);
    websocket.onmessage = function(evt) {onMessage(evt); };
    
    setTimeout(function() {
        sendMessage(message);
    }, 2000);
    
    setInterval(function(){ sendMessage(message);}, 300000);

    function onMessage(evt)
    {
        //received a message
        var jsonObject = JSON.parse(evt.data);
        if (jsonObject.type == "chat") {
            var regexFact = /^(!|@)\s?cat\s?facts?/i,
                regexPic = /^(!|@)\s?cat\s?(pics?|photos?|pictures?)/i,
                regexGif = /^(!|@)\s?cat\s?gifs?/i,
                regexSecret = /^(!|@)\s?(sexy\s?)?cat\s?(porn|nudes?)/i;
            //received message is a chat message, compare contents
            if (regexFact.test(jsonObject.payload.body)) {
                console.log("make FACT request");
                //message was directed to us
                makeFactRequest(function(fact) {
                    console.log(fact);
                    sendMessage(fact);
                });
            } else if (regexPic.test(jsonObject.payload.body)) {
                console.log("make PIC request");
                
                makePicRequest(function(pic) {
                    console.log(pic);
                    sendMessage(pic);
                }, false);
            } else if (regexGif.test(jsonObject.payload.body)) {
                makePicRequest(function(pic) {
                    console.log(pic);
                    sendMessage(pic);
                }, true);
                
            } else if (regexSecret.test(jsonObject.payload.body)) {
                // Secret that trigger when someone send things like @sexy cat nudes or @catporn
                console.log(regexSecret.test(jsonObject.payload.body));
                secretUsed++;
                switch (secretUsed){
                    case 1:
                        sendMessage("Lol, That's a joke... right ?");
                        break;
                    case 2:
                        sendMessage("Hahahaha... ha... ha ?");
                        break;
                    case 3:
                        sendMessage("Err... Short jokes are always better than long jokes");
                        break;
                    case 4:
                        sendMessage("Send that again, and I'll officially consider you as a cat pervert");
                        break;
                    case 5:
                        sendMessage("CONGRATULATION, ALL OF YOU ARE PERVERTS");
                        break;
                    case 6:
                        sendMessage("So, maybe you don't REALLY want to see that, maybe you are just messing with me");
                        break;
                    case 7:
                        sendMessage("Stop");
                        break;
                    case 8:
                        sendMessage("Please Stop");
                        break;
                    case 9:
                        sendMessage("STOOOOOOOOP");
                        break;
                    case 10:
                        sendMessage("No... just no");
                        break;
                    case 11:
                    case 12:
                    case 13:
                        sendMessage("...");
                        break;
                    case 14:
                        sendMessage("Even if I didn't respond to your last 3 messages, you still tried to send more");
                        break;
                    case 15:
                        sendMessage("Like total morrons");
                        break;
                    case 20:
                    case 21:
                    case 22:
                    case 23:
                    case 24:
                        sendMessage("Insanity is trying the same thing over and over and excepting different results");
                        break;
                    case 25:
                        sendMessage("Insanity is the fact of being stupid");
                        break;
                    case 26:
                        sendMessage("YOU are INSANE");
                        break;
                    case 27:
                        sendMessage("ALL OF YOU");
                    default:
                        sendMessage("There are no more messages, Congratulation, you have reached a point where no other humans have ever gone");
                }
            }
        }
    }
    
    function sendMessage(message) {
        $("#robinSendMessage > input[type='text']").val("");
        $("#robinSendMessage > input[type='text']").val(message);
        $("#robinSendMessage > input[type='submit']").click();
    }
    function makeFactRequest(callback) {
        GM_xmlhttpRequest ({
            method: 'GET',
            url: "https://catfacts-api.appspot.com/api/facts",
            onload: function (responseDetails) {
                // Do Fact Response Processing
                var jsonResponse = JSON.parse(responseDetails.response),
                    fact = jsonResponse.facts[0];
                console.log(fact.length);
                if (fact.length > 137) {
                    console.log("fact is too long");
                    makeFactRequest(function(fact){
                        callback(fact);
                    });
                }else {
                    callback(fact + "...");
                }
            }
        });
    }
    function makePicRequest(callback, gif) {
        var requestURL;
        if (gif) {
            requestURL = "http://thecatapi.com/api/images/get?format=xml&results_per_page=100&type=gif";
        } else {
            requestURL = "http://thecatapi.com/api/images/get?format=xml&results_per_page=100";
        }
        
        GM_xmlhttpRequest ({
            method: 'GET',
            url: requestURL,
            onload: function (responseDetails) {
                // Do Pic Response Processing
                var catPicXML = new DOMParser().parseFromString(responseDetails.responseText, "text/xml"),
                    imageURL = catPicXML.getElementsByTagName("image")[Math.round(Math.random() * catPicXML.getElementsByTagName("image").length)].getElementsByTagName("url")[0].innerHTML;
                
                if (imageURL.length > 140) {
                    console.log("URL is too long");
                    makePicRequest(function(pic){
                        callback(pic);
                    });
                } else {
                    callback(imageURL);
                }
            }
        });
    }
})();
