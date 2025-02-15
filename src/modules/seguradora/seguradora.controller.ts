import { SeguradoraService } from './seguradora.service';
import { Body, Controller, Post } from "@nestjs/common";

@Controller('seguradoras')
export class SeguradoraController {

    constructor(private readonly seguradoraService: SeguradoraService) {}

    @Post('')
    async buscaSeguradorasPorNome(@Body() oBody: { sNome: string }) {
        return this.seguradoraService.buscaSeguradoraPorNome(oBody.sNome);
    }

    @Post('cadastrar')
    async cadastrarSeguradora(@Body() oDados: {sNome: string }) {
        return this.seguradoraService.cadastrarSeguradora(oDados);
    }

}