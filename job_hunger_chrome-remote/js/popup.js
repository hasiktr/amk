$(document).ready(function() {

    $('#login-name').focus();

    function getTabUrl(callback) { //Take a callback
        var theTab;
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tab) {
            callback(tab); //call the callback with argument
        });
    };

    var connection = $.hubConnection('http://51.89.27.18');
    var objHub = connection.createHubProxy('myhub');
    var user = '';
    var channel = '';
    objHub.on('onConnected', function(id, userName, UserID, userGroup) {
        user = userName; 
        // $('.success').fadeIn(300).delay(1500).fadeOut(400);
        $('#showSignIn').fadeOut('slow', function() {
            $('#showSignIn').addClass('invisible');
            $('#jobForm').fadeIn('medium');
            $('#jobForm').removeClass('invisible');
            $('#login-name').val("");
        });
        $('textarea').val($('textarea').val() + userName + ' is connected \n');
    });

    objHub.on('getMessages', function(userName, message) {
        $("#message").val('');
        $('textarea').val($('textarea').val() + userName + ' : ' + message + '\n');
        var height = $('#divMessage')[0].scrollHeight;
        $('#divMessage').scrollTop(height);
    });

    connection.logging = true;
    connection.start({
        withCredentials: false
    }).done(function() {

        $('#login-post').click(function() {
            getTabUrl(function(tab) {
                var channelName = tab[0].url.split('=')[1];
                channel = channelName;
                objHub.invoke('connect', $('#login-name').val(), $('#login-name').val(), channelName);
            });
        });

        $('#send').click(function() {

            var msg = $("#message").val();
            if (msg.length > 0) {
                // var userName = $('#hUserName').val();
                // <<<<<-- ***** Return to Server [  SendMessageToGroup  ] *****
                objHub.invoke('sendMessageToGroup', user, msg, channel);
            }
        });

    });

    function loadClientMethods(objHub) {

        objHub.client.NoExistAdmin = function() {
            var divNoExist = $('<div><p>There is no Admin to response you try again later</P></div>');
            $("#divChat").hide();
            $("#divLogin").show();

            $(divNoExist).hide();
            $('#divalarm').prepend(divNoExist);
            $(divNoExist).fadeIn(900).delay(9000).fadeOut(900);
        }

        objHub.client.getMessages = function(userName, message) {

            $("#txtMessage").val('');
            $('#divMessage').append('<div><p>' + userName + ': ' + message + '</p></div>');

            var height = $('#divMessage')[0].scrollHeight;
            $('#divMessage').scrollTop(height);
        }

        objHub.client.onConnected = function(id, userName, UserID, userGroup) {

            var strWelcome = 'Welcome' + +userName;
            $('#welcome').append('<div><p>Welcome:' + userName + '</p></div>');

            $('#hId').val(id);
            $('#hUserId').val(UserID);
            $('#hUserName').val(userName);
            $('#hGroup').val(userGroup);

            $("#divChat").show();
            $("#divLogin").hide();
        }
    }

    // fill in title and company from the DOM
    chrome.runtime.sendMessage({
        method: 'getTitle'
    }, function(response) {
        $('#title').val(response[0]);
        $('#company').val(response[1])
    });

    // fill in the url with current url
    chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    }, function(tabs) {
        var tab = tabs[0];
        console.log(tab.url)
    });

    // if the user is logged in, hide login form and show job form
    if (localStorage.length > 0) {
        $('#showSignIn').addClass('invisible');
        $('#jobForm').removeClass('invisible')
    }

    // submit the job form
    $('#createJob').click(function(event) {
        event.preventDefault();
        data = {
            title: $('#title').val(),
            company_name: $('#company').val(),
            url: $('#url').val()
        };

        $.ajax({
            method: "POST",
            url: "http://mysterious-shelf-41013.herokuapp.com/create_from_chrome.json",
            dataType: "json",
            data: JSON.stringify(data),
            beforeSend: function(xhr) {
                xhr.setRequestHeader("access-token", localStorage.accessToken);
                xhr.setRequestHeader("accessToken", localStorage.accessToken);
                xhr.setRequestHeader("expiry", localStorage.expiry);
                xhr.setRequestHeader('token-type', localStorage.tokenType);
                xhr.setRequestHeader('tokenType', localStorage.tokenType);
                xhr.setRequestHeader("uid", localStorage.uid);
                xhr.setRequestHeader("client", localStorage.client);
                xhr.setRequestHeader("Content-Type", "application/json");
            },
            success: function() {
                $('.success').fadeIn(300).delay(1500).fadeOut(400);
                $('#title').val("");
                $('#company').val("");
                $('#notes').val("");
            },
            error: function(data) {
                $('.failure').fadeIn(300).delay(1500).fadeOut(400);
            }
        });
        event.stopPropagation();
    });

    // log out: hide job form and show sign in form
    $('#logout').click(function(event) {
        event.preventDefault();
        localStorage.clear();
        $('#jobForm').fadeOut('slow', function() {
            $('#jobForm').addClass('invisible');
            $('#showSignIn').fadeIn('medium');
            $('#showSignIn').removeClass('invisible')
        });
    });

});