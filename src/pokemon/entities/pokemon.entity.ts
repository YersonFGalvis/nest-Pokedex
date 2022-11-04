import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Pokemon extends Document {
    // id no se especifica porque mongo ya me lo da
    @Prop({
        unique: true,
        index: true, // el indice especifica exactamente donde esta el pokemon guardado
    })
    name: string;
    @Prop({
        unique: true,
        index: true, // el indice especifica exactamente donde esta el pokemon guardado
    })
    no:number;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
