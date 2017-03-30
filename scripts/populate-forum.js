// example data only
var testForum = {
  '_id': 'suggest_dinner_restaurant_for_first_night_in_london',
  '_rev': 'blerahrgjhegahg',
  'date': '24 March 2017, 22:39',
  'destinationId': 'London',
  'replies': [
    {
      userId: 'NickR',
      replyDate: '25 March 2017, 09:22',
      replyContent: 'Herman Ze German Villiers St is great fun and lovely food ......not British I hasten to add but a stone\'s throw from your hotel.....worth a ...',

      // new fields
      'points': 10
    },
    {
      userId: 'OnlyPlacesilike',
      replyDate: '25 March 2017, 10:19',
      replyContent: 'As its a week night you could walk towards the city of London and eat at the Paternoster chop house, on paternoster square in the shadow of ...',

      'points': 4
    },
    {
      userId: 'Gehrig',
      replyDate: '25 March 2017, 04:22',
      replyContent: 'We had a great meal at Rules last month. Although it is quite British and proper, we were dressed smart casual and were not out of place. Do...',

      'points': 8
    }
  ],
  'topic': 'Suggest Dinner Restaurant for First Night in London',
  'userId': 'RachelH'
}


$(function(){ populateForum(testForum); });

function populateForum( forum ) {
  
  $('h2').html(forum.topic + '<span>' + forum.userId + '</span>');

  $('section div').remove();
  for (var i in forum.replies)
    $('section').append('<div>' + forum.replies[i].replyContent + '</div>');

  for (var i in destination.tourist_attractions)
    $('#attractions').append('<p>' + destination.tourist_attractions[i] + '</p>');
}