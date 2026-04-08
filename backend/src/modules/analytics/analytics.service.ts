import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../orders/schemas/order.schema';
import { Product } from '../../modules/products/schema/product.schema';
import { AiService } from '../ai/ai.service';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly orderService: OrdersService,
    private readonly productService: ProductsService,
    private readonly aiService: AiService,
  ) {}
  async getStatdays() {
    return await this.orderService.getStats();
  }
  async getStatToday() {
    return await this.orderService.getStatsToday();
  }
  async getStats() {
    return await this.orderService.getTotalStat();
  }
  // 1. Thống kê doanh thu theo tháng (Phục vụ biểu đồ MIS)
  async getMonthlyRevenue() {
    return await this.orderModel
      .aggregate([
        {
          $group: {
            _id: { $month: '$createdAt' }, // trả về 1–12
            totalRevenue: { $sum: '$totalAmount' },
            orderCount: { $sum: 1 },
          },
        },
        {
          $addFields: {
            month: {
              $switch: {
                branches: [
                  { case: { $eq: ['$_id', 1] }, then: 'January' },
                  { case: { $eq: ['$_id', 2] }, then: 'February' },
                  { case: { $eq: ['$_id', 3] }, then: 'March' },
                  { case: { $eq: ['$_id', 4] }, then: 'April' },
                  { case: { $eq: ['$_id', 5] }, then: 'May' },
                  { case: { $eq: ['$_id', 6] }, then: 'June' },
                  { case: { $eq: ['$_id', 7] }, then: 'July' },
                  { case: { $eq: ['$_id', 8] }, then: 'August' },
                  { case: { $eq: ['$_id', 9] }, then: 'September' },
                  { case: { $eq: ['$_id', 10] }, then: 'October' },
                  { case: { $eq: ['$_id', 11] }, then: 'November' },
                  { case: { $eq: ['$_id', 12] }, then: 'December' },
                ],
                default: 'Unknown',
              },
            },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .exec();
  }

  // 2. Top 5 sản phẩm bán chạy nhất
  async getTopProducts() {
    return await this.orderModel
      .aggregate([
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.productId',
            name: { $first: '$items.name' },
            totalSold: { $sum: '$items.quantity' },
            revenue: {
              $sum: { $multiply: ['$items.quantity', '$items.price'] },
            },
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
      ])
      .exec();
  }

  // 3. AI STRATEGY: Phân tích và đưa ra chiến lược kinh doanh (Đỉnh cao Tích hợp)
  async getAiBusinessStrategy() {
    const topProducts = await this.getTopProducts();
    const alert = await this.productService.getLowStock();
    const revenue = await this.getMonthlyRevenue();

    const context = `
Báo cáo doanh thu tháng: ${JSON.stringify(revenue)}.
Danh sách sản phẩm bán chạy: ${JSON.stringify(topProducts)}.
Danh sách tồn kho thấp: ${JSON.stringify(alert)}.

Hãy trả về JSON theo format sau:

{
  "insights": ["..."],
  "recommendations": ["..."],
  "restockAlerts": [
    {
      "productId": "...",
      "productName": "...",
      "currentStock": number,
      "recommendedOrder": number,
      "priority": "low | medium | high"
    }
  ]
}

Chỉ trả về JSON, không giải thích.
`;

    const raw = await this.aiService.generateStrategy(context);

    let advice;
    try {
      advice = JSON.parse(raw);
    } catch (e) {
      advice = {
        insights: [],
        recommendations: [raw],
        restockAlerts: [],
      };
    }

    return advice;
  }

  async dashboardAI() {
    const orders = (await this.orderService.findAll({ limit: 20, page: 1 }))
      .data;
    const products = (await this.productService.findAll({ page: 1, limit: 20 }))
      .data;

    return this.aiService.analyzeBusiness({ orders, products });
  }

  async autoRestock(productId: string) {
    const product = await this.productService.findOne(productId);
    const orders = await this.orderService.findByProduct(productId);

    const aiText = await this.aiService.suggestRestock({
      product,
      orders,
    });

    const decision = this.aiService.parseRestockDecision(aiText);

    if (decision.shouldRestock) {
      await this.productService.increaseStock(
        productId,
        decision.suggestedQuantity,
      );
    }

    return {
      aiText,
      decision,
    };
  }
}
