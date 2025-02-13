import { SeguradoraService } from './seguradora.service';
import { Body, Controller, Post } from "@nestjs/common";

@Controller('seguradoras')
export class SeguradoraController {

    constructor(private readonly SeguradoraService: SeguradoraService) {}

    @Post('')
    async buscaSeguradorasPorNome(@Body() oBody: { sNome: string }) {
        return this.SeguradoraService.buscaSeguradoraPorNome(oBody.sNome);
    }

}