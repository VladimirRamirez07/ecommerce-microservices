import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { KafkaProducer } from '../kafka/kafka.producer';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private kafkaProducer: KafkaProducer,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const totalAmount = createOrderDto.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    const order = this.orderRepository.create({
      userId: createOrderDto.userId,
      shippingAddress: createOrderDto.shippingAddress,
      notes: createOrderDto.notes,
      totalAmount,
      items: createOrderDto.items.map((item) =>
        this.orderItemRepository.create({
          ...item,
          subtotal: item.unitPrice * item.quantity,
        }),
      ),
    });

    const saved = await this.orderRepository.save(order);

    await this.kafkaProducer.emit('order.created', {
      id: saved.id,
      userId: saved.userId,
      totalAmount: saved.totalAmount,
      items: saved.items,
      status: saved.status,
      createdAt: saved.createdAt,
    });

    return saved;
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ relations: { items: true } });
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { userId },
      relations: { items: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: { items: true },
    });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }

  async updateStatus(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    order.status = updateOrderDto.status;
    const updated = await this.orderRepository.save(order);

    await this.kafkaProducer.emit('order.status.updated', {
      id: updated.id,
      userId: updated.userId,
      status: updated.status,
      updatedAt: updated.updatedAt,
    });

    return updated;
  }

  async cancel(id: string): Promise<Order> {
    const order = await this.findOne(id);
    order.status = 'cancelled' as any;
    const cancelled = await this.orderRepository.save(order);

    await this.kafkaProducer.emit('order.cancelled', {
      id: cancelled.id,
      userId: cancelled.userId,
      items: cancelled.items,
    });

    return cancelled;
  }
}