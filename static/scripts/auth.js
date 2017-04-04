var dialog;
var userId = $('#userId'),
    password = $("#password"),
    allFields = $( [] ).add( userId ).add( password )

dialog = $( "#loginDialog" ).dialog({
    autoOpen: false,
    height: 400,
    width: 350,
    modal: true,
    buttons: {
        "Login": loginAuth,
        Cancel: function() {
            dialog.dialog( "close" );
        }
    },
    close: function() {
        form[ 0 ].reset();

    }
});
