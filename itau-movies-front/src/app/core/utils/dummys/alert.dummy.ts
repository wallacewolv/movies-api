import {
  AlertPayload,
  ErrorAPI,
} from '@core/contracts/alert/service/alert-service.interface';

export const ALERT_DUMMY = {
  get ALERT_INITIAL(): AlertPayload {
    return {
      message: '',
      timestamp: Date.now(),
    };
  },

  get ERROR_API(): ErrorAPI {
    return {
      error: {
        error: 'BadRequest',
        message: 'Campo obrigatório',
      },
    };
  },
};
