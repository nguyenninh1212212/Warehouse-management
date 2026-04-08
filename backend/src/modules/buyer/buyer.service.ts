import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Buyer, BuyerDocument } from './schemas/buyer.schema';
import { Model } from 'mongoose';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedResponseDto } from 'src/common/dto/pagination_response.dto';
import { paginate } from 'src/common/convert/paginator';

@Injectable()
export class BuyerService {
  constructor(
    @InjectModel(Buyer.name)
    private buyerModel: Model<BuyerDocument>,
  ) {}

  create(dto: CreateBuyerDto, userId: string) {
    return this.buyerModel.create({
      ...dto,
      createdBy: userId,
    });
  }

  // buyer.service.ts
  async findAll(
    queryDto: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<any>> {
    return paginate({
      model: this.buyerModel,
      searchableFields: ['name', 'email', 'phone'],
      queryDto,
    });
  }

  async findOne(id: string) {
    return await this.buyerModel.findById(id);
  }

  async update(id: string, data: UpdateBuyerDto, userId: string) {
    return await this.buyerModel.findByIdAndUpdate(
      id,
      {
        ...data,
        updatedBy: userId,
      },
      { new: true },
    );
  }

  async remove(id: string) {
    return await this.buyerModel.findByIdAndDelete(id);
  }

  async updateBuyerOrder(buyerId: string, totalAmount: number, session: any) {
    await this.buyerModel
      .findByIdAndUpdate(buyerId, {
        $inc: {
          totalOrders: 1,
          totalSpent: totalAmount,
        },
      })
      .session(session);
  }
}
