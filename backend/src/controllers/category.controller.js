import Category from '../models/Category.js';
import Task from '../models/Task.js';

export const createCategory = async (req, res) => {
  try {
    const { name, color, icon } = req.body;

    const category = await Category.create({
      user: req.user._id,
      name,
      color,
      icon
    });

    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category name already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user._id });
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const { name, color, icon } = req.body;
    if (name) category.name = name;
    if (color) category.color = color;
    if (icon) category.icon = icon;

    await category.save();

    res.json({
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Remove category from all tasks
    await Task.updateMany(
      { user: req.user._id, category: category._id },
      { $unset: { category: 1 } }
    );

    await category.deleteOne();

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};