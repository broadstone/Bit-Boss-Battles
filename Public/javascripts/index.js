$(document).ready(function() {
    
    parseCookies();
    
    if (getCookie("sound", "") == "true") { $("#sound").prop("checked", true); }
    
    var authWait = setInterval(function() {

        parseCookies();

        if (getCookie("auth", "") != "") { $("#launch").prop("disabled", false); $("#link").html("http://bitbossbattles.herokuapp.com/app.html" + SettingsToString() + "&token=" + getCookie("auth", "")); }
    }, 250);
    
    var appWindow = null;

    function LaunchAuth() {

        window.open("https://api.twitch.tv/kraken/oauth2/authorize?response_type=token&client_id=" + clientId + "&redirect_uri=" + redirectUri + "&scope=user_read", "", "width=400,height=512");
    }
    function LaunchForce() {

        window.open("https://api.twitch.tv/kraken/oauth2/authorize?response_type=token&client_id=" + clientId + "&redirect_uri=" + redirectUri + "&scope=user_read&force_verify=true", "", "width=400,height=512");
    }
    function LaunchApp() {

        appWindow = window.open("./app.html", "App", "width=350,height=100");
    }
    function LaunchDemo() {

        appWindow = window.open("./demo.html", "Demo", "width=350,height=325");
    }
    function Reset() {

        setCookie("currentBoss", "");
        setCookie("currentHp", "0");
        setCookie("auth", "");
        $("#launch").prop("disabled", true);
        $("#link").html("<span style='color: red;'>App not yet authorized. Authorize the app to get a link.</span>");
    }
    
    function SettingsToString() {
        
        return "?sound=" + getCookie("sound", "false") + "&trans=" + getCookie("trans", "false") + "&chroma=" + getCookie("chroma", "false") + "&hptype=" + getCookie("hptype", "overkill") + "&hpmult=" + getCookie("hpmult", "1") + "&hpamnt=" + getCookie("hpamnt", "1000");
    }
    
    $("#sound").click(function() {
        
        setCookie("sound", $(this).prop("checked").toString());
        
        if (appWindow != null)
        {
            appWindow.postMessage("refreshsettings", "*");
        }
        
        if (getCookie("auth", "") != "")
        {
            $("#link").html("http://bitbossbattles.herokuapp.com/app.html" + SettingsToString() + "&token=" + getCookie("auth", ""));
        }
    });
    
    $("#trans").click(function() {
        
        setCookie("trans", $(this).prop("checked").toString());
        
        if (appWindow != null)
        {
            appWindow.postMessage("refreshsettings", "*");
        }
        
        if (getCookie("auth", "") != "")
        {
            $("#link").html("http://bitbossbattles.herokuapp.com/app.html" + SettingsToString() + "&token=" + getCookie("auth", ""));
        }
    });
    
    $("#chroma").click(function() {
        
        setCookie("chroma", $(this).prop("checked").toString());
        
        if (appWindow != null)
        {
            appWindow.postMessage("refreshsettings", "*");
        }
        
        if (getCookie("auth", "") != "")
        {
            $("#link").html("http://bitbossbattles.herokuapp.com/app.html" + SettingsToString() + "&token=" + getCookie("auth", ""));
        }
    });
    
    $("#persistent").click(function() {
        
        setCookie("persistent", $(this).prop("checked").toString());
        $("#link").html("http://bitbossbattles.herokuapp.com/app.html" + SettingsToString() + "&persistent=" + $(this).prop("checked").toString() + "&token=" + getCookie("auth", ""));
    });
    
    $("input[type='radio'][name='hp']").change(function() {
        
        setCookie("hptype", $(this).val());
        if ($(this).val() == "overkill")
        {
            $("#hp-mult").prop("disabled", false);
            $("#hp-amnt").prop("disabled", true);
        }
        else if ($(this).val() == "constant")
        {
            $("#hp-amnt").prop("disabled", false);
            $("#hp-mult").prop("disabled", true);
        }
        
        if (getCookie("auth", "") != "")
        {
            $("#link").html("http://bitbossbattles.herokuapp.com/app.html" + SettingsToString() + "&token=" + getCookie("auth", ""));
        }
    });
    
    $("#hp-mult").change(function() {
        
        setCookie("hpmult", $(this).val().toString());
        
        if (appWindow != null)
        {
            appWindow.postMessage("refreshsettings", "*");
        }
        
        if (getCookie("auth", "") != "")
        {
            $("#link").html("http://bitbossbattles.herokuapp.com/app.html" + SettingsToString() + "&token=" + getCookie("auth", ""));
        }
    });
    
    $("#hp-amnt").change(function() {
        
        setCookie("hpamnt", $(this).val().toString());
        
        if (appWindow != null)
        {
            appWindow.postMessage("refreshsettings", "*");
        }
        
        if (getCookie("auth", "") != "")
        {
            $("#link").html("http://bitbossbattles.herokuapp.com/app.html" + SettingsToString() + "&token=" + getCookie("auth", ""));
        }
    });
    
    $("#auth").click(LaunchAuth);
    $("#force").click(LaunchForce);
    $("#launch").click(LaunchApp);
    $("#demo").click(LaunchDemo);
    $("#reset").click(Reset);
});