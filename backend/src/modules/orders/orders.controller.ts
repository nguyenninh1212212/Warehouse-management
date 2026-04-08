import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/config/guard/jwt-auth.guard';
import { OrderEnum } from 'src/enums/order.enum';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@ApiTags('Orders (Quản lý Bán hàng)')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo đơn hàng mới (Tích hợp trừ kho)' })
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    return this.ordersService.create(createOrderDto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách tất cả đơn hàng' })
  findAll(@Query() queryDto: PaginationQueryDto) {
    return this.ordersService.findAll(queryDto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thống kê doanh thu theo ngày (MIS Feature)' })
  updateOrder(@Param('id') id: string, @Query('status') status?: OrderEnum) {
    return this.ordersService.updateStatus(id, status);
  }
}
