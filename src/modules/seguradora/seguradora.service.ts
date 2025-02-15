import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import Seguradora from "src/database/models/seguradora.model";

@Injectable()
export class SeguradoraService {
    
    constructor(
        @InjectModel(Seguradora) readonly seguradoraModel: typeof Seguradora
    ) {}

    async buscaSeguradoraPorNome(sSeguradora) {
        return this.seguradoraModel.findAll({
            where: {
                nome: {
                    [Op.iLike]: `%${sSeguradora}%`
                }
            }
        })
    }

    async cadastrarSeguradora(oDados) {
        return this.seguradoraModel.create({
            nome: oDados.sNome
        });
    }

}