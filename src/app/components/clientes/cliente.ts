import { Region } from './region';

export class Cliente {
    public id: number;
    public nombre: string;
    public apellido: string;
    public createdAt: string;
    public email: string;
    public foto: string;
    public region: Region;
}
