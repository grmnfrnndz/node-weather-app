require('dotenv').config();
require('colors');

const { inquirerMenu, pausa, leerInput, listarLugares } = require('./helpers/iniquirer');
const Busquedas = require('./services/busquedas');


const main = async () => {

    let opt;
    const busquedas = new Busquedas();

    do {
        // mostrar menu
        opt = await inquirerMenu();


        switch (opt) {
            case 1:
                // mostrar mensaje
                const lugar = await leerInput('Ciudad: ');
                // buscar el lugar
                const lugares = await busquedas.ciudad(lugar);
                // seleccionar lugar
                const lugar_id = await listarLugares(lugares);

                if (lugar_id !== '0') {
                    const lugar_sel = lugares.find( l => l.id === lugar_id);
                    const {nombre, lat, lng} = lugar_sel;

                    busquedas.agregarHistorial(nombre);
                    // Mostrar resultados
                    // clima

                    const clima = await busquedas.climaLugar(lat,  lng);

                    if (clima) {

                        const {desc, temp, max, min} = clima;
                        console.clear();
                        console.log('\nInfo del lugar\n'.green);
                        console.log('Ciudad: ', nombre);
                        console.log('Lat: ', lat);
                        console.log('Lng: ', lng);
                        console.log('Temp: ', temp);
                        console.log('Min: ', min);
                        console.log('Max: ', max);
                        console.log('Estado del clima: ', desc);
                    } 
                }
                break;
            case 2:
                busquedas.historialCapitalizado.forEach((lugar, index) => {
                    const idx = `${index + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                });
                break;
        
            default:
                break;
        }



        // solo cuando la opcion es distinta de 0, se mostra la pausa
        if (opt !== 0) await pausa();

    // si la opt es 0 se saldra del ciclo
    } while (opt !== 0);

}

main();
