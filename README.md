# Lista de tareas CRUD con VUE

1. [Crear y levantar un servidor fake con json-server](#json-server)
2. [Instalación de dependencias](#dependencies)
3. [Explicación del proyecto y el router de vue](#router)
4. [Desarrollar plugins para utilizar las dependencias instaladas](#plugins)
5. [Iniciar módulo TODOS, definir estado, getters y mutaciones](#todos-module)
6. [Consumir la API utilziando vue-axios a través de acciones](#actions)

<hr>

<a name="json-server"></a>

## 1. Crear y levantar un servidor fake con json-server

El servicio json-server permite crear una api fake a la que podamos hacer peticiones.

Creamos una archivo *json-server/db.json* con el siguiente contenido:

~~~json
{
  "todos": []
}
~~~

Levantamos el servidor con el comando 
~~~
json-server --watch db.json
~~~


<hr>

<a name="dependencies"></a>

## 2. Instalación de dependencias

Para este proyecto utilizaremos los siguientes plugins/librarías:

- [axios](https://github.com/axios/axios)
- [vue-axios](https://github.com/imcvampire/vue-axios)
- [bootstrap-vue](https://bootstrap-vue.org/)
- [vuelidate](https://vuelidate.js.org/)

Las instalamos mediante el siguiente comando:
~~~
npm i axios vue-axios bootstrap-vue vuelidate
~~~

<hr>

<a name="router"></a>

## 3. Explicación del proyecto y el router de vue.

Al inticar en Vue UI que vamos a utilizar el router de vue, se ha generado una carpeta **views** que incluirá las distintas páginas de la aplicación y un archivo *router.js*.

El archivo **router** incluye las distintas rutas que va a tener la aplicación y cada ruta apunta a una de las páginas de **views**.

El router permite cargar las rutas de forma estática:
~~~js
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  }
]
~~~

O de forma dinámica: 
~~~js
const routes = [
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]
~~~

> Eliminamos el componente HelloWorld y todas sus referencias.


<hr>

<a name="plugins"></a>

## 4. Desarrollar plugins para utilizar las dependencias instaladas

En el componente principal *App.vue* podemos ver en el template que aparece la configuración para la barra de navecacion (*router-link*) y la etiqueta que carga las vistas (*router-view*).

~~~html
<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>
~~~

Creamos una carpeta *src/plugins* con los siguientes archivos:

- *vue-axios.js*

~~~js
import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';

const baseURL = 'http://localhost:3000';

axios.defaults.baseURL = baseURL;
Vue.use(VueAxios, axios);
~~~

- *vuelidate.js*

~~~js
import Vue from 'vue';
import Vuelidate from 'vuelidate';
Vue.use(Vuelidate);
~~~

- *bootstrap-vue.js*
~~~js
import Vue from 'vue'
import { BootstrapVue } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
~~~

- *index.js*

~~~js
require('./bootstrap-vue');
require('./vue-axios');
require('./vuelidate');
~~~


<hr>

<a name="todos-module"></a>

## 5. Iniciar módulo TODOS, definir estado, getters y mutaciones

Creamos el directorio *src/modules* y en su interior los archivos en donde configuraremos state, actions, mutations y getters. Incluimos un *index.js* para importar estos archivos:

~~~js
import state from './state';
import * as mutations from './mutations';
import * as actions from './actions';
import * as getters from './getters';

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
~~~

### State

Establecemos el estado que tendrá este módulo:

~~~js
export default {
  todos: [],
  selectedTodo: null,
  error: false,
  errorMessage: ''
}
~~~

### Getters

Utilizaremos los getters para obtener listas de tareas filtradas por su estado.

~~~js
export function pending(state) {
  return state.todos.filter( todo => !todo.done );
}

export function done(state) {
  return state.todos.filter( todo => todo.done );
}
~~~

### Mutations

Definimos las funciones que alterarán los datos del estado:

~~~js
export function setTodos(state, todos) {
  state.todos = todos;
}

export function setTodo(state, todo) {
  state.selectedTodo = todo;
}

export function updateTodoStatus(state, payload) {
  const todo = state.todos.find( t => t.id === payload.id );
  if (todo) {
    todo.done = !todo.done;
  }
}

export function todosError(state, payload) {
  state.error = true;
  state.errorMessage = payload;
  state.todos = [];
}
~~~


<hr>

<a name="actions"></a>

## 6. Consumir la API utilziando vue-axios a través de acciones

En el archivo *src/todos/actions.js* las distintas llamadas asíncronas que realizará la aplicación:

- Obtener la lista de tareas:

~~~js
import Vue from 'vue';

export async function fetchTodos({commit}) {
  try {
    const { data } = await Vue.axios({
      url: '/todos'
    })
    commit('todos/setTodos', data, {root: true})
  } catch (error) {
    commit('todos/todosError', error.message, {root: true})
  } finally {
    console.log('La petición para obtener los datos ha finalizado.')
  }
}
~~~

- Crear una tarea:

~~~js
export async function addTodo({commit}, todo) {
  try {
    await Vue.axios({
      method: 'POST',
      url: '/todos',
      data: {
        id: Date.now(),
        text: todo.text,
        done: false
      }
    })
  } catch (error) {
    commit('todos/todosError', error.message, {root: true})
  } finally {
    console.log('La petición para crear un todo ha finalizado.')
  }
}
~~~

- Actualizar una tarea: 

~~~js
export async function updateTodo({commit}, todo) {
  try {
    await Vue.axios({
      method: 'PUT',
      url: `/todos/${todo.id}`,
      data: {
        id: todo.id,
        text: todo.text,
        done: todo.done
      }
    })
  } catch (error) {
    commit('todos/todosError', error.message, {root: true})
  } finally {
    console.log('La petición para crear un todo ha finalizado.')
  }
}
~~~

- Actualizar el estado de una tarea: 

~~~js
export async function updateTodoStatus({commit}, todo) {
  try {
    await Vue.axios({
      method: 'PUT',
      url: `/todos/${todo.id}`,
      data: {
        id: todo.id,
        text: todo.text,
        done: !todo.done
      }
    })
  } catch (error) {
    commit('todos/todosError', error.message, {root: true})
  } finally {
    console.log('La petición para actualizar el estado de un todo ha finalizado.')
  }
}
~~~

- Eliminar una tarea:

~~~js
export async function removeTodo({commit, dispatch}, id) {
  try {
    await Vue.axios({
      method: 'DELETE',
      url: `/todos/${id}`
    })
    dispatch('fetchTodos')
  } catch (error) {
    commit('todos/todosError', error.message, {root: true})
  } finally {
    console.log('La petición para actualizar el estado de un todo ha finalizado.')
  }
}
~~~

> Dispatch permite lanzar otra acción, en este caso para volver a obtener la lista de tareas una vez eliminada una de ellas.

Por último sólo nos falta cargar el módulo en el **store**, que quedaría de la siguiente manera:

~~~js
import Vue from 'vue'
import Vuex from 'vuex'
import todos from '../modules/todos'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    todos
  }
})
~~~