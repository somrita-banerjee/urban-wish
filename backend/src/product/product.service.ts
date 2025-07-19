import {  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtUser } from 'src/decorator/userFromAuth.decorator';
import { v4 as uuid } from 'uuid';
import { user_type } from '@prisma/client';

@Injectable()
export class ProductService {
  logger = new Logger(ProductService.name);
  constructor(private prismaService: PrismaService) {}

  async create(createProductDto: CreateProductDto, user: JwtUser) {
    if (user.user_type !== user_type.seller) {
      throw new ForbiddenException('Only sellers can create products');
    }

    try {
      const categoryExists = await this.prismaService.category.findFirst({
        where: { id: createProductDto.category },
      });
      if (!categoryExists) {
        throw new NotFoundException('Category not found');
      }

      const product = await this.prismaService.products.create({
        data: {
          id: uuid(),
          name: createProductDto.name,
          description: createProductDto.description,
          category: createProductDto.category,
          image_url: createProductDto.imageUrl,
          price: parseFloat(createProductDto.price),
          seller_id: user.sub,
        },
      });

      return product;
    } catch (error) {
      this.logger.error('Error creating product', error);
      throw new HttpException(
        {
          status: error.status || 500,
          error: error.message || 'Internal Server Error',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
          description: 'Failed to create product',
        },
      );
    }
  }

  async findAll() {
    try {
      const products = await this.prismaService.products.findMany();
      return products;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status || 500,
          error: error.message || 'Internal Server Error',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
          description: 'Failed to retrieve products',
        },
      );
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.prismaService.products.findUnique({
        where: { id },
      });
      if (!product) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }

      return product;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status || 500,
          error: error.message || 'Internal Server Error',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
          description: 'Failed to retrieve product',
        },
      );
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: JwtUser) {
    if (user.user_type !== 'seller') {
      throw new ForbiddenException('Only sellers can update products');
    }

    try {
      const product = await this.prismaService.products.findUnique({
        where: { id },
      });
      
      if (!product) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }
      if (product.seller_id !== user.sub) {
        throw new ForbiddenException('You can only update your own products');
      }

      if (updateProductDto.category) {
        const categoryExists = await this.prismaService.category.findUnique({
          where: { id: updateProductDto.category },
        });
        if (!categoryExists) {
          throw new NotFoundException('Category not found');
        }
      }

      const updateBody = {
        name: updateProductDto.name,
        description: updateProductDto.description,
        category: updateProductDto.category,
        image_url: updateProductDto.imageUrl,
        price: updateProductDto.price ? parseFloat(updateProductDto.price) : undefined,
      };

      return this.prismaService.products.update({
        where: { id },
        data: updateBody,
      });
    } catch (error) {
      throw new HttpException(
        {
          status: error.status || 500,
          error: error.message || 'Internal Server Error',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
          description: 'Failed to update product',
        },
      );
    }
  }

  async remove(id: string, user: JwtUser) {
    if (user.user_type !== 'seller') {
      throw new ForbiddenException('Only sellers can delete products');
    }
    try {
      const product = await this.prismaService.products.findUnique({
        where: { id },
      });
      if (!product) {
        throw new NotFoundException(`Product not found`);
      }
      if (product.seller_id !== user.sub) {
        throw new ForbiddenException('You can only delete your own products');
      }
      return await this.prismaService.products.delete({
        where: {
          id,
          seller_id: user.sub,
        },
      });
    } catch (error) {
      throw new HttpException(
        {
          status: error.status || 500,
          error: error.message || 'Internal Server Error',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
          description: 'Failed to delete product',
        },
      );
    }
  }

  async findAllCategories() {
    const categories = await this.prismaService.category.findMany();
    return categories;
  }
}
