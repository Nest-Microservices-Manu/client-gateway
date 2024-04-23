import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus, OrderStatusList } from '../enum/order.enum';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
 
  @IsOptional()
  @IsEnum(OrderStatusList , {
    message: `Valid status are ${OrderStatusList}`
  })
  status?: OrderStatus;
}
