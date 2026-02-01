import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { WebhookService } from "./webhook.service";
import { CreateWebhookDto } from "./dto/create-webhook.dto";

@UseGuards(AuthGuard('jwt'))
@Controller('webhooks')
export class WebhookController {
  constructor(private service: WebhookService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateWebhookDto) {
    return this.service.create(req.user.userId, dto);
  }

  @Get()
  list(@Req() req) {
    return this.service.findAll(req.user.userId);
  }

  @Delete(':id')
  cancel(@Param('id') id: string, @Req() req) {
    return this.service.cancel(id, req.user.userId);
  }
}
