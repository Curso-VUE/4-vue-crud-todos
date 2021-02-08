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
    console.log('La petición para actualizar un todo ha finalizado.')
  }
}

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