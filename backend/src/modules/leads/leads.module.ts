import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsController } from './leads.controller';
import { PublicLeadsController } from './public-leads.controller';
import { UploadController } from './upload.controller';
import { LeadsService } from './leads.service';
import { Lead } from '@database/entities/lead.entity';
import { Customer } from '@database/entities/customer.entity';
import { Vehicle } from '@database/entities/vehicle.entity';
import { User } from '@database/entities/user.entity';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lead, Customer, Vehicle, User]),
    AuthModule, // Import AuthModule for guards
  ],
  controllers: [LeadsController, PublicLeadsController, UploadController],
  providers: [LeadsService],
  exports: [LeadsService], // Export for use in other modules
})
export class LeadsModule {}
