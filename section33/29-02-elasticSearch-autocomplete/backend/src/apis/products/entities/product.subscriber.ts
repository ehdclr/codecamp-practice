import {
  EntitySubscriberInterface,
  EventSubscriber,
  DataSource,
  InsertEvent,
} from 'typeorm';
import { Product } from './product.entity';

@EventSubscriber() //Subscriber인것을 알려주는 데코레이터
export class ProductSubscriber implements EntitySubscriberInterface {
  constructor(datasource: DataSource) {
    datasource.subscribers.push(this); //class에서 자기자신은 this
  }

  listenTo() {
    //누구를 구독할 것인가
    return Product;
  }

  afterInsert(event: InsertEvent<any>): void | Promise<any> {
    console.log(event); //event는 등록한 내용들이 들어옴 

    const id = event.entity.id
    const name = event.entity.name
    const description = event.entity.description
    const price = event.entity.price;
    const isSoldout = event.entity.isSoldout;


    console.log(id,name,description,price,isSoldout);
  }


 
}
