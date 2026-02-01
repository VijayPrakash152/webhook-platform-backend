import { Controller, Get, Param, Post, Body, UseGuards, Req } from '@nestjs/common';
import { EventsService } from './events.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /**
   * PUBLIC endpoint – webhook ingestion
   */
  @Post('webhooks/ingest/:subscriptionId')
  ingest(
    @Param('subscriptionId') subscriptionId: string,
    @Body() payload: any,
  ) {
    return this.eventsService.ingest(subscriptionId, payload);
  }

  /**
   * Authenticated – user event history
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('events')
  getEvents(@Req() req) {
    return this.eventsService.findByUser(req.user.userId);
  }
}
