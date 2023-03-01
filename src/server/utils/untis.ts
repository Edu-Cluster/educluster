import WebUntis from 'webuntis';
import customConfig from '../config/default';

export default new WebUntis(
  customConfig.school,
  customConfig.eduClusterUser,
  customConfig.eduClusterPassword,
  customConfig.schoolBaseUrl,
);
