import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import type { RegisterDto } from './dto/register.dto';
import type { LoginDto } from './dto/login.dto';
import type { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  ////////////////////////////////////
  // REGISTER
  ////////////////////////////////////
  async register(registerDto: RegisterDto) {
    // Vérifier si l'email existe déjà
    const existingUser = await this.userModel.findOne({ email: registerDto.email });
    if (existingUser) {
      throw new ConflictException('Email déjà utilisé');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Créer l'utilisateur
    const user = new this.userModel({
      ...registerDto,
      password: hashedPassword,
    });

    await user.save();

    // Retourner sans le mot de passe
    const { password, ...result } = user.toObject();
    return result;
  }

  ////////////////////////////////////
  // LOGIN
  ////////////////////////////////////
  async login(loginDto: LoginDto) {
    // Trouver l'utilisateur
    const user = await this.userModel.findOne({ email: loginDto.email });
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Vérifier si le compte est actif
    if (!user.isActive) {
      throw new UnauthorizedException('Compte désactivé');
    }

    // Générer le JWT
    const payload = { 
      sub: user._id, 
      email: user.email, 
      role: user.role 
    };
    
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      }
    };
  }

  ////////////////////////////////////
  // FIND ALL
  ////////////////////////////////////
  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  ////////////////////////////////////
  // FIND ONE
  ////////////////////////////////////
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException(`User avec ID ${id} introuvable`);
    }
    return user;
  }

  ////////////////////////////////////
  // FIND BY EMAIL
  ////////////////////////////////////
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  ////////////////////////////////////
  // UPDATE
  ////////////////////////////////////
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password')
      .exec();
    
    if (!updatedUser) {
      throw new NotFoundException(`User avec ID ${id} introuvable`);
    }
    return updatedUser;
  }

  ////////////////////////////////////
  // DELETE
  ////////////////////////////////////
  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel
      .findByIdAndDelete(id)
      .select('-password')
      .exec();
    
    if (!deletedUser) {
      throw new NotFoundException(`User avec ID ${id} introuvable`);
    }
    return deletedUser;
  }
}