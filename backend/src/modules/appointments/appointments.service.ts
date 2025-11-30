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

  // Buscar todos agendamentos (excluindo leads deletados)
  async findAll(): Promise<Appointment[]> {
    try {
      const appointments = await this.appointmentRepository
        .createQueryBuilder('appointment')
        .leftJoinAndSelect('appointment.lead', 'lead')
        .where('lead.deletedAt IS NULL')
        .orderBy('appointment.appointmentDate', 'ASC')
        .addOrderBy('appointment.appointmentStartTime', 'ASC')
        .getMany();
      
      this.logger.log(`Found ${appointments.length} appointments (excluding deleted leads)`);
      
      // DEBUG: Log date format and service fields from database
      if (appointments.length > 0) {
        const sample = appointments[0];
        this.logger.debug(`[CALENDAR DEBUG] Sample appointment date from DB: "${sample.appointmentDate}" (type: ${typeof sample.appointmentDate})`);
        
        if (sample.lead) {
          this.logger.debug(`[SERVICE DEBUG] Sample lead data:`);
          this.logger.debug(`  - serviceType: ${sample.lead.serviceType}`);
          this.logger.debug(`  - warrantyCompany: ${sample.lead.warrantyCompany}`);
          this.logger.debug(`  - selectedServices: ${JSON.stringify(sample.lead.selectedServices)}`);
          this.logger.debug(`  - symptomsDescription: ${sample.lead.symptomsDescription?.substring(0, 50)}...`);
        }
      }
      
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

  // Buscar por data (excluindo leads deletados)
  async findByDateRange(startDate: string, endDate: string): Promise<Appointment[]> {
    try {
      this.logger.log(`findByDateRange: ${startDate} to ${endDate}`);
      const appointments = await this.appointmentRepository
        .createQueryBuilder('appointment')
        .leftJoinAndSelect('appointment.lead', 'lead')
        .where('appointment.appointmentDate BETWEEN :startDate AND :endDate', { startDate, endDate })
        .andWhere('lead.deletedAt IS NULL')
        .orderBy('appointment.appointmentDate', 'ASC')
        .addOrderBy('appointment.appointmentStartTime', 'ASC')
        .getMany();
      
      this.logger.log(`findByDateRange result: ${appointments.length} appointments (excluding deleted leads)`);
      return appointments;
    } catch (error) {
      this.logger.error(`Error in findByDateRange (${startDate} to ${endDate}): ${error.message}`);
      this.logger.error(error.stack);
      return [];
    }
  }

  // Buscar por mês
  async findByMonth(year: number, month: number): Promise<Appointment[]> {
    try {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      
      // CRITICAL FIX: API uses 1-indexed months (1=Jan, 12=Dec)
      // To get last day of month X (1-indexed), use: new Date(year, X, 0)
      // Example: Last day of December (month=12) = new Date(2024, 12, 0) = Dec 31, 2024
      // This works because month=12 (out of bounds) rolls to January of next year, and day=0 goes back one day
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

      this.logger.log(`findByMonth: ${year}-${month} → ${startDate} to ${endDate} (last day: ${lastDay})`);
      const results = await this.findByDateRange(startDate, endDate);
      this.logger.log(`Found ${results.length} appointments for ${year}-${month}`);
      return results;
    } catch (error) {
      this.logger.error(`Error fetching appointments for ${year}-${month}: ${error.message}`);
      this.logger.error(error.stack);
      // Return empty array instead of throwing to prevent 500 error
      return [];
    }
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
   * Returns: total appointments THIS MONTH, this week count, estimated revenue
   */
  async getEnrichedStats() {
    const now = new Date();
    
    // Calculate start and end of CURRENT MONTH
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    // Calculate start of week (Sunday) for CURRENT WEEK
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Calculate end of week (Saturday) for CURRENT WEEK
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Format dates for query (YYYY-MM-DD)
    const startMonthStr = startOfMonth.toISOString().split('T')[0];
    const endMonthStr = endOfMonth.toISOString().split('T')[0];
    const startWeekStr = startOfWeek.toISOString().split('T')[0];
    const endWeekStr = endOfWeek.toISOString().split('T')[0];

    this.logger.log(`Getting enriched stats:`);
    this.logger.log(`  - Month: ${startMonthStr} to ${endMonthStr}`);
    this.logger.log(`  - Week: ${startWeekStr} to ${endWeekStr}`);

    // Total appointments THIS MONTH ONLY
    const total = await this.appointmentRepository.count({
      where: {
        appointmentDate: Between(startMonthStr, endMonthStr),
      },
    });

    // This week appointments (CURRENT WEEK: Sunday to Saturday)
    const thisWeek = await this.appointmentRepository.count({
      where: {
        appointmentDate: Between(startWeekStr, endWeekStr),
      },
    });

    // Get this week appointments with lead data for revenue calculation
    const thisWeekAppointments = await this.appointmentRepository.find({
      where: {
        appointmentDate: Between(startWeekStr, endWeekStr),
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

    this.logger.log(`Stats calculated: totalThisMonth=${total}, thisWeek=${thisWeek}, revenue=${formattedRevenue}`);

    return {
      total,
      thisWeek,
      estimatedRevenue: estimatedRevenue.toFixed(2),
      formattedRevenue,
    };
  }
}
