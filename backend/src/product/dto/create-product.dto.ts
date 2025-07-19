import { IsNotEmpty, IsNumberString, IsString, MaxLength } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    name: string;
    
    @IsNotEmpty()
    @IsString()
    description: string;
    
    @IsNotEmpty()
    @IsNumberString()
    price: string;
    
    @IsNotEmpty()
    @IsString()
    category: string;
    
    @IsNotEmpty()
    @IsString()
    imageUrl: string;
}
