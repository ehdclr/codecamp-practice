import axios  from "axios";

 axios.get("https://koreanjson.com/posts/gfdjgdsfkdsa/123123")
    .then((data)=>{
        console.log(data.data);
    })
    .catch((err)=>
    console.log(err));

