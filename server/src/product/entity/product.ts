import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { ProductImage } from "./product-image";
import { ProductOption } from "./option";
import { ProductDetailImage } from "./product-detail-image";
import { ProductUploadRequest } from "@/product/dto/product-upload-request";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  name: string;

  @Column()
  price: number;

  @Column({ name: "delivery_cost" })
  deliveryCost: number;

  @Column({ name: "discount_rate" })
  discountRate: number;

  @Column()
  stock: number;

  @Column()
  category: string;

  @Column({ name: "sub_category" })
  subCategory: string;

  @Column({ length: 16, nullable: true })
  option: string;

  @OneToMany(() => ProductOption, (option) => option.product, { cascade: true })
  options: ProductOption[];

  @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
  images: ProductImage[];

  @OneToMany(() => ProductDetailImage, (detailImage) => detailImage.product, {
    cascade: true,
  })
  detailImages: ProductDetailImage[];

  @CreateDateColumn({
    type: "timestamp",
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    name: "updated_at",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updatedAt: Date;

  static toEntity(product: ProductUploadRequest) {
    return {
      name: product.name,
      price: product.price,
      deliveryCost: product.deliveryCost,
      discountRate: product.discountRate,
      stock: product.stock,
      category: product.category,
      subCategory: product.subCategory,
      option: product.option ? product.option.value : null,
    } as Product;
  }

  getDiscountedPrice() {
    return this.discountRate === 0
      ? this.price
      : this.price * ((100 - this.discountRate) / 100);
  }

  getThumbnailImage() {
    if (!this.images) return "";
    return this.images[0].id;
  }

  getImagesAsString() {
    return this.images.map((image) => image.id);
  }

  getDetailImagesAsString() {
    return this.detailImages.map((image) => image.id);
  }
}
