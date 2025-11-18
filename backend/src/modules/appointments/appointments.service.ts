import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  // Criar agendamento
  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    this.logger.log(`Creating appointment for lead ${createAppointmentDto.leadId}`);

    // Parse time slot (ex: "9:00-11:00")
    const [startTime, endTime] = this.parseTimeSlot(
      createAppointmentDto.appointmentTimeSlot,
    );

    const appointment = this.appointmentRepository.create({
      ...createAppointmentDto,
      appointmentStartTime: startTime,
      appointmentEndTime: endTime,
    });

    const saved = await this.appointmentRepository.save(appointment);
    this.logger.log(`Appointment created: ${saved.id}`);
    
    return saved;
  }

  // Buscar todos agendamentos
  async findAll(): Promise<Appointment[]> {
    try {
      const appointments = await this.appointmentRepository.find({
        relations: ['lead'],
        order: { appointmentDate: 'ASC', appointmentStartTime: 'ASC' },
      });
      this.logger.log(`Found ${appointments.length} appointments`);
      return appointments;
    } catch (error) {
      this.logger.error(`Error fetching appointments: ${error.message}`);
      this.logger.error(error.stack);
      // Return empty array instead of throwing to prevent 500 error
      return [];
    }
  }

  // Buscar por ID
  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['lead'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment ${id} not found`);
    }

    return appointment;
  }

  // Buscar por lead
  async findByLead(leadId: string): Promise<Appointment | null> {
    return this.appointmentRepository.findOne({
      where: { leadId },
      relations: ['lead'],
    });
  }

  // Buscar por data
  async findByDateRange(startDate: string, endDate: string): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: {
        appointmentDate: Between(startDate, endDate),
      },
      relations: ['lead'],
      order: { appointmentDate: 'ASC', appointmentStartTime: 'ASC' },
    });
  }

  // Buscar por mês
  async findByMonth(year: number, month: number): Promise<Appointment[]> {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

    return this.findByDateRange(startDate, endDate);
  }

  // Atualizar
  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
    userId?: string,
  ): Promise<Appointment> {
    const appointment = await this.findOne(id);

    // Se status mudou para 'confirmed', registrar
    if (
      updateAppointmentDto.status === AppointmentStatus.CONFIRMED &&
      !appointment.confirmedAt
    ) {
      appointment.confirmedAt = new Date();
      if (userId) {
        appointment.confirmedById = userId;
      }
      this.logger.log(`Appointment ${id} confirmed by user ${userId || 'unknown'}`);
    }

    // Parse time slot se foi alterado
    const timeSlot = (updateAppointmentDto as any).appointmentTimeSlot;
    if (timeSlot) {
      const [startTime, endTime] = this.parseTimeSlot(timeSlot);
      appointment.appointmentStartTime = startTime;
      appointment.appointmentEndTime = endTime;
    }

    Object.assign(appointment, updateAppointmentDto);
    return this.appointmentRepository.save(appointment);
  }

  // Deletar
  async remove(id: string): Promise<void> {
    const appointment = await this.findOne(id);
    await this.appointmentRepository.remove(appointment);
    this.logger.log(`Appointment ${id} deleted`);
  }

  // Helper: Parse time slot
  private parseTimeSlot(timeSlot: string): [string, string] {
    // Ex: "9:00-11:00" → ["09:00:00", "11:00:00"]
    const [start, end] = timeSlot.split('-');
    return [
      start.trim().padStart(5, '0') + ':00',
      end.trim().padStart(5, '0') + ':00',
    ];
  }

  // Stats
  async getStats(startDate?: string, endDate?: string) {
    let query = this.appointmentRepository.createQueryBuilder('appointment');

    if (startDate && endDate) {
      query = query.where('appointment.appointment_date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const total = await query.getCount();

    const byStatus = await query
      .select('appointment.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('appointment.status')
      .getRawMany();

    return {
      total,
      byStatus: byStatus.reduce((acc, { status, count }) => {
        acc[status] = parseInt(count);
        return acc;
      }, {}),
    };
  }

  /**
   * Get enriched statistics for dashboard mockup
   * Returns: total appointments, this week count, estimated revenue
   */
  async getEnrichedStats() {
    const now = new Date();
    
    // Calculate start of week (Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Calculate end of week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Format dates for query (YYYY-MM-DD)
    const startDateStr = startOfWeek.toISOString().split('T')[0];
    const endDateStr = endOfWeek.toISOString().split('T')[0];

    this.logger.log(`Getting enriched stats for week: ${startDateStr} to ${endDateStr}`);

    // Total appointments
    const total = await this.appointmentRepository.count();

    // This week appointments
    const thisWeek = await this.appointmentRepository.count({
      where: {
        appointmentDate: Between(startDateStr, endDateStr),
      },
    });

    // Get this week appointments with lead data for revenue calculation
    const thisWeekAppointments = await this.appointmentRepository.find({
      where: {
        appointmentDate: Between(startDateStr, endDateStr),
      },
      relations: ['lead'],
    });

    // Calculate estimated revenue
    const estimatedRevenue = thisWeekAppointments.reduce(
      (sum, appointment) => {
        const value = appointment.lead?.estimatedValue || 0;
        return sum + Number(value);
      },
      0
    );

    // Format revenue for display
    const formattedRevenue = estimatedRevenue >= 1000
      ? `$${(estimatedRevenue / 1000).toFixed(1)}K`
      : `$${estimatedRevenue.toFixed(0)}`;

    this.logger.log(`Stats calculated: total=${total}, thisWeek=${thisWeek}, revenue=${formattedRevenue}`);

    return {
      total,
      thisWeek,
      estimatedRevenue: estimatedRevenue.toFixed(2),
      formattedRevenue,
    };
  }
}
