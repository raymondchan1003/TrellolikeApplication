var lists = document.querySelectorAll(".list");
const columnList = document.getElementById("column-list");
const addPostDiv = document.getElementById("addPostDiv");
const modifyPostDiv = document.getElementById("modifyPostDiv");
var modifyID = "";
const url = "http://localhost:3000/posts";

const addNewCard = () => {
  addPostDiv.style.display = "block";
};

const addColumn = () => {
  document.querySelector("#column").insertAdjacentHTML(
    "beforeend",
    `<div class="list">
    <input class="innerButton" type="button" value="Remove" onclick="removeColumn(this)">
    <div class="chgText">
    <p class="entry-title">${lists.length + 1}. </p>
    <u class="chgColumnName" onclick="modifyColumnName(this)"><b>Enter Column Name</b></u>
    </div>
    </div>`
  );
  lists = document.querySelectorAll(".list");
  refreshColumn();
};

const promptModifyBox = (id, title, author) => {
  modifyID = id;
  (document.getElementById("modifyPostTitle").value = title),
    (document.getElementById("modifyPostAuthor").value = author);
  modifyPostDiv.style.display = "block";
};

const postData = body => {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
    .then(resp => {
      addPostDiv.style.display = "none";
    })
    .catch(error => {
      addPostDiv.style.display = "none";
      alert("Error! " + error);
    });
};

const postModifyData = body => {
  //const url = `${url}/${modifyID}`;
  fetch(`${url}/${modifyID}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
    .then(resp => {
      modifyPostDiv.style.display = "none";
    })
    .catch(error => {
      modifyPostDiv.style.display = "none";
      alert("Error! " + error);
    });
};

const createPost = () => {
  var addPostTitle = document.getElementById("addPostTitle").value;
  var addPostAuthor = document.getElementById("addPostAuthor").value;

  if (addPostTitle !== "" && addPostAuthor !== "") {
    var body = {
      title: addPostTitle,
      author: addPostAuthor
    };
    postData(body);
  } else {
    alert("Please fill in all content!");
  }
};

const modifyPost = () => {
  var modifyPostTitle = document.getElementById("modifyPostTitle").value;
  var modifyPostAuthor = document.getElementById("modifyPostAuthor").value;

  if (modifyPostTitle !== "" && modifyPostAuthor !== "") {
    var body = {
      title: modifyPostTitle,
      author: modifyPostAuthor
    };
    postModifyData(body);
  } else {
    alert("Please fill in all content!");
  }
};

const cancelCreatePost = () => {
  addPostDiv.style.display = "none";
};

const cancelModifyPost = () => {
  modifyPostDiv.style.display = "none";
};

const fetchData = () => {
  fetch(url)
    .then(res => {
      return res.json();
    })
    .then(data => {
      const post = data.map(data => ({
        id: data.id,
        title: data.title,
        author: data.author
      }));
      displayData(post);
    })
    .catch(error => {
      alert("Error! " + error);
    });
};

const displayData = posts => {
  const postHTMLString = posts
    .map(
      post => `
  <div class="list-item" draggable="true" onClick="expandPost(this)">
  <div style="float: right;">
  <input type="button" class="innerButton" value="DELETE"  onclick="deletePost(${post.id})"/>
  <input type="button" class="innerButton" value="MODIFY"  onclick=" promptModifyBox('${post.id}','${post.title}','${post.author}')"/>
  </div>
  <p>Post ID: <b>${post.id}</b></p>
  <p>Post Title: <b>${post.title}</strong></b></p>
  <p class="author">Post Author: <b>${post.author}</b></p>
  </div>
  `
    )
    .join("");
  columnList.innerHTML =
    `<div class="buttonDefault" >Default</div>
    <div class="chgText">
    <p class="entry-title">${lists.length}. </p>
  <u class="chgColumnName" onclick="modifyColumnName(this)"><b>Enter Column Name</b></u>
</div>` + postHTMLString;
  refreshColumn();
};

const refreshColumn = () => {
  const list_items = document.querySelectorAll(".list-item");
  dragdrop(list_items);
};

const dragdrop = posts => {
  let draggedItem = null;

  for (let i = 0; i < posts.length; i++) {
    let item = posts[i];

    item.addEventListener("dragstart", function() {
      draggedItem = item;
      setTimeout(function() {
        item.style.display = "none";
      }, 0);
    });

    item.addEventListener("dragend", function() {
      setTimeout(function() {
        draggedItem.style.display = "block";
        draggedItem = null;
      }, 0);
    });

    for (let j = 0; j < lists.length; j++) {
      const list = lists[j];

      list.addEventListener("dragover", function(e) {
        e.preventDefault();
      });
      list.addEventListener("dragenter", function(e) {
        e.preventDefault();
        this.style.backgroundColor = "rgba(0,0,0,0.2)";
      });
      list.addEventListener("dragleave", function(e) {
        this.style.backgroundColor = "rgba(0,0,0,0.1)";
      });
      list.addEventListener("drop", function(e) {
        if (draggedItem != null) {
          this.append(draggedItem);
        }
        this.style.backgroundColor = "rgba(0,0,0,0.1)";
      });
    }
  }
};

const deletePost = id => {
  //const url = `${url}/${id}`;
  fetch(`${url}/${id}`, {
    method: "DELETE"
  })
    .then(resp => {})
    .catch(error => {
      alert("Error! " + error);
    });
};

const expandPost = expand => {
  var x = expand.querySelector(".author");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
};

const modifyColumnName = column => {
  var txt;
  var desc = prompt(
    "Please enter column name:",
    column.querySelector("b").innerHTML
  );
  if (desc == null || desc == "") {
    txt = column.querySelector("b").innerHTML;
  } else {
    txt = desc;
  }
  column.querySelector("b").innerHTML = txt;
};

const removeColumn = input => {
  input.parentNode.querySelectorAll(".list-item").forEach(element => {
    document.querySelector("#column-list").insertAdjacentHTML(
      "beforeend",
      `<div class="list-item" draggable="true" onClick="expandPost(this)">
              ${element.innerHTML}
        </div>`
    );
  });
  input.parentNode.remove();
  lists = document.querySelectorAll(".list");
  refreshColumn();
  updateColumnId(lists);
};

const updateColumnId = lists => {
  var count = 1;
  lists.forEach(element => {
    element
      .querySelector(".chgText")
      .querySelector(".entry-title").innerHTML = `${count}. `;
    count++;
  });
};

fetchData();
