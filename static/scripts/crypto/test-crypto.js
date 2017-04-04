$('#checkBtn').click(function(){
  $('#output').html( (passwordCheck($('#userID').val(),$('#password').val()))? 'Correct':'Wrong password or username' );
});



function passwordCheck( userId, password ) {

  return (CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64) == testUser.passwordHash);

}




// example data only

var testUser = {
  '_id': 'ajs38',
  '_rev': 'whatever',
  
  // NEW!!!
  'passwordHash': 'i0DRGGT7zUncW5DQijNgcawcpT6reoyqkAcINsRlaOo=',
  'sessionKeyHash': '',
  //
  
  'startDate': 'March 2017',
  'bio': 'Site co-founder. Avid traveller. Blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah.',
  'favouritePlaces': [
    'London',
    'Paris',
    'St&nbsp;Andrews',
    'Melbourne',
    'Cupar',
    'Edinburgh',
    'New&nbsp;York',
    'Lilongwe',
    'Dedza',
    'Prague'
  ],
  'posts': [
    {
      'postId': 'suggest_dinner_restaurant_for_first_night_in_london',
      'commentId': 5,
      'postContent': 'We had a great meal at Rules last month. Although it is quite British and proper, we were dressed smart casual and were not out of place. Do...'
    }, {
      'postId': 'another_forum',
      'commentId': 17,
      'postContent': "I'd probably go for the thing"
    }, {
      'postId': 'asked_a_question',
      'commentId': 0,
      'postContent': "I'm going to Santa Cruz in Tenerife this Easter. Does anyone know the best way to climb to the top of the island from there?"
    }
  ]
}