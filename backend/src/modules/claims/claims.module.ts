import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaimsController } from './claims.controller';
import { ClaimsService } from './claims.service';
import { Claim } from '@database/entities/claim.entity';
import { Customer } from '@database/entities/customer.entity';
import { Vehicle } from '@database/entities/vehicle.entity';
import { User } from '@database/entities/user.entity';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Claim, Customer, Vehicle, User]),
    AuthModule, // Import AuthModule for guards
  ],
  controllers: [ClaimsController],
  providers: [ClaimsService],
  exports: [ClaimsService], // Export for use in other modules
})
export class ClaimsModule {}
