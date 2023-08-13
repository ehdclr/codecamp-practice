interface IProfile{
    name : string
    age: number
    school : string;
    hobby? : string;
}

//! Partial 타입
type aaa = Partial<IProfile>;

//! Required 타입
type bbb = Required<IProfile>


//! Pick 타입
type ccc = Pick<IProfile, "name" | "age">;

//! Omit 타입 

type ddd = Omit<IProfile, "school">


//!Record 타입
type eee = "철수" |"영희" | "훈이" //!Union타입  
let child1 : eee = "철수"; //!철수 영희 훈이만 됨
let child2 : string = "사과" //! 모두 다 됨 ! 

type fff = Record<eee,number>; //!각각의 레코드에 넘버타입을 붙여줌 


//!6. 객체의 key들로 유니온 타입만들기 
type ggg = keyof IProfile; // !키가 나열된다.  
let myprofile : ggg = "hobby";


//!7. type과 interface의 차이 -> 인터페이스는 선언 병합 가능
interface IProfile {
    candy : number; //!선언 병합으로 추가됨
}


let profile : Partial<IProfile>= {
    candy: 10
}