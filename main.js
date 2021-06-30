
const loggedOut = document.querySelectorAll('.logged-out')
const loggedin = document.querySelectorAll('.logged-in')
const loginCheck = user => 
{
    if (user)
    {
        loggedin.forEach(link => link.style.display='block');
        loggedOut.forEach(link => link.style.display='none');
    } else {
        loggedOut.forEach(link => link.style.display='block');
        loggedin.forEach(link => link.style.display='none');
    } 
}



const signUpForm = document.querySelector("#signup-form");



signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector("#signup-email").value;

    const password = document.querySelector("#signup-password").value;

    auth
        .createUserWithEmailAndPassword(email, password)
        .then(useCredential => {
            //clear form
            signUpForm.reset();

        })
});

//sigIn

const siginForm = document.querySelector("#signin-form")

siginForm.addEventListener("submit", e => 
{
    e.preventDefault();
    const email = document.querySelector("#signin-email").value;

    const password = document.querySelector("#signin-password").value;

    auth
    .signInWithEmailAndPassword(email, password)
    .then(useCredential => {
        //clear form
        signUpForm.reset();
        console.log("sigin")

    })
});

//logOut
const logOut= document.querySelector("#logout");

logOut.addEventListener("click",e => {
    e.preventDefault();
    auth.signOut().then(() => 
    {
        console.log("logout")
    })
});
//GOOGLE LOGIN
const googleLogin = document.querySelector("#googleLogin")
googleLogin.addEventListener("click", e => 
{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth
        .signInWithPopup(provider)
    //si todo salio bien entonces...
        .then(result => 
            {
                console.log("google sign in")
            })
    //si ocurrio un error
        .catch(err => 
            {
                console.log(err)
            })
})

//FACEBOOK LOGIN

const facebookLogin = document.querySelector("#facebookLogin")
facebookLogin.addEventListener("click", e => 
{
    e.preventDefault();
    const provider = new firebase.auth.FacebookAuthProvider();
    auth 
    .signInWithPopup(provider)
    .then(result =>
        {
            console.log("facebook sign in")
        })
    .catch(err => 
        {
            console.log(err)
        })
})  


//posts

const postList = document.querySelector(".posts");
//A traves de la siguiente variable verificamos si la coleccion tiene datos
const setUpPosts = data => {
    if(data.length)
    {
        //En el caso que tenga datos los incluimos en nuestro DOM
        let html = '';
        data.forEach(doc => {
            const post = doc.data()
            const li = `
            <li class="list-group-item list-group-item-action">
                <h5>${post.tittle}</h5>
                <p>${post.description}</p>
                <div>
                    <button class="btn btn-danger">Delete</button>
                    <button class="btn btn-primary">Edit</button>.
                </div>
            </li>`;
            html += li;
        })
        postList.innerHTML = html;
    }
    else
    {
        postList.innerHTML=`<p class="text-center">login to see posts</p>`
    }
}
//Events
//List for auth state changes
//El siguiente evento hace que el mismo se dispare si hay un cambio en el estado del usuario(logueado, registrado o deslogueado)

auth.onAuthStateChanged(user => 
    {
        //Si user existe quiere decir que el usuario esta logueado
        if (user)
        {
            //Si el usuario esta logueado traeme los elementos de la coleccion posts
            fs.collection("posts")
                .get()
                //Mostrame los datos actuales de esa colecion actuales
                .then((snapshot) => {
                    setUpPosts(snapshot.docs)
                    loginCheck(user);
                })
        } else{
            setUpPosts([])
            loginCheck(user); 
        }
    })
//CRUD ZONE --->

const taskForm = document.querySelector("#task-form")

//CREATE NEW TASK
const saveTask = (tittle,description) => 
{
    const response =  fs.collection("posts").doc().set(
        {
            tittle,
            description
        }
    )
}
taskForm.addEventListener("submit", async (e) => 
{
    e.preventDefault();
    console.log("enviando")

    const tittle = taskForm['task-tittle'];
    const description = taskForm['task-description'];

    await saveTask(tittle.value, description.value);

    setUpPosts();
    taskForm.reset();
    tittle.focus();
})
//END CREATE NEW TASK
