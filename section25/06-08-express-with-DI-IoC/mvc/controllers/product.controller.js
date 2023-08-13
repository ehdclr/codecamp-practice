

export class ProductController {

    cashService;
    productService;
    constructor(qqq,aaa){
        this.cashService = qqq;
        this.productService =aaa;
    }

    buyProduct = (req,res)=>{
        //1. 가진돈 검증하는 코드(대략 10줄)
        
        const hasMoney = this.cashService.checkValue();
        
    
        //2. 판매 여부를 검증하는 코드
        // const productService = new ProductService();
        const isSoldout =this.productService.checkSoldout();
        
    
        //3. 상품 구매하는 코드 
        if(hasMoney && !isSoldout){
            res.send("상품 구매 완료 ")
        }

    }

    refundProduct = (req,res)=>{
        //1. 판매여부 검증하는 코드(대략 10줄)
        // const productService = new ProductService();
        const isSoldout = this.productService.checkSoldout();
        
    
        //2.상품 환불하는 코드
        if(isSoldout){
            res.send("상품 환불 완료!!")
        }
    }
}