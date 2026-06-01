import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Inventory } from './inventory.entity';
import { MovementType } from './inventory.entity';

@Entity('stock_movements')
export class StockMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Inventory)
  @JoinColumn({ name: 'inventoryId' })
  inventory: Inventory;

  @Column()
  inventoryId: string;

  @Column({ type: 'enum', enum: MovementType })
  type: MovementType;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  reason: string;

  @Column({ nullable: true })
  orderId: string;

  @CreateDateColumn()
  createdAt: Date;
}