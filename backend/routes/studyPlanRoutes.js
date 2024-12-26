const express = require('express');
const router = express.Router();
const { createStudyPlan, getStudyPlans, updateStudyPlan, deleteStudyPlan } = require('../controllers/studyPlanController');
const authenticateUser = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validate');

router.use(authenticateUser);

router.get('/', getStudyPlans);
router.post('/', validateRequest('studyPlan'), createStudyPlan);
router.put('/:id', validateRequest('studyPlan'), updateStudyPlan);
router.delete('/:id', deleteStudyPlan);
module.exports = router;
