function checkSecNum(secNum) {
  let juminRule =
    /^(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))-[1-4][0-9]{6}$/;
  let [firstNum, secondNum] = secNum.split("-");
  if (!juminRule.test(secNum)) {
    console.log("에러 발생!!! 형식이 올바르지 않습니다!!!");
    return false;
  }

  if (firstNum.length !== 6 && secondNum.length) {
    console.log("에러 발생!!! 개수를 제대로 입력해주세요!!!");
    return false;
  }

  return true;
}

function printResult(Num) {
  const maskingIdNum = Num.replace(/-/g, "").replace(
    /(\d{6})(\d{1})(\d{6})/,
    "$1-$2*******"
  );
  console.log(maskingIdNum);
}

function customRegistrationNumber(secNum) {
  if(checkSecNum(secNum)){
    printResult(secNum);
  };
  
}

customRegistrationNumber("210510101010101");
