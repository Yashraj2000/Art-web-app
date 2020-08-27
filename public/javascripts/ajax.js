var isloggedin = document.getElementById("current-user-id");
if(isloggedin)
{
  var currentUserId = isloggedin.dataset.id;
}
var formurl  = $("#like").attr("action");
var likeslength = document.getElementById("count");
var nolike = document.getElementById("nolike");
var ele2="";
$("#like").on("submit",function(e){
  e.preventDefault();
  $.ajax({
    url:formurl,
    method:'POST'
  })
  .done(function(data){
    if(data==="resend")
    {
      window.location.href = "/resend-page";
    }else
    {
      likeslength.textContent= data.likes.length
    if(data.likes.length==0)
    { 
      var ele = `<tr><td><em >No likes yet.</em></td></tr>`
      nolike.innerHTML = ele;

    }else{
      ele2="";
      data.likes.forEach(function(a){
        ele2 += `<tr><td><img src=${a.image.secure_url}  alt="userimage" class="img-fluid show-img mr-3">${a.username}</td></tr>`;
        nolike.innerHTML = ele2;
    })
    }
  }
  })
  .fail(function(err){
    console.log(err)
    alert("Something went wrong Please try again in a moment")
  })
});

// CREATE COMMENT 
var commentcontainer = document.getElementById("comment-container");
var commenturl  = $("#comment").attr("action");
var ele = "";
$("#comment").on("submit",function(e){
  e.preventDefault();
  var formData = $(e.target).serialize();
  e.target.reset();
  $("#comment").find("button").attr("disabled",true);
  $("#comment").find("button").text("Posting");
  $.ajax({
    url:commenturl,
    type:'post',
    data:formData
  })
  .done(function(data){
    if(data==="resend")
    {
     return window.location.href = "/resend-page";
    }
    commentcontainer.style.display="block";
    $("#nocomment").css("display","none");
    if(data.comments.length===0)
    {
      commentcontainer.innerHTML = `<p id="nocomment" class="text-center mt-1">No comments yet be the first one to comment</p>`;
    }else{
      ele="";
      data.comments.sort(function(a,b){
        var c = new Date(a.createdAt);
        var d = new Date(b.createdAt);
        return d-c;
      })
      var a= data.comments[0];
      // data.comments.forEach(function(a){
        ele+=` <div id="${a._id}"  class="customcss"><div class="d-flex flex-row align-items-center">`;
        ele+= `
        <div><img src=${a.author.image.secure_url} alt="userimage" class="img-fluid show-img"> </div>
        <div class="pl-4 mt-2 font-weight-bold">${a.author.username}</div>
        `
        if(isloggedin && (a.author._id===currentUserId))
        {
          ele+=`
          <div class="dropdown ml-3 mt-2">
            <span style="font-size: 35px;"><i class="fas fa-caret-down dropbtn crate"></i></span>
          <div class="dropdown-content">
            <a style="color: black;" class="pl-2 edit-tag" data-id="${a._id}" data-toggle="collapse" href="#collapseExample${a._id}" role="button" aria-expanded="false" aria-controls="collapseExample${a._id}">Edit</a>
            <form action="/post/${data._id}/comments/${a._id}?_method=DELETE" method="POST"  getid=${a._id}>
              <button class="form-submit-button delete1">Delete</button>
           </form>        
          </div>
        </div> `
        }
        ele+=`</div>`
        ele+=`
        <div class="mt-4" id="com-content${a._id}"><div class="container text-justify comment-value">${a.comment}</div><span class="float-right com-time">${ moment(a.updatedAt,moment.defaultFormat).fromNow()}</span></div><hr>
        `
        if(isloggedin && (a.author._id===currentUserId)){  
          ele+=`
          <div class="collapse" id="collapseExample${a._id}">
          <form action="/post/${data._id}/comments/${a._id}?_method=PUT" method="POST" id=${a._id} class="edit1">
            <div class="form-group">
            <textarea name="newcomment[comment]" class="form-control" placeholder="Leave your comment here" required cols="152" id="message" rows="5">${a.comment}</textarea>
              </div>
            <button class="btn btn-success">Publish</button>
            <a class="btn btn-primary" data-toggle="collapse" href="#collapseExample${a._id}" role="button" aria-expanded="false" aria-controls="collapseExample">
            Close
          </a>
            </form>     
          </div>
          `
        }
        ele+=`</div>`
      // })
      console.log(commentcontainer.childNodes[0],"first child")
      // ele  = $.parseHTML(ele);
      // console.log(typeof ele)
      // commentcontainer.innerHTML = ele;
      $("#comment-container").prepend(ele);
      $("#comment").find("button").attr("disabled",false);
      $("#comment").find("button").text("Publish");
  } 
  })
  .fail(function(err){
    alert("Something went wrong Please try again")
  })
})
    // DELETE COMMENT
  $("#comment-container").hover(function(){
    var button = document.querySelectorAll(".delete1");
    // var editTag= document.getElementsByClassName("edit-tag");
    // editTag.forEach(function(tag){
    //   var data;
     
    // })
    button.forEach(function(a){ 
      //on is replacement of bind
     $(a).unbind().on("click",function(e){
        e.preventDefault();
        e.stopPropagation(); 
        var contid = a.parentElement.getAttribute("getid");
        var deleteurl = a.parentElement.getAttribute("action");
        $.ajax({
          url:deleteurl,
          method:"DELETE",
          success:function(data){
            $(`#${contid}`).fadeOut(1000,function(e){
              // $(this).stopImmediatePropagation()
              $(this).remove();
              // alert("removed")
              if(data.length===0){
                document.getElementById("nocomment").innerHTML = `No comments yet be the first one to comment`;
                $("#nocomment").css("display","block");
                commentcontainer.style.display="none";
      
                }
            })
            console.group(data)
          //   button = document.querySelectorAll(".delete1")

        },
        fail:function(a){
          alert("something went wrong")
        }
        });
      });
    });
});
      // EDIT COMMENT
      $("#comment-container").hover(function(){
        var editform = document.querySelectorAll(".edit1");
        editform.forEach(function(c){ 
          $(c).unbind().on("submit",function(e){
            var urlcom = this.getAttribute("action");
            var self = $(this);
            e.preventDefault();
            e.stopImmediatePropagation();
            $(this).find("button").attr("disabled",true);
        // var commentdata = $(this).find('textarea[name="newcomment[comment]"]').val();
        var commentdata = $(e.target).serialize();
        // console.log(typeof commentdata)
        $.ajax({
          url:urlcom,
          method:"PUT",
          data:commentdata,
          success:async function(data){
            // console.log(data);
            var comcont = document.getElementById(`com-content${data._id}`)
            comcont.innerHTML = `<div class="container text-justify comment-value">${data.comment}</div><span class="float-right com-time">${ moment(data.updatedAt,moment.defaultFormat).fromNow()}</span>`;
            var commodel = document.getElementById(`collapseExample${data._id}`)
            // console.log(commodel.childNodes[1][0].textContent);
            commodel.childNodes[1][0].textContent = data.comment;
            self.find("button").attr("disabled",false);
            console.log(self)
            $(commodel).removeClass('show');
        },
        fail:function(a){
          alert("something went wrong");
          self.find("button").attr("disabled",false);
        }
        });
     });
   });
 })

//  SHOW MORE COMMENT
 var anchor = document.getElementById("showmore");
 var comele = "";
 $("#showmore").on("click",function(e){
 var currentpage=Number(this.dataset.page);
 anchor.setAttribute("disabled",true);
 console.log(currentpage,"on click");
 e.preventDefault();
 var newurl = anchor.getAttribute("href");
 newurl+='?currentpage='+currentpage;
 $.ajax({
 url:newurl,
 method:'GET',
 data:currentpage,
 success:function(data){
   console.log(data)
   if(data.comments && data.comments.length==0)
   { 
    //  comele = `<p class="text-center"><em>No more comments to show</em></p>`
    //  anchor.style.display="none";
    $("#showmore").closest("div").remove();
    //  $("#comment-container").append(comele);
     return;
   }
    // console.log(data);
    anchor.dataset.page=currentpage+1;
     // starting
     comele="";
     data.comments.forEach(function(a){
        comele+=` <div id="${a._id}"  class="customcss"><div class="d-flex flex-row align-items-center">`;
        comele+= `
        <div><img src=${a.author.image.secure_url} alt="userimage" class="img-fluid show-img" > </div>
        <div class="pl-4 mt-2 font-weight-bold">${a.author.username}</div>
        `
        if(isloggedin && (a.author._id===currentUserId))
        {
          comele+=`
          <div class="dropdown ml-3 mt-2">
            <span style="font-size: 35px;"><i class="fas fa-caret-down dropbtn crate"></i></span>
          <div class="dropdown-content">
            <a style="color: black;" class="pl-2" data-toggle="collapse" href="#collapseExample${a._id}" role="button" aria-expanded="false" aria-controls="collapseExample${a._id}">Edit</a>
            <form action="/post/${data._id}/comments/${a._id}?_method=DELETE" method="POST"  getid=${a._id}>
              <button class="form-submit-button delete1">Delete</button>
           </form>        
          </div>
        </div> `
        }
        comele+=`</div>`
        comele+=`
        <div class="mt-4" id="com-content${a._id}"><div class="container text-justify comment-value">${a.comment}</div><span class="float-right com-time">${ moment(a.updatedAt,moment.defaultFormat).fromNow()}</span></div><hr>
        `
        if(isloggedin && (a.author._id===currentUserId)){  
          comele+=`
          <div class="collapse" id="collapseExample${a._id}">
          <form action="/post/${data._id}/comments/${a._id}?_method=PUT" method="POST" id=${a._id} class="edit1">
          <div class="form-group">
            <textarea name="newcomment[comment]" class="form-control" placeholder="Leave your comment here" required cols="152" id="message" rows="5">${a.comment}</textarea>
            </div>
            <button class="btn btn-success">Publish</button>
            <a class="btn btn-primary" data-toggle="collapse" href="#collapseExample${a._id}" role="button" aria-expanded="false" aria-controls="collapseExample">
            Close
          </a>
            </form>     
          </div>
          `
        }
        comele+=`</div>`
      })
      $("#comment-container").append(comele);
      anchor.setAttribute("disabled",false);
      // ending
 }
 })
})
