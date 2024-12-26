const StudyPlan = require('../models/StudyPlan');

const createStudyPlan = async (req, res) => {
    console.log('Create study plan triggered', { user: req.user, body: req.body });
    
    try {
        const { title, description, tasks } = req.body;
        
        if (!req.user || !req.user.id) {
            console.log('User ID missing:', req.user);
            return res.status(401).json({ message: 'User authentication failed' });
        }

        const newStudyPlan = new StudyPlan({
            title,
            description,
            tasks,
            userId: req.user.id
        });

        const savedPlan = await newStudyPlan.save();
        console.log('Study plan created:', savedPlan);
        res.status(201).json({ message: 'Study Plan created successfully', studyPlan: savedPlan });
    } catch (error) {
        console.error('Study plan creation failed:', error);
        res.status(500).json({ message: 'Error creating study plan', error: error.message });
    }
};

const getStudyPlans = async (req, res) => {
    console.log('Fetching study plans for user:', req.user.id);
    
    try {
        const plans = await StudyPlan.find({ userId: req.user.id });
        console.log('Found plans:', plans);
        res.json({ studyPlans: plans });
    } catch (error) {
        console.error('Error fetching plans:', error);
        res.status(500).json({ message: 'Error fetching study plans' });
    }
};

const updateStudyPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, tasks } = req.body;
        
        // Ensure user only updates their own study plans
        const studyPlan = await StudyPlan.findOne({ _id: id, userId: req.user.id });
        
        if (!studyPlan) {
            return res.status(404).json({ message: 'Study plan not found or unauthorized' });
        }

        const updatedStudyPlan = await StudyPlan.findByIdAndUpdate(
            id, 
            { title, description, tasks }, 
            { new: true }
        );

        res.status(200).json({ message: 'Study Plan updated successfully', studyPlan: updatedStudyPlan });
    } catch (error) {
        console.error('Error updating study plan:', error);
        res.status(500).json({ message: 'Error updating study plan', error: error.message });
    }
};

const deleteStudyPlan = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Ensure user only deletes their own study plans
        const studyPlan = await StudyPlan.findOne({ _id: id, userId: req.user.id });
        
        if (!studyPlan) {
            return res.status(404).json({ message: 'Study plan not found or unauthorized' });
        }

        await StudyPlan.findByIdAndDelete(id);
        res.status(200).json({ message: 'Study Plan deleted successfully' });
    } catch (error) {
        console.error('Error deleting study plan:', error);
        res.status(500).json({ message: 'Error deleting study plan', error: error.message });
    }
};

module.exports = { createStudyPlan, getStudyPlans, updateStudyPlan, deleteStudyPlan };