import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async create(email: string, passwordHash: string) {
    try {
      return await this.userModel.create({
        email,
        passwordHash,
      });
    } catch (err) {
      if (err.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw err;
    }
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async findById(userId: string) {
    return this.userModel.findById(userId).select('-passwordHash');
  }
}
