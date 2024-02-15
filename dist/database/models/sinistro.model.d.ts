import { Model } from "sequelize-typescript";
import { StatusSinistro } from "src/enums/statusSinistro";
import { TipoSinistro } from "src/enums/tipoSinistros";
export default class Sinistro extends Model {
    codigo: number;
    placa: string;
    nome: string;
    seguradora: string;
    evento: string;
    terceiro: boolean;
    caminho: string;
    tipo: TipoSinistro;
    status: StatusSinistro;
}
