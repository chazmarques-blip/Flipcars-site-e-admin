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
import { StorageModule } from '@modules/storage/storage.module';
import { AppointmentsModule } from '@modules/appointments/appointments.module';
import { EmailModule } from '@modules/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lead, Customer, Vehicle, User]),
    AuthModule, // Import AuthModule for guards
    StorageModule, // Import StorageModule for Supabase Storage
    AppointmentsModule, // Import AppointmentsModule for auto-creating appointments
    EmailModule, // Import EmailModule for sending confirmation emails
  ],
  controllers: [LeadsController, PublicLeadsController, UploadController],
  providers: [LeadsService],
  exports: [LeadsService], // Export for use in other modules
})
export class LeadsModule {}
