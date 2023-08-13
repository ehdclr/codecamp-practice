import express from "express";

import { ProductController } from "./mvc/controllers/product.controller";
import {CouponController} from "./mvc/controllers/coupon.controller";
import { ProductService } from "./mvc/controllers/services/product.service";
import {CashService} from "./mvc/controllers/services/cash.service";
import {PointService} from "./mvc/controllers/services/point.service";


const app = express();
                                            //의존성 주입으로 발생하는 장점 
const productService = new ProductService() ; //1. new 한번으로 모든 곳에서 재사용 
const cashService = new CashService();       // 2.의존성 주입으로인해 한꺼번에 변경 가능 
const pointService = new PointService();     // 3.의존성 주입으로인해 쿠폰 구매 방식이 포인트 결제로 변경됨 

                                             //!부가 설명 
                                             // 1.ProductContoller가 CashService에 의존하고 있음 (의존성 주입 전)
                                             // => 이 상황을 "깅하게 결합되어있다"라고 표현
                                             // => tight-coupling   


                                             // 2. 이를 개선하기 위해서 "느슨한 결합"으로 변경할 필요가 있음
                                             // => loose-coupling
                                             // => 이를 "의존성 주입으로 해결"(의존성 주입 : Dependency Injection 줄여서 DI)
                                            // => 이 역할을 대신해주는 Nestjs의 도구 : IoC 컨테이너(기능이 내장되어 있음 -->얘가 알아서 new해서 넣어주는 애 , DI 해줌) 
                                            // => IoC : Inversion of Control

                                            //3. "의존성 주입"으로 싱글톤 패턴 구현 가능해짐
                                            //  => "의존성 주입"이면 , "싱글톤 패턴"인가? 그건아님 
                                            



const productController = new ProductController(cashService,productService);

//상품 구매하기 API
app.post('/products/buy',productController.buyProduct)

//상품 환불하기 API
app.post("/products/refund",productController.refundProduct)

//쿠폰 (상품권) API 
const couponController = new CouponController(pointService);
app.post("/coupons/buy",couponController.buyCoupon) //상품권을 돈주고 구매하는 API

//게시판 API
//app.get("/boards/...");

app.listen(3000);