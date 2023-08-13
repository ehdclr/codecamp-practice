//! 타입추론 
let aaa = "안녕하세요";
aaa =3;


//!타입 명시
let bbb : string = "반갑습니다.";
bbb =10


//!유니온 타입 (타입 명시가 필요한 상황 )
let ccc : (number | string) = 1000;
ccc = "1000원"

let eee : boolean = true;
eee = false;
eee = "false";

//!배열타입
let fff :number[] = [1,2,3,4,5];

let hhh = ["철수","영희","훈이",10];