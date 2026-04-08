import { Model } from 'mongoose';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { PaginatedResponseDto } from '../dto/pagination_response.dto';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface PaginateParams<T, R> {
  model: Model<any>;
  queryDto: PaginationQueryDto;
  classDto?: new (data: any) => R;
  filter?: object;
  projection?: any;
  populates?: any[];
  sort?: any;
}

export const paginate = async <T, R = T>({
  model,
  queryDto,
  classDto,
  filter = {},
  projection = {},
  populates = [],
  searchableFields = [],
}: PaginateParams<T, R> & { searchableFields?: string[] }) => {
  const { page = 1, limit = 10, search } = queryDto;
  const skip = (page - 1) * limit;

  const finalFilter = { ...filter };
  if (search && searchableFields.length > 0) {
    finalFilter['$or'] = searchableFields.map((field) => ({
      [field]: { $regex: search, $options: 'i' },
    }));
  }

  let query = model.find(finalFilter).select(projection);
  populates.forEach((p) => (query = query.populate(p)));

  const [rawData, total] = await Promise.all([
    query.sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec(),
    model.countDocuments(finalFilter).exec(),
  ]);

  const data = classDto
    ? rawData.map((item) => new classDto(item))
    : (rawData as any);

  return new PaginatedResponseDto(data, total, page, limit);
};
