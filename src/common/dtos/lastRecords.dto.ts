import { TipoSinistro } from "src/common/enums/tipoSinistros"

export default class LastRecords {
    id: number
    code: number
    type: TipoSinistro
    event: string
    company: string
    clientName: string
}