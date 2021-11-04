import { Link, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import store from "../../../Store/store";
import { observer } from "mobx-react";

function Edit() {
  // (GET) serer로부터 data 불러오기
  useEffect(() => {
    store.LoadData();
  }, []);
  // console.log(store.getBlogData)

  // Click한 ID정보 받아오기
  const currentid = Number(useParams().id);
  // console.log("클릭한 게시물의 ID는", currentid);
  const postFilter = store.getBlogData.filter((value) => {
    // console.log("postFilter: ", value);
    return value.id === Number(currentid);
  });

  // 날짜정보얻기
  const currentDate = new Date();
  const cYear = currentDate.getFullYear();
  const cMonth = currentDate.getMonth() + 1;
  const cDate = currentDate.getDate();
  const cHour = currentDate.getHours();
  const cMin = currentDate.getMinutes();
  const editTime = `${cYear}년 ${cMonth}월 ${cDate}일 ${cHour}시 ${cMin}분`;

  // Post 수정하기
  const [loadfile, setLoadfile] = useState();
  const [currentURL, setCurrentURL] = useState();
  const currentTitle = postFilter.length !== 0 && postFilter[0].title;
  const currentTag = postFilter.length !== 0 && postFilter[0].tag;
  const currentContents = postFilter.length !== 0 && postFilter[0].contents;
  const [modititle, setModititle] = useState(currentTitle);
  const [moditag, setModitag] = useState(currentTag);
  const [modicontents, setModicontents] = useState(currentContents);
  const [modiURL, setModiURL] = useState(currentURL);

  // user가 작성한 input 받아오기
  const EditTitle = (event) => {
    setModititle(event.target.value);
  };
  const EditTag = (event) => {
    setModitag(event.target.value);
  };
  const EditContents = (event) => {
    setModicontents(event.target.value);
  };
  const EditURL = (event) => {
    setLoadfile(URL.createObjectURL(event.target.files[0]));
    let fileReader = new FileReader();
    fileReader.readAsDataURL(event.target.files[0]);
    fileReader.onload = function (event) {
      setCurrentURL(event.target.result);
      setModiURL(event.target.value);
    };
  };

  // 해시태그 기능
  const [tagList, setTagList] = useState([]);
  const Keypress = (e) => {
    if (e.key === "Enter" || e.code === "Space") {
      setTagList((tagList) => [...tagList, moditag]);
      setModitag("");
      e.preventDefault();
    }
    console.log("태그리스트", tagList);
  };

  // (PUT/PATCH) server로 data 수정 요청
  const modifiyData = () => {
    const mappingData = {
      date: editTime,
      title: modititle === false ? currentTitle : modititle,
      tag: tagList.length === 0 ? currentTag : tagList,
      contents: modicontents === false ? currentContents : modicontents,
      imgURL: modiURL === undefined ? currentURL : modiURL,
    };
    store.EditData(currentid, mappingData);
  };

  return (
    postFilter.length !== 0 && (
      // 수정
      <div className="EditDiv">
        <textarea className="EditTitle" name="title" onChange={EditTitle}>
          {currentTitle}
        </textarea>
        <div className="EditTagDiv">
          <textarea className="EditTag" name="tag" onChange={EditTag} onKeyPress={Keypress}>
            {moditag === false ? currentTag : moditag}
          </textarea>
          <div className="EditTagShowDiv">
            {tagList.length !== 0 &&
              tagList.map((v, i) => {
                return <span className="hash">#{tagList[i]} </span>;
              })}
          </div>
        </div>
        <textarea className="EditContents" name="contents" onChange={EditContents}>
          {currentContents}
        </textarea>
        <div className="EditBtnDiv">
          <img src={loadfile} alt="Img URL" width="100px" />
          <input type="file" accept="image/*" onChange={EditURL} />
          <Link to="/">
            <button className="EditBtn" onClick={modifiyData}>Post</button>
          </Link>
        </div>
      </div>
    )
  );
}

export default observer(Edit);