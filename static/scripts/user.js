(function(){
    $("#login").click(function(e) {
        $("#loginDialog").show();
        // preventDefaultEvent(e);

        $("#loginBtn").click(function() {
            var username = $('#username').val();
            var password = $("#password").val();

            if(input_check(username) && input_check(password)) {
                var user = {"username":username,"password":password};
                console.log(user);

                $.ajax
                ({
                    type: "POST",
                    url: "/login",
                    dataType: 'json',
                    contentType:'application/json',
                    data: JSON.stringify(user),
                    success: function (data){
                        console.log(data);
                    },
                    error: function() {
                        console.log("Failed to login");
                    }
                });
            }
            else
                alert("Empty input");

        })
    });


    $("#registerBtn").click(function() {
        var newusername = $('#newusername').val(),
            newemail = $("#newemail").val(),
            newpassword =$("#newpassword").val();

        var newuser = {"username": newusername, "email": newemail, "newpassword": newpassword };
        console.log(newuser);
        $.ajax
        ({
            type: "POST",
            url: "/register",
            dataType: 'json',
            contentType:'application/json',
            data: JSON.stringify(newuser),
            success: function (){
                console.log("register success");
                $("#registerDialog input").val('');


                alert("You have registered successfully!");

                //TODO redirect login page
            },
            error: function() {
                console.log("Failed to register");
                alert("Sorry your user name already exists, please try another one!");
            }
        });


    })



//TODO: modify client side input check
    function input_check(input) {
        if(input === "" || input == undefined || input.replace(/\s/g,"").length == 0 ) {
            return false;
        }
        return true;
    }

})();




