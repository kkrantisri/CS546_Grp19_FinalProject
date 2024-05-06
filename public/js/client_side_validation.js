$(document).ready(function() {
  // let reg_form = $('#signup-form');
  // let login_form = $('#signin-form');

  // reg_form.submit(function(event) {
  //     event.preventDefault();
  //     let errorDiv = $('#reg_errors');
  //     errorDiv.empty().hide(); 
  //     let firstName = $('#firstName').val().trim();
  //     let lastName = $('#lastName').val().trim();
  //     let username = $('#username').val().trim();
  //     let password = $('#password').val().trim();
  //     let confirmPassword = $('#confirmPassword').val().trim();
  //     let favoriteQuote = $('#favoriteQuote').val().trim();
  //     let themePreference = $('#themePreference').val().trim();
  //     let role = $('#role').val().trim();

  //     let errorList = [];

  //     function validateString(param, name, minLen, maxLen, regex) {
  //         if (param.length === 0) return `${name} cannot be empty or just spaces`;
  //         if (param.length < minLen || param.length > maxLen) return `${name} must be between ${minLen} and ${maxLen} characters long`;
  //         if (regex && !regex.test(param)) return `${name} is invalid`;
  //     }

  //     function validatePassword(pwd) {
  //         if (pwd.length < 8) return 'Password should be a minimum of 8 characters long';
  //         if (/\s/.test(pwd)) return 'Password cannot contain spaces';
  //         if (!/[A-Z]/.test(pwd)) return 'Password must contain at least one uppercase letter';
  //         if (!/\d/.test(pwd)) return 'Password must contain at least one number';
  //         if (!/[!@#$%^&*()-_=+[\]{};:'",.<>?]/.test(pwd)) return 'Password must contain at least one special character';
  //     }

  //     if (!firstName || !lastName || !username || !password || !confirmPassword || !favoriteQuote || !themePreference || !role) {
  //         errorList.push('All fields must be supplied');
  //     } else {
  //         errorList.push(validateString(firstName, 'First Name', 2, 25, /^[^\d]+$/));
  //         errorList.push(validateString(lastName, 'Last Name', 2, 25, /^[^\d]+$/));
  //         errorList.push(validateString(username, 'Username', 5, 10, /^[^\d]+$/));
  //         errorList.push(validateString(favoriteQuote, 'Favorite Quote', 20, 255));
  //         errorList.push(validatePassword(password));
  //         errorList.push(validatePassword(confirmPassword));
  //         if (password !== confirmPassword) {
  //             errorList.push('Passwords do not match');
  //         }
  //     }

  //     errorList = errorList.filter(Boolean); 

  //     if (errorList.length > 0) {
  //         errorDiv.show();
  //         $.each(errorList, function(index, message) {
  //             errorDiv.append($('<p>').text(message));
  //         });
  //     } else {
  //         reg_form[0].submit();
  //     }
  // });

  // // AJAX login for submission
  // login_form.submit(function(event) {
  //     event.preventDefault();

  //     let errorDiv = $('#login_errors');
  //     errorDiv.empty().hide();

  //     let username = $('#username').val().trim();
  //     let password = $('#password').val().trim();

  //     if (!username || !password) {
  //         errorDiv.show().append($('<p>').text('Both username and password must be supplied'));
  //         return;
  //     }

  //     if (username && password) {
  //         // Setting up AJAX request configuration
  //         let requestConfig = {
  //             method: 'POST',
  //             url: '/login',
  //             data: {
  //                 username: username,
  //                 password: password
  //             }
  //         };

  //         // Sending AJAX request for login
  //         $.ajax(requestConfig)
  //             .done(function(response) {
  //                 // successful login
  //                 console.log('Login successful:', response);
  //             })
  //             .fail(function(xhr, status, error) {
  //                 // error logging in
  //                 console.error('Login error:', error);
  //                 errorDiv.show().text('Invalid username or password. Please try again.');
  //             });
  //     }

  //     // function validateField() {
  //     //     if (!username || !password) {
  //     //         return 'Both username and password must be supplied';
  //     //     }
  //     //     return null;
  //     // }
  //     // let error = validateField();
  //     // if (error) {
  //     //     errorDiv.show().append($('<p>').text(error));
  //     // } else {
  //     //     login_form[0].submit();
  //     // }
  // });
  
  // $('.accept-button').click(async function() {
  //     const sessionId = $(this).attr('data-session-id');
  //     const username = $(this).attr('data-user-name');
  
  //     try {
  //       const response = await axios.patch(`/sessions/${username}/received/${sessionId}`, {
  //         action: 'accepted'
  //       });
  //         const sessionArticle = $(this).closest('.session');
  //         sessionArticle.removeClass('session-pending').addClass('session-accepted');
  //         sessionArticle.find('.accept-button, .reject-button').hide();
  //         sessionArticle.find('.status').text(`Current Status is ${response.data.status}`);
  //     } catch (error) {
  //       console.error('Error occurred:', error);
        
  //     }
  //   });
  
  //   // Reject button click event listener
  //   $('.reject-button').click(async function() {
  //     const sessionId = $(this).attr('data-session-id');
  //     const username = $(this).attr('data-user-name');
  
  //     try {
  //       const response = await axios.patch(`/sessions/${username}/received/${sessionId}`, {
  //         action: 'rejected'
  //       });
  //       const sessionArticle = $(this).closest('.session');
  //       sessionArticle.removeClass('session-pending').addClass('session-accepted');
  //       sessionArticle.find('.accept-button, .reject-button').hide();
  //       sessionArticle.find('.status').text(`Current Status is ${response.data.status}`);
  //     } catch (error) {
  //       console.error('Error occurred:', error);
  //     }
  //   });
    $('#search-tag-form').submit(function (event) {
      event.preventDefault();
  
      let tag = $('#tag').val();
      tag = tag.trim();
  
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

  
});
