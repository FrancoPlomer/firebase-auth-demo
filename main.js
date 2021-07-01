
const loggedOut = document.querySelectorAll('.logged-out')
const loggedin = document.querySelectorAll('.logged-in')
const taskForm = document.querySelector("#task-form")
const containerCrud = document.querySelector('.containerCrud')
let editStatus = false;
let id = '';
const loginCheck = user => 
{
    if (user)
    {
        loggedin.forEach(link => link.style.display='block');
        loggedOut.forEach(link => link.style.display='none');
        containerCrud.style.display='block';
    } else {
        loggedOut.forEach(link => link.style.display='block');
        loggedin.forEach(link => link.style.display='none');
        containerCrud.style.display='none';
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
//LO siguiente es para que, cada vez que se actualice una nueva tarea, esta lo refresque sobre la pagina 
const setUpPostGet = (callback) => fs.collection('posts').onSnapshot(callback)

//El siguiente metodo es para borrar un post por su id.
const DeletePost = id  => fs.collection('posts').doc(id).delete();

//El siguiente metodo es para traer un elemento por su id el cual se usara para el editar
const getPost = (id) => fs.collection('posts').doc(id).get();

//El siguiente metodo es para editar un campo
const updatePost = (id, updatedPost) => fs.collection('posts').doc(id).update(updatedPost);

//A traves de la siguiente variable verificamos si la coleccion tiene datos
const setUpPosts = data => {
    if(data.length)
    {
        //En el caso que tenga datos los incluimos en nuestro DOM
        
        //LO siguiente es para que, cada vez que se actualice una nueva tarea, esta lo refresque sobre la pagina 
        setUpPostGet((data) => 
        {
            let html = '';
            data.forEach(doc => {
                const post = doc.data()
                post.id =doc.id;
                const li = `
                <li class="list-group-item list-group-item-action">
                    <h5>${post.tittle}</h5>
                    <p>${post.description}</p>
                    <div>
                        <button class="btn btn-danger btn-delete" data-id="${post.id}">Delete</button>
                        <button class="btn btn-primary btn-edit" data-id="${post.id}">Edit</button>
                    </div>
                </li>`;
                html += li;
                
                
            })
            postList.innerHTML = html;
            //Function delete
            const btnsDelete = document.querySelectorAll('.btn-delete');
            btnsDelete.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    await DeletePost(e.target.dataset.id)
                })
            })
            //function edit
            const btnsEdit = document.querySelectorAll('.btn-edit');
            btnsEdit.forEach(btn =>{
                btn.addEventListener('click', async (e) => 
                {
                    const doc = await getPost(e.target.dataset.id);
                    const task = doc.data();
                    id = doc.id;
                    editStatus = true;
                    
                    taskForm['task-tittle'].value = task.tittle;
                    taskForm['task-description'].value = task.description;
                    taskForm['btn-task-form'].innerText = 'Update';
                    

                })
            
            })
        })

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

    const tittle = taskForm['task-tittle'];
    const description = taskForm['task-description'];

    if (!editStatus)
    {
        await saveTask(tittle.value, description.value);
    }else{  
        await updatePost(id, {
            tittle: tittle.value,
            description: description.value
        })
        editStatus = false;
        taskForm['btn-task-form'].innerText = 'save';
    }
    taskForm.reset();
    tittle.focus();
})
//END CREATE NEW TASK
