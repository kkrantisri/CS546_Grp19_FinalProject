$(document).ready(function() {
    $('#search-tag-form').submit(function (event) {
      event.preventDefault();
  
      let tag = $('#tag').val();
      tag = tag.trim();
      if (tag === "") {
  
        $('#posts-area').html(`<p>Tag is required.</p>`);
        return; 
    }

  
      if (tag !== "") {
          // Set up AJAX request config
          let requestConfig = {
              method: 'GET',
              url: `/posts/tag/${tag}`,
              contentType: 'application/json',
          };
          // AJAX Call. Gets the returned JSON data, creates the elements, binds the click event to the link and appends the new todo to the page
          $.ajax(requestConfig).then(function (responseMessage) {
              $('#posts-area').empty();
              if (responseMessage.gotList) {
                  responseMessage.posts.map((post) => {
                      let element = $(
                          `<article class="post">
                              <h1>${post.title}</h1>
                              <h2>Posted By <a href="/users/${post.posterId}">${post.posterName}</a></h2>
                              <p>${post.content}</p>
                          </article>`
                      );
                      $('#posts-area').append(element);
                  });
              }
              else{
                  let element = $(`<p>Sorry No posts with that Tag</p>`)
                  $('#posts-area').append(element);
              }
          });
      }
  });
  $('.like').click(async function(event) {
      event.preventDefault();
      const $button = $(this);
      const postId = $(this).attr('data-post-id');
      const action = $(this).attr('data-state');
      let requestConfig = {
          method: 'POST',
          url: `/posts/${postId}/likes`,
          contentType: 'application/json',
          data: JSON.stringify({
            action: action,
          })
        };
      $.ajax(requestConfig).then(function (response) {
        $button.siblings('.likes-count').text(response.likesCount)
        if(action==='like'){
          $button.text('unlike')
          $button.attr('data-state', 'unlike');
        }
        else{
          $button.text('like')
          $button.attr('data-state', 'like');
        }
      })
});
$('.dislike').click(async function(event) {
event.preventDefault();
const $button = $(this);
const postId = $(this).attr('data-post-id');
const action = $(this).attr('data-state');
let requestConfig = {
    method: 'POST',
    url: `/posts/${postId}/dislikes`,
    contentType: 'application/json',
    data: JSON.stringify({
      action: action,
    })
  };
$.ajax(requestConfig).then(function (response) {
  $button.siblings('.dislikes-count').text(response.dislikesCount)
  if(action==='dislike'){
    $button.text('undislike')
    $button.attr('data-state', 'undislike');
  }
  else{
    $button.text('dislike')
    $button.attr('data-state', 'dislike');
  }
})
});

$('.accept-button, .reject-button').on('click', function() {
var sessionId = $(this).data('session-id');
var userName = $(this).data('user-name');
var statusElement = $(this).closest('.session').find('.status');
var action = $(this).data('action');
let requestConfig = {
  method: 'POST',
  url: `/sessions/${userName}/received/${sessionId}`,
  contentType: 'application/json',
  data: JSON.stringify({
    action: action,
  })
};
$.ajax(requestConfig).then(function (response) {
  //const likesCountSpan = $(this).siblings('.likes-count');
  //const newLikesCount = response.likesCount; 
  statusElement.text(`Current Status is ${response.status} `);
  statusElement.siblings('.accept-button, .reject-button').hide();
})



});





  
  function validateCreatePostForm() {
      const course = $('#course').val();
      const content = $('#content').val();
      const tags = $('#tags').val();
      $('#errorList').empty();

      let errors = [];
      if (!course.trim()) {
          errors.push("Course is required.");
      }
      if (!content.trim()) {
          errors.push("Content is required.");
      }
      if (!tags.trim()) {
          errors.push("Tags are required.");
      } else {
          const tagArray = tags.split(',');
          if (tagArray.length === 1 && tagArray[0].trim() === '') {
              errors.push("Please provide at least one tag.");
          }
      }
      if (errors.length > 0) {
          const errorList = $('<ul>');
          errors.forEach(function(error) {
              errorList.append($('<li>').text(error));
          });
          $('#errorList').append(errorList);
          return false;
      }

      return true; 
  }
  function validateUpdatePostForm() {

    const course = $('#course').val();
    const title = $('#title').val();
    const content = $('#content').val();
    const tags = $('#tags').val();
    $('#error').empty();

    let errors = [];

    // Check if at least one field is provided for update
    if (!course.trim() && !title.trim() && !content.trim() && !tags.trim()) {
        errors.push("At least one field should be provided for update.");
    }

    // Display errors
    if (errors.length > 0) {
        $('#error').text(errors.join(' '));
        return false; // Form is invalid
    }

    return true; // Form is valid
}
  let createPostForm = $('#createPostForm');
  createPostForm.submit(function(event) {
    event.preventDefault();
    if (!validateCreatePostForm()) {
      $("#errorList").show();
    }else{
      $("#errorList").hide();
      createPostForm[0].submit();

    }
    });
    let updatePostForm = $('#updatePostForm');
  updatePostForm.submit(function(event) {
    event.preventDefault();
    if (!validateUpdatePostForm()) {
      $("#errorList").show();
    }else{
      $("#errorList").hide();
      updatePostForm[0].submit();
    }
    });
  
});
