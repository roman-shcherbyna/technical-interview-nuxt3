export function useTasks() {
  const token = useCookie('token')
  const config = useRuntimeConfig()
  const tasks = ref([])

  async function fetchTasks() {
    tasks.value = await $fetch(`${config.public.apiBase}/tasks`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })
  }

  async function addTask(taskData) {
    await $fetch(`${config.public.apiBase}/tasks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: taskData,
    })
    fetchTasks()
  }

  async function deleteTask(taskId) {
    await $fetch(`${config.public.apiBase}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })
    fetchTasks()
  }

  async function updateTask(taskId, updatedTask) {
    await $fetch(`${config.public.apiBase}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: updatedTask,
    })
    fetchTasks()
  }

  return {
    tasks,
    fetchTasks,
    addTask,
    deleteTask,
    updateTask,
  }
}
