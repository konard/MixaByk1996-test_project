import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Event } from './event.entity';
import { Category } from '../categories/category.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Event[]> {
    return this.eventsRepository.find({
      relations: ['organizer', 'venue', 'categories'],
    });
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['organizer', 'venue', 'categories', 'reviews'],
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async create(createEventDto: CreateEventDto, organizerId: string): Promise<Event> {
    const { categoryIds, ...eventData } = createEventDto;

    const event = this.eventsRepository.create({
      ...eventData,
      organizerId,
    });

    if (categoryIds && categoryIds.length > 0) {
      event.categories = await this.categoriesRepository.findBy({
        id: In(categoryIds),
      });
    }

    return this.eventsRepository.save(event);
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);
    const { categoryIds, ...eventData } = updateEventDto;

    Object.assign(event, eventData);

    if (categoryIds) {
      event.categories = await this.categoriesRepository.findBy({
        id: In(categoryIds),
      });
    }

    return this.eventsRepository.save(event);
  }

  async remove(id: string): Promise<void> {
    const event = await this.findOne(id);
    await this.eventsRepository.remove(event);
  }
}
