"use client"
import React, { useReducer, ChangeEvent, FormEvent } from 'react';
import { AlertCircle, CheckCircle, FolderPlus, ArrowRight, RefreshCw, X } from 'lucide-react';
import { createProject } from "@/lib/api"; 

type Category = 'Web Development' | 'Mobile App' | 'UI/UX Design' | 'Marketing';

interface FormValues {
  title: string;
  description: string;
  category: Category;
  budgetMin: string;
  budgetMax: string;
  deadline: string; // ISO date string, e.g. "2026-09-15"
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

interface CreatedProject {
  id: string;
  title: string;
  description: string;
  category: Category;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  status: 'open' | 'in_progress' | 'completed' | 'closed';
  clientName: string;
  proposalCount: number;
  createdAt: string;
}

interface FormState {
  values: FormValues;
  errors: FormErrors;
  apiError: string | null;
  isSubmitting: boolean;
  createdProject: CreatedProject | null;
}

type FormAction =
  | { type: 'SET_FIELD'; field: keyof FormValues; value: string }
  | { type: 'SET_ERRORS'; errors: FormErrors }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS'; payload: CreatedProject }
  | { type: 'SUBMIT_FAILURE'; error: string }
  | { type: 'CLEAR_API_ERROR' }
  | { type: 'RESET_SUCCESS' };

const initialState: FormState = {
  values: {
    title: '',
    description: '',
    category: 'Web Development',
    budgetMin: '',
    budgetMax: '',
    deadline: '',
  },
  errors: {},
  apiError: null,
  isSubmitting: false,
  createdProject: null,
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: undefined },
      };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'SUBMIT_START':
      return { ...state, isSubmitting: true, apiError: null };
    case 'SUBMIT_SUCCESS':
      return { ...initialState, createdProject: action.payload };
    case 'SUBMIT_FAILURE':
      return { ...state, isSubmitting: false, apiError: action.error };
    case 'CLEAR_API_ERROR':
      return { ...state, apiError: null };
    case 'RESET_SUCCESS':
      return { ...state, createdProject: null };
    default:
      return state;
  }
}




function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const min = Number(values.budgetMin);
  const max = Number(values.budgetMax);

  if (!values.title.trim()) errors.title = 'Project title is required.';

  if (!values.description.trim()) {
    errors.description = 'Description is required.';
  } else if (values.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters.';
  }

  if (!values.budgetMin.trim() || Number.isNaN(min) || min <= 0) {
    errors.budgetMin = 'Enter a valid minimum budget.';
  }

  if (!values.budgetMax.trim() || Number.isNaN(max) || max <= 0) {
    errors.budgetMax = 'Enter a valid maximum budget.';
  } else if (!Number.isNaN(min) && max < min) {
    errors.budgetMax = 'Max budget must be ≥ min budget.';
  }

  if (!values.deadline.trim()) {
    errors.deadline = 'Deadline is required.';
  } else if (Number.isNaN(new Date(values.deadline).getTime())) {
    errors.deadline = 'Enter a valid date.';
  }

  return errors;
}



interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

function Field({ id, label, required, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClasses = (hasError?: string) =>
  `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-50 ${
    hasError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200 focus:border-indigo-500'
  }`;

export default function CreateProjectForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { values, errors, apiError, isSubmitting, createdProject } = state;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    dispatch({ type: 'SET_FIELD', field: name as keyof FormValues, value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      dispatch({ type: 'SET_ERRORS', errors: validationErrors });
      return;
    }

    dispatch({ type: 'SUBMIT_START' });
    try {
      const project = await createProject({
        title: values.title,
        description: values.description,
        category: values.category,
        budgetMin: Number(values.budgetMin),
        budgetMax: Number(values.budgetMax),
        deadline: values.deadline,
      });
      dispatch({ type: 'SUBMIT_SUCCESS', payload: project });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      dispatch({ type: 'SUBMIT_FAILURE', error: message });
    }
  };


  return (

    <div className="max-w-2xl mx-auto my-10 p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <FolderPlus className="w-7 h-7 text-indigo-600" aria-hidden="true" />
        <h2 className="text-2xl font-bold text-gray-800">Create New Project</h2>
      </div>

      {apiError && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r flex items-start justify-between gap-3"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-semibold text-red-800">Submission Failed</h3>
              <p className="text-sm text-red-700 mt-1">{apiError}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => dispatch({ type: 'CLEAR_API_ERROR' })}
            className="text-red-400 hover:text-red-600 focus:outline-none"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Field id="project-title" label="Project Title" required error={errors.title}>
          <input
            id="project-title"
            type="text"
            name="title"
            disabled={isSubmitting}
            value={values.title}
            onChange={handleChange}
            placeholder="e.g., Build an E-commerce Website"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'project-title-error' : undefined}
            className={inputClasses(errors.title)}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field id="project-category" label="Category">
            <select
              id="project-category"
              name="category"
              disabled={isSubmitting}
              value={values.category}
              onChange={handleChange}
              className={inputClasses()}
            >
              <option value="Web Development">Web Development</option>
              <option value="Mobile App">Mobile App</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Marketing">Marketing</option>
            </select>
          </Field>

          <Field id="project-deadline" label="Deadline" required error={errors.deadline}>
            <input
              id="project-deadline"
              type="date"
              name="deadline"
              disabled={isSubmitting}
              value={values.deadline}
              onChange={handleChange}
              aria-invalid={Boolean(errors.deadline)}
              aria-describedby={errors.deadline ? 'project-deadline-error' : undefined}
              className={inputClasses(errors.deadline)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field id="project-budget-min" label="Budget Min ($)" required error={errors.budgetMin}>
            <input
              id="project-budget-min"
              type="number"
              name="budgetMin"
              disabled={isSubmitting}
              value={values.budgetMin}
              onChange={handleChange}
              placeholder="50000"
              aria-invalid={Boolean(errors.budgetMin)}
              aria-describedby={errors.budgetMin ? 'project-budget-min-error' : undefined}
              className={inputClasses(errors.budgetMin)}
            />
          </Field>

          <Field id="project-budget-max" label="Budget Max ($)" required error={errors.budgetMax}>
            <input
              id="project-budget-max"
              type="number"
              name="budgetMax"
              disabled={isSubmitting}
              value={values.budgetMax}
              onChange={handleChange}
              placeholder="100000"
              aria-invalid={Boolean(errors.budgetMax)}
              aria-describedby={errors.budgetMax ? 'project-budget-max-error' : undefined}
              className={inputClasses(errors.budgetMax)}
            />
          </Field>
        </div>

        <Field id="project-description" label="Description" required error={errors.description}>
          <textarea
            id="project-description"
            name="description"
            rows={4}
            disabled={isSubmitting}
            value={values.description}
            onChange={handleChange}
            placeholder="Briefly describe the project scope and primary deliverables..."
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? 'project-description-error' : undefined}
            className={inputClasses(errors.description)}
          />
        </Field>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-lg shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" />
              <span>Creating Project...</span>
            </>
          ) : (
            <>
              <span>Submit Project</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </>
          )}
        </button>
      </form>

      {createdProject && (
        <div role="status" aria-live="polite" className="mt-8 pt-6 border-t border-gray-200">
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                <CheckCircle className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                <span>Project Created Successfully!</span>
              </div>
              <button
                type="button"
                onClick={() => dispatch({ type: 'RESET_SUCCESS' })}
                className="text-emerald-600 hover:text-emerald-800 focus:outline-none text-xs font-medium underline"
              >
                Dismiss
              </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100 space-y-2 text-sm text-gray-700">
              <Row label="Project ID">
                <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-800">
                  {createdProject.id}
                </span>
              </Row>
              <Row label="Title">
                <span className="font-semibold text-gray-800">{createdProject.title}</span>
              </Row>
              <Row label="Category">
                <span>{createdProject.category}</span>
              </Row>
              <Row label="Budget">
                <span className="font-semibold text-emerald-600">
                  ${createdProject.budgetMin.toLocaleString()} – ${createdProject.budgetMax.toLocaleString()}
                </span>
              </Row>
              <Row label="Deadline">
                <span>{new Date(createdProject.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </Row>
              <div className="pt-1">
                <span className="font-medium text-gray-500 block mb-1">Description:</span>
                <p className="text-gray-600 bg-gray-50 p-2.5 rounded text-xs leading-relaxed">
                  {createdProject.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between border-b border-gray-100 pb-2">
      <span className="font-medium text-gray-500">{label}:</span>
      {children}
    </div>
  );
}