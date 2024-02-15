import { SinistrosService } from './sinistros.service';
import { TipoSinistro } from 'src/enums/tipoSinistros';
export declare class SinistrosController {
    private readonly sinistroService;
    constructor(sinistroService: SinistrosService);
    getResumoCard(payload: {
        tipo: TipoSinistro;
    }): Promise<{
        aberto: number;
        indenizado: number;
    }>;
}
