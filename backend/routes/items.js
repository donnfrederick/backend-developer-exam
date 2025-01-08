const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const { name, description, created_at } = req.body;
  
    const newItem = new Item({
        name, description, created_at
    });
  
    try {
      const savedItem = await newItem.save();
      res.status(201).json(savedItem);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
      const update = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!update) return res.status(404).json({ message: 'Item not found' });
      res.json(update);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
      const deleteStatus = await Item.findByIdAndDelete(req.params.id, req.body, { new: true });
      if (!deleteStatus) return res.status(404).json({ message: 'Item not found' });
      res.json(deleteStatus);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
});

module.exports = router;