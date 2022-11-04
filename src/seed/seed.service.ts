import { Injectable } from '@nestjs/common';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { PokeResponse } from './interfaces/poke-response.interface';
import { AxiosAdapter } from '../common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  //inyectamos el servicio de pokemon 
  constructor(
    private readonly pokemonService: PokemonService,
    private readonly http: AxiosAdapter
  ){}
  
  async executeSeed(){

    await this.pokemonService.deleteMany() //delete * from pokemon

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650 ');

    const pokemonToInsert:CreatePokemonDto[] = []

    data.results.forEach(({ name, url}) => {

      const segments = url.split('/');
      const no = +segments[ segments.length - 2] //tomamos la penultima posicion

      // const pokemon = await this.pokemonService.create(Pokemon)

      pokemonToInsert.push({name,no})

    });

    await this.pokemonService.insertMany(pokemonToInsert)

    return `SEED EXECUTED`;
  }


}
