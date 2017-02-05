$(document).ready(function () {
    
    // Demo Mode
    var demoMode = false;
    
    // Channel ID
    var channelId = "";
    
    // Settings
    var sound = false;

    // Boss vars
    var nextBoss = "nifty255";

    // Timeout and Interval handlers
    var imgRemove = null;
    var frstDelay = null;
    var animDelay = null;
    var shakeStop = null;
    var hitShStop = null;

    // State indicators
    var isDelayed = false;
    var shaking = false;
    var lossShowing = false;
    var refill = false;
    var preload = true;
    
    // Name scroll
    var scrollInterval = 5000;
    var resetInterval = 1000;
    var scrollDelay = null;
    var resetDelay = null;

    // Hit label offset
    var lossOffset = 0;

    // Shake intensity
    var shakeIntensity = 1000;

    // HP, delayed HP, and current damage
    var maxHp = 1000;
    var prevHp = 0;
    var hp = 0;
    var delayed = 0;
    var loss = 0;

    // Element containers
    var health = $("#health");
    var hitdelay = $("#hitdelay");
    var counter = $("#hp");
    var avatarimg = $("#avatar");    
    
    // Bits gifs
    
    // 1 bit
    var bits1 = [
        "http://i.imgur.com/axWaf1G.gif",
        "http://i.imgur.com/vrkWxrQ.gif",
        "http://i.imgur.com/T2RFqm3.gif",
        "http://i.imgur.com/bIUYT4E.gif"
    ];
    
    // 100 bits
    var bits100 = [
        "http://i.imgur.com/qIGLfo8.gif",
        "http://i.imgur.com/AxTcMpu.gif",
        "http://i.imgur.com/ueYVt9V.gif",
        "http://i.imgur.com/p8Wxr0m.gif"
    ];
    
    // 1000 bits
    var bits1000 = [
        "http://i.imgur.com/TQPP9xT.gif",
        "http://i.imgur.com/bvG9kkm.gif",
        "http://i.imgur.com/QRI0GE5.gif",
        "http://i.imgur.com/JpuqYpk.gif"
    ];
    
    // 5000 bits
    var bits5000 = [
        "http://i.imgur.com/A6EIUy1.gif",
        "http://i.imgur.com/ddgxLpl.gif",
        "http://i.imgur.com/DBjwiB3.gif",
        "http://i.imgur.com/Btlkt1D.gif"
    ];
    
    // 10000 bits
    var bits10000 = [
        "http://i.imgur.com/koNnePN.gif",
        "http://i.imgur.com/0HU0GFx.gif",
        "http://i.imgur.com/f8aQMPt.gif",
        "http://i.imgur.com/LCYgixP.gif"
    ];
    
    parseCookies();
    
    sound = (getCookie("sound", "") == "true");
    
    window.addEventListener("message", RefreshSettings, false);
    
    function RefreshSettings(event) {
        
        if (event.data == "refreshsettings") { parseCookies(); sound = (getCookie("sound", "") == "true"); }
    }
    
    nextBoss = "nifty255";
    GetNewBoss();
    
    function InterpretData(message)
    {
        if (!message) { return; }
        if (!message.user_name) { return; }
        if (!message.bits_used) { return; }
        if (!message.context) { return; }
        
        if (nextBoss == "")
        {
            GetUserInfo(message.user_name, function(info) {
                
                $("#attackerdisplay").css({
                    
                    "opacity": "0"
                });
                
                var amount = "";
                
                if (message.bits_used < 100) { amount = "1"; }
                else if (message.bits_used < 1000) { amount = "100"; }
                else if (message.bits_used < 5000) { amount = "1000"; }
                else if (message.bits_used < 10000) { amount = "5000"; }
                else { amount = "10000"; }
                
                $("#attackerdisplay").html("<img id='cheerimg' src='https://d3aqoihi2n8ty8.cloudfront.net/actions/" + message.context + "/light/animated/" + amount + "/1.gif?a=" + Math.random() + "'>" + info.displayName);
                
                $("#attackerdisplay").stop().animate({ "opacity": "1" }, 1000, "linear", function() { setTimeout(function() { $("#attackerdisplay").css("opacity", "0"); $("#attackerdisplay").html("&nbsp;"); }, 1000) });
                
                Strike(message.bits_used, message.user_name, info.displayName);
            });
        }
    }

    function Strike(amount, attacker, display) {
        
        if (nextBoss == "")
        {
            var imgToUse = "";

            if (amount < 100)
            {
                imgToUse = bits1[GetRandomInt(0, 3)];
            }
            else if (amount < 1000)
            {
                imgToUse = bits100[GetRandomInt(0, 3)];
            }
            else if (amount < 5000)
            {
                imgToUse = bits1000[GetRandomInt(0, 3)];
            }
            else if (amount < 10000)
            {
                imgToUse = bits5000[GetRandomInt(0, 3)];
            }
            else
            {
                imgToUse = bits10000[GetRandomInt(0, 3)];
            }
            
            if (sound) { hits[GetRandomInt(0, hits.length - 1)].play(); }

            $("#strikeimg").remove();
            if (imgRemove != null) { clearTimeout(imgRemove); }
            avatarimg.after('<img id="strikeimg" src="' + imgToUse + '?a=' + Math.random() + '"/>');
            imgRemove = setTimeout(function() { $("#strikeimg").remove(); }, 1000);

            loss += amount;
            if (hp - loss <= 0)
            {
                nextBoss = attacker;
                counter.html("Final Blow: " + display);
            }

            isDelayed = true;

            if (animDelay != null) { clearTimeout(animDelay); }

            if (frstDelay != null) { clearTimeout(frstDelay); }

            frstDelay = setTimeout(function() {

                hp = Math.max(0, hp - loss);
                health.css("width", ((hp / maxHp) * 100).toString() + "%");
                
                if (sound) { damage[GetRandomInt(0, damage.length - 1)].play(); }

                lossOffset = 20;
                lossShowing = true;
                $("#loss").html("-" + loss.toString());
                $("#loss").css({

                    "-webkit-transform": "translateY(" + lossOffset.toString() + "px)",
                    "-ms-transform": "translateY(" + lossOffset.toString() + "px)",
                    "transform": "translateY(" + lossOffset.toString() + "px)",
                    "visibility": "visible"
                });
                if (hitShStop != null) { clearTimeout(hitShStop); }

                if (shakeStop != null) { clearTimeout(shakeStop); }
                shaking = true;
                shakeIntensity = 1000;

                animDelay = setTimeout(function() {

                    isDelayed = false;
                }, 1000);

                shakeStop = setTimeout(function() {

                    shaking = false;
                    avatarimg.css({

                        "-webkit-transform": "translate(0px,0px)",
                        "-ms-transform": "translate(0px,0px)",
                        "transform": "translate(0px,0px)"
                    });
                }, 1000);

                loss = 0;
            }, 1000);
        }
    }

    function Explode() {

        preload = true;
        
        if (sound) { explosion.play(); }
        
        avatarimg.after('<img id="explodeimg" src="http://i.imgur.com/m9Ajapt.gif?a='+Math.random()+'"/>');
        avatarimg.animate({opacity: 0}, 1000, "linear", function() {

            $("#explodeimg").remove();
            GetNewBoss();
        });
    }

    function Shake() {

        shakeIntensity  = Math.max(0, shakeIntensity - 16);

        var x = Math.floor((Math.random() - 0.5) * 7) * (shakeIntensity / 1000);
        var y = Math.floor((Math.random() - 0.5) * 7) * (shakeIntensity / 1000);

        avatarimg.css({

            "-webkit-transform": "translate(" + x.toString() + "px," + y.toString() + "px)",
            "-ms-transform": "translate(" + x.toString() + "px," + y.toString() + "px)",
            "transform": "translate(" + x.toString() + "px," + y.toString() + "px)"
        });
    }

    function GetNewBoss() {
        
        if (nextBoss == "") { return; }
        
        GetUserInfo(nextBoss, function(info) {
            
            if (info.logo == null) { avatarimg.attr("src", "https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png"); }
            else { avatarimg.attr("src", info.logo); }
            avatarimg.on('load', function() {
                
                $("#name").html(info.displayName);
                $("#test").html(info.displayName);
                
                $("#name").stop().css("margin-left", "0px");
                
                if (scrollDelay != null && scrollDelay != -1) { clearTimeout(scrollDelay); scrollDelay = null; }
                if (resetDelay != null) { clearTimeout(resetDelay); resetDelay = null; }
                
                refill = true;
                preload = false;

                hitdelay.css({
                    "visibility": "hidden"
                });
                
                avatarimg.css("opacity", "0");
                avatarimg.animate({ opacity: 1 }, 1000, "linear");
                avatarimg.off('load');
            });
        });
    }
    
    function GetUserInfo(username, callback) {
        
        if (username == "") { return; }
        if (!callback) { return; }

        $.get("https://api.twitch.tv/kraken/users/" + username + "?client_id=" + clientId, function(response) {
            
            callback({ displayName: response.display_name, logo: response.logo });
        });
    }

    function GetRandomInt(min, max) {

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function GetUrlParameter(sParam) {
        
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    }
    
    // Animation loop
    setInterval(function() {

        if (refill)
        {
            if (prevHp == 0) { hp = Math.min(maxHp, hp + (maxHp / 60)); }
            else { hp = Math.min(prevHp, hp + (prevHp / 60)); }
            delayed = hp;
            counter.html("HP: " + Math.floor(delayed).toLocaleString("en-US") + " / " + maxHp.toLocaleString("en-US"));
            health.css("width", ((hp / maxHp) * 100).toString() + "%");

            if (hp == maxHp)
            {
                refill = false;
                nextBoss = "";
                hitdelay.css({
                    "width": "100%",
                    "visibility": "visible"
                });
            }
        }

        if (!isDelayed && !refill && !preload)
        {
            delayed = Math.max(delayed - ((maxHp / 5) / 60), hp);
            if (nextBoss == "") { counter.html("HP: " + Math.floor(delayed).toLocaleString("en-US") + " / " + maxHp.toLocaleString("en-US")); }
            hitdelay.css("width", ((delayed / maxHp) * 100).toString() + "%");

            if (delayed == 0)
            {
                Explode();
            }
        }

        if (shaking)
        {
            Shake();
        }

        if (lossOffset > 0)
        {
            lossOffset = Math.max(0, lossOffset - (20 / 50));

            $("#loss").css({

                "-webkit-transform": "translateY(" + lossOffset.toString() + "px)",
                "-ms-transform": "translateY(" + lossOffset.toString() + "px)",
                "transform": "translateY(" + lossOffset.toString() + "px)"
            });
        }
        else if (lossShowing)
        {
            lossShowing = false;
            hitShStop = setTimeout(function() {

                $("#loss").css("visibility", "hidden");
            }, 500);
        }
        
        var nameWidth = $("#test").width();
        var scrollWidth = $("#scroll").width();
        
        if (nameWidth > scrollWidth)
        {
            if (scrollDelay == null)
            {
                console.log("Test")
                scrollDelay = setTimeout(function() {
                    
                    scrollDelay = -1;
                    
                    $("#name").stop().animate({"marginLeft": "-" + (nameWidth - scrollWidth).toString() + "px"}, 1000, "linear", function() {
                        
                        resetDelay = setTimeout(function() {
                            
                            $("#name").css("margin-left", "0px");
                            scrollDelay = null;
                        }, resetInterval);
                    });
                }, scrollInterval);
            }
        }
    }, (1000/60));

    $("#strike1").click(function () { InterpretData({ user_name: $("#attackerinput").val(), bits_used: 1, context: "cheer" }); });
    $("#strike100").click(function () { InterpretData({ user_name: $("#attackerinput").val(), bits_used: 100, context: "cheer" }); });
    $("#strike1000").click(function () { InterpretData({ user_name: $("#attackerinput").val(), bits_used: 1000, context: "cheer" }); });
    $("#strike5000").click(function () { InterpretData({ user_name: $("#attackerinput").val(), bits_used: 5000, context: "cheer" }); });
    $("#strike10000").click(function () { InterpretData({ user_name: $("#attackerinput").val(), bits_used: 10000, context: "cheer" }); });
});