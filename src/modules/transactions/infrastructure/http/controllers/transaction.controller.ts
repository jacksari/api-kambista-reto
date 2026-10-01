import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { CreateTransactionUseCase } from '../../../application/use-cases/create-transaction.use-case';
import { AuthenticatedUser } from '../../../../auth/infrastructure/tokens/jwt-access-token.service';
import { CurrentUser } from '../../../../auth/infrastructure/http/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../../auth/infrastructure/http/guards/jwt-auth.guard';
import { CreateTransactionRequestDto } from '../dto/create-transaction-request.dto';
import {
    CreateTransactionResponseDto,
    toCreateTransactionResponse,
} from '../dto/create-transaction-response.dto';
import { GetTransactionHistoryUseCase } from 'src/modules/transactions/application/use-cases/get-transaction-history.use-case';
import { GetTransactionHistoryQueryDto } from '../dto/get-transaction-history-query.dto';
import { toTransactionHistoryResponse, TransactionHistoryResponseDto } from '../dto/transaction-history-response.dto';
import { UserRole } from 'src/modules/auth/domain/enums/user-role.enum';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
    constructor(
        private readonly createTransaction:
            CreateTransactionUseCase,
        private readonly getTransactionHistory:
            GetTransactionHistoryUseCase,
    ) { }

    @Post()
    async create(
        @CurrentUser() user: AuthenticatedUser,
        @Body() request: CreateTransactionRequestDto,
    ): Promise<CreateTransactionResponseDto> {
        const transaction =
            await this.createTransaction.execute({
                userId: user.id,
                sourceCurrency: request.monedaOrigen,
                targetCurrency: request.monedaDestino,
                amount: request.monto,
            });

        return toCreateTransactionResponse(transaction);
    }

    @Get('history')
    async getHistory(
        @CurrentUser() user: AuthenticatedUser,
        @Query() query: GetTransactionHistoryQueryDto,
    ): Promise<TransactionHistoryResponseDto> {
        const history =
            await this.getTransactionHistory.execute({
                authenticatedUserId: user.id,
                isAdmin: user.role === UserRole.ADMIN,
                requestedUserId: query.userId,
                startDate: new Date(query.startDate),
                endDate: new Date(query.endDate),
                page: query.page,
                perPage: query.perPage,
            });

        return toTransactionHistoryResponse(history);
    }
}