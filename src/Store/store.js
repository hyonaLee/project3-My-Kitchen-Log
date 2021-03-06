import { makeObservable, observable, action, computed, toJS } from "mobx";
import axios from "axios";

class store {
  blogData = [];

  constructor() {
    makeObservable(this, {
      blogData: observable,

      LoadData: action,
      AddData: action,
      EditData: action,
      DeleteData: action,

      getBlogData: computed,
    });
  }

  LoadData = (useremail) => {
    axios
      .post("api/upload/getpost", {
        email: useremail,
      })
      .then((response) => {
        this.blogData = response.data.userInfo.posts;
      })
      .catch((err) => {
        console.log("Load실패", err);
      });
  };
  get getBlogData() {
    return this.blogData;
  }

  AddData = (data) => {
    console.log("AddData로 들어온 data", data);
    axios
      .post("http://localhost:5000/api/upload/addpost", {
        ...data,
      })
      .then(function (response) {
        console.log("Add성공", response);
        console.log("AddData", response.data);
        return (this.blogData = response.data.userInfo.posts);
      })
      .catch(function (error) {
        console.log("Add실패", error);
      });
  };

  EditData = (currentid, useremail, data) => {
    console.log("EditData로 들어온 data", data);
    console.log("EditData로 들어온 currentid", currentid);
    axios
      .put(`http://localhost:5000/api/upload/updatepost`, {
        postid: currentid,
        email: useremail,
        ...data,
      })
      .then(function (response) {
        console.log("수정성공", response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  DeleteData = (currentid, useremail) => {
    console.log("DeleteData로 들어온 currentid", currentid);
    axios
      .put(`http://localhost:5000/api/upload/delpost`, {
        postid: currentid,
        email: useremail,
      })
      .then((response) => {
        console.log("Delete완료", response);
      })
      .catch(function (error) {
        console.log("Delete실패", error);
      });
  };
}
const myStore = new store();

export default myStore;
