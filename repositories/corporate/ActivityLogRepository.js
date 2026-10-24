import ActivityLogRepository from '../internal/ActivityLogRepository.js';

export default {
  createActivityLog(data) {
    return ActivityLogRepository.createActivityLog({ ...data, service_name: 'corporate' });
  }
};
