import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes } from '@nestjs/common';
import { EventService } from './event.service';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import type { CreateEventDto } from './dto/create-event.dto';
import type { UpdateEventDto } from './dto/update-event.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  ///////////////////////
  @Post()
  @UsePipes(ZodValidationPipe)
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  ///////////////////////
  @Get()
  async findAll() {
    return this.eventService.findAll();
  }

  ///////////////////////
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  ///////////////////////
  @Get('organizer/:organizerId')
  async findByOrganizer(@Param('organizerId') organizerId: number) {
    return this.eventService.findByOrganizer(+organizerId);
  }

  ///////////////////////
  @Get('location/:location')
  async findByLocation(@Param('location') location: string) {
    return this.eventService.findByLocation(location);
  }

  ///////////////////////
  @Patch(':id')
  @UsePipes(ZodValidationPipe)
  async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(id, updateEventDto);
  }

  ///////////////////////
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }

  ///////////////////////
  @Patch(':id/like')
  async incrementLike(@Param('id') id: string) {
    return this.eventService.incrementLike(id);
  }

  ///////////////////////
  @Patch(':id/unlike')
  async decrementLike(@Param('id') id: string) {
    return this.eventService.decrementLike(id);
  }
}