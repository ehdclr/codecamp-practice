//1.한개 테스트하기
it('더하기 테스트', () => {
  const a = 1;
  const b = 2;

  expect(a + b).toBe(3);
});

//2.그룹 단위로 테스트(여러 개 묶음으로 테스트)
describe('나의 테스트 그룹', () => {
  it('더하기 테스트', () => {
    const a = 1;
    const b = 2;

    expect(a + b).toBe(3);
  });

  it('곱하기 테스트', () => {
    const a = 1;
    const b = 2;

    expect(a * b).toBe(2);
  });
});

//3. 상품 구매하기 테스트 예제
describe('상품 구매 테스트', () => {
  
  // //모든 것 하기 전에 한번 실행
  // beforeAll(()=>{

  // })

  // //각각 테스트하기 전에 실행
  // berforeEach(()=>{

  // })


  it('돈 검증하기', () => {
    const result = true; // 돈이 충분하다고 가정하기
    expect(result).toBe(true);
  });

  it('상품 구매하기', () => {
    const result = true; //상품을 구매했다고 가정하기
    expect(result).toBe(true);
  });
});
