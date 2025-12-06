import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Eventy, EventDocument } from './schemas/event.schema';
import { Feedback, FeedbackDocument } from '../feedback/schemas/feedback.schema';
import type { CreateEventDto } from './dto/create-event.dto';
import type { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Eventy.name)
    private eventModel: Model<EventDocument>,
    @InjectModel(Feedback.name)
    private feedbackModel: Model<FeedbackDocument>
  ) {}

  ////////////////////////////////////
  // CREATE
  ////////////////////////////////////
  async create(createEventDto: CreateEventDto): Promise<Eventy> {
    const createdEvent = new this.eventModel(createEventDto);
    return createdEvent.save();
  }

  ////////////////////////////////////
// READ ALL WITH ORGANIZER INFO
////////////////////////////////////
async findAll(): Promise<Eventy[]> {
  return this.eventModel
    .find()
    .populate('organizerId', 'firstName lastName email')  // ← Populate organizer
    .exec();
}

////////////////////////////////////
// READ ONE WITH ORGANIZER INFO
////////////////////////////////////
async findOne(id: string): Promise<Eventy> {
  const event = await this.eventModel
    .findById(id)
    .populate('organizerId', 'firstName lastName email')  // ← Populate organizer
    .exec();
  
  if (!event) {
    throw new NotFoundException(`Event with ID ${id} not found`);
  }
  return event;
}

  ////////////////////////////////////
  // READ BY ORGANIZER
  ////////////////////////////////////
  async findByOrganizer(organizerId: number): Promise<Eventy[]> {
    return this.eventModel.find({ organizerId }).exec();
  }

  ////////////////////////////////////
  // READ BY LOCATION
  ////////////////////////////////////
  async findByLocation(location: string): Promise<Eventy[]> {
    return this.eventModel.find({ location }).exec();
  }

  ////////////////////////////////////
  // GET FEEDBACKS FOR EVENT
  ////////////////////////////////////
  async getFeedbacks(id: string): Promise<Feedback[]> {
    const event = await this.eventModel.findById(id).exec();
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    // Récupérer les feedbacks avec l'_id de l'événement
    return this.feedbackModel.find({ id_event: id }).exec();
  }

  ////////////////////////////////////
  // UPDATE
  ////////////////////////////////////
  async update(id: string, updateEventDto: UpdateEventDto): Promise<Eventy> {
    const updatedEvent = await this.eventModel.findByIdAndUpdate(id, updateEventDto, { new: true }).exec();
    if (!updatedEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return updatedEvent;
  }

  ////////////////////////////////////
  // DELETE
  ////////////////////////////////////
  async remove(id: string): Promise<Eventy> {
    const deletedEvent = await this.eventModel.findByIdAndDelete(id).exec();
    if (!deletedEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return deletedEvent;
  }

  ////////////////////////////////////
  // INCREMENT LIKE
  ////////////////////////////////////
  async incrementLike(id: string): Promise<Eventy> {
    const event = await this.eventModel.findByIdAndUpdate(
      id,
      { $inc: { nbrLike: 1 } },
      { new: true }
    ).exec();
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  ////////////////////////////////////
  // DECREMENT LIKE
  ////////////////////////////////////
  async decrementLike(id: string): Promise<Eventy> {
    const event = await this.eventModel.findByIdAndUpdate(
      id,
      { $inc: { nbrLike: -1 } },
      { new: true }
    ).exec();
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }
}