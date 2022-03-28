const inquirer = require('inquirer');
require('colors');

const pausaOpts = [
    {
        type: 'input',
        name: 'pregunta',
        message: `\nPresione ${ 'ENTER'.green } para continuar\n`
    }
];

const menuOpts = [
    {
        type: 'list',
        name: 'opcion',
        message: 'Que desea hacer...?: ',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar ciudad`,
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`
            }
            
        ]
    }
];

const inquirerMenu = async () => {
    console.clear();
    console.log('================================================================'.green);
    console.log('                             Menu                               ');
    console.log('================================================================\n'.green);
    const {opcion} = await inquirer.prompt(menuOpts);
    return opcion;
}


const pausa = async () => {
    console.log('\n');
    await inquirer.prompt(pausaOpts);
}


const leerInput = async (message = '') => {
    const pregunta = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate (value) {
                if (value.length === 0){
                    return 'Ingrese un valor';
                }
                return true;
            }
        }
    ];

    const { desc } = await inquirer.prompt(pregunta);

    return desc;
}

const listarLugares = async(lugares = []) => {

    const choices = lugares.map((lugar, indice) => {

        const idx = `${indice + 1}`.green;

        return {
            value: lugar.id,
            name: `${idx}. ${lugar.nombre}` 
        }
    });

    choices.unshift(
        {
            value: '0',
            name: '0.'.green + ' cancelar' 
        }
    );


    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Indicar lugar: ',
            choices
        }
    ];

    const { id } = await inquirer.prompt(preguntas);

    return id;

}


const confirmar = async (mensaje) => {

    const pregunta = [
        {
            type: 'confirm',
            name: 'ok',
            message: mensaje
        }
    ]

    const { ok } = await inquirer.prompt(pregunta);

    return ok;

}

const mostrarListadoChecklist = async(tareas = []) => {

    const choices = tareas.map((tarea, indice) => {
        const idx = `${indice + 1}`.green;
        return {
            value: tarea.id,
            name: `${idx}. ${tarea.desc}`,
            checked: (tarea.completadoEn) ? true : false
        }
    });

    const pregunta = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Seleccione',
            choices
        }
    ];

    const { ids } = await inquirer.prompt(pregunta);

    return ids;

}



module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares, 
    confirmar,
    mostrarListadoChecklist
}