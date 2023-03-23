// Link API
const url = "https://jsonplaceholder.typicode.com/posts";

// Get DOM Elements
const loadingElement = document.querySelector("#loading");
const postsContainer = document.querySelector("#posts-container");

const commentsContainer = document.querySelector("#comments-container");
const postPage = document.querySelector("#post");
const postContainer = document.querySelector("#post-container");

const commentForm = document.querySelector("#comment-form");
const emailInput = document.querySelector("#email");
const bodyInput = document.querySelector("#body");

// Get id from URL
const urlSearchParams = new URLSearchParams(window.location.search);
const postId = urlSearchParams.get("id");

// Create a function to get posts
async function getAllPosts() {
  const response = await fetch(url);

  // Check if the response is ok
  console.log(response);

  // Get the data
  const data = await response.json();

  // Check if the data is ok
  console.log(data);

  loadingElement.classList.add("hide");

  // Loop through the data
  data.map((post) => {
    const div = document.createElement("div");
    const title = document.createElement("h2");
    const body = document.createElement("p");
    const link = document.createElement("a");

    title.innerText = post.title;
    body.innerText = post.body;
    link.innerText = "Read More";
    // Atributos na URL do link para extrair o ID do post
    link.setAttribute("href", `/post.html?id=${post.id}`);

    div.appendChild(title);
    div.appendChild(body);
    div.appendChild(link);

    postsContainer.appendChild(div);
  });
}

// Create a function to get post by id
async function getPost(id) {
  const [responsePost, responseComments] = await Promise.all([
    fetch(`${url}/${id}`),
    fetch(`${url}/${id}/comments`),
  ]);

  const dataPost = await responsePost.json();
  const dataComments = await responseComments.json();

  loadingElement.classList.add("hide");
  postPage.classList.remove("hide");

  const title = document.createElement("h1");
  const body = document.createElement("p");

  title.innerText = dataPost.title;
  body.innerText = dataPost.body;

  postContainer.appendChild(title);
  postContainer.appendChild(body);

  // Loop through the comments
  console.log(dataComments);

  dataComments.map((comment) => {
    createComment(comment);
  });
}
// Create Comments
function createComment(comment) {
  const div = document.createElement("div");
  const email = document.createElement("h3");
  const commentbody = document.createElement("p");

  email.innerText = comment.email;
  commentbody.innerText = comment.body;

  div.appendChild(email);
  div.appendChild(commentbody);

  commentsContainer.appendChild(div);
}

// Create a function to post a comment
async function postComment(comment) {
    const response = await fetch(`${url}/${postId}/comments`, {
        method: "POST",
        body: comment,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    });
    const data = await response.json();
    createComment(data);
}


// Check if the id is null
if (!postId) {
  getAllPosts();
} else {
  getPost(postId);

  commentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let comment = {
      email: emailInput.value,
      body: bodyInput.value,
    };

    console.log(comment);
    comment = JSON.stringify(comment);
    postComment(comment);
  });
}
