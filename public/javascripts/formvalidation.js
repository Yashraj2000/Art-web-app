       let check = document.getElementById("check");
       let password = document.getElementById("password")
       let pform = document.getElementById("form");
       let len1;
       console.log(check)
       password.addEventListener("input",e=>{
        len1=password.value.length
        if(len1<6)
        {     
                pwd("Length of password must be atleast 6","color-red", "color-green")
          }else{
              pwd("Password Looks correct","color-green", "color-red") 
        }
       })
          function pwd(mess,add, remove){
              check.textContent = mess;
              check.classList.add(add)
              check.classList.remove(remove)
          }
     
          pform.addEventListener("submit",e=>{
            if(password.value.length<6)
            {
              e.preventDefault();
            }
          })