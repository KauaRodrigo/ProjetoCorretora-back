import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize, Op } from "sequelize";
import Cliente from "src/database/models/clientes.model";
import Seguradora from "src/database/models/seguradora.model";

@Injectable()
export class ClientesService {

    constructor(
        @InjectModel(Cliente) readonly clienteModel: typeof Cliente,
        @InjectModel(Seguradora) readonly seguradoraModel: typeof Seguradora,
        @Inject('SEQUELIZE') private sequelize: Sequelize
    ) {}

    /**
     * Busca os cliente pelo valor passado no campo nome;
     * 
     * @param { string } sNome 
     * @return { Cliente[]}
     */
    async getClientesPorNome(sNome: string): Promise<Cliente[]> {
        return this.clienteModel.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${sNome}%`
                }
            },
            include: [
                this.seguradoraModel
            ]
        })
    }

    async cadastrarCliente(oDados): Promise<boolean> {
        const iSeguradora = await this.seguradoraModel.findOne({
            where: {
                nome: oDados.seguradora
            }
        });

        oDados.seguradoraId = iSeguradora.id;
        delete oDados.seguradora;

        const cliente: any = await this.clienteModel.create(oDados);

        return !!cliente;
    }
}