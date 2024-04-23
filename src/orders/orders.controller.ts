import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Inject,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config/services';
import { firstValueFrom } from 'rxjs';
import { PaginationOrderDto } from './dto/pagination-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder', createOrderDto);
  }

  @Get()
  async findAll(@Query() paginationOrderDto: PaginationOrderDto) {
    try {
      const orders = await firstValueFrom(
        this.client.send('findAllOrders', paginationOrderDto),
      );

      return orders;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(
        this.client.send('findOneOrder', { id }),
      );

      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  async changeOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    try {
      return this.client.send('changeOrdeStatus', {
        id,
        status: updateOrderDto.status,
      });
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
