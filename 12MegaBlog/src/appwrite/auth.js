import conf from "../conf/conf.js";
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
