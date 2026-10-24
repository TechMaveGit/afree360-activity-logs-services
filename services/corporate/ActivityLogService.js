import ActivityLogRepository from '../../repositories/corporate/ActivityLogRepository.js';

export default {
  logActivity(data) {
    if (!data.activity_type) throw new Error('activity_type is required');
    return ActivityLogRepository.createActivityLog(data);
  }
};
