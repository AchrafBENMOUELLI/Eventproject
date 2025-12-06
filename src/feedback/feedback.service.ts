import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Feedback, FeedbackDocument } from './schemas/feedback.schema';
import { Eventy, EventDocument } from '../event/schemas/event.schema';
import type { CreateFeedbackDto } from './dto/create-feedback.dto';
import type { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name) 
    private feedbackModel: Model<FeedbackDocument>,
    @InjectModel(Eventy.name)
    private eventModel: Model<EventDocument>
  ) {}

  ////////////////////////////////////
  // CREATE
  ////////////////////////////////////
  async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    // Vérifier que l'événement existe
    const eventExists = await this.eventModel.findById(createFeedbackDto.id_event).exec();
    if (!eventExists) {
      throw new NotFoundException(`Event with ID ${createFeedbackDto.id_event} not found`);
    }

    const createdFeedback = new this.feedbackModel(createFeedbackDto);
    return createdFeedback.save();
  }

  ////////////////////////////////////
// READ ALL WITH USER INFO
////////////////////////////////////
async findAll(): Promise<Feedback[]> {
  return this.feedbackModel
    .find()
    .populate('id_user', 'firstName lastName email')
    .populate('id_event', 'title') 
    .exec();
}

////////////////////////////////////
// READ ONE WITH USER INFO
////////////////////////////////////
async findOne(id: string): Promise<Feedback> {
  const feedback = await this.feedbackModel
    .findById(id)
    .populate('id_user', 'firstName lastName email')
    .populate('id_event', 'title')
    .exec();
  
  if (!feedback) {
    throw new NotFoundException(`Feedback with ID ${id} not found`);
  }
  return feedback;
}

  ////////////////////////////////////
  // READ BY USER
  ////////////////////////////////////
  async findByUser(id_user: number): Promise<Feedback[]> {
    return this.feedbackModel.find({ id_user }).exec();
  }

  ////////////////////////////////////
  // READ BY EVENT
  ////////////////////////////////////
  async findByEvent(id_event: string): Promise<Feedback[]> {
    return this.feedbackModel.find({ id_event }).exec();
  }

  ////////////////////////////////////
  // UPDATE
  ////////////////////////////////////
  async update(id: string, updateFeedbackDto: UpdateFeedbackDto): Promise<Feedback> {
    const updatedFeedback = await this.feedbackModel.findByIdAndUpdate(id, updateFeedbackDto, { new: true }).exec();
    if (!updatedFeedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }
    return updatedFeedback;
  }

  ////////////////////////////////////
  // DELETE
  ////////////////////////////////////
  async remove(id: string): Promise<Feedback> {
    const deletedFeedback = await this.feedbackModel.findByIdAndDelete(id).exec();
    if (!deletedFeedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }
    return deletedFeedback;
  }
}

/*
@Injectable() :
Marque la classe comme un service que NestJS peut injecter ailleurs
Permet l'injection de dépendances

async:
Marque la fonction comme asynchrone
Permet d'utiliser await à l'intérieur
Retourne automatiquement une Promise

Promise :Objet représentant une opération future

populate() est une fonction de Mongoose qui remplace automatiquement une référence ObjectId par l'objet complet de la collection référencée.
*/