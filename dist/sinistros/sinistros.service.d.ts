import Sinistro from 'src/database/models/sinistro.model';
import { TipoSinistro } from 'src/enums/tipoSinistros';
export declare class SinistrosService {
    readonly sinistroModel: typeof Sinistro;
    constructor(sinistroModel: typeof Sinistro);
    getResumoCard(tipo: TipoSinistro): Promise<{
        aberto: number;
        indenizado: number;
    }>;
}
