import {
  Controller,
  Body,
  Patch,
  Request,
  UseGuards,
  Get,
  Post,
  Param,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/config/guard/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles/roles.guard';
import { RegisterAuthDto } from '../auth/dto/register-auth.dto';
import { RoleEnum } from '../auth/roles/role.enum';
import { Roles } from '../auth/roles/roles.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('profile/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    console.log('🚀 ~ UsersController ~ update ~ id:', id);
    return this.usersService.update(id, updateUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll(@Request() req, @Query() dto: PaginationQueryDto) {
    return this.usersService.findAll(req.user._id.toString(), dto);
  }

  @Post('add')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  create(@Body() dto: RegisterAuthDto) {
    return this.usersService.create(dto);
  }
}
