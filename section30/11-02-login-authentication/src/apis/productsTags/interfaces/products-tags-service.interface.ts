export interface IProductsTagsServiceBulkInsert {
  names: {
    name: string;
  }[];
}

export interface IProductTagsServiceFindByNames {
  tagNames: string[];
}
