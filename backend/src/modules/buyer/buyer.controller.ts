import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { JwtAuthGuard } from 'src/config/guard/jwt-auth.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { RoleEnum } from '../auth/roles/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { RolesGuard } from '../auth/roles/roles.guard';

@ApiTags('Quản lý khách hàng')
@Controller('buyer')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BuyerController {
  constructor(private readonly buyerService: BuyerService) {}

  @Post()
  @Roles(RoleEnum.ADMIN)
  create(@Body() createBuyerDto: CreateBuyerDto, @Req() req: any) {
    return this.buyerService.create(createBuyerDto, req.user.id);
  }

  @Get()
  @ApiBearerAuth()
  findAll(@Query() queryDto: PaginationQueryDto) {
    return this.buyerService.findAll(queryDto);
  }
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.buyerService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateBuyerDto: UpdateBuyerDto,
    @Req() req: any,
  ) {
    return this.buyerService.update(id, updateBuyerDto, req.user.id);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  remove(@Param('id') id: string) {
    return this.buyerService.remove(id);
  }
}
