import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create inventory for a product' })
  create(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.create(createInventoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all inventory' })
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get products with low stock' })
  getLowStock() {
    return this.inventoryService.getLowStock();
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Get inventory by product ID' })
  findOne(@Param('productId') productId: string) {
    return this.inventoryService.findByProductId(productId);
  }

  @Put(':productId/stock')
  @ApiOperation({ summary: 'Update stock (in/out/reserve/release)' })
  updateStock(
    @Param('productId') productId: string,
    @Body() updateStockDto: UpdateStockDto,
  ) {
    return this.inventoryService.updateStock(productId, updateStockDto);
  }

  @Get(':productId/movements')
  @ApiOperation({ summary: 'Get stock movement history' })
  getMovements(@Param('productId') productId: string) {
    return this.inventoryService.getMovements(productId);
  }
}