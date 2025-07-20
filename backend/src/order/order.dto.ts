import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

class ItemDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  product: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CartDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMaxSize(15, { message: 'Maximum 15 products can be added to cart' })
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];
}
