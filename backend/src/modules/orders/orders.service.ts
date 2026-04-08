import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductsService } from '../products/products.service';
import { OrderEnum } from 'src/enums/order.enum';
import { BuyerService } from '../buyer/buyer.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { paginate } from 'src/common/convert/paginator';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectConnection() private readonly connection: Connection, // Dùng để làm Transaction
    private readonly productsService: ProductsService, // Tích hợp với ProductModule
    private readonly buyerService: BuyerService, // Tích hợp với ProductModule
  ) {}

  findByProduct(productId: string) {
    return this.findByProduct(productId);
  }
  /**
   * TÍNH NĂNG TÍCH HỢP CHÍNH: Tạo đơn hàng và trừ tồn kho
   * Sử dụng Transaction để đảm bảo: Nếu trừ kho lỗi thì không tạo đơn hàng.
   */
  async create(createOrderDto: CreateOrderDto, userId: string) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      let totalAmount = 0;
      const orderItems = [];

      // Bước 1: Duyệt qua các item để kiểm tra kho và tính toán
      for (const item of createOrderDto.items) {
        const product = await this.productsService.findOne(item.productId);

        if (!product) {
          throw new NotFoundException(
            `Sản phẩm ID ${item.productId} không tồn tại`,
          );
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Sản phẩm ${product.name} không đủ tồn kho`,
          );
        }

        // Cập nhật tồn kho (phải truyền session)
        await this.productsService.updateStock(
          item.productId,
          -item.quantity,
          session,
        );

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        orderItems.push({
          productId: item.productId,
          name: product.name,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // Bước 2: Cập nhật thông tin khách hàng (Sau khi đã có tổng tiền cuối cùng)
      // Lưu ý: Hàm này trong BuyerService phải được sửa để nhận tham số session
      await this.buyerService.updateBuyerOrder(
        createOrderDto.buyerId,
        totalAmount,
        session,
      );

      // Bước 3: Tạo đơn hàng mới
      const newOrder = new this.orderModel({
        userId,
        items: orderItems,
        buyerId: createOrderDto.buyerId,
        totalAmount,
        status: 'COMPLETED',
      });

      const savedOrder = await newOrder.save({ session });

      // Bước 4: Hoàn tất
      await session.commitTransaction();
      return savedOrder;
    } catch (error) {
      // Rollback toàn bộ nếu có bất kỳ lỗi nào (sai kho, lỗi DB, lỗi buyer...)
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
  /**
   * PHỤC VỤ MÔN MIS: Lấy lịch sử bán hàng để AI phân tích
   */
  async getSalesHistory(productId: string) {
    return await this.orderModel
      .find({
        'items.productId': productId,
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .exec();
  }

  /**
   * PHỤC VỤ MÔN MIS: Thống kê doanh thu cho Dashboard
   */
  async getStats() {
    const stats = await this.orderModel.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          dailyRevenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          revenue: '$dailyRevenue',
          orders: '$orderCount',
        },
      },
    ]);

    return stats;
  }

  async getStatsToday() {
    // Tạo mốc thời gian 00:00:00 của ngày hôm nay (theo giờ UTC/Hệ thống)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const stats = await this.orderModel.aggregate([
      {
        // Bước 1: Chỉ lấy các đơn hàng từ 00:00:00 hôm nay đến hiện tại
        $match: {
          createdAt: { $gte: startOfDay },
        },
      },
      {
        // Bước 2: Group (Lúc này thực tế chỉ có 1 group vì match theo ngày)
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          dailyRevenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          revenue: '$dailyRevenue',
          orders: '$orderCount',
        },
      },
    ]);

    return (
      stats[0] || {
        date: new Date().toISOString().split('T')[0],
        revenue: 0,
        orders: 0,
      }
    );
  }

  async getTotalStat() {
    const [totalOrders, revenue] = await Promise.all([
      this.orderModel.countDocuments(),
      this.orderModel.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
          },
        },
      ]),
    ]);

    return {
      totalOrders,
      totalRevenue: revenue[0]?.totalRevenue || 0,
    };
  }

  async findAll(queryDto: PaginationQueryDto) {
    return paginate({
      model: this.orderModel,
      queryDto,
      populates: [
        { path: 'userId', select: 'email name' },
        { path: 'buyerId', select: 'email name' },
      ],
      searchableFields: ['items.name'],
    });
  }
  async findOne(id: string) {
    const order = await this.orderModel
      .findById(id)
      .populate('userId', 'email name')
      .exec();
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    return order;
  }

  async updateStatus(id: string, status: OrderEnum) {
    // Kiểm tra status hợp lệ
    const allowedStatuses = [
      OrderEnum.CANCELLED,
      OrderEnum.COMPLETED,
      OrderEnum.PENDING,
    ];
    if (!allowedStatuses.includes(status)) {
      throw new BadRequestException(`Status "${status}" không hợp lệ`);
    }

    // Tìm đơn hàng
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Đơn hàng không tồn tại');

    // Cập nhật status
    order.status = status;
    const updatedOrder = await order.save();

    return updatedOrder;
  }
}
