import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SinistrosService } from './sinistros.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { TipoSinistro } from 'src/enums/tipoSinistros';

@Controller('sinistros')
export class SinistrosController {

    constructor(private readonly sinistroService: SinistrosService) {}

    @UseGuards(AuthGuard)
    @Get('resumo')
    async getResumoCard(@Query() payload: { tipo: TipoSinistro }): Promise<{ aberto: number, indenizado: number }> {
        return this.sinistroService.getResumoCard(payload.tipo);
    }

}
