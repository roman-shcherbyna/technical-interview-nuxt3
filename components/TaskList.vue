<template>
  <div class="tasks-wrapper">
    <div v-if="editingTask" class="edit-form-wpraper">
      <h2 class="h2-main">Edytuj zadanie</h2>

      <Form
        v-if="schema"
        :validation-schema="schema"
        :initial-values="editData"
        v-slot="{ handleSubmit, resetForm }"
      >
        <form @submit.prevent="handleSubmit(values => saveTask(values, resetForm))">
          <div class="form-item-wrapper">
            <ErrorMessage class="error" name="title" />
            <Field name="title" class="change-task-title" placeholder="Nagłówek" />
          </div>

          <div class="form-item-wrapper">
            <ErrorMessage class="error" name="description" />
            <Field
              name="description"
              as="textarea"
              class="change-task-description"
              placeholder="Opis"
            />
          </div>

          <div class="form-item-wrapper">
            <ErrorMessage class="error" name="deadline" />
            <Field
              name="deadline"
              type="datetime-local"
              class="change-task-deadline"
            />
          </div>

          <div class="change-task-is-done-wrapper">
            <label class="change-task-is-done">
              <Field name="is_done" type="checkbox" :value="true" :unchecked-value="false" />
              Wykonana
            </label>
          </div>
          <div class="wrapper-for-buttons-edit">
            <button class="save-change-task-button" type="submit">Zapisz</button>
            <button class="cancel-change-task-button" type="button" @click="cancelEdit">Anuluj</button>
          </div>
        </form>
      </Form>
    </div>

    <h2 class="h2-main">Lista zadań</h2>
    <h3 aria-live="polite">Ilość zadań:{{ totalTasks }}</h3>
    <div v-for="task in tasks" :key="task.id" class="task">
      <div class="task-title">{{ task.title }}</div>

      <div class="task-description">{{ task.description }}</div>

      <div class="task-is-done" v-if="task.is_done">
        <span class="task-is_done-green">✔</span>
        Wykonana
      </div>

      <div class="task-is-done" v-else>
        <span class="task-is_done-red">✘</span>
        Niewykonana
      </div>

      <div class="task-datetime">{{ new Date(task.deadline).toLocaleString() }}</div>
      <button class="button-change" @click="editTask(task)">Edytuj</button>
      <button class="button-delete" @click="removeTask(task.id)">Usuń</button></div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { useTasks } from '~/composables/useTasks'


const { tasks, fetchTasks, deleteTask, updateTask } = useTasks()

const totalTasks = computed(() => Array.isArray(tasks.value) ? tasks.value.length : 0)

const schema = ref(null)
onMounted(() => {
  schema.value = yup.object({
    title: yup.string().required('Nagłówek jest wymagany').min(10, 'Min. 10 symboli'),
    description: yup.string().required('Opis jest wymagany'),
    deadline: yup.date().transform((value, originalValue) => originalValue === '' ? null : value).required('Data jest wymagana'),
    is_done: yup.boolean(),
  })
})

let intervalId
onMounted(() => {
  fetchTasks()
  intervalId = setInterval(fetchTasks, 5000)
})
onUnmounted(() => {
  clearInterval(intervalId)
})

function removeTask(id) {
  deleteTask(id)
}

const editingTask = ref(null)
const editData = ref({
  title: '',
  description: '',
  deadline: '',
  is_done: false
})

function editTask(task) {
  editingTask.value = task
  editData.value = {
    title: task.title ?? '',
    description: task.description ?? '',
    deadline: formatForDateTimeLocal(task.deadline),
    is_done: !!task.is_done
  }
}

function saveTask(values, resetForm) {
  const payload = {
    ...values,
  }

  updateTask(editingTask.value.id, payload)
  editingTask.value = null
  resetForm()
}

function cancelEdit() {
  editingTask.value = null
}

function formatForDateTimeLocal(d) {
  if (!d) return ''
  const date = typeof d === 'string' || typeof d === 'number' ? new Date(d) : d
  if (isNaN(date.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  const yyyy = date.getFullYear()
  const mm = pad(date.getMonth() + 1)
  const dd = pad(date.getDate())
  const hh = pad(date.getHours())
  const min = pad(date.getMinutes())
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`
}
</script>
