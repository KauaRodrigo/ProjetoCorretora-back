import Cliente from "src/database/models/clientes.model";
import Seguradora from "src/database/models/seguradora.model";
import { StatusSinistro } from "src/enums/statusSinistro";
import { TipoSinistro } from "src/enums/tipoSinistros"

export default class SinistroDto {

    id?: number;
    numeroApolice: number;
    numeroSinistro: number;
    nome: string;
    placa?: string;
    tipo: TipoSinistro;
    observacoes: string;
    evento: string;
    terceiro: boolean;
    status?: StatusSinistro;
    dataOcorrencia: Date|string;
    fotos: any;
    cliente?: Cliente;
    seguradora?: Seguradora|string;

}