import styled from "styled-components";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import React, { useState } from "react";
import useLoad from "../../Hooks/useLoad";

// 미완성.
// 재료부분 해쉬로 추가 기능.
// 재료 기준으로 검색 기능 구현.
// 사진 업로드 기능.
// 수정버튼 눌른후 아무작업안하고 post 누르면 다 날아가는 오류.

function Edit() {

      // 이미지 업로드
const [loadfile, setLoadfile] = useState();
const [currentURL, setCurrentURL] = useState();



// (GET) serer로부터 data 불러오기
  const blogData = useLoad()
// Click한 ID정보 받아오기
  const currentid = Number(useParams().id);
  // console.log("클릭한 게시물의 ID는", currentid);
  const postFilter = blogData.filter((value) => {
    // console.log("postFilter: ", value);
    return value.id === Number(currentid);
  });
  // console.log("postFilter", postFilter);

// 날짜정보얻기
  const currentDate = new Date();
  const cYear = currentDate.getFullYear();
  const cMonth = currentDate.getMonth() + 1;
  const cDate = currentDate.getDate();
  const cHour = currentDate.getHours();
  const cMin = currentDate.getMinutes();
  const editTime = `${cYear}년 ${cMonth}월 ${cDate}일 ${cHour}시 ${cMin}분`;

// Post 수정하기
  const currentTitle = postFilter.length !== 0 && postFilter[0].title;
  const currentTag = postFilter.length !== 0 && postFilter[0].tag;
  const currentContents = postFilter.length !== 0 && postFilter[0].contents;
  const [modititle, setModititle] = useState(currentTitle);
  const [moditag, setModitag] = useState(currentTag);
  const [modicontents, setModicontents] = useState(currentContents);
  const [modiURL, setModiURL] = useState(currentURL);
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
    setModiURL(event.target.value);
    setLoadfile(URL.createObjectURL(event.target.files[0]))
    let fileReader = new FileReader();
    fileReader.readAsDataURL(event.target.files[0])
    fileReader.onload = function (event) {
      setCurrentURL(event.target.result)
  }
  };
  console.log(modititle);
  console.log(moditag);
  console.log(modicontents);
  console.log(modiURL);

// (PUT/PATCH) server로 data 수정 요청 /
  const modifiyData = () => {
    axios
      .patch(`http://localhost:3001/posts/${currentid}`, {
        date: editTime,
        title: modititle === false ? currentTitle : modititle,
        tag: moditag === false ? currentTag : moditag,
        contents: modicontents === false ? currentContents : modicontents,
        imgURL: modiURL === undefined ? currentURL : modiURL,
      })
      .then(function (response) {
        console.log("수정성공", response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    postFilter.length !== 0 && (
      // 수정
      <WriteDiv>
        <Title name="title" onChange={EditTitle}>
          {currentTitle}
        </Title>
        <Tag
        name="tag" onChange={EditTag}>
          {currentTag}
        </Tag> 
        <Contents name="contents" onChange={EditContents}>
          {currentContents}
        </Contents>
        <BtnDiv>
      <img src={loadfile} alt="Blob URL" width="100px" />
        <input type="file" accept="image/*" onChange={EditURL}/>
        <Link to="/">
          <CreateBtn onClick={modifiyData}>Post</CreateBtn>
        </Link>
      </BtnDiv>
      </WriteDiv>
    )
  );
}

const WriteDiv = styled.div`
  width: 100%;
  height: 640px;
  position: relative;
  top: 80px;
  background-color: ivory;
  color: black;
  display: flex;
  flex-direction: column;
`;
const CreateBtn = styled.button`
  border-radius: 14px;
  background-color: orange;
  color: white;
  border: none;
  height: 30px;
  width: 65px;
  font-size: 24px;
  line-height: 20px;
  padding: 0px 10px 0px 10px;
  margin-right: 50px;
  margin-bottom: 10px;
  cursor: pointer;
`;
const Title = styled.textarea`
  width: 80%;
  padding: 20px;
  margin: auto;
  margin-top: 30px;
  height: 75px;
  border: none;
  font-size: 25px;
  background-color: ivory;
`;
const Tag = styled.textarea`
  width: 80%;
  padding: 20px;
  margin: auto;
  margin-top: 30px;
  height: 75px;
  border: none;
  font-size: 25px;
  background-color: ivory;
`;
const Contents = styled.textarea`
  width: 80%;
  padding: 20px;
  margin: auto;
  margin-top: 30px;
  margin-bottom: 30px;
  height: 600px;
  border: none;
  font-size: 25px;
  background-color: ivory;
`;
const BtnDiv = styled.div`
  text-align: right;
`;

export default Edit;
