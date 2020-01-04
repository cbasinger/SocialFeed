//Social Feed Project*

//Overview:* You are startup that has decided Facebook and Twitter is for old people. 
//So you are going to make your own social feed application. You application should perform the following:

//- A user is able to enter data into an input area. Think like Twitter or Facebook.
//****ADD TO FEED */
//- At the very least, there should be a text area, and a input where the user is able to enter the url of image from online
//- Bonus: Give the user the ability to select the text color
//- When the user submits their data, it should go into a feed that exist on the page
//The username, time the user submitted the post, and the content should appear on the page
//If the post has an image, it should appear also
//Remember, a post can have text, image, or both
//Figure out how to prevent users from entering bad data (ie, no text or not an image)
//Give error message for above
// As the username adds more post, it should also be added to the feed
//The user should have the ability to delete a post
//BONUS: Give the ability for the user to update the post in the feed.
//Areas Needed: textarea, text, button(onclick), 
//data storage: can be an array, objects, an array of objects
//createElement, getElementbyID
//USE EXERCISE 2
//Inspect a subreddit
//Uploading Post Box
//**CREATE SERVER.JS THEN DO AXIOS REQUEST FOR SERVER.JS HERE */
var api_url = 'http://localhost:3000/';
var allPosts = [];

function getPosts(){
    axios.get(api_url + `api/posts`)
    .then(function(data) {
        allPosts = data.data;
        createFeed();
        });
};
    

//READ BELOW THIS LINE
function insertPost(data, successCallback, errorCallback){

    $.axios({
        type: "POST",
        data: data,
        url: api_url + 'api/posts',
        success: successCallback,
        error: errorCallback,
    });
}
function createPostItem(data){
    let item = `
    <div class="card card-body bg-light">
        <div><img src=${data.imageUrl}></div>
        <div>${data.post}</div>
        <div>${data.user}</div>
    </div>
        
    `;
    return item;
};

var createFeed = function () {
    for (i=0; i < allPosts.length; i++){
        let info = createPostItem(allPosts[i].body);
        $('#container').append(info);
    }
};

function insertIntoFeed(item){
    $('feed').append(item);
};






       

//app.listen(3000, function(){
//    console.log('Todo List API is now listening on port 3000...');
//    })













