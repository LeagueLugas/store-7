import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import { CreateOrderRequest } from "../dto/order-request";
import { Order } from "../entity/order";
import { OrderStatus } from "@/order/entity/order";

@Injectable()
export class Orders {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>
  ) {}

  async findOrders() {
    return await this.orderRepository.find({
      relations: ["user", "product", "product.images", "product.options"],
    });
  }

  async findOrdersByUserId(userId: number) {
    return await this.orderRepository.find({
      relations: ["user", "product", "product.images", "review"],
      where: { user: { id: userId } },
    });
  }

  async findOrderByOrderNum(orderNum: number) {
    return await this.orderRepository.find({
      relations: ["user", "product", "product.images", "product.options"],
      where: { orderNum },
    });
  }

  async findCurrentOrdersByUserId(userId: number) {
    return await this.orderRepository.find({
      relations: ["user", "product", "product.images"],
      where: { user: { id: userId }, status: "배송중" },
    });
  }

  async findDeliverdOrdersByUserId(userId: number) {
    return await this.orderRepository.find({
      relations: ["user", "product", "product.images"],
      where: { user: { id: userId }, status: "배송완료" },
    });
  }

  async findReviewedOrdersByUserId(userId: number) {
    return await this.orderRepository.find({
      relations: ["user", "product", "product.images"],
      where: { user: { id: userId }, status: "구매확정" },
    });
  }

  async findOrderById(id: number) {
    return await this.orderRepository.findOne({ where: { id } });
  }

  async findOrdersByUserIdByDateRange(
    userId: number,
    range: {
      from: Date;
      to: Date;
    }
  ) {
    return await this.orderRepository.find({
      relations: ["user"],
      where: { user: { id: userId }, createdAt: Between(range.from, range.to) },
    });
  }

  async createOrder(order: CreateOrderRequest) {
    const result = await this.orderRepository.insert(order);
    return (await this.findOrderById(result.raw.insertId)).id;
  }

  async updateOrderStatus(id: number, status: OrderStatus) {
    return await this.orderRepository.update({ id }, { status });
  }

  async updateOrderNum(id: number, orderNum: string) {
    await this.orderRepository.update({ id }, { orderNum });
  }
}
