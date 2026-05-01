import { useEffect, useState } from 'react'
import { COURSE_CATEGORIES } from '../../lib/constants'
import Button from '../atoms/button'
import Input from '../atoms/Input'
import Select from '../atoms/Select'
import FormField from '../Molecules/FormField'

const emptyForm = {
  title: '',
  description: '',
  category: COURSE_CATEGORIES[0],
}

function CourseForm({ initialValue, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialValue || emptyForm)

  useEffect(() => {
    setForm(initialValue || emptyForm)
  }, [initialValue])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(form)
    setForm(emptyForm)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{initialValue ? 'Хичээл засах' : 'Шинэ хичээл үүсгэх'}</h3>

      <FormField label="Хичээлийн нэр" required>
        <Input name="title" value={form.title} onChange={handleChange} placeholder="Жишээ: React Fundamentals" required />
      </FormField>

      <FormField label="Тайлбар" required>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          required
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          placeholder="Хичээлийн товч танилцуулга..."
        />
      </FormField>

      <FormField label="Ангилал" required>
        <Select name="category" value={form.category} onChange={handleChange}>
          {COURSE_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </FormField>

      <div className="flex flex-wrap gap-2">
        <Button type="submit">{initialValue ? 'Өөрчлөлт хадгалах' : 'Хичээл нэмэх'}</Button>
        {initialValue ? (
          <Button variant="secondary" onClick={onCancel}>
            Болих
          </Button>
        ) : null}
      </div>
    </form>
  )
}

export default CourseForm
