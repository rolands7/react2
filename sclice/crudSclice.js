import {createAction, createReducer} from '@reduxjs/toolkit';
import {useSelector} from 'react-redux';
import uuid from 'react-native-uuid';
import Instana from '@instana/react-native-agent';

const CREATE_NEW = createAction('add-new');
const MODAL = createAction('modal');
const UPDATE_MODAL = createAction('update-modal');
const LOADING = createAction('load');
const REMOVE_ONE = createAction('remove-one');
const UPDATE_ONE = createAction('update-one');
const PLACEHOLDER_DATA = createAction('placeholder-data');

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

let date = mm + '/' + dd + '/' + yyyy;

const initialState = {
  modalOpen: false,
  PlaceHolder: null,
  updateModalOpen: false,
  loading: false,
  quotes: [
    {
      id: 1,
      author: 'Vivian Greene',
      date: `${date}`,
      text: "Life isn't about waiting for the storm to pass. It's about learning how to dance in the rain.",
    },
    {
      id: 2,
      author: 'Maya Angelou',
      date: `${date}`,
      text: 'Still, like air, I rise.',
    },
    {
      id: 3,
      author: 'Confucius',
      date: `${date}`,
      text: 'Our greatest glory is not in never falling, but in rising every time we fall.',
    },
  ],
};
// Create new
const Quote = createReducer(initialState, builder => {


  builder.addCase(CREATE_NEW, (state, action) => {
   //
    Instana.setView('AddView');
    // Variables de tiempo
    const startTime = performance.now(); // Inicio de la ejecución de la función
    let prev = JSON.parse(JSON.stringify(state.quotes));
    prev.unshift({
      ...action.payload,
      id: uuid.v4(),
      date: `${date}`,
    });

    const endTime = performance.now(); // Fin de la ejecución de la función
    const duration = endTime - startTime; // Duración en milisegundos
      // Log del tiempo de duración
      console.log(`Tiempo de duración de la operación Crear: ${duration.toFixed(2)} ms`);

    Instana.reportEvent('crearCita', {
      duration: duration,
      meta: {
        duration: String(duration),
        viewName: 'AddView'
      },
    });
    

    return {
      ...state,
      quotes: prev,
    };
  });

  // Update one

  builder.addCase(UPDATE_ONE, (state, action) => {
    Instana.setView('UpdateView');
    // Variables de tiempo
    const startTime = performance.now(); // Inicio de la ejecución de la función    
    let prev = JSON.parse(JSON.stringify(state.quotes));
    const index = prev.findIndex(obj => obj.id === action.payload.id);
    if (index !== -1) prev[index] = action?.payload;
    const endTime = performance.now(); // Fin de la ejecución de la función
    const duration = endTime - startTime; // Duración en milisegundos
      // Log del tiempo de duración
      console.log(`Tiempo de duración de la operación actualizar: ${duration.toFixed(2)} ms`);

    Instana.reportEvent('actualizarCita', {
      duration: duration,
      meta: {
        duration: String(duration),
        viewName: 'UpdateView'
      },
    });
    return {
      ...state,
      quotes: prev,
    };
  });

  // Delete one

  builder.addCase(REMOVE_ONE, (state, action) => {
    Instana.setView('DeleteView');
    const startTime = performance.now(); // Inicio de la ejecución de la función  
    let prev = JSON.parse(JSON.stringify(state.quotes));
    const index = prev.findIndex(obj => obj.id === action?.payload);
    if (index !== -1) prev.splice(index, 1);
    const endTime = performance.now(); // Fin de la ejecución de la función
    const duration = endTime - startTime; // Duración en milisegundos
      // Log del tiempo de duración
      console.log(`Tiempo de duración de la operación Eliminar: ${duration.toFixed(2)} ms`);

    try {
      // Simulamos una operación que podría fallar
      throw new Error('Hubo un problema al eliminar la cita');
    } catch (err) {
      Instana.reportEvent('eliminarCita', {
        duration: duration, 
        meta: {
          duration: String(duration),
          viewName: 'DeleteView'
        },
        error: {
          message: err.message, // Mensaje del error
          stack: err.stack,     // Pila del error para mayor detalle (opcional)
          name: err.name,       // Nombre del error
        },
      });
    }
    
    return {
      ...state,
      quotes: prev,
    };
  });

  // Fire form modal
  builder.addCase(MODAL, (state, action) => {
    return {
      ...state,
      modalOpen: action.payload,
    };
  });

  // Fire update form modal
  builder.addCase(UPDATE_MODAL, (state, action) => {
    return {
      ...state,
      updateModalOpen: action.payload,
    };
  });

  // Fire Activity Indicator
  builder.addCase(LOADING, (state, action) => {
    return {
      ...state,
      loading: action.payload,
    };
  });
  // Use to hold temp data for update
  builder.addCase(PLACEHOLDER_DATA, (state, action) => {
    return {
      ...state,
      PlaceHolder: action.payload,
    };
  });
});

export default Quote;

export {
  CREATE_NEW,
  MODAL,
  LOADING,
  REMOVE_ONE,
  UPDATE_ONE,
  UPDATE_MODAL,
  PLACEHOLDER_DATA,
};
