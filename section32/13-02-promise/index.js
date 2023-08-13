const fetchData = async() => {
  //! API 보내기 요청

 const result = await new Promise((resolve,reject)=>{

        try{
            console.log("이미지 받아왔다~")
            resolve("강아지.jpg");
        } catch(err){
            reject("실패샜습니다.")
        }
    })
    

    console.log(result);
 

  console.log("받아온 강아지.jpg 브라우저 전달");
};

fetchData();
