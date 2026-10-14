import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const Icon = ({ icon, className, ...props }) => <FontAwesomeIcon icon={icon} className={className} {...props} />;

export default Icon;
