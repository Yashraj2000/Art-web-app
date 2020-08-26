
let newpasswordvalue;
let confirmpasswordvalue;
let len;

const usernamevalue = document.getElementById("username").value;
const username = document.getElementById("username");
const email = document.getElementById("Email");
const emailvalue = document.getElementById("Email").value;
const form  = document.querySelector("form");
const newpassword = document.getElementById("new-password");
const pwdlength  = document.getElementById("pwd-length")
const confirmation = document.getElementById("password-confirmation");
const validationMessage = document.getElementById("form-validation");
console.log(pwdlength);
if(newpassword){
newpassword.addEventListener("input",e=>{
    e.stopPropagation();
  len = newpassword.value.length;
    if(len<6)
    {     
           pwd("Length of password must be atleast 6","color-red", "color-green")
    }else{
        pwd("correct","color-green", "color-red") 
    }
});
}
function pwd(mess,add, remove){
    pwdlength.textContent = mess;
    pwdlength.classList.add(add)
    pwdlength.classList.remove(remove)
}

if(confirmation){
confirmation.addEventListener("input",e =>{
newpasswordvalue = newpassword.value;
confirmpasswordvalue = confirmation.value;
if(newpasswordvalue!==confirmpasswordvalue){
validate("Password must match","color-red", "color-green")
}else{
    validate("Password match","color-green", "color-red")
}
});
}
function validate(mess,add, remove){
    validationMessage.textContent = mess;
    validationMessage.classList.add(add)
    validationMessage.classList.remove(remove)
}
let image = document.getElementById("image");
let upload = document.getElementById("upload");
let url = image.src;
upload.addEventListener("change",function(){
    const file = this.files[0];
    if(file){
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.addEventListener("load",function(){
            image.setAttribute("src",this.result)
        })
    }else{
        // console.log("here")
        image.setAttribute("src",url)
    }
});

form.addEventListener("submit", e=>{
    if(newpasswordvalue!==confirmpasswordvalue){
        e.preventDefault();
        alert("Sorry ! Passwords Must Match")
    }if(usernamevalue !=username.value || emailvalue !=email.value) { 
        var formdata="";
        var userName = username.value;
        var Email = email.value
        if(usernamevalue !=username.value){
            formdata += `username=${userName}&`
        }if(emailvalue !=email.value){
            formdata+=`email=${Email}&`
        }
        e.preventDefault();
        e.stopPropagation();
        $.ajax({
            url:"/profile/check",
            type:"post",
            data:formdata,
            success:function(data){
             //    console.log(data)
                 if(data && data.length>0)
                 {   
                     // console.log("yaha")  
                     var email_error = document.getElementsByClassName("email")
                     var username_error = document.getElementsByClassName("username");
                     if(data.length==2){
                         email_error[0].textContent = "Email is already taken";
                         email_error[0].style.color = "red"
                         username_error[0].textContent ="Username is already taken";
                         username_error[0].style.color = "red"
                     }else{
                         if(data[0]=="Username"){
                             // e.preventDefault(); 
                             username_error[0].textContent ="Username is already taken";
                             username_error[0].style.color = "red"
                             email_error[0].textContent = "";

                         }
                         else{
                             email_error[0].textContent = "Email is already taken";
                             email_error[0].style.color = "red"
                             username_error[0].textContent ="";
                         }

                     }

                 }else{
                   $("form").submit();
                     // return false;  
                 }
            }
        });
    }
})

$(document).ready(function(){
    $("#bio").keyup(function(){
        $("#about").text($(this).val().length+'/500');
    })
    
    $("#tag").keyup(function(){
        $("#tagline").text($(this).val().length+'/90');
    })
})
