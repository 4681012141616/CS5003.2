//Record recent posts to the user profile
function userNewPost( post ) {
  var userId = $("#viewProfile a").html();
  //get the user information and then call a put request to update the user profile
  $.ajax({
      type: "GET",
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'text/plain',
      },
      dataType: "json",
      url: "/user/"+ userId,
      success: function (data){
        var favouritePlaces = data.value.favouritePlaces;
        var bio = data.value.bio;
        var posts = data.value.posts;
        posts.push(post);

        $.ajax({
            type: "put",
            dataType: "text",
            contentType: 'application/json',
            url: "/user/"+ userId,
            data: JSON.stringify({
              "bio": bio,
              "favouritePlaces": favouritePlaces,
              "posts": posts
            }),
            success: function () {
              console.log("add new post successfully")
            },
            error: function () {
              console.log("fail to add post")
            }
        });

      },
      error: function () {
        alert("Please log in first");
         console.log("err");
      }
  })
}
