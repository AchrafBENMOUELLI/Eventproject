import { Controller, Post, Body, UsePipes, Get, Param, Patch, Delete } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import type { CreateFeedbackDto } from './dto/create-feedback.dto';
import type { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  ////////////////////////////////////////////////////////////////////////////
  @Post()
  @UsePipes(ZodValidationPipe)
  async create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create(createFeedbackDto);
  }

  /////////////////////////////////////////////////////////////////////////////
  @Get()
  async findAll() {
    return this.feedbackService.findAll();
  }

  /////////////////////////////////////////////////////////////////////////////
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.feedbackService.findOne(id);
  }

  //////////////////////////////////////////////////////////////////////////////
  @Get('user/:id_user')
  async findByUser(@Param('id_user') id_user: number) {
    return this.feedbackService.findByUser(+id_user);
  }

  //////////////////////////////////////////////////////////////////////////////
  @Get('event/:id_event')
  async findByEvent(@Param('id_event') id_event: number) {
    return this.feedbackService.findByEvent(+id_event);
  }

  /////////////////////////////////////////////////////////////////////////////
  @Patch(':id')
  @UsePipes(ZodValidationPipe)
  async update(@Param('id') id: string, @Body() updateFeedbackDto: UpdateFeedbackDto) {
    return this.feedbackService.update(id, updateFeedbackDto);
  }

  ///////////////////////////////////////////////////////////////////////////////
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.feedbackService.remove(id);
  }
}

/*
@UsePipes : Applies the Zod validation pipe to validate incoming request data against the defined Zod schema
*/