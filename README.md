# Lista de tareas CRUD con VUE

1. [Crear y levantar un servidor fake con json-server](#json-server)
2. [Instalación de dependencias](#dependencies)
3. [Explicación del proyecto y el router de vue](#router)
4. [Desarrollar plugins para utilizar las dependencias instaladas](#plugins)

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

