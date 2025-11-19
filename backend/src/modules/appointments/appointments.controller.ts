import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  findAll(@Query('year') year?: string, @Query('month') month?: string) {
    // Se year e month forem fornecidos, buscar por mês
    if (year && month) {
      return this.appointmentsService.findByMonth(parseInt(year), parseInt(month));
    }
    // Caso contrário, retornar todos
    return this.appointmentsService.findAll();
  }

  @Get('stats')
  getStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.appointmentsService.getStats(startDate, endDate);
  }

  @Get('dashboard/stats')
  getDashboardStats() {
    return this.appointmentsService.getEnrichedStats();
  }

  @Get('month/:year/:month')
  findByMonth(@Param('year') year: string, @Param('month') month: string) {
    return this.appointmentsService.findByMonth(parseInt(year), parseInt(month));
  }

  @Get('lead/:leadId')
  findByLead(@Param('leadId') leadId: string) {
    return this.appointmentsService.findByLead(leadId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @Request() req: any,
  ) {
    return this.appointmentsService.update(
      id,
      updateAppointmentDto,
      req.user?.userId,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}
