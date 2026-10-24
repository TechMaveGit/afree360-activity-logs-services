import ActivityLogRepository from '../../repositories/internal/ActivityLogRepository.js';

const ActivityLogService = {
  async logActivity(data) {
    const payload = {
      user_id: data.user_id || null,
      activity_type: String(data.activity_type).trim(),
      service_name: String(data.service_name).trim(),
      reference_id: data.reference_id || null,
      description: data.description || null,
      ip_address: data.ip_address || null
    };

    return ActivityLogRepository.createActivityLog(payload);
  }
};

export default ActivityLogService;
