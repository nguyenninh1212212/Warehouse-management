import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from './schema/product.schema';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { paginate } from 'src/common/convert/paginator';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async update(updateProductDto: UpdateProductDto, id: string) {
    delete (updateProductDto as any).sku;
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product id');
    }

    const updated = await this.productModel.findByIdAndUpdate(
      id,
      updateProductDto,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updated) {
      throw new NotFoundException('Product not found');
    }

    console.log('🚀 ~ ProductsService ~ update ~ updated:', updated);
    return updated;
  }
  async increaseStock(productId: string, suggestedQuantity: number) {
    const product = await this.productModel.findById(productId).exec();
    await product.updateOne({ stock: suggestedQuantity });
  }
  async remove(id: string) {
    await this.productModel.findOneAndDelete({ id }).exec();
  }
  async findOne(id: string) {
    return await this.productModel
      .findOne({ _id: id })
      .populate('category', 'name')
      .exec();
  }
  async create(dto: any) {
    const newProduct = new this.productModel(dto);
    return await newProduct.save();
  }

  // Lấy danh sách sản phẩm sắp hết hàng (Phục vụ MIS - Cảnh báo nhập hàng)
  async getLowStock() {
    return await this.productModel.find({
      $expr: { $lte: ['$stock', '$lowStockThreshold'] },
    });
  }

  // Hàm quan trọng nhất để TÍCH HỢP với OrderModule
  async updateStock(productId: string, quantity: number, session?: any) {
    const product = await this.productModel
      .findById(productId)
      .session(session);

    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');

    const newStock = product.stock + quantity;

    if (newStock < 0) {
      throw new BadRequestException(
        `Sản phẩm ${product.name} không đủ tồn kho`,
      );
    }

    product.stock = newStock;
    return await product.save({ session });
  }

  async findAll(queryDto: PaginationQueryDto) {
    return paginate({
      model: this.productModel,
      queryDto,
      populates: [{ path: 'category', select: 'name' }],
      searchableFields: ['sku', 'name', 'category.name'],
    });
  }
}
