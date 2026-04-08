import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/config/guard/jwt-auth.guard'; // Đường dẫn của bạn
import { RolesGuard } from 'src/modules/auth/roles/roles.guard'; // Nếu bạn có làm phân quyền
import { Roles } from 'src/modules/auth/roles/roles.decorator';
import { RoleEnum } from '../auth/roles/role.enum';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@ApiTags('Products (Quản lý Kho)') // Phân nhóm trong Swagger cho môn Tích hợp
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN) // Chỉ admin mới được thêm sản phẩm
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thêm sản phẩm mới vào kho' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sửa sản phẩm mới vào kho' })
  update(@Body() updateProductDto: UpdateProductDto, @Param('id') id: string) {
    return this.productsService.update(updateProductDto, id);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả sản phẩm' })
  findAll(@Query() queryDto: PaginationQueryDto) {
    return this.productsService.findAll(queryDto);
  }

  @Get('low-stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cảnh báo sản phẩm sắp hết hàng (Dành cho sếp - MIS)',
  })
  getLowStock() {
    return this.productsService.getLowStock();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết một sản phẩm' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id/stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật kho thủ công (Nhập hàng thêm)' })
  updateStock(@Param('id') id: string, @Body('quantity') quantity: number) {
    return this.productsService.updateStock(id, quantity);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN) // Chỉ admin mới được thêm sản phẩm
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa sản phẩm khỏi hệ thống' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
