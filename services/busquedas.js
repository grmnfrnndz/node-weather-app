const fs = require('fs');

const axios = require('axios');


class Busquedas {

    historial = [];
    archivoPath = './db/data.json'
    
    constructor() {
        // TODO: leer DB si existe
        const data = this.leerDB();
        if (data && data.historial.length > 0) {
            this.historial = data.historial;
        }
    }

    get historialCapitalizado() {

        // solucion del curso
        // let palabras = lugar.split(' ');
        // palabras = palabras.map(p => p[0].toUpperCase() = p.substring(1));

        return this.historial.map(lugar => {
            const capitalizado = lugar.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
            return capitalizado;
        });
    }

    get paramsMapbox() {
        return {
            limit: 5,
            language: 'es',
            access_token: process.env.MAPBOX_KEY
        };
    }

    get paramsOpenWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        };
    }

    async ciudad(lugar='') {
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            const respuesta = await instance.get();
            return respuesta.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
        } catch (error) {
            return [];
        }
    }

    async climaLugar(lat, lon) {
        try {
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {...this.paramsOpenWeather, lat, lon} 
            });

            const respuesta = await instance.get();
            const {weather, main} = respuesta.data;
            return {
                desc: weather[0].description,
                temp: main.temp,
                max: main.temp_max,
                min: main.temp_min
            };
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    agregarHistorial(lugar = '') {

        if (this.historial.includes(lugar.toLocaleLowerCase())) return;

        // esto mantiene desde la posicion 0 a la 5 dejando fuera lo demas registros 
        // solo quedaran los ultimos 6 registros
        this.historial = this.historial.splice(0, 5);

        this.historial.unshift(lugar.toLocaleLowerCase());

        // grabar en la db
        this.guardarDB();
    }

    guardarDB() {

        const payload = {
            historial: this.historial
        };

        fs.writeFileSync(this.archivoPath, JSON.stringify(payload));
    }

    leerDB () {

        // existe el archivo
        if(!fs.existsSync(this.archivoPath)) return null;

        const info = fs.readFileSync(this.archivoPath, {encoding: 'utf-8'});
        const data = JSON.parse(info);
        return data;
    }

}

module.exports = Busquedas;