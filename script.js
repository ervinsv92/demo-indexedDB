const indexedDB = window.indexedDB;
let db;

if (indexedDB) {
  const request = indexedDB.open('taskList', 1);

  request.onsuccess = () => {
    db = request.result;
    console.log('Open', db);
  };

  request.onupgradeneeded = () => {
    db = request.result;
    console.log('Create', db);

    const objStore = db.createObjectStore('tasks', {
      //genera la clave automaticamente
      autoIncrement: true //hay varios tipos, este es el mas facil
      //keyPath: 'titulo' //la llave es el valor de una propiedad del objeto
    });
  };

  request.onerror = e => {
    console.log('Error', e);
  };
}

const guardar = () => {
  const titulo = prompt('Titulo de tarea');
  const obj = {
    titulo,
    id: new Date().getTime()
  };

  //Para poder trabajar sobre la bd hay que hacer lo siguiente
  //1- abrir una transaccion
  //el primer parametro es el almacen de datos (coleccion)
  //los tipos de transaccion son 'readonly', 'readwrite', entre otros
  const transaction = db.transaction(['tasks'], 'readwrite');

  //se abre el almacen
  const objStore = transaction.objectStore('tasks');

  //aniadir datos
  const request = objStore.add(obj);
};

const leerDatos = () => {
  const transaction = db.transaction(['tasks'], 'readonly'); //readonly es el por defecto, si se quiere no se pone

  //se abre el almacen
  const objStore = transaction.objectStore('tasks');

  //aniadir datos
  const request = objStore.openCursor();

  request.onsuccess = e => {
    const cursor = e.target.result;
    if (cursor) {
      console.log(cursor.value);
      cursor.continue();
    }
  };
};
