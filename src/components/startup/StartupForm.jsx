import { useForm, useFieldArray } from 'react-hook-form';
import { Input, Textarea, Select, Option, Button, IconButton } from '@material-tailwind/react';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { DEVELOPER_CATEGORIES, LEVELS, STARTUP_STAGES } from '../../constants/categories.js';

// defaultValues bo'lsa - tahrirlash rejimi, bo'lmasa - yangi startap yaratish
const StartupForm = ({ defaultValues, onSubmit, isSubmitting }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues || {
      title: '',
      description: '',
      industry: '',
      stage: 'Idea',
      website: '',
      requiredRoles: [], // MUHIM: bo'sh qoldirish mumkin, majburiy emas
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'requiredRoles' });

  const submitHandler = (data) => {
    const payload = {
      ...data,
      tags: typeof data.tags === 'string' ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : data.tags,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-5">
      <Input
        label="Startap nomi"
        {...register('title', { required: 'Startap nomi kiritilishi shart' })}
        error={!!errors.title}
      />
      {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}

      <Textarea
        label="Batafsil ma'lumot"
        rows={5}
        {...register('description', { required: "Startap haqida ma'lumot kiritilishi shart" })}
        error={!!errors.description}
      />
      {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Sohasi (masalan: EdTech)" {...register('industry')} />
        <Select label="Bosqich" {...register('stage')} defaultValue={defaultValues?.stage || 'Idea'}>
          {STARTUP_STAGES.map((s) => (
            <Option key={s.value} value={s.value}>
              {s.label}
            </Option>
          ))}
        </Select>
      </div>

      <Input label="Veb-sayt (ixtiyoriy)" {...register('website')} />
      <Input label="Teglar (vergul bilan ajrating)" {...register('tags')} />

      {/* Kerakli mutaxassislar - IXTIYORIY bo'lim */}
      <div className="rounded-xl border border-gray-200 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Kerakli mutaxassislar (ixtiyoriy)</p>
            <p className="text-xs text-gray-500">
              To'ldirmasangiz ham bo'ladi — dasturchilar baribir qo'shilish uchun so'rov yubora oladi.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outlined"
            className="flex items-center gap-1"
            onClick={() => append({ category: DEVELOPER_CATEGORIES[0].value, level: 'Junior', slots: 1 })}
          >
            <PlusIcon className="h-4 w-4" /> Qo'shish
          </Button>
        </div>

        {fields.length === 0 && (
          <p className="text-sm text-gray-400">Hozircha mutaxassis talabi kiritilmagan.</p>
        )}

        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[2fr_1fr_1fr_auto]">
              <Select label="Mutaxassislik" {...register(`requiredRoles.${index}.category`)} defaultValue={field.category}>
                {DEVELOPER_CATEGORIES.map((c) => (
                  <Option key={c.value} value={c.value}>
                    {c.label}
                  </Option>
                ))}
              </Select>
              <Select label="Daraja" {...register(`requiredRoles.${index}.level`)} defaultValue={field.level}>
                {LEVELS.map((l) => (
                  <Option key={l.value} value={l.value}>
                    {l.label}
                  </Option>
                ))}
              </Select>
              <Input
                type="number"
                min={1}
                label="Nechta kishi"
                {...register(`requiredRoles.${index}.slots`, { valueAsNumber: true })}
                defaultValue={field.slots}
              />
              <IconButton variant="text" color="red" onClick={() => remove(index)}>
                <TrashIcon className="h-4 w-4" />
              </IconButton>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" className="bg-brand-600" loading={isSubmitting}>
        {defaultValues ? "Saqlash" : "Startapni e'lon qilish"}
      </Button>
    </form>
  );
};

export default StartupForm;
