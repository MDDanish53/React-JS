# Workflow

## 1. Create react app through vite 

```
npm create vite@latest
```

## 2. Install the following libraries/dependencies : 

    i. redux toolkit
    ii. react redux 
    iii. react router dom 
    iv. appwrite - for database and backend
    v. tinymce - helps in visual code editor
    vi. html react parser - to parse the html of editor 
    vii. react hook form - to easily manage form

```
npm i @reduxjs/toolkit react-redux react-router-dom appwrite @tinymce/tinymce-react html-react-parser react-hook-form
```

 ## 3. Create environment variables : create .env file(don't push it on github, add it in .gitignore) in the root of project i.e in the main project folder and write - 

```
REACT_APP_APPWRITE_URL = "test environemnt"
```

access the environment variable in App.jsx as - 

``` 
function App() {
  console.log(process.env.REACT_APP_APPWRITE_URL) //accessing the env
 return (
  <>
  <h1>A blog app with appwrite</h1>
  </>
 )
}

export default App
```

usually the environment variable file loads once. when we change anything in env then we have to restart the project in maximum cases

if we create react app through create react app then we have to define env starting with REACT_APP then add the proceeding name and access it through process.env.REACT_APP

if we create react app through vite then we have to define env starting with VITE_ then add the proceeding name and access it through import.meta.env.VITE_ 

as our app is created through vite so update App.jsx and .env files :

App.jsx - 

```
function App() {
  console.log(import.meta.env.VITE_APPWRITE_URL); //accessing the env
  return (
    <>
      <h1>A blog app with appwrite</h1>
    </>
  );
}

export default App;
```

.env - 

```
VITE_APPWRITE_URL = "test environemnt"
```

now restart the project 

add other env in .env - 

```
VITE_APPWRITE_URL = "test environemnt"
VITE_APPWRITE_PROJECT_ID = ""
VITE_APPWRITE_DATABASE_ID = ""
VITE_APPWRITE_COLLECTION_ID = ""
VITE_APPWRITE_BUCKET_ID = ""
```

# Using Appwrite for backend as a service and doing setup : 

 # 4. create a new project in appwrite and copy its API Endpoint, project id and paste it into our env appwrite url, project id - 

```
VITE_APPWRITE_URL = "https://fra.cloud.appwrite.io/v1"
VITE_APPWRITE_PROJECT_ID = "681f724c001dba022123"
```

# 5. create database in appwrite with name blog an copy its id and paste in .env variable - 

```
VITE_APPWRITE_DATABASE_ID = "681f738c00313c04ec60"
```

# 6. create a collection with name articles in blog database and copy its id and paste in the .env variable - 

```
VITE_APPWRITE_COLLECTION_ID = "681f747c0030d2e70df0"
```

to provide permission about to read, write in the collection, go in the settings of collection > Update permissions, select All users to give permission to all registered users and tick create, read, update, delete options to give permission to all users. 

# 7. Create attributes for our blog in the article collection all with size 255 - 

    name - title
    required - yes
    type - string

    name - content
    required - yes
    type - string

    name - featuredImage
    required - yes
    type - string

    name - status 
    type - string

    name - userId
    required - yes
    type - string


# 8. Create an index of status attribute in articles collection by going in indexes section - 

    index key - status
    index type - key
    Attribute - status
    Order - ASC

# 9. Create bucket by going in the bucket section - 

    Name - images

copy the bucket id and paste in the env - 

```
VITE_APPWRITE_BUCKET_ID = "681f7896002088c0ed5f"
```

go in the images bucket settings and allow permissions to all the registered users to create, read, update, delete

## backend setup ends here 

# 10. create a new folder in src > conf > conf.js and write :

```
const conf = {}
export default conf
```

we created this file due to - 

sometimes env(import.meta.env.VITE_APPWRITE_URL) does not loads, there app crashes. if we had not created env in string format and it will treat it in the form of number or no character exists but env should be in string format.

import our env in conf file as - 
```
const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
}

export default conf
```

now we will get everything in string.

## Now we will create the services : 

# 11. for user authentication create folder src > appwrite > auth.js and write code :

```
import conf from "../conf.js";
import { Client, Account, ID } from "appwrite";

//Creating a class
export class AuthService {
  //creating client
  client = new Client();
  //account
  account;
  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    //adding value to account
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      //creating user account
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      if (userAccount) {
        //call another method
        return this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (err) {
      throw err;
    }
  }

  async login({ email, password }) {
    try {
      return this.account.createEmailPasswordSession(email, password);
    } catch (err) {
      throw err;
    }
  }

  //user is logged in or not
  async getCurrentUser() {
    try {
        //account exists or not
        return await this.account.get();
    } catch(err) {
        console.log(`Appwrite service :: getCurrentUser :: error ${err}`)
    }
    return null;
  }

  async logout() {
    try {
        return this.account.deleteSessions()
    } catch(err) {
        console.log("Appwrite service :: logout :: error", err)
    }
  }
}

//creating object of class
const authService = new AuthService();

export default authService;
```

this code contains functionalities such as :

at first when an object is created the client is created and account is declared. Through constructor endpoints and project gets setted in the client. then value of client gets added in the account. then the client can access the functionalities such as createAccount, login, logout and a method getCurrentUser to check if account exists or not i.e user is logged in or not.

Now our 1 service is ready

## 12. appwrite > config.js

```
import conf from "../conf.js";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    //adding value to the databases
    this.databases = new Databases(this.client);
    //adding value to the bucket(storage)
    this.storage = new Storage(this.client);
  }

//Post related services

  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          //attributes
          title,
          content,
          featuredImage,
          status,
          userId,
        }
      );
    } catch (err) {
      console.log(`Appwrite service :: createPost :: error ${err}`);
    }
  }

  async updatePost(slug, { title, content, featuredImage, status }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          status,
          featuredImage,
        }
      );
    } catch (err) {
      console.log(`Appwrite service :: updatePost :: error ${err}`);
    }
  }

  async deletePost(slug) {
    try {
      return await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
      return true;
    } catch (err) {
      console.log(`Appwrite service :: deletePost :: error ${err}`);
      return false;
    }
  }

  //to get a particular post
  async getPost(slug) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
      return true;
    } catch (err) {
      console.log(`Appwrite service :: getPost :: error ${err}`);
      return false;
    }
  }

  //get all posts whose status is active (to apply queries, we have to create indexes)
  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        queries
      );
      return true;
    } catch (err) {
      console.log(`Appwrite service :: getPosts :: error ${err}`);
      return false;
    }
  }

  //file upload service

  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file
      );
    } catch (err) {
      console.log(`Appwrite service :: uploadFile :: error ${err}`);
    }
  }

  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
      return true
    } catch (err) {
      console.log(`Appwrite service :: deleteFile :: error ${err}`);
      return false
    }
  }

  getFilePreview(fileId) {
    return this.bucket.getFilePreview(
        conf.appwriteBucketId,
        fileId,
    )
  }
}

const service = new Service();

export default service;
```

## 13. Create a store in src > store > store.js and add the reducer to it

```
import {configureStore} from '@reduxjs/toolkit'

//creating a store
const store = configureStore({
    reducer: {}
})

export default store
```

## 14. create slice to track authentication of user, we will ask is user authenticated or not from store. src > store > authSlice.js

```
import { createSlice } from "@reduxjs/toolkit";

//initial state of slice
const initialState = {
  status: false,
  userData: null,
};

//creating slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    //actions of reducers
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload.userData;
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
    },
  },
});

//exporting actions of reducers
export const { login, logout } = authSlice.actions;

//exporting reducers
export default authSlice.reducer;
```

this was our work on store

Now, we will create components

## 15. Create folder src > components > Header > Header.jsx :

```
import React from 'react'

function Header() {
    return (
        <div>Header</div>
    )
}

export default Header
```

  Create File src > components > Footer > Footer.jsx :

```
import React from 'react'

function Footer() {
    return (
        <div>Footer</div>
    )
}

export default Footer
```

Create file src > components > index.js for exporting all the components :

```
import Header from './Header/Header'
import Footer from './Footer/Footer'

export {Header, Footer}
```

## 16. update the App.jsx :

```
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import {Header, Footer} from './components'

function App() {
  //loading state
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // when our app is called this function is called
  useEffect(() => {
    //getting the current user
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          //if .getCurrentUser exists then call login with userData
          dispatch(login({ userData }));
        } else {
          //if .getCurrentUser does not exists then call logout
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  });

  //conditional rendering
  return !loading ? (
    <div className="min-h-screen flex flex-wrap content-between bg-gray-400">
      <div className='w-full block'>
        <Header />
        <main>
          //outlet
        </main>
        <Footer />
      </div>
    </div>
  ) : null;
}

export default App;
```

## 17. setting up provider in main.jsx :

```
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from 'react-redux'
import store from './store/store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </StrictMode>,
)
```

## 18. Create file src > components > container > Container.jsx :

```
import React from 'react'

function Container({children}) {
    return <div className='w-full max-w-7xl mx-auto px-4'>{children}</div>;
}

export default Container
```

## 19. Modify src > components > Footer > Footer.jsx :

```
import React from "react";
import {Link} from 'react-router-dom'
import Logo from '../Logo'  

function Footer() {
  return (
    <section className="relative overflow-hidden py-10 bg-gray-400 border border-t-2 border-t-black">
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div className="-m-6 flex flex-wrap">
          <div className="w-full p-6 md:w-1/2 lg:w-5/12">
            <div className="flex h-full flex-col justify-between">
              <div className="mb-4 inline-flex items-center">
                <Logo width="100px" />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  &copy; Copyright 2023. All Rights Reserved by DevUI.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full p-6 md:w-1/2 lg:w-2/12">
            <div className="h-full">
              <h3 className="tracking-px mb-9  text-xs font-semibold uppercase text-gray-500">
                Company
              </h3>
              <ul>
                <li className="mb-4">
                  <Link
                    className=" text-base font-medium text-gray-900 hover:text-gray-700"
                    to="/"
                  >
                    Features
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className=" text-base font-medium text-gray-900 hover:text-gray-700"
                    to="/"
                  >
                    Pricing
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className=" text-base font-medium text-gray-900 hover:text-gray-700"
                    to="/"
                  >
                    Affiliate Program
                  </Link>
                </li>
                <li>
                  <Link
                    className=" text-base font-medium text-gray-900 hover:text-gray-700"
                    to="/"
                  >
                    Press Kit
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full p-6 md:w-1/2 lg:w-2/12">
            <div className="h-full">
              <h3 className="tracking-px mb-9  text-xs font-semibold uppercase text-gray-500">
                Support
              </h3>
              <ul>
                <li className="mb-4">
                  <Link
                    className=" text-base font-medium text-gray-900 hover:text-gray-700"
                    to="/"
                  >
                    Account
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className=" text-base font-medium text-gray-900 hover:text-gray-700"
                    to="/"
                  >
                    Help
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className=" text-base font-medium text-gray-900 hover:text-gray-700"
                    to="/"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    className=" text-base font-medium text-gray-900 hover:text-gray-700"
                    to="/"
                  >
                    Customer Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full p-6 md:w-1/2 lg:w-3/12">
            <div className="h-full">
              <h3 className="tracking-px mb-9  text-xs font-semibold uppercase text-gray-500">
                Legals
              </h3>
              <ul>
                <li className="mb-4">
                  <Link
                    className=" text-base font-medium text-gray-900 hover:text-gray-700"
                    to="/"
                  >
                    Terms &amp; Conditions
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className=" text-base font-medium text-gray-900 hover:text-gray-700"
                    to="/"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    className=" text-base font-medium text-gray-900 hover:text-gray-700"
                    to="/"
                  >
                    Licensing
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Footer;
```

## 20. Create src > components > Logo.jsx :

```
import React from 'react'

function Logo({width = '100px'}) {
    return (
        <div>Logo</div>
    )
}

export default Logo
```

## 21. Create file src > components > Header > LogoutBtn.jsx :

```
import React from "react";
import { useDispatch } from "react-redux";
import authService from "../../appwrite/auth.js";
//import logout from authSlice.js
import { logout } from "../../store/authSlice.js";

function LogoutBtn() {
  const dispatch = useDispatch();
  const logoutHandler = () => {
    //returns a promise
    authService.logout().then(() => {
      //update the important information in store
      dispatch(logout());
    });
  };
  return (
    <button className="inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full">
      Logout
    </button>
  );
}

export default LogoutBtn;
```

## 22. Update the Header.jsx :

```
import React from "react";
import { Container, Logo, LogoutBtn } from "../index";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux"; //used to see in store if user is logged in or not
import { useNavigate } from "react-router-dom";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ];
  return (
    <header className="py-3 shadow bg-gray-500">
      <Container>
        <nav className="flex">
          <div className="mr-4">
            <Link to="/">
              <Logo width="70px" />
            </Link>
          </div>
          <ul>
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button onClick={() => navigate(item.slug)} className='inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'>
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
            //if authStatus is true then only the logout button will be visible
            {authStatus && (
                <li>
                    <LogoutBtn />
                </li>
            )
            }
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
```

## 23. Create a file components > Button.jsx :

```
import React from 'react'

function Button({
    children,
    type = "button",
    bgColor = "bg-blue-600",
    textColor = "text-white",
    className = "",
    //spreading additional properties provided by the user
    ...props
}) {
    return (
        <button className={`px-4 py-2 rounded-lg ${bgColor} ${textColor} ${className}`} {...props}>
            {children}
        </button>
    )
}

export default Button;
```

## 24. Create file components > Input.jsx :

```
import React, { useId } from "react";

const Input = React.forwardRef(function Input(
  { label, type = "text", className = "", ...props },
  ref
) {
    //generate unique id 
  const id = useId();

  return (
    <div className="w-full">
        //if label is provided by the user then display the label by creating it
      {label && (
        <label className="inline-block mb-1 pl-1" htmlFor={id}>
          {label}
        </label>    
      )}
      <input
      type = {type}
      className = {`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`} 
      //this gives us reference of parent component, for this we used forwardRef. reference will be passed from user from component and access of state will be taken from here, doing this input values will be taken 
      ref={ref}
      {...props}
      id={id} //id of label and its corresponding input is the same
      />
    </div>
  );
});

export default Input;
```

## 25. create file components > Select.jsx :

```
import React, {useId} from 'react'

function Select({
    label,
    options,
    className = "",
    ...props
}, ref) {
    const id = useId()
    return (
        <div className = 'w-full'>
            {label && <label htmlFor={id} className=''></label>}
            <select
            {...props}
            id={id}
            ref={ref}
            className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
            >
                //options are in array, if array contains values then only apply the map method 
                {options?.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    )
}

//as we hadn't forwarded the reference above so we do :
export default React.forwardRef(Select)
```

## 26. create file components > PostCard.jsx :

```
import React from "react";
//importing as it is not available in the state
import appwriteService from "../appwrite/config";
//we imported appwriteService because we have to apply query and service will apply the query. if it was in state, then we can use redux and can take information from state
import { Link } from "react-router-dom";

//$id is appwrite syntax, //featuredImage is file id of image
function PostCard({ $id, title, featuredImage }) {
  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full bg-gray-100 rounded-xl p-4">
        <div className="w-full justify-center mb-4">
          <img
            src={appwriteService.getFilePreview(featuredImage)}
            alt={title}
            className="rounded-xl"
          />
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
    </Link>
  );
}

export default PostCard;
```

Now, we will work with login component

## 27. create file in src > components > Login.jsx :

```
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { Button, Input, Logo } from "./index";
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import { useForm } from "react-hook-form";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //react hook form
  const { register, handleSubmit } = useForm();
  //to display errors
  const [error, setError] = useState("");

  //handleSubmit
  const login = async (data) => {
    //empty the error
    setError("");
    try {
      //if session exist then user is logged in
      const session = await authService.login(data);
      //getting userData from getCurrentUser method, not from session
      if (session) {
        const userData = await authService.getCurrentUser();
        //if userData exists then dispatch it to authLogin
        if (userData) dispatch(authLogin(userData));
        //if logged in then navigate the user to route
        navigate("/");
      }
    } catch (err) {
      //if session does not exist then user is not logged in
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
        <p className="mt-2 text-center text-base text-black/60">
            Don&apos;t have any account?&nbsp;
            <Link
            to = "/signup"
            className="font-medium text-primary transition-all duration-200 hover:underline"
            >
                Sign Up
            </Link>
        </p>
        //error display
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        //handleSubmit is a keyword, event & method from useForm 
        <form onSubmit={handleSubmit(login)} className="mt-8">
            <div className="space-y-5">
                //Input for email
                <Input 
                label = "Email: "
                placeholder = "Enter your email"
                type = "email"
                //as we are using react hook form so we have to spread its register
                //here, email is key
                //the object is used to pass the options 
                {...register("email", {
                    required: true,
                    validate: {
                        //regexr for regular expression pattern
                        matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || 
                        "Email address must be a valid address"
                    }
                })}
                />
                //Input for password
                <Input 
                label = "Password: "
                type = "password"
                placeholder = "Enter your password"
                {...register("password", {
                    required: true,
                })}
                />
                <Button
                type = "submit"
                className = "w-full"
                >Sign In</Button>
            </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
```

## 28. create file in src > components > Signup.jsx :

```
import React, { useState } from "react";
import authService from "../appwrite/auth";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { Button, Input, Logo } from "./index";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const create = async (data) => {
    setError("");
    try {
      const userData = await authService.createAccount(data);
      if (userData) {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(login(userData));
        navigate("/");
      }
    } catch (error) {}
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign up to create your account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        <form onSubmit={handleSubmit(create)}>
          <div className="space-y-5">
            <Input
              label="Full Name:"
              placeholder="Enter your full name"
              {...register("name", {
                required: true,
              })}
            />
            <Input
              label="Email: "
              placeholder="Enter your email"
              type="email"
              //as we are using react hook form so we have to spread its register
              //here, email is key
              //the object is used to pass the options
              {...register("email", {
                required: true,
                validate: {
                  //regexr for regular expression pattern
                  matchPattern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />
            <Input
              label="Password: "
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: true,
              })}
            />
            <Button type="submit" className="w-full">
              Create Accout
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
```

## 29. Create file in src > components > AuthLayout.jsx :

```
//Authentication Layout - it is a mechanism of protecting pages or routes 

import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

// we will conditionally render that to render its children or not
export default function Protected({children, authentication = true}) {

    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    //asking to authStatus(store) that you are logged in or not
    const authStatus = useSelector(state => state.auth.status)

    //useEffect tells us that we have to send to login, home and check according to field change or not
    useEffect(() => {
        if(authentication && authStatus !== authentication) {
            navigate('/login')
        } else if(!authentication && authStatus !== authentication) {
            navigate("/")
        }
        setLoader(false)
    }, [authStatus, navigate, authentication])
    
    return loader ? <h1>Loading...</h1> : <>{children}</>
}
```

## 30. Create file in src > components > RTE.jsx :

```
import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";

//control comes from react-hook-form and it is responsible for taking its all states in that form (from component to form), we will pass this control when we will use this RTE there
//this control passes this component's control to whom who calls it   
export default function RTE({name, control, label, defaultValue = ""}) {
  return (
    <div className="w-full">
        {label && <label className="inline-block mb-1 pl-1">{label}</label>}
         //Controller passes this component's control to whom who calls it   
        <Controller 
        name={name || "content"}
        //passing control to the parent element so it can take control of it
        control={control}
        //rendering elements 
        render={({field: {onChange}}) => (
            <Editor
            initialValue = {defaultValue}
            init={{
                initialValue: defaultValue,
                height: 500,
                menubar: true,
                plugins: [
                    "image", "advlist", "autolink", "lists", "link", "image", "charmap", "preview", "anchor", "searchreplace", "visualblocks", "code", "fullscreen", "insertdatetime", "media", "table", "code", "help", "wordcount", "anchor",
                ],
                toolbar:
                    "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                    content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
            onEditorChange={onChange}
             />
        )}
        />
    </div>
  )
}
```

## 31. Create a file in src > components > post-form > PostForm.jsx :

```
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "../index";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

//watch = used to monitor a field continuously
//setValue = used to set a value in a form because we are using react-hook-form
//control = used to get control of a form. we will pass this control as it is in RTE, then we will get control of RTE here
//getValues = used to grab values of form
function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });

  const navigate = useNavigate();
  //getting userData from state
  const userData = useSelector((state) => state.user.userData);

  const submit = async (data) => {
    //if post already exists then we update it
    if (post) {
      const file = data.image[0]
        ? appwriteService.uploadFile(data.image[0])
        : null;

      //if we have uploaded the image then delete the previously posted post image
      if (file) {
        appwriteService.deleteFile(post.featuredImage);
      }
      //updating the changes of the post
      const dbPost = await appwriteService.updatePost(post.$id, {
        ...data,
        featuredImage: file ? file.$id : undefined,
      });
      //navigating the user to the updated post
      if (dbPost) {
        navigate(`/post/${dbPost.$id}`);
      }
    } else {
      //if there is no existing post then we create a new post
      //uploading the image
      const file = await appwriteService.uploadFile(data.image[0]);

      if (file) {
        const fileId = file.$id;
        data.featuredImage = fileId;
        //creating the post
        const dbPost = await appwriteService.createPost({
          ...data,
          userId: userData.$id,
        });
        //navigating the user to the created post
        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      }
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      //replace(/^[a-zA-Z\d\s]+/g, '-') it does not matches alphabets, numbers and spaces and replaces else content with "-"
      //replace(/\s/g, '-') it replaces all the spaces globally with "-"
      return value
        .trim()
        .toLowerCase()
        .replace(/^[a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");
    //if there is nothing in the value
    return "";
  }, []);

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title, { shouldValidate: true }));
      }
    });

    //optimization
    return () => {
      subscription.unsubscribe();
    };
  }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />
        {post && (
          <div className="w-full mb-4">
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default PostForm;
```

## 32. Create file in src > pages > Signup.jsx :

```
import React from "react";
import { Signup as SignupComponent } from "../components";

function Signup() {
  return (
    <div className="py-8">
      <SignupComponent />
    </div>
  );
}

export default Signup;
```

## 33. Create file in src > pages > Login.jsx :

```
import React from "react";
import { Login as loginComponent } from "../components";

function Login() {
  return (
    <div className="py-8">
      <loginComponent />
    </div>
  );
}

export default Login;
```

## 34. Create file in src > pages > AddPost.jsx :

```
import React from "react";
import { Container, PostForm } from "../components";

function AddPost() {
  return (
    <div className="py-8">
      <Container>
        <PostForm />
      </Container>
    </div>
  );
}

export default AddPost;
```

## 34. Create file in src > pages > AllPosts.jsx :

```
import React, { useState, useEffect } from "react";
import { Container, PostCard } from "../components";
import appwriteService from "../appwrite/config";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {}, []);
  appwriteService.getPosts([]).then((posts) => {
    if(posts) {
        setPosts(posts.documents)
    }
  });

  return (
    <div className = "w-full py-8">
        <Container>
            <div className = "flex flex-wrap">
                {posts.map((post) => (
                    <div key={post.$id} className="p-2 w-1/4">
                        <PostCard post={post}/>
                    </div>
                ))}
            </div>
        </Container>
    </div>
  )
}

export default AllPosts;
```

 ## 35. Create file in src > pages > EditPost.jsx :

 ```
 import React, { useEffect, useState } from "react";
import { Container, PostForm } from "../components";
import appwriteService from "../appwrite/config";
import {useNavigate, useParams} from 'react-router-dom'

function EditPost() {
    const [post, setPost] = useState([])
    //getting slug value from url
    const {} = useParams()
    const navigate = useNavigate()

    //if slug changes then bring the data value
    useEffect(() => {
        if(slug) {
            appwriteService.getPost(slug).then((post) => {
                if(post) {
                    setPost(post)
                }
            })
        } else {
            navigate('/')
        }
    }, [slug, navigate])
  return post ? (
    <div className = "py-8">
        <Container>
            <PostForm post={post}/>
        </Container>
    </div>
  ) : null
}

export default EditPost;
```

## 36. Create file in src > pages > Home.jsx :

```
import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../components";
import appwriteService from "../appwrite/config";

function Home() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        appwriteService.getPosts().then((posts) => {
            if(posts) {
                setPosts(posts.documents)
            }
        })
    }, [])
  
    if(posts.length === 0) {
        return (
            <div className = "w-full py-8 mt-4 text-center">
                <Container>
                    <div className = "flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                Login to read posts
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className="w-full py-8">
            <Container>
                <div className="flex flex-wrap">
                    {posts.map((post) => (
                        <div key={post.$id} className="p-2 w-1/4">
                            <PostCard {...post}/>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home;
```

## 37. Create file in src > pages > Post.jsx :

```
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);

  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        if (post) setPost(post);
        else navigate("/");
      });
    } else navigate("/");
  }, [slug, navigate]);

  const deletePost = () => {
    appwriteService.deletePost(post.$id).then((status) => {
      if (status) {
        appwriteService.deleteFile(post.featuredImage);
        navigate("/");
      }
    });
  };

  return post ? (
    <div className="py-8">
      <Container>
        <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
          <img
            src={appwriteService.getFilePreview(post.featuredImage)}
            alt={post.title}
            className="rounded-xl"
          />

          {isAuthor && (
            <div className="absolute right-6 top-6">
              <Link to={`/edit-post/${post.$id}`}>
                <Button bgColor="bg-green-500" className="mr-3">
                  Edit
                </Button>
              </Link>
              <Button bgColor="bg-red-500" onClick={deletePost}>
                Delete
              </Button>
            </div>
          )}
        </div>
        <div className="w-full mb-6">
          <h1 className="text-2xl font-bold">{post.title}</h1>
        </div>
        <div className="browser-css">{parse(post.content)}</div>
      </Container>
    </div>
  ) : null;
}
```

# Now we will do the process of routing 

## Update the main.jsx :

```
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { AuthLayout, Login } from "./components";
import AddPost from "./pages/AddPost";
import EditPost from "./pages/EditPost";
import AllPosts from "./pages/AllPosts";
import Signup from "./pages/Signup";
import Post from "./pages/Post";
import Home from './pages/Home'
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    //root
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        ),
      },
      {
        path: "/all-posts",
        element: (
          <AuthLayout authentication>
            {" "}
            <AllPosts />
          </AuthLayout>
        ),
      },
      {
        path: "/add-post",
        element: (
          <AuthLayout authentication>
            {" "}
            <AddPost />
          </AuthLayout>
        ),
      },
      {
        path: "/edit-post/:slug",
        element: (
          <AuthLayout authentication>
            {" "}
            <EditPost />
          </AuthLayout>
        ),
      },
      {
        path: "/post/:slug",
        element: <Post />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
```