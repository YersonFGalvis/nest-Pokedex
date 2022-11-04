import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) { }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;

    } catch (error) {

      this.handleExceptions(error);
    }

  }

  findAll() {
    return this.pokemonModel.find()
  }

  async findOne(term: string) {

    let pokemon: Pokemon;

    //si es un numero
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    //MongoID

    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    //Name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() })
    }

    if (!pokemon) {
      throw new NotFoundException(`Pokemon with id, name or no "${term}" not found`)
    }


    return pokemon;

  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {
      await pokemon.updateOne(updatePokemonDto);

      // esparzo el pokemon que encontre y le sobreescribo las nuevas propiedades
      return { ...pokemon.toJSON(), ...updatePokemonDto };

    } catch (error) {

      this.handleExceptions(error);

    }
  }

  async remove(id: string) {

    //borrar sin importar que argumento reciba el endpoint, id, no o nombre
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();

    const result = await this.pokemonModel.findByIdAndDelete(id)

    if (!result) {
      throw new NotFoundException(`Pokemon with id: "${id}" not found`);
    }
 
    return result;
    
  }

  private handleExceptions(error: any) {
    //Manejando esta excepcion nos ahorramos tener que hacer 2 consultas a la db preguntando si el id,nombre existen
    if (error.code === 11000) { // si el id del pokemon que quiero actualizar ya existe
      throw new BadRequestException(`Pokemon Already Exists in DB ${JSON.stringify(error.keyValue)}`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Something went wrong - Check server logs`)
  }
}
