import axios from 'axios';
import process from 'process';

// Accept infinite arguments id or name
const args = process.argv;

const getPokemon = async (name: string, id: number) => {
    try {
        const response = await axios.get<any>(`https://pokeapi.co/api/v2/pokemon/${name || id}`);
        const pokemon = response.data; 
        //console.log(`Types: ${pokemon.types.map((type: { type: { name: any; }; }) => type.type.name).join(', ')}`);
        // log the next pokemon evolution and previous evolution if available with their id
        console.log(`\n${pokemon.name} : `);
        console.log(` - ID: ${pokemon.id}`);
        console.log(` - Height: ${pokemon.height}`);
        console.log(` - Weight: ${pokemon.weight}`);
        console.log(`\n`);
        // log in the console the pokemon stats
        pokemon.stats.forEach((stat: any) => {
            console.log(` - ${stat.stat.name}: ${stat.base_stat}`);
        });
        console.log(`\n`);
        if (pokemon.species.url) {
            // Another request to get the pokemon evolution chain
            const speciesResponse = await axios.get<any>(pokemon.species.url);
            const species = speciesResponse.data;
            // Pokemon name + french name

            // If it has already evolved
            if (species.evolves_from_species) {
                console.log(` - Previous evolution: ${species.evolves_from_species.name} (${species.evolves_from_species.url.split('/').slice(-2, -1)})`);
            }

            // fetch and log the CORRECT evolution chain
            const evolutionResponse = await axios.get<any>(species.evolution_chain.url);
            const evolution = evolutionResponse.data;
            if (evolution.chain.evolves_to.length > 0) {
                if(evolution.chain.evolves_to[0].species.name === pokemon.name) {
                    console.log(` - Next evolution: ${evolution.chain.evolves_to[0].evolves_to[0].species.name} (${evolution.chain.evolves_to[0].evolves_to[0].species.url.split('/').slice(-2, -1)})`);
                }
                else if(evolution.chain.evolves_to[0].evolves_to[0].species.name === pokemon.name) {
                    console.log(` - No more evolution`);
                }
                else {
                    console.log(` - Next evolution: ${evolution.chain.evolves_to[0].species.name} (${evolution.chain.evolves_to[0].species.url.split('/').slice(-2, -1)})`);
                }
            }
        }
    } catch (error) {
        //console.error(error);
    }
}
async function main() {
    // Get all arguments
    for(const arg of args) {
        // If argument is a number, get pokemon by id
        if (!isNaN(parseInt(arg))) {
            await getPokemon('', parseInt(arg));
        } else {
            // If argument is a string, get pokemon by name
            await getPokemon(arg, 0);
        }
    }
}

main();

