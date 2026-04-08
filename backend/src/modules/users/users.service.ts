import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterAuthDto } from '../auth/dto/register-auth.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schemas';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { PasswordHashHelper } from 'src/helper/hash/password-hash.helper';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { paginate } from 'src/common/convert/paginator';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll(userId: string, queryDto: PaginationQueryDto) {
    // 1. Định nghĩa bộ lọc dùng chung cho cả lệnh Đếm và lệnh Tìm
    const filter = { _id: { $ne: userId } };

    return paginate({
      model: this.userModel,
      queryDto,
      filter,
      projection: '-password -password_key',
      searchableFields: ['name', 'email', 'username', 'role'],
    });
  }

  async create(dto: RegisterAuthDto) {
    const passwordGenerator = await PasswordHashHelper.hash(dto.password);
    dto.password = passwordGenerator.hash;

    const createdUser = new this.userModel({
      ...dto,
      password_key: passwordGenerator.passKey,
    });

    try {
      return await createdUser.save();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.userModel
      .findOne({ email })
      .select('+password')
      .select('+password_key')
      .exec();

    if (!user) {
      throw new NotFoundException('Could not find user.');
    }

    const isPasswordCorrect = await PasswordHashHelper.comparePassword(
      password,
      user.password_key,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new NotFoundException('Could not find user.');
    }

    return user;
  }

  async findOne(id: string) {
    const user = await this.userModel
      .findById(id)
      .select([
        '_id',
        'name',
        'role',
        'user',
        'email',
        'createdAt',
        'updatedAt',
      ])
      .exec();

    if (!user) {
      throw new NotFoundException('Could not find user.');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('Could not find user.');
    }

    return {
      message: 'User updated successfully',
      data: updatedUser,
    };
  }
  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = refreshToken
      ? await bcrypt.hash(refreshToken, 10)
      : null;
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: hashedRefreshToken,
    });
  }
}
