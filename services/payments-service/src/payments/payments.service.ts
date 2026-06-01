import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { KafkaProducer } from '../kafka/kafka.producer';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private kafkaProducer: KafkaProducer,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentRepository.create({
      ...createPaymentDto,
      status: PaymentStatus.PROCESSING,
    });

    const saved = await this.paymentRepository.save(payment);

    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      saved.status = PaymentStatus.COMPLETED;
      saved.transactionId = `TXN-${Date.now()}`;
    } else {
      saved.status = PaymentStatus.FAILED;
      saved.failureReason = 'Payment declined by bank';
    }

    const updated = await this.paymentRepository.save(saved);

    await this.kafkaProducer.emit(
      isSuccess ? 'payment.completed' : 'payment.failed',
      {
        id: updated.id,
        orderId: updated.orderId,
        userId: updated.userId,
        amount: updated.amount,
        status: updated.status,
        transactionId: updated.transactionId,
      },
    );

    return updated;
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) throw new NotFoundException(`Payment ${id} not found`);
    return payment;
  }

  async findByOrder(orderId: string): Promise<Payment[]> {
    return this.paymentRepository.find({ where: { orderId } });
  }

  async refund(id: string): Promise<Payment> {
    const payment = await this.findOne(id);
    payment.status = PaymentStatus.REFUNDED;
    const refunded = await this.paymentRepository.save(payment);

    await this.kafkaProducer.emit('payment.refunded', {
      id: refunded.id,
      orderId: refunded.orderId,
      userId: refunded.userId,
      amount: refunded.amount,
    });

    return refunded;
  }
}