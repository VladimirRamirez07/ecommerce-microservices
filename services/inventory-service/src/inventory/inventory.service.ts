import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { MovementType } from './entities/inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(StockMovement)
    private movementRepository: Repository<StockMovement>,
  ) {}

  async create(createInventoryDto: CreateInventoryDto): Promise<Inventory> {
    const inventory = this.inventoryRepository.create({
      ...createInventoryDto,
      available: createInventoryDto.quantity,
    });
    return this.inventoryRepository.save(inventory);
  }

  async findAll(): Promise<Inventory[]> {
    return this.inventoryRepository.find();
  }

  async findByProductId(productId: string): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findOne({
      where: { productId },
    });
    if (!inventory) throw new NotFoundException(`Inventory for product ${productId} not found`);
    return inventory;
  }

  async updateStock(productId: string, updateStockDto: UpdateStockDto): Promise<Inventory> {
    const inventory = await this.findByProductId(productId);
    const { quantity, type, reason, orderId } = updateStockDto;

    switch (type) {
      case MovementType.IN:
        inventory.quantity += quantity;
        inventory.available += quantity;
        break;
      case MovementType.OUT:
        if (inventory.available < quantity) {
          throw new BadRequestException('Insufficient stock');
        }
        inventory.quantity -= quantity;
        inventory.available -= quantity;
        break;
      case MovementType.RESERVE:
        if (inventory.available < quantity) {
          throw new BadRequestException('Insufficient available stock');
        }
        inventory.reserved += quantity;
        inventory.available -= quantity;
        break;
      case MovementType.RELEASE:
        inventory.reserved -= quantity;
        inventory.available += quantity;
        break;
    }

    await this.inventoryRepository.save(inventory);

    await this.movementRepository.save(
      this.movementRepository.create({
        inventoryId: inventory.id,
        type,
        quantity,
        reason,
        orderId,
      }),
    );

    return inventory;
  }

  async getMovements(productId: string): Promise<StockMovement[]> {
    const inventory = await this.findByProductId(productId);
    return this.movementRepository.find({
      where: { inventoryId: inventory.id },
      order: { createdAt: 'DESC' },
    });
  }

  async getLowStock(): Promise<Inventory[]> {
    return this.inventoryRepository
      .createQueryBuilder('inventory')
      .where('inventory.available <= inventory.lowStockThreshold')
      .andWhere('inventory.lowStockThreshold > 0')
      .getMany();
  }
}