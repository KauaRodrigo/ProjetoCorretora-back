import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { SinistrosService } from './sinistros.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { TipoSinistro } from 'src/enums/tipoSinistros';
import LastRecords from 'src/dtos/lastRecords.dto';
import {FileInterceptor} from "@nestjs/platform-express";

@UseGuards(AuthGuard)
@Controller('sinistros')
export class SinistrosController {

    constructor(private readonly sinistroService: SinistrosService) {}
    
    @Post('')
    async FindAccidentsByFilters(@Body() filters: any ): Promise<{ rows: any[], count: number }> {
        return this.sinistroService.getAccidentsByFilters(filters)
    }

    @Get('resumo')
    async getResumoCard(@Query() payload: { tipo: TipoSinistro }): Promise<{ aberto: number, indenizado: number }> {
        return this.sinistroService.getResumoCard(payload.tipo);
    }

    @Post('criar')
    @UseInterceptors(FileInterceptor('file'))
    async createAccidentRegister(@Body() payload: any, @UploadedFile() file): Promise<boolean> {
        console.log(file)
        return this.sinistroService.CreateAccidentRegister(payload)
    }

    @Post('editar/:id')
    async editAccidentRegister(@Body() payload: any, @Param('id') id: number): Promise<boolean> {
        return this.sinistroService.editAccidentRegister(id, payload);
    }

    @Post('excluir/:id')
    async excludeAccidentRegister(@Param('id') id: number): Promise<boolean> {
        return this.sinistroService.excludeAccidentRegister(id);
    }

    @Post('atualizar/:id')
    async updateStatusRegister(@Body() payload: { status: string }, @Param('id') id: number): Promise<boolean> {
        return this.sinistroService.updateStatusRegister(payload, id);
    }

    @Get('last-records')
    async getLastRecords(): Promise<{ rows: LastRecords[], count: number}> {
        return this.sinistroService.getLastRecords()
    }

    @Get('/:id')
    async getAccidentSingle(@Param('id') id: number): Promise<any> {
        return this.sinistroService.getAccidentSingle(id);
    }

}
