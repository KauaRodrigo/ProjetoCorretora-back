import { StatusSinistro } from "src/enums/statusSinistro";
import { TipoSinistro } from "src/enums/tipoSinistros"

export default class SinistroDto {

    id: number;
    numeroApolice: number;
    numeroSinistro: number;
    tipo: TipoSinistro;
    evento: string;
    cliente: string;
    status: StatusSinistro;
    seguradora: string;

}