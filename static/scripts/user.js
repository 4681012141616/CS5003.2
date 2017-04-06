var $loginDialog = $("#loginDialog");
var $registerDialog = $("#registerDialog");
var $register_login = $('#register-login');


$("#login").click(function (e) {
    $registerDialog.hide();
    showMask();
    $loginDialog.show();


    $("#loginBtn").click(function () {

        var username = $('#username').val();
        var password = $("#password").val();

        if (check_input(username) && check_input(password)) {
            var user = {"username": username, "password": password};
            console.log(user);

            $.ajax
            ({
                type: "POST",
                url: "/login",
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(user),
                success: function (data) {
                    alert("You have logged in!");
                    $loginDialog.hide();
                    $("#loginDialog input").val('');
                    $register_login.hide();
                    $('#afterLogin').show();
                    hideMask();
                    //console.log(data);
                    $('#viewProfile a').text(data);
                },
                error: function () {
                    console.log("Failed to login");
                }
            });
        }
        else
            alert("Empty input");
    })

             $('.cancelBtn').click(function() {
                  $loginDialog.hide();
                  hideMask();
              });
});


$("#register").click(function () {
    $loginDialog.hide();
    showMask();
    $registerDialog.show();



    $("#registerBtn").click(function () {
        var newusername = $('#newusername').val(),
            newemail = $("#newemail").val(),
            newpassword = $("#newpassword").val();
        if (!check_input(newusername) || !check_input(newpassword) || !check_email(newemail)) {
            alert("Invalid input.");
        } else {

            var startDate = moment().format('DD MMMM YYYY');
            var newuser = {"username": newusername, "email": newemail, "newpassword": newpassword, "startDate": startDate};
            console.log(newuser);
            $.ajax
            ({
                type: "POST",
                url: "/register",
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(newuser),
                success: function () {
                    console.log("register success");
                    $("#registerDialog input").val('');
                    alert("You have registered successfully!");
                    hideMask();

                },
                error: function () {
                    console.log("Failed to register");
                    alert("Sorry your user name already exists, please try another one!");
                }
            });
        }

    })

    $('.cancelBtn').click(function() {
        $registerDialog.hide();
        hideMask();
    });

})


function check_input(input) {
    if (input === "" || input == undefined || input.replace(/\s/g, "").length === 0) {
        return false;
    }
    return true;
}

function check_email(input) {
    var patt = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    if (input === "" || !patt.test(input))
        return false;
    return true;
}
