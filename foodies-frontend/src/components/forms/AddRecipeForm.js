import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createRecipe } from '../../store/slices/recipesSlice';
import { fetchCategories } from '../../store/slices/categoriesSlice';
import Button from '../ui/Button';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .required('Title is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(200, 'Description must be less than 200 characters')
    .required('Description is required'),
  instructions: Yup.string()
    .min(20, 'Instructions must be at least 20 characters')
    .max(1000, 'Instructions must be less than 1000 characters')
    .required('Instructions are required'),
  cookingTime: Yup.number()
    .min(1, 'Cooking time must be at least 1 minute')
    .max(1440, 'Cooking time must be less than 24 hours')
    .required('Cooking time is required'),
  category: Yup.string().required('Category is required'),
  area: Yup.string().required('Area is required'),
  image: Yup.mixed().required('Recipe image is required'),
  ingredients: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().required('Ingredient name is required'),
        measure: Yup.string().required('Measure is required'),
      })
    )
    .min(1, 'At least one ingredient is required'),
});

const AddRecipeForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.recipes);
  const { categories } = useSelector(state => state.categories);
  const [imagePreview, setImagePreview] = useState(null);

  const areas = [
    'American', 'British', 'Canadian', 'Chinese', 'Croatian', 'Dutch',
    'Egyptian', 'French', 'Greek', 'Indian', 'Irish', 'Italian',
    'Jamaican', 'Japanese', 'Kenyan', 'Malaysian', 'Mexican', 'Moroccan',
    'Polish', 'Portuguese', 'Russian', 'Spanish', 'Thai', 'Turkish'
  ];

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      instructions: '',
      cookingTime: '',
      category: '',
      area: '',
      image: null,
      ingredients: [{ name: '', measure: '' }],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();

        // Append basic fields
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('instructions', values.instructions);
        formData.append('cookingTime', values.cookingTime);
        formData.append('category', values.category);
        formData.append('area', values.area);
        formData.append('image', values.image);

        // Append ingredients as JSON
        formData.append('ingredients', JSON.stringify(values.ingredients));

        const resultAction = await dispatch(createRecipe(formData));
        if (createRecipe.fulfilled.match(resultAction)) {
          toast.success('Recipe created successfully!');
          navigate(`/recipe/${resultAction.payload._id}`);
        } else {
          toast.error(resultAction.payload || 'Failed to create recipe');
        }
      } catch (error) {
        toast.error('An error occurred while creating the recipe');
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addIngredient = () => {
    formik.setFieldValue('ingredients', [
      ...formik.values.ingredients,
      { name: '', measure: '' }
    ]);
  };

  const removeIngredient = (index) => {
    const newIngredients = formik.values.ingredients.filter((_, i) => i !== index);
    formik.setFieldValue('ingredients', newIngredients);
  };

  const updateIngredient = (index, field, value) => {
    const newIngredients = [...formik.values.ingredients];
    newIngredients[index][field] = value;
    formik.setFieldValue('ingredients', newIngredients);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Recipe Title"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.title && formik.errors.title}
          placeholder="Enter recipe title"
        />

        <Input
          label="Cooking Time (minutes)"
          type="number"
          name="cookingTime"
          value={formik.values.cookingTime}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.cookingTime && formik.errors.cookingTime}
          placeholder="30"
        />
      </div>

      <TextArea
        label="Description"
        name="description"
        value={formik.values.description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.description && formik.errors.description}
        placeholder="Brief description of your recipe"
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          {formik.touched.category && formik.errors.category && (
            <p className="text-sm text-red-600">{formik.errors.category}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Area/Cuisine</label>
          <select
            name="area"
            value={formik.values.area}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Select an area</option>
            {areas.map(area => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
          {formik.touched.area && formik.errors.area && (
            <p className="text-sm text-red-600">{formik.errors.area}</p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Recipe Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
        />
        {formik.touched.image && formik.errors.image && (
          <p className="text-sm text-red-600">{formik.errors.image}</p>
        )}
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Recipe preview"
              className="w-32 h-32 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">Ingredients</label>
          <Button type="button" onClick={addIngredient} size="sm" variant="outline">
            Add Ingredient
          </Button>
        </div>

        {formik.values.ingredients.map((ingredient, index) => (
          <div key={index} className="flex gap-4 items-end">
            <div className="flex-1">
              <Input
                placeholder="Ingredient name"
                value={ingredient.name}
                onChange={(e) => updateIngredient(index, 'name', e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Input
                placeholder="Measure (e.g., 2 cups)"
                value={ingredient.measure}
                onChange={(e) => updateIngredient(index, 'measure', e.target.value)}
              />
            </div>
            {formik.values.ingredients.length > 1 && (
              <Button
                type="button"
                onClick={() => removeIngredient(index)}
                variant="destructive"
                size="sm"
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        {formik.touched.ingredients && formik.errors.ingredients && (
          <p className="text-sm text-red-600">{formik.errors.ingredients}</p>
        )}
      </div>

      <TextArea
        label="Instructions"
        name="instructions"
        value={formik.values.instructions}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.instructions && formik.errors.instructions}
        placeholder="Step-by-step cooking instructions"
        rows={8}
      />

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={loading || !formik.isValid}
          className="flex-1"
        >
          {loading ? 'Creating Recipe...' : 'Create Recipe'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/')}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddRecipeForm;