//user login and register

var $loginDialog = $("#loginDialog");
var $registerDialog = $("#registerDialog");
var $register_login = $('#register-login');

//popup login window when click on the log in
$("#login").click(function () {
    $("#loginDialog input").val('');
    $registerDialog.hide();
    showMask();
    $loginDialog.show();

    //call login() function when click or press enter on the keyboard
    $("#loginBtn").click(function () {
            login();
    });
    $("#loginDialog input").keydown(function(e) {
        if(e.which === 13) {
            login();
        }
    })
});


//popup register window when click on the register
$("#register").click(function () {
    $("#registerDialog input").val('');
    $loginDialog.hide();
    showMask();
    $registerDialog.show();

    //call register() function when click or press enter on the keyboard
    $("#registerBtn").click(function () {
        register();
    })
    $("#registerDialog input").keydown(function(e) {
        if(e.which === 13) {
            register();
        }
    })
})


//user login function
function login() {
    var username = $('#username').val();
    var password = $("#password").val();

    //validate input before call the post request
    if (check_input(username) && check_input(password)) {
        var user = {"username": username, "password": password};
        //a post request to login, user is authenticated
        $.ajax
        ({
            type: "POST",
            url: "/login",
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(user),
            success: function (data) {
                $loginDialog.hide();
                alert("You have logged in!");
                $("#loginDialog input").val('');
                $register_login.hide();
                $('#afterLogin').show();
                hideMask();
                $('#viewProfile a').text(data);
            },
            error: function () {
                console.log("Failed to login");
                alert("Fail to log in, please check your password");
            }
        });
    }
    else
        alert("Empty input");
}


//user register register function
function register() {
    var newusername = $('#newusername').val(),
        newemail = $("#newemail").val(),
        newpassword = $("#newpassword").val();
    if (!check_input(newusername) || !check_input(newpassword) || !check_email(newemail)) {
        alert("Invalid input.");
    } else {
        //startDate the day when the user registers, using moment.js
        var startDate = moment().format('DD MMMM YYYY');
        var newuser = {
            "username": newusername,
            "email": newemail,
            "password": newpassword,
            "startDate": startDate
        };
        //a post request to register a new user, the existence of user is checked before register
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
}

//click close icon to close the popup window
$('.cancelBtn, .closeBtn').click(function () {
    $(this).parent().parent().hide();
    hideMask();
});

//validate the input
function check_input(input) {
    if (input === "" || input == undefined || input.replace(/\s/g, "").length === 0) {
        return false;
    }
    return true;
}
//validate email format
function check_email(input) {
    var patt = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    if (input === "" || !patt.test(input))
        return false;
    return true;
}

$(document).ready(function(){
//check the login status when the page is loaded
  $.ajax({
    type: "GET",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
    },
    dataType: "json",
    url: "/checkLoginStatus",
    success: function (data){
      $register_login.hide();
      $('#afterLogin').show();
      $('#viewProfile a').text(data.user_id.slice(5));
    },
    error: function (attraction) {
      console.log("Failed to log in")
    }
  })
})
