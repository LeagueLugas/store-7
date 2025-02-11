import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { ProductService } from "../application/product-service";
import { ProductElementResponse } from "../dto/product-element-response";
import { QuestionResponse } from "@/product/dto/question-response";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { ProductUploadRequest } from "@/product/dto/product-upload-request";
import { SearchService } from "../application/search-service";
import {
  ProductFindQuery,
  ProductSearchQuery,
} from "../dto/product-find-query";
import { ProductReviewsQuery } from "../dto/product-request";
import { Review } from "../entity/review";
import { ReviewRate } from "../dto/review-rate";

@Controller("/products")
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly searchService: SearchService
  ) {}

  @Get()
  async getProducts(
    @Query() query: ProductFindQuery,
    @Body("userId") userId: number
  ): Promise<ProductElementResponse[]> {
    const result = await this.productService.getProducts(query, userId);
    return result;
  }

  //auto complete
  @Get("/search")
  async searchProducts(
    @Query() query: ProductSearchQuery,
    @Body("userId") userId: number
  ) {
    return await this.searchService.searchProducts(query, userId);
  }

  //search result
  @Get("/keywords")
  async getKeywords(@Query("keyword") keyword: string) {
    return this.searchService.findKeywords(keyword);
  }

  // TODO: 데이터를 만들었는데, ES에 저장 안했을 때 불러주면 되는 것
  // @Get("/init")
  // async createAllKeyword() {
  //   return await this.searchService.setAllProductsIntoElasticSearch();
  // }

  @Get("/:id")
  async getProduct(@Param("id") id: number, @Body("userId") userId: number) {
    return await this.productService.getProduct(id, userId);
  }

  @Get("/:id/reviews")
  async getReviews(
    @Param("id") id: number,
    @Query() query: ProductReviewsQuery
  ): Promise<{
    averageRate: number;
    rates: ReviewRate[];
    reviews: Review[];
    length: number;
  }> {
    return await this.productService.getProductReviews(id, query);
  }

  @Get("/:id/questions")
  async getProductQuestions(
    @Param("id") id: number
  ): Promise<QuestionResponse[]> {
    return await this.productService.getProductQuestions(id);
  }

  @UseInterceptors(
    FileFieldsInterceptor([{ name: "images" }, { name: "details" }])
  )
  @Post()
  async addProduct(
    @UploadedFiles() files,
    @Body() body: ProductUploadRequest
  ): Promise<number> {
    return await this.productService.createProduct(
      body,
      files.images,
      files.details
    );
  }

  @Delete("/:id")
  async deleteProduct(@Param("id") id: number) {
    await this.productService.deleteProduct(id);
  }
}
