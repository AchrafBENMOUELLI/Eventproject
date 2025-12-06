import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import type { RegisterDto } from './dto/register.dto';
import type { LoginDto } from './dto/login.dto';
import type { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  ///////////////////////
  // REGISTER
  ///////////////////////
  @Post('register')
  @UsePipes(ZodValidationPipe)
  async register(@Body() registerDto: RegisterDto) {
    return this.userService.register(registerDto);
  }

  ///////////////////////
  // LOGIN
  ///////////////////////
  @Post('login')
  @UsePipes(ZodValidationPipe)
  async login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  ///////////////////////
  // GET ALL USERS
  ///////////////////////
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  ///////////////////////
  // GET ONE USER
  ///////////////////////
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  ///////////////////////
  // UPDATE USER
  ///////////////////////
  @Patch(':id')
  @UsePipes(ZodValidationPipe)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  ///////////////////////
  // DELETE USER
  ///////////////////////
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}