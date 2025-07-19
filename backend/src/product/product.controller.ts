import {  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtUser, UserFromAuth } from 'src/decorator/userFromAuth.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @UserFromAuth() user: JwtUser,
  ) {
    return this.productService.create(createProductDto, user);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get('categories')
  findAllCategories() {
    return this.productService.findAllCategories();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UserFromAuth() user: JwtUser,
  ) {
    return this.productService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @UserFromAuth() user: JwtUser) {
    return this.productService.remove(id, user);
  }
}
