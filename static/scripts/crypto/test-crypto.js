$('#checkBtn').click(function(){
  $('#output').html( (passwordCheck($('#userID').val(),$('#password').val()))? 'Correct':'Wrong password or username' );
});



function hash( str ) {
  return CryptoJS.SHA256(hash).toString(CryptoJS.enc.Base64);
}



function passwordCheck( userId, password ) {
  $.ajax({
    type: "GET",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'text/plain',
    },
    dataType: "json",
    url: "/login/" + userId,
    success:
        function (data){
          displayInfo(data);
          console.log(JSON.stringify(data));
        },
    error: function () {
      $('#output').html('Wrong password or username');
    }
  });

  return (hash(password) == testUser.passwordHash);

}
