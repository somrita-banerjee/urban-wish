import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { UserType } from '@prisma/client';


export class LoginDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @MaxLength(60)
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

}

export class RegisterDto  {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    name: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @MaxLength(60)
    email: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsEnum(UserType)
    type: UserType;
}