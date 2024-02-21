import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SinistrosService } from './sinistros.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { TipoSinistro } from 'src/enums/tipoSinistros';
import LastRecords from 'src/dtos/lastRecords.dto';

@UseGuards(AuthGuard)
@Controller('sinistros')
export class SinistrosController {

    constructor(private readonly sinistroService: SinistrosService) {} 

    @Get('resumo')
    async getResumoCard(@Query() payload: { tipo: TipoSinistro }): Promise<{ aberto: number, indenizado: number }> {
        return this.sinistroService.getResumoCard(payload.tipo);
    }

    @Get('last-records')
    async getLastRecords(): Promise<{ rows: LastRecords[], count: number}> {
        return this.sinistroService.getLastRecords()
    }


}
