import { Region } from './region';
import { Factura } from '../facturas/models/factura';

export class Cliente {
    public id: number;
    public nombre: string;
    public apellido: string;
    public createdAt: string;
    public email: string;
    public foto: string;
    public region: Region;
    public facturas: Factura[] = [];
}
