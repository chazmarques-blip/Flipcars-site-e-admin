import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { Customer } from '@database/entities/customer.entity';
import { User } from '@database/entities/user.entity';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, User]),
    AuthModule, // Import AuthModule for guards
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService], // Export for use in other modules
})
export class CustomersModule {}
